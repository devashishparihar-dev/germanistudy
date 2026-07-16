import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const colors = ['var(--marigold)', 'var(--coral)', 'var(--sage)'];

const ConfettiBurst = ({ isActive, onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isActive) {
      // Generate particles
      const newParticles = Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const distance = 30 + Math.random() * 20;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          color: colors[i % colors.length],
          size: 4 + Math.random() * 4
        };
      });
      setParticles(newParticles);
      
      if (onComplete) {
        const timer = setTimeout(onComplete, 600);
        return () => clearTimeout(timer);
      }
    } else {
      setParticles([]);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, pointerEvents: 'none', zIndex: 10 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, scale: 1, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: 'absolute',
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            backgroundColor: p.color,
            marginLeft: `-${p.size / 2}px`,
            marginTop: `-${p.size / 2}px`
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiBurst;
