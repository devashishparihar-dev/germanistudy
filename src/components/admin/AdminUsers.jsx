import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Loader2, Shield, User, AlertCircle } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    const actionText = newRole === 'admin' ? 'promote this user to Admin' : 'demote this Admin to student';
    
    if (window.confirm(`Are you sure you want to ${actionText}?`)) {
      setUpdating(userId);
      try {
        const { data, error } = await supabase.functions.invoke('admin-update-role', {
          body: { targetUserId: userId, newRole }
        });
        
        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        // Update local state
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      } catch (err) {
        console.error('Error updating role:', err);
        alert(err.message || 'Failed to update user role.');
      } finally {
        setUpdating(null);
      }
    }
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--ink)', marginBottom: '8px' }}>User Accounts</h1>
          <p style={{ color: 'var(--ink-muted)' }}>Manage user roles and permissions.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
          <Loader2 size={32} className="spin" color="var(--sky)" />
        </div>
      ) : users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', background: 'var(--paper)', borderRadius: '12px', border: '1px solid rgba(43, 36, 56, 0.1)' }}>
          <p style={{ color: 'var(--ink-muted)', fontSize: '1.1rem' }}>No users found.</p>
        </div>
      ) : (
        <div style={{ background: 'var(--paper)', borderRadius: '12px', border: '1px solid rgba(43, 36, 56, 0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(43, 36, 56, 0.03)', borderBottom: '1px solid rgba(43, 36, 56, 0.1)' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-muted)' }}>User ID</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-muted)' }}>Role</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-muted)' }}>Joined</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u.id || idx} style={{ borderBottom: '1px solid rgba(43, 36, 56, 0.05)' }}>
                  <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
                    {u.id}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {u.role === 'admin' ? (
                        <Shield size={16} color="var(--marigold)" />
                      ) : (
                        <User size={16} color="var(--ink-muted)" />
                      )}
                      <span style={{ 
                        fontWeight: 600, 
                        color: u.role === 'admin' ? 'var(--marigold)' : 'var(--ink)',
                        textTransform: 'capitalize',
                        fontSize: '0.95rem'
                      }}>
                        {u.role || 'student'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: 'var(--ink-muted)' }}>
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Unknown'}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <button 
                      onClick={() => handleRoleChange(u.id, u.role)}
                      disabled={updating === u.id}
                      style={{ 
                        background: u.role === 'admin' ? 'rgba(228, 87, 74, 0.1)' : 'rgba(47, 93, 138, 0.1)', 
                        border: 'none', 
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: updating === u.id ? 'wait' : 'pointer', 
                        color: u.role === 'admin' ? 'var(--coral)' : 'var(--sky)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        transition: 'opacity 0.2s',
                        opacity: updating === u.id ? 0.5 : 1
                      }}
                    >
                      {updating === u.id ? 'Updating...' : u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
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

export default AdminUsers;
