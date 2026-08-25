import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

const NotFound = () => {
  const navigate = useNavigate();
  useSEO({
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist.',
    noindex: true,
  });

  return (
    <div className="view-container home-view" style={{ justifyContent: 'center' }}>
      <div className="hero-section">
        <h1 className="hero-title" style={{ fontSize: '4rem', color: 'var(--accent-red)' }}>404</h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Page Not Found</h2>
        <p className="hero-subtitle">The page you are looking for does not exist or you do not have permission to view it.</p>
        <button className="btn-primary hero-btn" onClick={() => navigate('/')}>
          Return Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
