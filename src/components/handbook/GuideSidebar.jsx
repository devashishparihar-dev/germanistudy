import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const GuideSidebar = ({ chapters, activeChapterId, onSearch, searchQuery }) => {
  return (
    <aside className="guide-sidebar hide-on-mobile" style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '100px', height: 'calc(100vh - 100px)', overflowY: 'auto', paddingRight: '24px' }}>
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          placeholder="Search handbook..." 
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          style={{ 
            width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', 
            border: '1px solid var(--border)', background: 'var(--surface)', 
            color: 'var(--text)', fontSize: '0.95rem', outline: 'none' 
          }} 
        />
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {chapters.map((chapter, index) => {
          const isActive = activeChapterId === chapter.id;
          return (
            <a 
              key={chapter.id} 
              href={`#${chapter.id}`}
              style={{
                padding: '8px 12px', borderRadius: '6px', color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500, fontSize: '0.95rem', textDecoration: 'none',
                background: isActive ? 'var(--surface)' : 'transparent',
                borderLeft: `2px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
                transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '12px'
              }}
            >
              <span style={{ fontSize: '0.8rem', opacity: 0.6, width: '20px' }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              {chapter.title}
            </a>
          );
        })}
      </nav>
    </aside>
  );
};
