import React, { useState } from 'react';
import { Save, RotateCcw, Trash2, List } from 'lucide-react';

const ScratchNotebook = () => {
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  const handleInput = (e) => {
    setContent(e.target.value);
    setSaveStatus('Saving...');
    setTimeout(() => setSaveStatus('Saved'), 1000);
  };

  const clearNotes = () => {
    setContent('');
    setSaveStatus('Cleared');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const addBullet = () => {
    setContent(content + (content.length > 0 && !content.endsWith('\n') ? '\n' : '') + '• ');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--card-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-color)', background: '#F9FAFB' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Digital Scratchpad</span>
        <div style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)' }}>
          {saveStatus && <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Save size={12} /> {saveStatus}</span>}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', padding: '8px 16px', borderBottom: '1px solid var(--border-color)', background: '#F9FAFB' }}>
        <button onClick={addBullet} title="Add Bullet" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><List size={16} /></button>
        <button title="Undo" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><RotateCcw size={16} /></button>
        <button onClick={clearNotes} title="Clear Notes" style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}><Trash2 size={16} /></button>
      </div>

      <textarea
        value={content}
        onChange={handleInput}
        placeholder="Type your workings here... (Use bullet points for steps)"
        style={{ flex: 1, width: '100%', border: 'none', padding: '16px', outline: 'none', resize: 'vertical', minHeight: '200px', fontSize: '0.95rem', fontFamily: 'inherit', color: 'var(--text-main)', background: 'transparent' }}
      />
    </div>
  );
};

export default ScratchNotebook;
