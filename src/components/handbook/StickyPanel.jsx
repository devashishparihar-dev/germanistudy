import React from 'react';
import { Bookmark, BookOpen, BrainCircuit, PlayCircle, ExternalLink, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

export const StickyPanel = ({ progress, totalTime, estimatedTimeLeft }) => {
  return (
    <aside className="sticky-panel hide-on-mobile" style={{ width: '320px', flexShrink: 0, position: 'sticky', top: '100px', height: 'calc(100vh - 100px)', paddingLeft: '24px' }}>
      
      <div className="premium-card" style={{ padding: '24px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '0.5px' }}>Reading Progress</h4>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{Math.round(progress)}%</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', paddingBottom: '4px' }}>completed</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'var(--background)', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px', transition: 'width 0.3s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span>Total: {totalTime} min</span>
          <span>~{estimatedTimeLeft} min left</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        <button className="btn-primary" style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <BookOpen size={18} /> Continue Reading
        </button>
        <button style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          <Bookmark size={18} /> Bookmark Page
        </button>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '16px', letterSpacing: '0.5px' }}>Quick Navigation</h4>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li>
            <a href="#mock-tests" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>
              <div style={{ background: 'rgba(217, 164, 65, 0.1)', padding: '8px', borderRadius: '8px', color: 'var(--primary)' }}><BrainCircuit size={16} /></div>
              Take Mock Test
            </a>
          </li>
          <li>
            <a href="#practice" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>
              <div style={{ background: 'rgba(217, 164, 65, 0.1)', padding: '8px', borderRadius: '8px', color: 'var(--primary)' }}><PlayCircle size={16} /></div>
              Start Practice
            </a>
          </li>
          <li>
            <a href="#official" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>
              <div style={{ background: 'rgba(217, 164, 65, 0.1)', padding: '8px', borderRadius: '8px', color: 'var(--primary)' }}><ExternalLink size={16} /></div>
              Official Resources
            </a>
          </li>
        </ul>
      </div>

      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}
      >
        <ArrowUp size={16} /> Back to top
      </button>

    </aside>
  );
};
