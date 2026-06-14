import { AFFILIATE_LINKS } from '../lib/affiliateLinks';
import { getUserId } from '../lib/supabase';
import type { MouseEvent } from 'react';

export type AffiliateService = 'study_sapuri' | 'cambly';

export type AffiliatePlacement =
  | 'home'
  | 'settings'
  | 'toeic_result'
  | 'ai_analysis'
  | 'blog_body'
  | 'blog_footer'
  | 'recommend_page'
  | 'streak';

type AffiliateCardProps = {
  service: AffiliateService;
  placement: AffiliatePlacement;
  variant?: 'compact' | 'standard' | 'wide';
  reason?: string;
  screenName?: string;
  urlKey?: 'toeic' | 'home' | 'trial' | 'detail';
};

const SERVICE_COPY = {
  study_sapuri: {
    label: 'TOEIC対策におすすめ',
    title: 'スタディサプリENGLISH',
    description: 'TOEIC対策、文法、リスニングを講義と演習で本格的に進めたい方に向いています。',
    cta: 'まずは無料体験',
    color: '#B88932',
    icon: '🎓',
  },
  cambly: {
    label: '英会話実践におすすめ',
    title: 'Cambly',
    description: 'AIで練習した英語を、ネイティブ講師との会話で実践したい方に向いています。',
    cta: 'Cambly無料体験はこちら',
    color: '#0F766E',
    icon: '🗣️',
  },
};

function getUrl(service: AffiliateService, key?: AffiliateCardProps['urlKey']) {
  if (service === 'cambly') {
    if (key === 'home') return AFFILIATE_LINKS.CAMBLY_HOME;
    if (key === 'detail') return AFFILIATE_LINKS.CAMBLY_DETAIL;
    return AFFILIATE_LINKS.CAMBLY_TRIAL;
  }
  if (key === 'home') return AFFILIATE_LINKS.STUDY_SUPPLI_HOME;
  if (key === 'trial') return AFFILIATE_LINKS.STUDY_SUPPLI_TRIAL;
  return AFFILIATE_LINKS.STUDY_SUPPLI_TOEIC;
}

export default function AffiliateCard({
  service,
  placement,
  variant = 'standard',
  reason,
  screenName,
  urlKey,
}: AffiliateCardProps) {
  const copy = SERVICE_COPY[service];
  const url = getUrl(service, urlKey);
  const compact = variant === 'compact';

  async function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    try {
      await fetch('/api/affiliate/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: getUserId(),
          cardKey: service,
          cardTitle: copy.title,
          affiliateName: service,
          screenName: screenName || placement,
          placement,
        }),
      });
    } catch {
      // Click logging should never block the learner from opening the service.
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <aside
      style={{
        border: `1px solid ${copy.color}33`,
        background: compact ? '#fff' : `${copy.color}08`,
        borderRadius: 8,
        padding: compact ? '0.9rem' : '1.1rem',
        margin: compact ? '1rem 0' : '1.5rem 0',
      }}
    >
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <div style={{ fontSize: compact ? 22 : 28, lineHeight: 1 }}>{copy.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: copy.color, fontWeight: 800, fontSize: '0.85rem', marginBottom: 4 }}>
            {copy.label}
          </div>
          <h3 style={{ margin: '0 0 0.35rem', fontSize: compact ? '1rem' : '1.15rem' }}>
            {copy.title}
          </h3>
          <p style={{ margin: '0 0 0.8rem', color: '#475569', lineHeight: 1.7 }}>
            {reason || copy.description}
          </p>
          <a
            href={url}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            onClick={handleClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 40,
              padding: '0.6rem 0.9rem',
              borderRadius: 6,
              background: copy.color,
              color: '#fff',
              fontWeight: 800,
              textDecoration: 'none',
              borderBottom: 0,
            }}
          >
            {copy.cta}
          </a>
        </div>
      </div>
    </aside>
  );
}
