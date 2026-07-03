import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';
import EmailVerificationCard from '../components/auth/EmailVerificationCard';

const Auth = ({ setCurrentView }) => {
  const [viewState, setViewState] = useState('login'); // 'login', 'signup', 'forgot', 'verify'
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleLogin = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) setCurrentView('Dashboard');
    return error; // return error to the form to display
  };

  const handleSignup = async (formData) => {
    // Basic Supabase signup. Extended fields (targetModule, country, etc.) 
    // can be added to user metadata or a separate profiles table here.
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          country: formData.country,
          study_level: formData.studyLevel,
          target_module: formData.targetModule,
          test_date: formData.testDate
        }
      }
    });

    if (error) {
      alert(error.message);
    } else {
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
