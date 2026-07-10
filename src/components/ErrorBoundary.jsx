import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh', 
          width: '100vw',
          alignItems: 'center', 
          justifyContent: 'center', 
          background: 'var(--bg-main)', 
          fontFamily: 'sans-serif',
          padding: '24px'
        }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="premium-card" 
            style={{ 
              maxWidth: '600px', 
              width: '100%', 
              padding: '48px', 
              background: 'var(--surface)', 
              textAlign: 'center',
              border: '1px solid var(--border)'
            }}
          >
            <AlertCircle size={64} style={{ color: 'var(--error)', margin: '0 auto 24px' }} />
            
            <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--text)', fontWeight: 'bold' }}>
              Something went wrong.
            </h2>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px', lineHeight: '1.6' }}>
              We encountered an unexpected error. If you were taking a test, don't worry—your progress up to your last answer has been securely saved.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                onClick={this.handleReload} 
                className="btn-primary" 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '1.05rem' }}
              >
                <RefreshCw size={20} />
                Reload Page
              </button>
              
              <button 
                onClick={this.handleGoHome} 
                className="btn-secondary" 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '1.05rem' }}
              >
                <Home size={20} />
                Return to Dashboard
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div style={{ marginTop: '32px', textAlign: 'left', background: 'var(--bg-main)', padding: '16px', borderRadius: '8px', overflowX: 'auto' }}>
                <div style={{ color: 'var(--error)', fontWeight: 'bold', marginBottom: '8px' }}>Developer Details:</div>
                <pre style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {this.state.error.toString()}
                  {'\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
