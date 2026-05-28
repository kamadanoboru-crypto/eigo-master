import type { NextApiRequest, NextApiResponse } from 'next';
import { callAI, parseJSON } from '../../../lib/aiClient';
import { getWallet, spendCoins } from '../../../lib/economy';
import { sbFrom } from '../../../lib/supabase';
import { selectRecommendedSites } from '../../../lib/adviceSites';

const ADVICE_COST = 5;
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

type AiAdvice = {
  summary: string;
  advice: string;
  focus: string[];
  next_actions: string[];
};

const fallbackAdvice: AiAdvice = {
  summary: '今日の学習状況をもとに、次の一歩を整理しました。',
  advice: '最近の学習量を維持しながら、短い英文を聞いてすぐ意味を取る練習を増やしましょう。動画学習のあとに1文だけ音読すると、リスニングとスピーキングの橋渡しになります。',
  focus: ['短文の瞬間理解', '復習の固定化'],
  next_actions: ['動画を1本見たら気になった英文を3つ保存する', 'Part5を5問だけ解いて弱点を確認する', '保存文を1つ音読する'],
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const { userId, clientSummary = {} } = req.body || {};
  const incomingSummary = clientSummary && typeof clientSummary === 'object' ? clientSummary : {};
  if (!userId) return res.status(400).json({ ok: false, message: 'userId is required' });

  if (!(await isAdviceTableReady())) {
    return res.status(200).json({
      ok: false,
      setupRequired: true,
      message: 'advice_history テーブルが未作成です。Supabase SQLエディタで sql/advice_history_patch.sql を実行してください。',
    });
  }

  const wallet = await getWallet(String(userId));
  if (wallet.coins < ADVICE_COST) {
    return res.status(402).json({
      ok: false,
      message: `コインが不足しています。AIアドバイスには${ADVICE_COST}コイン必要です。`,
      remaining: wallet.coins,
    });
  }

  const latestRows = await sbFrom('advice_history').select(
    `*&user_id=eq.${encodeURIComponent(String(userId))}&order=created_at.desc&limit=5`,
  );
  const latest = latestRows?.[0] as any;
  if (latest?.created_at && Date.now() - new Date(latest.created_at).getTime() < 15000) {
    return res.status(200).json({ ok: true, duplicate: true, advice: latest, remaining: wallet.coins });
  }

  const learningRows = await sbFrom('learning_logs').select(
    `type,correct,total,score,created_at&user_id=eq.${encodeURIComponent(String(userId))}&order=created_at.desc&limit=200`,
  );
  const videoRows = await sbFrom('user_videos').select(
    `title,channel_title,added_at&user_id=eq.${encodeURIComponent(String(userId))}&order=added_at.desc&limit=5`,
  );
  const savedRows = await sbFrom('saved_items').select(
    `id&user_id=eq.${encodeURIComponent(String(userId))}&limit=500`,
  );

  const dbSummary = summarizeLearning(learningRows || [], videoRows || [], savedRows || []);
  const studySummary = {
    ...dbSummary,
    ...incomingSummary,
    recent_videos: ((incomingSummary as any).recent_videos?.length ? (incomingSummary as any).recent_videos : dbSummary.recent_videos) || [],
  };
  studySummary.toeic_estimate = Number(studySummary.toeic_estimate || 500);

  const recommendedSites = selectRecommendedSites(studySummary);
  const referencedHistoryIds = (latestRows || []).map((row: any) => row.id).filter(Boolean);

  try {
    const prompt = buildPrompt(studySummary, latestRows || [], recommendedSites);
    const raw = await callAI(
      prompt,
      900,
      'You are a warm Japanese English-learning coach. Return valid JSON only.',
    );
    const aiAdvice = normalizeAdvice(parseJSON<AiAdvice>(raw, fallbackAdvice));

    const inserted = await sbFrom('advice_history').insert({
      user_id: String(userId),
      coins_used: ADVICE_COST,
      toeic_estimate: studySummary.toeic_estimate,
      study_summary: studySummary,
      ai_advice: aiAdvice,
      recommended_sites: recommendedSites,
      referenced_history_ids: referencedHistoryIds,
      ai_provider: process.env.AI_PROVIDER_PRIORITY || 'auto',
      metadata: { generated_at: new Date().toISOString(), cost_policy: 'success_only' },
    });
    const row = inserted?.[0];
    if (!row) return res.status(500).json({ ok: false, message: 'アドバイス保存に失敗しました。' });

    const spent = await spendCoins(String(userId), ADVICE_COST);
    if (!spent.ok) {
      await sbFrom('advice_history').delete(`id=eq.${encodeURIComponent(String((row as any).id))}`);
      return res.status(402).json({ ok: false, message: spent.message || 'コインが不足しています。', remaining: spent.remaining });
    }

    return res.status(200).json({ ok: true, advice: row, remaining: spent.remaining });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ ok: false, message: `AIアドバイス生成に失敗しました: ${message}` });
  }
}

async function isAdviceTableReady() {
  if (!SB_URL || !SB_ANON) return false;
  try {
    const r = await fetch(`${SB_URL}/rest/v1/advice_history?select=id&limit=1`, {
      headers: {
        apikey: SB_ANON,
        Authorization: `Bearer ${SB_ANON}`,
      },
    });
    return r.ok;
  } catch {
    return false;
  }
}

function summarizeLearning(logs: any[], videos: any[], saved: any[]) {
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const recent = logs.filter((log) => new Date(log.created_at || 0).getTime() >= weekAgo);
  const total = Math.max(1, logs.length);
  const listeningCount = logs.filter((log) => log.type === 'listening' || log.type === 'shadowing').length;
  const conversationCount = logs.filter((log) => log.type === 'shadowing').length;
  const accuracyLogs = logs.filter((log) => Number(log.total) > 0);
  const accuracy = accuracyLogs.length
    ? accuracyLogs.reduce((sum, log) => sum + Number(log.correct || 0) / Math.max(1, Number(log.total || 1)), 0) / accuracyLogs.length
    : 0.55;
  const toeic = Math.max(300, Math.min(850, Math.round(350 + accuracy * 420 + Math.min(80, logs.length * 2))));

  return {
    toeic_estimate: toeic,
    study_frequency: recent.length,
    listening_ratio: listeningCount / total,
    conversation_ratio: conversationCount / total,
    vocabulary_count: saved.length,
    recent_videos: videos.map((v) => v.title).filter(Boolean).slice(0, 5),
  };
}

function buildPrompt(summary: any, history: any[], sites: any[]) {
  const compactHistory = history.slice(0, 5).map((h: any) => ({
    date: h.created_at,
    toeic: h.toeic_estimate,
    summary: h.ai_advice?.summary || '',
    next_actions: h.ai_advice?.next_actions || [],
  }));

  return `次の英語学習データを見て、継続性のある短い日本語コーチングを作ってください。

現在の学習情報:
${JSON.stringify(summary, null, 2)}

過去のアドバイス履歴:
${JSON.stringify(compactHistory, null, 2)}

ルールベースのおすすめ候補:
${JSON.stringify(sites.map((s: any) => ({ title: s.title, category: s.category, tags: s.tags })), null, 2)}

条件:
- 前回と矛盾しない
- 成長や停滞を踏まえる
- 押し付けず、次にやることを3つ以内で具体化する
- JSONのみ返す

形式:
{
  "summary": "一言要約",
  "advice": "300〜500字程度の日本語アドバイス",
  "focus": ["重点1", "重点2"],
  "next_actions": ["今日やること1", "今週やること2", "おすすめ導線3"]
}`;
}

function normalizeAdvice(advice: Partial<AiAdvice>): AiAdvice {
  return {
    summary: String(advice.summary || fallbackAdvice.summary).slice(0, 120),
    advice: String(advice.advice || fallbackAdvice.advice).slice(0, 900),
    focus: Array.isArray(advice.focus) ? advice.focus.map(String).slice(0, 4) : fallbackAdvice.focus,
    next_actions: Array.isArray(advice.next_actions) ? advice.next_actions.map(String).slice(0, 4) : fallbackAdvice.next_actions,
  };
}
