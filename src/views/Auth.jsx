import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';
import EmailVerificationCard from '../components/auth/EmailVerificationCard';
import { trackEvent } from '../utils/analytics';

const Auth = ({ setCurrentView }) => {
  const [viewState, setViewState] = useState('login'); // 'login', 'signup', 'forgot', 'verify'
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleLogin = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      if (localStorage.getItem('redirectAfterAuth') === 'free_mock') {
        localStorage.removeItem('redirectAfterAuth');
        localStorage.setItem('selectedDigitalModule', 'free_mock');
        setCurrentView('DigitalSimulator');
      } else {
        setCurrentView('Dashboard');
      }
    }
    return error; // return error to the form to display
  };

  const handleSignup = async (formData) => {
    // Basic Supabase signup. Extended fields (targetModule, country, etc.) 
    // can be added to user metadata or a separate profiles table here.
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password
    });

    if (error) {
      alert(error.message);
    } else {
      trackEvent('sign_up_success', { email: formData.email });
      setRegisteredEmail(formData.email);
      setViewState('verify');
    }
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
      {viewState === 'login' && (
        <LoginForm 
          onToggleMode={() => setViewState('signup')} 
          onLogin={handleLogin}
          onForgotPassword={() => setViewState('forgot')}
        />
      )}
      
      {viewState === 'signup' && (
        <SignupForm 
          onToggleMode={() => setViewState('login')} 
          onSignup={handleSignup}
        />
      )}

      {viewState === 'forgot' && (
        <ForgotPasswordModal 
          onBack={() => setViewState('login')}
          onReset={handleResetPassword}
        />
      )}

      {viewState === 'verify' && (
        <EmailVerificationCard 
          email={registeredEmail}
          onResend={handleResendVerification}
          onChangeEmail={() => setViewState('signup')}
          onBackToLogin={() => setViewState('login')}
        />
      )}
    </AuthLayout>
  );
};

export default Auth;
