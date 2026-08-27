import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Loader2, Database, Users, FileText, CheckSquare, Upload, BookMarked } from 'lucide-react';
import AdminQuestionBank from '../components/admin/AdminQuestionBank';
import AdminUsers from '../components/admin/AdminUsers';
import AdminBlogs from '../components/admin/AdminBlogs';
import AdminResults from '../components/admin/AdminResults';
import AdminMockImport from '../components/admin/AdminMockImport';
import AdminNotes from '../components/admin/AdminNotes';

const AdminPanel = ({ setCurrentView, session }) => {
  const [activeTab, setActiveTab] = useState('questions');
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%', background: 'var(--background)' }}>
        <Loader2 size={48} className="spin" style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%', background: 'var(--background)', fontFamily: 'var(--font-body)' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text)', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>403 Unauthorized</h1>
        <p style={{ color: 'var(--text-muted)' }}>You do not have permission to access this panel.</p>
        <button 
          onClick={() => setCurrentView('Home')}
          style={{ 
            marginTop: '24px',
            background: 'var(--primary)',
            color: '#111413',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'; }}
        >
          Return Home
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'import', label: 'Import JSON', icon: <Upload size={20} /> },
    { id: 'questions', label: 'Questions Bank', icon: <Database size={20} /> },
    { id: 'blogs', label: 'Blog Posts', icon: <FileText size={20} /> },
    { id: 'users', label: 'User Accounts', icon: <Users size={20} /> },
    { id: 'results', label: 'Mock Test Results', icon: <CheckSquare size={20} /> },
    { id: 'notes', label: 'Study Notes', icon: <BookMarked size={20} /> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', background: 'var(--background)', fontFamily: 'var(--font-body)' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Admin Sidebar */}
        <div style={{ 
          width: '280px', 
          backgroundColor: 'var(--surface-translucent)', 
          borderRight: '1px solid var(--border)', 
          display: 'flex', 
          flexDirection: 'column',
          padding: '32px 16px',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <img src="/assets/branding/logo_light.png" alt="GermaniStudy Logo" className="logo-light-mode" style={{ height: '70px', objectFit: 'contain' }} />
            <img src="/assets/branding/logo_dark.png" alt="GermaniStudy Logo" className="logo-dark-mode" style={{ height: '70px', objectFit: 'contain' }} />
          </div>

          <button 
            onClick={() => setCurrentView('Dashboard')}
            style={{
              marginBottom: '32px',
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(43, 36, 56, 0.05)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            ← Back to Dashboard
          </button>

          <div style={{ marginBottom: '40px', paddingLeft: '8px' }}>
            <span style={{ fontWeight: 800, color: 'var(--text)', fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>
              Admin Controls
            </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tabs.map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                style={{ 
                  padding: '12px 16px',
                  backgroundColor: activeTab === tab.id ? 'var(--text)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--background)' : 'var(--text)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left',
                  outline: 'none',
                  fontFamily: 'var(--font-body)'
                }}
              >
                {React.cloneElement(tab.icon, { style: { color: activeTab === tab.id ? 'var(--background)' : 'var(--text-muted)' } })}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Admin Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px', backgroundColor: 'var(--background)' }}>
          {activeTab === 'import' && <AdminMockImport />}
          {activeTab === 'questions' && <AdminQuestionBank />}
          {activeTab === 'blogs' && <AdminBlogs />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'results' && <AdminResults />}
          {activeTab === 'notes' && <AdminNotes />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
