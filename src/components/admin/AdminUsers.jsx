import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Search, Shield, User } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, role, created_at')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>User Management</h2>
      </div>

      <div className="premium-card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by email..." 
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
              <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>Email</th>
              <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>Role</th>
              <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>Join Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="3" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</td></tr>
            ) : (
              filteredUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{u.email}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '4px 12px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600,
                      backgroundColor: u.role === 'admin' ? 'var(--primary-light, #e0e7ff)' : 'var(--bg-light)',
                      color: u.role === 'admin' ? 'var(--primary-dark, #3730a3)' : 'var(--text-muted)'
                    }}>
                      {u.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
