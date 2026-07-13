import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Loader2, LayoutDashboard, Database, Users, FileText, Upload } from 'lucide-react';
import AdminOverview from '../components/admin/AdminOverview';
import AdminQuestionBank from '../components/admin/AdminQuestionBank';
import AdminUsers from '../components/admin/AdminUsers';
import AdminBlogs from '../components/admin/AdminBlogs';
import AdminMockImport from '../components/admin/AdminMockImport';

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
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'questions', label: 'Question Bank', icon: <Database size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'blogs', label: 'Blog Manager', icon: <FileText size={20} /> },
    { id: 'import', label: 'Import JSON', icon: <Upload size={20} /> }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', paddingTop: '70px', backgroundColor: 'var(--bg-light)' }}>
      {/* Admin Sidebar */}
      <div style={{ 
        width: '260px', 
        backgroundColor: 'var(--card-bg)', 
        borderRight: '1px solid var(--border-color)', 
        display: 'flex', 
        flexDirection: 'column',
        padding: '24px 16px'
      }}>
        <div style={{ marginBottom: '32px', paddingLeft: '8px' }}>
          <span style={{ fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.5px', fontSize: '1.2rem' }}>
            Admin Workspace
          </span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                padding: '12px 16px',
                backgroundColor: activeTab === tab.id ? 'var(--primary-light, rgba(37, 99, 235, 0.1))' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 600 : 500,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left',
                outline: 'none'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Admin Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
        {activeTab === 'overview' && <AdminOverview />}
        {activeTab === 'questions' && <AdminQuestionBank />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'blogs' && <AdminBlogs />}
        {activeTab === 'import' && <AdminMockImport />}
      </div>
    </div>
  );
};

export default AdminPanel;
