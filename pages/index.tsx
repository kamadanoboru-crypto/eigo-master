import dynamic from 'next/dynamic';

// SSRを無効化（speechSynthesis / localStorage / crypto などブラウザAPIを使用するため）
const EigoMaster = dynamic(
  () => import('../components/EigoMaster'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: '100vh', gap: 16,
        fontFamily: "'Noto Sans JP', sans-serif", background: '#F8FAFC',
      }}>
        <div style={{ fontSize: 40 }}>🎓</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>英語マスター</div>
        <div style={{ fontSize: 14, color: '#94A3B8' }}>読み込み中...</div>
      </div>
    ),
  },
);

export default function Home() {
  return <EigoMaster />;
}
