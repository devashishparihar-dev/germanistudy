import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AuthLayout from '../components/auth/AuthLayout';
import UnifiedAuthCard from '../components/auth/UnifiedAuthCard';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';
import EmailVerificationCard from '../components/auth/EmailVerificationCard';

const Auth = ({ setCurrentView }) => {
  const [viewState, setViewState] = useState('main'); // 'main', 'forgot', 'verify'
  const [registeredEmail, setRegisteredEmail] = useState('');

  useEffect(() => {
    // Redirect if already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentView('Dashboard');
      }
    };
    checkSession();
  }, [setCurrentView]);

  const handleLoginSuccess = () => {
    if (localStorage.getItem('redirectAfterAuth') === 'free_mock') {
      localStorage.removeItem('redirectAfterAuth');
      localStorage.setItem('selectedDigitalModule', 'free_mock');
      setCurrentView('DigitalSimulator');
    } else {
      setCurrentView('Dashboard');
    }
  };

  const handleSignupSuccess = (email) => {
    setRegisteredEmail(email);
    setViewState('verify');
  };

  const handleResetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    return error;
  };

  const handleResendVerification = async () => {
    await supabase.auth.resend({
      type: 'signup',
      email: registeredEmail,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    alert('Verification email resent!');
  };

  return (
    <AuthLayout>
      {viewState === 'main' && (
        <UnifiedAuthCard 
          onLoginSuccess={handleLoginSuccess}
          onSignupSuccess={handleSignupSuccess}
          onForgotPassword={() => setViewState('forgot')}
        />
      )}

      {viewState === 'forgot' && (
        <ForgotPasswordModal 
          onBack={() => setViewState('main')}
          onReset={handleResetPassword}
        />
      )}

      {viewState === 'verify' && (
        <EmailVerificationCard 
          email={registeredEmail}
          onResend={handleResendVerification}
          onChangeEmail={() => setViewState('main')}
          onBackToLogin={() => setViewState('main')}
        />
      )}
    </AuthLayout>
  );
};

export default Auth;
