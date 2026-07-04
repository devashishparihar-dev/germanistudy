import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Clock } from 'lucide-react';
import { blogPosts } from '../data/blogs';

const BlogPost = ({ setCurrentView, blogId }) => {
  const post = blogPosts.find(p => p.id === blogId);

  if (!post) {
    return (
      <div className="view-container" style={{ padding: '120px 32px', textAlign: 'center', background: 'var(--background)' }}>
        <h2>Blog post not found</h2>
        <button onClick={() => setCurrentView('Blogs')} className="btn-primary" style={{ marginTop: '24px' }}>
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="view-container blog-post-view" style={{ maxWidth: '100%', padding: '0', background: 'var(--background)' }}>
      <main style={{ width: '100%', padding: '120px 32px 100px', minHeight: 'calc(100vh - 200px)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <button 
            onClick={() => setCurrentView('Blogs')}
            style={{ 
              background: 'none', border: 'none', color: 'var(--text-muted)', 
              display: 'flex', alignItems: 'center', gap: '8px', 
              cursor: 'pointer', fontSize: '1rem', fontWeight: 500, marginBottom: '32px',
              padding: '8px 0'
            }}
          >
            <ArrowLeft size={20} /> Back to all posts
          </button>

          <header style={{ marginBottom: '48px', borderBottom: '1px solid var(--border)', paddingBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <span style={{ padding: '6px 16px', background: 'rgba(242, 175, 0, 0.15)', color: 'var(--primary)', borderRadius: '24px', fontSize: '0.9rem', fontWeight: 600 }}>
                {post.category}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{post.date}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                <Clock size={16} /> {post.readTime}
              </div>
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.2 }}>
              {post.title}
            </h1>
          </header>

          {post.thumbnail && (
            <div style={{ width: '100%', height: '400px', borderRadius: '16px', overflow: 'hidden', marginBottom: '48px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}>
              <img src={post.thumbnail} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          <article className="markdown-content" style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text)' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </article>

        </div>
      </main>
    </div>
  );
};

export default BlogPost;
