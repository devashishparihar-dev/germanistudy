import React from 'react';
import { motion } from 'framer-motion';

export const GuideSidebar = ({ chapters, activeChapterId, onSearch, searchQuery }) => {
  return (
    <aside className="guide-sidebar hide-on-mobile" style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '100px', height: 'calc(100vh - 100px)', overflowY: 'auto', paddingRight: '24px' }}>

      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {chapters.map((chapter, index) => {
          const isActive = activeChapterId === chapter.id;
          return (
            <div 
              key={chapter.id} 
              style={{
                padding: '8px 12px', borderRadius: '6px', color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500, fontSize: '0.95rem', textDecoration: 'none',
                background: isActive ? 'var(--surface)' : 'transparent',
                borderLeft: `2px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
                transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '12px',
                cursor: 'default'
              }}
            >
              <span style={{ fontSize: '0.8rem', opacity: 0.6, width: '20px' }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              {chapter.title}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
