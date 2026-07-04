import React from 'react';
import { Newspaper, ChevronRight, Clock } from 'lucide-react';

import { motion } from 'framer-motion';

import { blogPosts } from '../data/blogs';

const Blogs = ({ setCurrentView }) => {

  return (
    <div className="view-container blogs-view" style={{ maxWidth: '100%', padding: '0', background: 'var(--background)' }}>
      
      <main style={{ width: '100%', padding: '120px 32px 100px', minHeight: 'calc(100vh - 200px)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <header style={{ marginBottom: '48px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text)', marginBottom: '16px', letterSpacing: '-1px' }}>Blogs & Insights</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', lineHeight: 1.6 }}>
              Read the latest tips, guides, and student experiences to help you on your journey to studying a Master's degree in Germany.
            </p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
            {blogPosts.map((post, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.1 }} 
                className="premium-card" 
                style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface)', overflow: 'hidden' }}
              >
                {post.thumbnail && (
                  <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
                    <img src={post.thumbnail} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <span style={{ padding: '4px 12px', background: 'rgba(136, 192, 208, 0.15)', color: 'var(--primary)', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600 }}>
                    {post.category}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Clock size={14} /> {post.readTime}
                  </div>
                </div>
                
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '16px', lineHeight: 1.3 }}>
                  {post.title}
                </h3>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '32px', flex: 1 }}>
                  {post.excerpt}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{post.date}</span>
                  <button onClick={() => setCurrentView(`BlogPost:${post.id}`)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '1rem' }}>
                    Read Full Post <ChevronRight size={18} />
                  </button>
                </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--surface)', width: '100%', padding: '64px 32px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <img src="/assets/branding/logo_light.png" alt="GermaniStudy Logo" className="logo-light-mode" style={{ height: '96px', objectFit: 'contain', filter: 'grayscale(1) opacity(0.5)' }} />
          <img src="/assets/branding/logo_dark.png" alt="GermaniStudy Logo" className="logo-dark-mode" style={{ height: '96px', objectFit: 'contain', filter: 'grayscale(1) opacity(0.5)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button onClick={() => setCurrentView('Home')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500, fontSize: '1rem' }}>Home</button>
          <button onClick={() => setCurrentView('Auth')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500, fontSize: '1rem' }}>DMAT Prep</button>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500, fontSize: '1rem' }}>Resources</button>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>© 2026 GermaniStudy. The Gateway to Germany. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Blogs;
