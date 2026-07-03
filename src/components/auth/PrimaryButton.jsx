import React from 'react';
import { Loader2 } from 'lucide-react';

const PrimaryButton = ({ children, isLoading, ...props }) => {
  return (
    <button
      className="btn-primary"
      style={{
        width: '100%',
        padding: '14px',
        fontSize: '1.05rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        opacity: isLoading ? 0.7 : 1,
        cursor: isLoading ? 'not-allowed' : 'pointer'
      }}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin" size={20} style={{ animation: 'spin 1s linear infinite' }} /> : null}
      {children}
    </button>
  );
};

export default PrimaryButton;
