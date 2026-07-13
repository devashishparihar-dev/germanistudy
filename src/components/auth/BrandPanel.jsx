import React from 'react';
import { Target, BarChart2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const BrandPanel = () => {
  return (
    <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', padding: '64px', height: '100%', color: 'white', justifyContent: 'space-between' }}>
      
      <div>
        <div style={{ marginBottom: '64px' }}>
          <img src="/assets/branding/logo_wide_dark.png" alt="GermaniStudy Logo" style={{ height: '200px', objectFit: 'contain' }} />
        </div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '24px', fontFamily: 'var(--font-heading)', color: '#F8F9FA' }}>
          Boost your preparation with GermaniStudy.
        </motion.h1>
        
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ fontSize: '1.15rem', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.7)', maxWidth: '400px', marginBottom: '64px' }}>
          Practice under real exam conditions with professional mock tests, performance analytics, and detailed progress tracking.
        </motion.p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {[
            { icon: <Target size={24} color="#F2AF00" />, title: 'Real Test Simulation', desc: 'Practice in an interface designed to closely resemble the official digital TestAS experience.' },
            { icon: <BarChart2 size={24} color="#F2AF00" />, title: 'Performance Analytics', desc: 'Track your strengths, weaknesses, accuracy, and time management after every mock test.' },
            { icon: <Zap size={24} color="#F2AF00" />, title: 'Personalized Learning', desc: 'Receive recommendations based on your weakest question types and subject modules.' },
          ].map((feature, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (idx * 0.1) }} style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(242, 175, 0, 0.1)', border: '1px solid rgba(242, 175, 0, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {feature.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px', color: '#F8F9FA' }}>{feature.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.5 }}>{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 500, marginTop: '48px' }}>
        Trusted by future students preparing for Germany.
      </div>

    </div>
  );
};

export default BrandPanel;
