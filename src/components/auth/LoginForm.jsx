import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthInput from './AuthInput';
import PrimaryButton from './PrimaryButton';
import SocialLoginButtons from './SocialLoginButtons';

const LoginForm = ({ onToggleMode, onLogin, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const error = await onLogin(email, password);
    if (error) {
      setErrorMsg(error.message || 'Invalid login credentials');
    }
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ width: '100%' }}>
      <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        <img src="/assets/branding/logo_light.png" alt="GermaniStudy Logo" className="logo-light-mode" style={{ height: '64px', objectFit: 'contain' }} />
        <img src="/assets/branding/logo_dark.png" alt="GermaniStudy Logo" className="logo-dark-mode" style={{ height: '64px', objectFit: 'contain' }} />
      </motion.div>
      
      <motion.div variants={itemVariants} style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Continue your preparation where you left off.</p>
      </motion.div>

      {errorMsg && (
        <motion.div variants={itemVariants} style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '24px', fontWeight: 500 }}>
          {errorMsg}
        </motion.div>
      )}

      <motion.form variants={itemVariants} onSubmit={handleSubmit}>
        <AuthInput label="Email Address" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} required />
        <AuthInput label="Password" type="password" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} required />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" id="remember" style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary)' }} />
            <label htmlFor="remember" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>Remember me</label>
          </div>
          <button type="button" onClick={onForgotPassword} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
            Forgot Password?
          </button>
        </div>

        <PrimaryButton type="submit" isLoading={loading}>Sign In</PrimaryButton>
      </motion.form>

      <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        <span style={{ padding: '0 12px' }}>OR</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SocialLoginButtons />
      </motion.div>

      <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Don't have an account?{' '}
        <button onClick={onToggleMode} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Create Account</button>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;
