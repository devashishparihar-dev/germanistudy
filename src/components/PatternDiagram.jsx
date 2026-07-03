import React from 'react';

const PatternDiagram = ({ text, inline = false }) => {
  if (!text) return null;

  // Split text by lines
  const lines = text.split('\n');
  
  return (
    <div style={{
      background: inline ? 'transparent' : 'var(--card-bg)',
      border: inline ? 'none' : '1px solid var(--border-color)',
      borderRadius: inline ? '0' : 'var(--radius-md)',
      padding: inline ? '0' : '24px',
      margin: inline ? '0' : '24px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: inline ? '8px' : '16px',
      fontFamily: 'monospace',
      fontSize: '1.2rem',
    }}>
      {lines.map((line, idx) => {
        // Look for pattern blocks like [ ◯ ]
        const parts = line.split(/(\[.*?\])/g);
        
        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            {parts.map((part, pIdx) => {
              if (part.startsWith('[') && part.endsWith(']')) {
                // This is a block, render it as a stylized box
                const innerText = part.slice(1, -1).trim();
                return (
                  <div key={pIdx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: inline ? '40px' : '60px',
                    height: inline ? '40px' : '60px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '8px',
                    background: 'white',
                    fontSize: inline ? '1.1rem' : '1.5rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    color: 'var(--text-main)',
                    letterSpacing: innerText.length > 2 ? '-2px' : 'normal',
                    padding: '0 12px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                  }}>
                    {innerText === '?' ? <span style={{ color: 'var(--primary-blue)', fontWeight: 'bold' }}>?</span> : innerText}
                  </div>
                );
              } else if (part.trim() !== '') {
                // Text label
                return (
                  <div key={pIdx} style={{ fontWeight: 600, color: 'var(--text-muted)', marginRight: '8px' }}>
                    {part.trim()}
                  </div>
                );
              }
              return null;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default PatternDiagram;
