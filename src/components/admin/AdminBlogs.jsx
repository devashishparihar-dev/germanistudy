import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    read_time: '',
    excerpt: '',
    content: '',
    thumbnail: '',
    status: 'draft'
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setBlogs(data || []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      setBlogs(blogs.filter(b => b.id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Failed to delete post.");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const { error } = await supabase.from('blog_posts').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setBlogs(blogs.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (err) {
      console.error("Error toggling status:", err);
      alert("Failed to update status.");
    }
  };

  const openForm = (b = null) => {
    if (b) {
      setEditingId(b.id);
      setFormData({
        title: b.title || '',
        category: b.category || '',
        read_time: b.read_time || '',
        excerpt: b.excerpt || '',
        content: b.content || '',
        thumbnail: b.thumbnail || '',
        status: b.status || 'draft'
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        category: '',
        read_time: '',
        excerpt: '',
        content: '',
        thumbnail: '',
        status: 'draft'
      });
    }
    setIsFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase.from('blog_posts').update(formData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert([formData]);
        if (error) throw error;
      }
      setIsFormOpen(false);
      fetchBlogs();
    } catch (err) {
      console.error("Error saving blog:", err);
      alert("Failed to save post.");
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>Blog Manager</h2>
        <button 
          onClick={() => openForm()}
          className="btn-premium" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
        >
          <Plus size={18} /> New Post
        </button>
      </div>

      <div className="premium-card" style={{ padding: '16px', marginBottom: '24px', display: 'flex' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by title..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-main)' }} 
          />
        </div>
      </div>

      <div className="premium-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light)' }}>
              <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>Title</th>
              <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>Category</th>
              <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
              <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td></tr>
            ) : filteredBlogs.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No posts found.</td></tr>
            ) : (
              filteredBlogs.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px', fontWeight: 500, maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.title}</td>
                  <td style={{ padding: '16px' }}>{b.category}</td>
                  <td style={{ padding: '16px' }}>
                    <button 
                      onClick={() => handleToggleStatus(b.id, b.status)}
                      style={{ 
                        padding: '4px 12px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                        backgroundColor: b.status === 'published' ? 'var(--success-light, #d1fae5)' : 'var(--warning-light, #fef3c7)',
                        color: b.status === 'published' ? 'var(--success-dark, #065f46)' : 'var(--warning-dark, #92400e)'
                      }}
                    >
                      {b.status === 'published' ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={() => openForm(b)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginRight: '16px' }}>
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(b.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '24px' }}>
          <div className="premium-card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>{editingId ? 'Edit Post' : 'New Post'}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Title</label>
                <input 
                  required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Category</label>
                  <input 
                    required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-main)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Read Time (e.g. "5 min")</label>
                  <input 
                    type="text" value={formData.read_time} onChange={e => setFormData({...formData, read_time: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Thumbnail URL</label>
                <input 
                  type="text" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Excerpt</label>
                <textarea 
                  rows="2" value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-main)', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Content (Markdown)</label>
                <textarea 
                  required rows="8" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-light)', color: 'var(--text-main)', resize: 'vertical', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsFormOpen(false)} style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>Save Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
