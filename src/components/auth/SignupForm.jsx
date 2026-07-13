import React, { useState } from 'react';
import { Mail, Lock, User, Calendar, MapPin, BookOpen, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthInput from './AuthInput';
import PrimaryButton from './PrimaryButton';
import SocialLoginButtons from './SocialLoginButtons';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const SignupForm = ({ onToggleMode, onSignup }) => {
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '', acceptTerms: false
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    setLoading(true);
    await onSignup(formData);
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ width: '100%' }}>

      <motion.div variants={itemVariants} style={{ marginBottom: '8px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>Create your account</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Start your personalized TestAS preparation journey today.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SocialLoginButtons />
      </motion.div>

      <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', margin: '8px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        <span style={{ padding: '0 12px' }}>OR</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
      </motion.div>

      <motion.form variants={itemVariants} onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <AuthInput label="Email Address" type="email" name="email" icon={Mail} value={formData.email} onChange={handleChange} required />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <AuthInput label="Password" type="password" name="password" icon={Lock} value={formData.password} onChange={handleChange} required />
          </div>
          <div style={{ flex: 1 }}>
            <AuthInput label="Confirm Password" type="password" name="confirmPassword" icon={Lock} value={formData.confirmPassword} onChange={handleChange} required />
          </div>
        </div>



        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <input type="checkbox" id="terms" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }} required />
          <label htmlFor="terms" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>I agree to the Terms of Service and Privacy Policy.</label>
        </div>

        <PrimaryButton type="submit" isLoading={loading}>Create Account</PrimaryButton>
      </motion.form>

      <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <button onClick={onToggleMode} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Log In</button>
      </motion.div>
    </motion.div>
  );
};

export default SignupForm;
