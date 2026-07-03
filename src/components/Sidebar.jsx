import React from 'react';
import { GraduationCap } from 'lucide-react';

const Sidebar = ({ onEndTest, testEnded }) => {
  return (
    <aside className="sidebar" style={{ background: 'var(--sidebar-bg)', color: 'white' }}>
      <div className="sidebar-header" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <img src="/assets/branding/logo_light.png" alt="GermaniStudy Logo" className="logo-light-mode" style={{ height: '60px', objectFit: 'contain' }} />
          <img src="/assets/branding/logo_dark.png" alt="GermaniStudy Logo" className="logo-dark-mode" style={{ height: '60px', objectFit: 'contain' }} />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>TestAS Simulator</p>
      </div>
      <div className="sidebar-content" style={{ padding: '0 24px' }}>
        <div className="info-block" style={{ marginBottom: '16px' }}>
          <span className="label" style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '4px' }}>Candidate:</span>
          <span className="value" style={{ fontSize: '1.1rem', fontWeight: 600 }}>Guest User</span>
        </div>
        <div className="info-block" style={{ marginBottom: '16px' }}>
          <span className="label" style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '4px' }}>Module:</span>
          <span className="value" style={{ fontSize: '1.1rem', fontWeight: 600 }}>Core Test</span>
        </div>
        <div className="info-block" style={{ marginBottom: '16px' }}>
          <span className="label" style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '4px' }}>Section:</span>
          <span className="value" style={{ fontSize: '1.1rem', fontWeight: 600 }}>Quantitative Problems</span>
        </div>
      </div>
      <div className="sidebar-footer" style={{ padding: '24px', marginTop: 'auto' }}>
        <button 
          className="btn-secondary" 
          onClick={onEndTest}
          disabled={testEnded}
          style={{ width: '100%', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
        >
          End Test
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
