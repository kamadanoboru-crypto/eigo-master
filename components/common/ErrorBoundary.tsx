import React, { Component, type ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{ maxWidth: 430, margin: '0 auto', padding: 40, fontFamily: 'sans-serif', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#0F172A' }}>問題が発生しました</div>
        <div style={{ fontSize: 13, color: '#64748B', marginBottom: 24, fontFamily: "'Noto Sans JP',sans-serif" }}>
          アプリを再読み込みしてください
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{ background: '#183153', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
        >
          再読み込み
        </button>
        {process.env.NODE_ENV === 'development' && (
          <details style={{ marginTop: 20, textAlign: 'left', fontSize: 11, color: '#64748B' }}>
            <summary>エラー詳細</summary>
            <pre style={{ overflow: 'auto', padding: 8, background: '#F1F5F9', borderRadius: 4, marginTop: 8 }}>
              {this.state.error?.toString()}
            </pre>
          </details>
        )}
      </div>
    );
  }
}
