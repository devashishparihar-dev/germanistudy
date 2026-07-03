import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

const SocialLoginButtons = () => {
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const handleOAuthLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      alert(`Error logging in with ${provider}: ${error.message}`);
    }
  };

  const btnStyle = {
    width: '100%', padding: '12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '1rem', fontWeight: 600, color: 'var(--text)',
    cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-soft)'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      <button 
        onClick={() => handleOAuthLogin('google')}
        style={{ ...btnStyle, opacity: hoveredBtn === 'google' ? 0.8 : 1 }}
        onMouseEnter={() => setHoveredBtn('google')}
        onMouseLeave={() => setHoveredBtn(null)}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
          </g>
        </svg>
        Continue with Google
      </button>

      {/* <button 
        onClick={() => handleOAuthLogin('apple')}
        style={{ ...btnStyle, opacity: hoveredBtn === 'apple' ? 0.8 : 1 }}
        onMouseEnter={() => setHoveredBtn('apple')}
        onMouseLeave={() => setHoveredBtn(null)}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.62-1.496 3.6-2.998 1.14-1.665 1.626-3.279 1.65-3.367-.035-.015-3.153-1.214-3.189-4.836-.03-3.034 2.47-4.484 2.584-4.558-1.423-2.078-3.626-2.361-4.42-2.404-1.921-.103-3.792 1.218-4.751 1.218-.971 0-2.52-1.117-3.751-1.117zm4.26-3.17c.866-1.049 1.448-2.508 1.29-3.96-1.267.05-2.825.84-3.722 1.889-.8.924-1.492 2.41-1.306 3.823 1.428.11 2.87-.714 3.738-1.752z"/>
        </svg>
        Continue with Apple
      </button> */}
    </div>
  );
};

export default SocialLoginButtons;
