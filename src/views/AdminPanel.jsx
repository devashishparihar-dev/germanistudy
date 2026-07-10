import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Loader2 } from 'lucide-react';
import AdminOverview from '../components/admin/AdminOverview';
import AdminQuestionBank from '../components/admin/AdminQuestionBank';
import AdminUsers from '../components/admin/AdminUsers';
import AdminBlogs from '../components/admin/AdminBlogs';

const AdminPanel = ({ setCurrentView, session }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!session?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (error || !data || data.role !== 'admin') {
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [session]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
        <Loader2 size={48} className="spin" style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px' }}>403 Unauthorized</h1>
        <p style={{ color: 'var(--text-muted)' }}>You do not have permission to access this panel.</p>
        <button className="btn-primary" style={{ marginTop: '24px' }} onClick={() => setCurrentView('Home')}>Return Home</button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'questions', label: 'Question Bank' },
    { id: 'users', label: 'Users' },
    { id: 'blogs', label: 'Blog Manager' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', paddingTop: '70px', backgroundColor: 'var(--bg-light)' }}>
      {/* Admin Top Navigation */}
      <div style={{ padding: '0 32px', backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '8px', alignItems: 'stretch', minHeight: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '24px' }}>
          <span style={{ fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.5px' }}>Admin Workspace</span>
        </div>
        {tabs.map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              padding: '0 24px',
              backgroundColor: 'transparent',
              color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--text-muted)',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid var(--primary-color)' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Admin Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'overview' && <AdminOverview />}
        {activeTab === 'questions' && <AdminQuestionBank />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'blogs' && <AdminBlogs />}
      </div>
    </div>
  );
};

export default AdminPanel;
