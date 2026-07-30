import React from 'react';
import { Info, AlertTriangle, CheckCircle, ExternalLink, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export const GuideHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: '40px' }}>
    <motion.h1 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '8px', lineHeight: 1.2 }}
    >
      {title}
    </motion.h1>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: 500 }}
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const BaseCard = ({ icon: Icon, title, content, borderColor, bgColor, iconColor }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
    style={{ 
      background: bgColor, 
      borderLeft: `4px solid ${borderColor}`,
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px',
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start'
    }}
  >
    <Icon size={24} color={iconColor} style={{ flexShrink: 0, marginTop: '2px' }} />
    <div>
      {title && <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>{title}</h4>}
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{content}</p>
    </div>
  </motion.div>
);

export const InfoCard = ({ title, content }) => (
  <BaseCard icon={Info} title={title} content={content} borderColor="var(--accent)" bgColor="rgba(47, 93, 138, 0.05)" iconColor="var(--accent)" />
);

export const WarningCard = ({ title, content }) => (
  <BaseCard icon={AlertTriangle} title={title} content={content} borderColor="var(--warning)" bgColor="rgba(245, 158, 11, 0.05)" iconColor="var(--warning)" />
);

export const SuccessCard = ({ title, content }) => (
  <BaseCard icon={CheckCircle} title={title} content={content} borderColor="var(--success)" bgColor="rgba(16, 185, 129, 0.05)" iconColor="var(--success)" />
);

export const ResourceCard = ({ title, description, link }) => (
  <motion.a 
    href={link}
    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
    className="premium-card"
    style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '20px 24px', marginBottom: '16px', background: 'var(--surface)',
      border: '1px solid var(--border)', borderRadius: '12px', textDecoration: 'none',
      transition: 'all 0.2s ease', cursor: 'pointer'
    }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
  >
    <div>
      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{title}</h4>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{description}</p>
    </div>
    <div style={{ background: 'var(--background)', padding: '12px', borderRadius: '50%', color: 'var(--primary)' }}>
      <Download size={20} />
    </div>
  </motion.a>
);

export const UniversityCard = ({ name, programs, accepts, score, link }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
    className="premium-card"
    style={{
      padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px',
      display: 'flex', flexDirection: 'column', gap: '16px'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>{name}</h4>
      <a href={link} style={{ color: 'var(--primary)' }}><ExternalLink size={18} /></a>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      <div>
        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Programs</span>
        <div style={{ color: 'var(--text)', fontWeight: 500 }}>{programs}</div>
      </div>
      <div>
        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Accepts dMAT</span>
        <div style={{ color: 'var(--success)', fontWeight: 500 }}>{accepts}</div>
      </div>
      <div style={{ gridColumn: 'span 2' }}>
        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Recommended Score</span>
        <div style={{ color: 'var(--text)', fontWeight: 500 }}>{score}</div>
      </div>
    </div>
  </motion.div>
);
