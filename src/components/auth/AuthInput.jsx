import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AuthInput = ({ label, type = "text", value, onChange, icon: Icon, required = false, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="auth-input-group">
      <input
        type={inputType}
        value={value}
        onChange={onChange}
        className="auth-input"
        placeholder=" " /* Required for floating label CSS trick */
        required={required}
        {...props}
      />
      <label className="auth-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {Icon && <Icon size={16} />}
        {label}
      </label>
      
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex'
          }}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

export default AuthInput;
