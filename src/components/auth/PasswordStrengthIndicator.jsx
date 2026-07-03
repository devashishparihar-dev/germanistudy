import React from 'react';
import { Check, X } from 'lucide-react';

const PasswordStrengthIndicator = ({ password }) => {
  const requirements = [
    { label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { label: 'Uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { label: 'Lowercase letter', test: (p) => /[a-z]/.test(p) },
    { label: 'Number', test: (p) => /[0-9]/.test(p) },
    { label: 'Special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
  ];

  if (!password) return null;

  return (
    <div style={{ marginTop: '16px', padding: '16px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '12px' }}>Password Requirements</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {requirements.map((req, idx) => {
          const isValid = req.test(password);
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: isValid ? 'var(--success)' : 'var(--text-muted)' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: isValid ? 'var(--success)' : 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                {isValid ? <Check size={10} className="strength-check" /> : <X size={10} color="var(--text-muted)" />}
              </div>
              {req.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
