import React from 'react';

interface State { hasError: boolean; message: string }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : String(error);
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    const safeMsg = error instanceof Error ? error.message.replace(/[\r\n]/g, ' ') : 'Unknown error';
    const safeStack = (info.componentStack ?? '').replace(/[\r\n]/g, ' ');
    console.error('[ErrorBoundary]', safeMsg, safeStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F8FAFC',
          padding: '2rem',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: '1.25rem',
            boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
            padding: '2.5rem',
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontWeight: 900, fontSize: '1.25rem', color: '#111827', marginBottom: '0.5rem' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            An unexpected error occurred. Your data is safe — please try refreshing the page.
          </p>
          {import.meta.env.DEV && this.state.message && (
            <pre
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                fontSize: '0.72rem',
                color: '#DC2626',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '1.5rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {this.state.message}
            </pre>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              onClick={this.handleReset}
              style={{
                background: '#0B6B4B',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.75rem',
                padding: '0.65rem 1.5rem',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#F3F4F6',
                color: '#374151',
                border: '1px solid #E5E7EB',
                borderRadius: '0.75rem',
                padding: '0.65rem 1.5rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }
}
