import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Info, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

const APSGuide = ({ setCurrentView }) => {
  useEffect(() => {
    trackEvent('page_view', { page: 'APSGuide' });
  }, []);

  return (
    <div className="view-container" style={{ maxWidth: '100%', padding: '0', background: 'var(--background)' }}>
      {/* Hero Section */}
      <section style={{ width: '100%', padding: '120px 32px 80px', display: 'flex', justifyContent: 'center', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(217, 164, 65, 0.1)', color: 'var(--primary)', borderRadius: '24px', marginBottom: '24px', fontWeight: 600, fontSize: '0.9rem' }}>
              <ShieldCheck size={18} /> APS India Certification
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '24px', lineHeight: 1.1 }}>
              The Ultimate Guide to APS India & dMAT
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Everything you need to know about the Akademische Prüfstelle (APS) certification and the new Digital Master Test (dMAT) requirement for Indian Master's applicants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ width: '100%', padding: '80px 32px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '800px', width: '100%', display: 'flex', flexDirection: 'column', gap: '48px' }}>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>What is APS India?</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              The Akademische Prüfstelle (APS) is an institution established by the German Embassy in New Delhi. It verifies the authenticity of Indian academic documents and checks if they meet the requirements for studying at a German university. An APS certificate is a mandatory prerequisite for submitting a German student visa application.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="premium-card" style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <Info size={28} color="var(--primary)" />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>The New dMAT Requirement</h3>
            </div>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '24px' }}>
              Starting for the Summer 2027 intake, the APS India has introduced the <strong>Digital Master Test (dMAT)</strong> as a mandatory requirement for specific Master's degree applicants. You must take the dMAT if your undergraduate degree is in:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {['Engineering', 'Commerce, Accounting, Finance, or Economics', 'Business or Management'].map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', color: 'var(--text)' }}>
                  <CheckCircle size={20} color="var(--success)" /> {item}
                </li>
              ))}
            </ul>
            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--error)', color: 'var(--text)' }}>
              <strong>Note:</strong> You are exempt if you completed your APS online registration before June 29, 2026, or if you already hold a valid APS certificate.
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>dMAT Exam Structure</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '24px' }}>
              The dMAT is a 3.5-hour digital exam conducted at designated test centers. It consists of two main modules:
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>1. Core Module</h4>
                <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Measures general cognitive, analytical, and problem-solving skills.</p>
                <ul style={{ color: 'var(--text-muted)', paddingLeft: '20px', lineHeight: 1.6 }}>
                  <li>Figure Sequences</li>
                  <li>Mathematical Equations</li>
                  <li>Latin Squares</li>
                </ul>
              </div>
              <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>2. General Academic Module</h4>
                <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>For APS applicants, this module presents passages or technical scenarios across multiple domains (Math, Sciences, Engineering, Business) and tests application skills rather than specialized knowledge.</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ textAlign: 'center', marginTop: '32px' }}>
            <button className="btn-primary" onClick={() => setCurrentView('Auth')} style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              Start Preparing for the dMAT <ArrowRight size={20} style={{ marginLeft: '8px' }} />
            </button>
          </motion.div>

        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--surface)', width: '100%', borderTop: '1px solid var(--border)' }}>
        <div style={{ padding: '40px 32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© 2026 GermaniStudy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default APSGuide;
