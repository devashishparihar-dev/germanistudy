import React from 'react';
import { motion } from 'framer-motion';

const HandDrawnCheck = ({ color = 'var(--coral)', strokeWidth = 2.5, className = '' }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 100 40" 
      fill="none" 
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: '130%', 
        height: '150%', 
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      <motion.path
        d="M50 2 C 75 1, 98 10, 95 25 C 92 40, 75 39, 50 38 C 25 37, 5 30, 8 15 C 11 0, 30 3, 52 4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </svg>
  );
};

export default HandDrawnCheck;
