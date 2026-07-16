import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';
import Topbar from '../components/Topbar';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-body)' }}>
      <Topbar hideLinks />
      <div style={{ maxWidth: '800px', margin: '100px auto', padding: '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ background: 'var(--marigold-light)', color: 'var(--marigold)', padding: '16px', borderRadius: '16px' }}>
              <Scale size={32} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--ink)' }}>Terms of Service</h1>
          </div>
          
          <div style={{ fontSize: '1.1rem', color: 'var(--ink-muted)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p><strong>Last Updated: [Current Date]</strong></p>
            
            <p>By accessing and using GermaniStudy, you agree to be bound by the following Terms of Service. If you do not agree to these terms, please do not use our platform.</p>

            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '1.5rem', marginTop: '16px' }}>1. Educational Use Only</h2>
            <p>GermaniStudy provides simulated exam environments for the TestAS exam. While we strive for accuracy, our platform is not officially affiliated with the TestAS institute. Mock exam scores are not a guarantee of actual test performance.</p>

            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '1.5rem', marginTop: '16px' }}>2. Account Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You agree not to share your account with others or use automated tools to scrape our question banks.</p>

            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '1.5rem', marginTop: '16px' }}>3. Academic Integrity</h2>
            <p>Our mock exams simulate real test conditions, including tracking tab-switches and time limits. Attempting to bypass these mechanisms undermines the value of the platform for your own preparation.</p>

            <div style={{ marginTop: '32px', padding: '24px', background: 'var(--paper-dark)', borderRadius: '12px', borderLeft: '4px solid var(--marigold)' }}>
              <strong>Legal Disclaimer:</strong> This is a placeholder policy for demonstration purposes. It should be reviewed by legal counsel before being treated as a legally binding Terms of Service.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
