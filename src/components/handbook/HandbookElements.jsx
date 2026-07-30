import React from 'react';
import { motion } from 'framer-motion';

export const Timeline = ({ steps }) => {
  return (
    <div style={{ position: 'relative', paddingLeft: '24px', marginBottom: '40px' }}>
      <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border)' }} />
      {steps.map((step, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
          style={{ position: 'relative', marginBottom: index === steps.length - 1 ? 0 : '32px' }}
        >
          <div style={{ 
            position: 'absolute', left: '-24px', top: '4px', width: '16px', height: '16px', 
            borderRadius: '50%', background: 'var(--primary)', border: '4px solid var(--background)' 
          }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{step.title}</h4>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

export const Checklist = ({ title, items }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      style={{
        background: 'var(--surface)', padding: '24px', borderRadius: '12px', 
        border: '1px solid var(--border)', marginBottom: '32px'
      }}
    >
      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>{title}</h4>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((item, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-muted)' }}>
            <div style={{ 
              width: '20px', height: '20px', borderRadius: '4px', border: '2px solid var(--primary)', 
              display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, marginTop: '2px' 
            }}>
              <div style={{ width: '10px', height: '10px', background: 'var(--primary)', borderRadius: '2px' }} />
            </div>
            <span style={{ lineHeight: 1.5 }}>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
