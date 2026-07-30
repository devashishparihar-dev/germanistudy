import React from 'react';
import ExamSidebar from '../../components/ExamSidebar';
import { motion } from 'framer-motion';

const PracticeSubjectSocialSciences = ({ setCurrentView }) => {
  return (
    <div className="view-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <ExamSidebar setCurrentView={setCurrentView} />
      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card" style={{ padding: '40px', background: 'var(--surface)' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>Practice Subject Social Sciences</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>This is the dedicated hub for Practice Subject Social Sciences. Future notes, practice sets, and video lessons will be integrated here.</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default PracticeSubjectSocialSciences;
