import React from 'react';

const GridMotif = ({ size = 24, color = 'var(--accent)', style = {}, className = '' }) => {
  const dotSize = size * 0.15;
  const gap = size * 0.25;
  const totalSize = dotSize * 3 + gap * 2;

  const scale = size / totalSize;

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={`0 0 ${size} ${size}`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', flexShrink: 0, ...style }}
      className={className}
    >
      <g transform={`scale(${scale})`}>
        {[0, 1, 2].map(row => (
          [0, 1, 2].map(col => (
            <rect 
              key={`${row}-${col}`}
              x={col * (dotSize + gap)} 
              y={row * (dotSize + gap)} 
              width={dotSize} 
              height={dotSize} 
              fill={color} 
            />
          ))
        ))}
      </g>
    </svg>
  );
};

export default GridMotif;
