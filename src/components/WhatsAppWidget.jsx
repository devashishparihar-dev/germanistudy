import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';

const WhatsAppWidget = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 1 }}
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            zIndex: 9999,
          }}
        >
          <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            animate={{ 
              y: isHovered ? -5 : 0,
              boxShadow: isHovered 
                ? '0 20px 40px rgba(37, 211, 102, 0.25)' 
                : '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}
            style={{
              background: 'var(--surface)',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              cursor: 'pointer',
              position: 'relative'
            }}
            onClick={(e) => {
              // Don't trigger link if closing
              if (e.target.closest('button')) return;
              window.open('https://chat.whatsapp.com/JBKeNJadi2GJQRpYLeClMr', '_blank');
            }}
          >
            {/* Close Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(false);
              }}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <X size={14} />
            </button>

            {/* Icon Bubble */}
            <div style={{
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
            }}>
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="white" strokeWidth="2" fill="white" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </div>

            {/* Text Content */}
            <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '8px' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>
                Join the Community
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                TestAS Prep & Updates
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppWidget;
