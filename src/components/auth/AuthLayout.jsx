import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '16px', background: 'var(--background)' }}>
      {children}
      
      <div style={{ marginTop: '16px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.85rem' }}>
        <a href="#PrivacyPolicy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
        <span style={{ color: 'var(--border)' }}>|</span>
        <a href="#TermsOfService" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a>
      </div>
    </div>
  );
};

export default AuthLayout;
