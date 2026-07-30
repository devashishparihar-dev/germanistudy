import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FAQAccordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{
              background: 'var(--surface)',
              border: `1px solid ${isOpen ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'all 0.2s ease'
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '20px 24px', background: 'transparent', border: 'none', cursor: 'pointer',
                textAlign: 'left', color: 'var(--text)', fontSize: '1.1rem', fontWeight: 600
              }}
            >
              {item.question}
              <div style={{ color: isOpen ? 'var(--primary)' : 'var(--text-muted)', transition: 'transform 0.2s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                <ChevronDown size={20} />
              </div>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div style={{ padding: '0 24px 24px 24px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};
