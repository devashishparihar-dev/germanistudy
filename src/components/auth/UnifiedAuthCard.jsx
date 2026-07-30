import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { trackEvent } from '../../utils/analytics';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Mail, Lock, User, Loader2 } from 'lucide-react';

const UnifiedAuthCard = ({ onLoginSuccess, onSignupSuccess, onForgotPassword }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (mode === 'login') {
      if (!email || !password) {
        setError('Email and password are required.');
        setIsLoading(false);
        return;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
      } else {
        onLoginSuccess();
      }
    } else {
      if (!fullName || !email || !password) {
        setError('All fields are required.');
        setIsLoading(false);
        return;
      }
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        trackEvent('sign_up_success', { email });
        onSignupSuccess(email);
      }
    }
    setIsLoading(false);
  };

  const handleGoogleAuth = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    });
    if (error) setError(error.message);
  };

  return (
    <div className="premium-card" style={{ width: '100%', maxWidth: '560px', padding: '32px 40px', background: 'var(--background)' }}>
      
      {/* Branding */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
        </div>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>GermaniStudy</span>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>
          {mode === 'login' ? 'Welcome Back' : 'Create Free Account'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0 }}>
          {mode === 'login' ? 'Continue your dMAT preparation where you left off.' : 'Track your progress and prepare smarter.'}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'var(--surface)', padding: '4px', borderRadius: '8px', marginBottom: '12px' }}>
        <button 
          onClick={() => { setMode('login'); setError(null); }}
          style={{ flex: 1, padding: '8px', fontSize: '1.05rem', background: mode === 'login' ? 'var(--background)' : 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, color: mode === 'login' ? 'var(--text)' : 'var(--text-muted)', boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}
        >
          Sign In
        </button>
        <button 
          onClick={() => { setMode('signup'); setError(null); }}
          style={{ flex: 1, padding: '8px', fontSize: '1.05rem', background: mode === 'signup' ? 'var(--background)' : 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, color: mode === 'signup' ? 'var(--text)' : 'var(--text-muted)', boxShadow: mode === 'signup' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}
        >
          Create Account
        </button>
      </div>

      {/* Google Login */}
      <button 
        onClick={handleGoogleAuth}
        style={{ width: '100%', padding: '10px', fontSize: '1.05rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, color: 'var(--text)', marginBottom: '12px', transition: 'background 0.2s' }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--paper)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--surface)'}
      >
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        
        <AnimatePresence mode="popLayout">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ padding: '12px', background: 'rgba(229, 62, 62, 0.1)', border: '1px solid var(--error, #e53e3e)', borderRadius: '6px', color: 'var(--error, #e53e3e)', fontSize: '0.9rem', fontWeight: 500 }}>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {mode === 'signup' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ width: '100%', padding: '10px 10px 10px 38px', fontSize: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }}
                  required={mode === 'signup'}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ position: 'relative' }}>
          <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="email" 
            placeholder="Email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 38px', fontSize: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }}
            required
          />
        </div>

        <div>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 38px', fontSize: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }}
              required
            />
          </div>
          {mode === 'login' && (
            <div style={{ textAlign: 'right', marginTop: '4px' }}>
              <button 
                type="button"
                onClick={onForgotPassword}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer', padding: 0 }}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
              >
                Forgot Password?
              </button>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="btn-primary" 
          style={{ width: '100%', padding: '10px', fontSize: '1.05rem', marginTop: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          {isLoading ? <Loader2 size={20} className="spinner" /> : (mode === 'login' ? 'Sign In' : 'Create Account')}
        </button>

      </form>

      {/* Trust Section */}
      <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
        {[
          "Free account",
          "Secure Google Auth",
          "Auto-saved progress"
        ].map((trust, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <Check size={14} color="var(--primary)" />
            {trust}
          </div>
        ))}
      </div>

    </div>
  );
};

export default UnifiedAuthCard;
