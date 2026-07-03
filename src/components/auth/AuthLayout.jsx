import React from 'react';
import BrandPanel from './BrandPanel';

const AuthLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      {/* Left Branding Panel (Hidden on Mobile) */}
      <div 
        style={{ 
          flex: '0 0 45%', 
          backgroundColor: '#13151A',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          borderRight: '1px solid var(--border)'
        }}
        className="auth-brand-panel-container"
      >
        {/* Subtle grid background */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(242, 175, 0, 0.05) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.5 }}></div>
        
        {/* Floating geometric elements */}
        <div className="floating-element" style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(242, 175, 0, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
        <div className="floating-element" style={{ position: 'absolute', bottom: '-5%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(242, 175, 0, 0.08) 0%, transparent 70%)', borderRadius: '50%', animationDelay: '2s', filter: 'blur(40px)' }}></div>

        <BrandPanel />
      </div>

      {/* Right Authentication Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', position: 'relative' }}>
        
        {/* Mobile-only subtle banner fallback if we wanted one, but per instructions, keep it clean */}
        <div style={{ width: '100%', maxWidth: '480px' }}>
          {children}
        </div>

      </div>

      {/* Injecting some quick media queries for the split screen directly via style tag for simplicity, though they usually go in css */}
      <style>{`
        @media (max-width: 1024px) {
          .auth-brand-panel-container { flex: 0 0 40% !important; }
        }
        @media (max-width: 768px) {
          .auth-brand-panel-container { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
