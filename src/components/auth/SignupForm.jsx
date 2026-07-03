import React, { useState } from 'react';
import { Mail, Lock, User, Calendar, MapPin, BookOpen, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthInput from './AuthInput';
import PrimaryButton from './PrimaryButton';
import SocialLoginButtons from './SocialLoginButtons';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const SignupForm = ({ onToggleMode, onSignup }) => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    country: '', studyLevel: '', targetModule: '', testDate: '', acceptTerms: false
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
      <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        <img src="/assets/branding/logo_light.png" alt="GermaniStudy Logo" className="logo-light-mode" style={{ height: '64px', objectFit: 'contain' }} />
        <img src="/assets/branding/logo_dark.png" alt="GermaniStudy Logo" className="logo-dark-mode" style={{ height: '64px', objectFit: 'contain' }} />
      </motion.div>
      <motion.div variants={itemVariants} style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>Create your account</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Start your personalized DMAT preparation journey today.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SocialLoginButtons />
      </motion.div>

      <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        <span style={{ padding: '0 12px' }}>OR</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
      </motion.div>

      <motion.form variants={itemVariants} onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <AuthInput label="Full Name" name="fullName" icon={User} value={formData.fullName} onChange={handleChange} required />
          </div>
          <div style={{ flex: 1 }}>
            <AuthInput label="Email Address" type="email" name="email" icon={Mail} value={formData.email} onChange={handleChange} required />
          </div>
        </div>

        <AuthInput label="Password" type="password" name="password" icon={Lock} value={formData.password} onChange={handleChange} required />
        <PasswordStrengthIndicator password={formData.password} />
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <AuthInput label="Confirm Password" type="password" name="confirmPassword" icon={Lock} value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          <div style={{ flex: 1 }}>
            <AuthInput label="Country" name="country" icon={MapPin} value={formData.country} onChange={handleChange} required />
          </div>
        </div>

        {/* Extended Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div className="auth-input-group">
            <select name="studyLevel" value={formData.studyLevel} onChange={(e) => { handleChange(e); setFormData(prev => ({ ...prev, targetModule: '' })); }} className="auth-input" style={{ paddingTop: '24px', paddingLeft: '38px', appearance: 'none' }} required>
              <option value="" disabled></option>
              <option value="Undergraduate">Undergraduate (Bachelor's)</option>
              <option value="Master's">Postgraduate (Master's)</option>
            </select>
            <GraduationCap size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <label className="auth-label" style={{ top: '8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>Study Level</label>
          </div>

          <div className="auth-input-group">
            <select name="targetModule" value={formData.targetModule} onChange={handleChange} className="auth-input" style={{ paddingTop: '24px', paddingLeft: '38px', appearance: 'none' }} required disabled={!formData.studyLevel}>
              <option value="" disabled></option>
              {formData.studyLevel === 'Undergraduate' ? (
                <>
                  <option value="DMAT - Engineering">DMAT - Engineering</option>
                  <option value="DMAT - Economics">DMAT - Economics</option>
                  <option value="DMAT - Humanities">DMAT - Humanities</option>
                  <option value="DMAT - Mathematics">DMAT - Mathematics</option>
                  <option value="DMAT - Medical">DMAT - Medical</option>
                </>
              ) : formData.studyLevel === "Master's" ? (
                <>
                  <option value="DMAT">DMAT</option>
                  <option value="GRE">GRE</option>
                  <option value="GMAT">GMAT</option>
                  <option value="General/Direct Admission">General / Direct Admission</option>
                </>
              ) : null}
            </select>
            <BookOpen size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <label className="auth-label" style={{ top: '8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>Target Exam / Module</label>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div className="auth-input-group">
            <input type="date" name="testDate" value={formData.testDate} onChange={handleChange} className="auth-input" style={{ paddingTop: '24px', paddingLeft: '38px' }} required />
            <Calendar size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <label className="auth-label" style={{ top: '8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>Expected Test Date (or Application Date)</label>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <input type="checkbox" id="terms" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }} required />
          <label htmlFor="terms" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>I agree to the Terms of Service and Privacy Policy.</label>
        </div>

        <PrimaryButton type="submit" isLoading={loading}>Create Account</PrimaryButton>
      </motion.form>

      <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <button onClick={onToggleMode} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Log In</button>
      </motion.div>
    </motion.div>
  );
};

export default SignupForm;
