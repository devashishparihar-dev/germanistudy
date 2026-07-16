import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setBlogs(data || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setCurrentBlog({ ...blog });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentBlog({
      title: '',
      category: 'General',
      readTime: '5 min read',
      excerpt: '',
      content: '',
      thumbnail: ''
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (error) throw error;
        setBlogs(blogs.filter(b => b.id !== id));
      } catch (err) {
        console.error('Error deleting blog:', err);
        alert('Failed to delete blog post.');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...currentBlog };
      if (!payload.id) {
        const { error } = await supabase.from('blog_posts').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').update(payload).eq('id', payload.id);
        if (error) throw error;
      }
      setIsEditing(false);
      setCurrentBlog(null);
      fetchBlogs();
    } catch (err) {
      console.error('Error saving blog:', err);
      alert('Failed to save blog post. Ensure the table schema matches these fields.');
    } finally {
      setSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--ink)' }}>
            {currentBlog.id ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          <button 
            onClick={() => setIsEditing(false)}
            style={{ background: 'transparent', border: '1px solid var(--ink)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--paper)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(43, 36, 56, 0.1)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Title</label>
            <input 
              type="text"
              value={currentBlog.title || ''} 
              onChange={e => setCurrentBlog({...currentBlog, title: e.target.value})}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(43, 36, 56, 0.2)', background: 'var(--paper)', fontFamily: 'var(--font-body)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Category</label>
              <input 
                type="text"
                value={currentBlog.category || ''} 
                onChange={e => setCurrentBlog({...currentBlog, category: e.target.value})}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(43, 36, 56, 0.2)', background: 'var(--paper)', fontFamily: 'var(--font-body)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Read Time</label>
              <input 
                type="text"
                value={currentBlog.readTime || ''} 
                onChange={e => setCurrentBlog({...currentBlog, readTime: e.target.value})}
                placeholder="e.g. 5 min read"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(43, 36, 56, 0.2)', background: 'var(--paper)', fontFamily: 'var(--font-body)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Thumbnail URL (optional)</label>
            <input 
              type="text"
              value={currentBlog.thumbnail || ''} 
              onChange={e => setCurrentBlog({...currentBlog, thumbnail: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(43, 36, 56, 0.2)', background: 'var(--paper)', fontFamily: 'var(--font-body)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Excerpt</label>
            <textarea 
              value={currentBlog.excerpt || ''} 
              onChange={e => setCurrentBlog({...currentBlog, excerpt: e.target.value})}
              required
              rows={3}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(43, 36, 56, 0.2)', background: 'var(--paper)', fontFamily: 'var(--font-body)', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Content (Markdown)</label>
            <textarea 
              value={currentBlog.content || ''} 
              onChange={e => setCurrentBlog({...currentBlog, content: e.target.value})}
              required
              rows={12}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(43, 36, 56, 0.2)', background: 'var(--paper)', fontFamily: 'var(--font-mono)', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button 
              type="submit"
              disabled={saving}
              style={{ 
                background: 'var(--marigold)', 
                color: 'var(--ink)', 
                border: 'none', 
                padding: '12px 32px', 
                borderRadius: '8px', 
                fontWeight: 700, 
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1
              }}
            >
              {saving ? 'Saving...' : 'Save Blog Post'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--ink)', marginBottom: '8px' }}>Blog Posts</h1>
          <p style={{ color: 'var(--ink-muted)' }}>Manage blog posts and articles.</p>
        </div>
        <button 
          onClick={handleCreate}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'var(--sky)', color: '#fff', border: 'none', 
            padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
            transition: 'transform 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Plus size={18} /> New Post
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
          <Loader2 size={32} className="spin" color="var(--sky)" />
        </div>
      ) : blogs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', background: 'var(--paper)', borderRadius: '12px', border: '1px solid rgba(43, 36, 56, 0.1)' }}>
          <p style={{ color: 'var(--ink-muted)', fontSize: '1.1rem' }}>No blog posts found.</p>
        </div>
      ) : (
        <div style={{ background: 'var(--paper)', borderRadius: '12px', border: '1px solid rgba(43, 36, 56, 0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(43, 36, 56, 0.03)', borderBottom: '1px solid rgba(43, 36, 56, 0.1)' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-muted)' }}>Title</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-muted)' }}>Category</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-muted)' }}>Date</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b, idx) => (
                <tr key={b.id || idx} style={{ borderBottom: '1px solid rgba(43, 36, 56, 0.05)' }}>
                  <td style={{ padding: '16px 24px', fontSize: '0.95rem', fontWeight: 500 }}>
                    {b.title}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: 'var(--ink-muted)' }}>
                    {b.category}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: 'var(--ink-muted)' }}>
                    {b.created_at ? new Date(b.created_at).toLocaleDateString() : 'Draft'}
                  </td>
                  <td style={{ padding: '16px 24px', display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => handleEdit(b)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--sky)', display: 'flex', alignItems: 'center' }}
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(b.id)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--coral)', display: 'flex', alignItems: 'center' }}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
