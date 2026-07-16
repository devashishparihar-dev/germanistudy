import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import Topbar from '../components/Topbar';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-body)' }}>
      <Topbar hideLinks />
      <div style={{ maxWidth: '800px', margin: '100px auto', padding: '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ background: 'var(--sage-light)', color: 'var(--sage)', padding: '16px', borderRadius: '16px' }}>
              <Shield size={32} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--ink)' }}>Privacy Policy</h1>
          </div>
          
          <div style={{ fontSize: '1.1rem', color: 'var(--ink-muted)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p><strong>Last Updated: [Current Date]</strong></p>
            
            <p>Welcome to GermaniStudy. This Privacy Policy outlines how we collect, use, and protect your data when you use our authentic digital TestAS mock exams and related services.</p>

            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '1.5rem', marginTop: '16px' }}>1. Data Collection via Supabase Auth</h2>
            <p>We use Supabase Authentication to manage user accounts. When you sign up, we collect your email address and securely store an encrypted version of your password. We do not sell your personal contact information to third parties.</p>

            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '1.5rem', marginTop: '16px' }}>2. Test History and Storage</h2>
            <p>To provide accurate scoring and test simulations, we record your exam attempts, selected answers, timer data, and tab-switching behavior. This data is associated with your account so you can review your performance history.</p>

            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '1.5rem', marginTop: '16px' }}>3. Data Deletion Requests</h2>
            <p>Under GDPR guidelines, you have the right to request the deletion of your account and all associated test data. Please contact us at [Support Email] to initiate a data deletion request.</p>

            <div style={{ marginTop: '32px', padding: '24px', background: 'var(--paper-dark)', borderRadius: '12px', borderLeft: '4px solid var(--marigold)' }}>
              <strong>Legal Disclaimer:</strong> This is a placeholder policy for demonstration purposes. It should be reviewed by legal counsel before being treated as a compliant Privacy Policy.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
