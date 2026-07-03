import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';

const EmailVerificationCard = ({ email, onResend, onChangeEmail, onBackToLogin }) => {
  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <Mail size={40} color="var(--primary-color)" />
      </div>
      
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Verify Your Email</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.6 }}>
        We've sent a verification link to <br/>
        <strong style={{ color: 'var(--text-main)' }}>{email}</strong>
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button className="btn-primary" onClick={onResend} style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 600 }}>
          Resend Verification Email
        </button>
        <button onClick={onChangeEmail} style={{ background: 'white', border: '1px solid var(--border-color)', color: 'var(--text-main)', width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 600, borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
          Change Email Address
        </button>
      </div>

      <div style={{ marginTop: '32px' }}>
        <button onClick={onBackToLogin} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
          Back to Login <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationCard;
