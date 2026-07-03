import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import AuthInput from './AuthInput';
import PrimaryButton from './PrimaryButton';

const ForgotPasswordModal = ({ onBack, onReset }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const error = await onReset(email);
    if (error) {
      setErrorMsg(error.message || 'Failed to send reset email.');
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ width: '100%', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle size={32} color="var(--success)" className="strength-check" />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Check your email</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          We've sent password reset instructions to <strong>{email}</strong>.
        </p>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
          <ArrowLeft size={16} /> Back to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Reset Password</h2>
        <p style={{ color: 'var(--text-muted)' }}>Enter your email address and we'll send you a link to reset your password.</p>
      </div>

      {errorMsg && (
        <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '24px', fontWeight: 500 }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <AuthInput label="Email Address" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} required />
        <PrimaryButton type="submit" isLoading={loading}>Send Reset Link</PrimaryButton>
      </form>
    </div>
  );
};

export default ForgotPasswordModal;
