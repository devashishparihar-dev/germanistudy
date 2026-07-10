import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Database, Layers } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    users: 0,
    mocksTaken: 0,
    questionsLive: 0,
    draftPosts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [usersRes, mocksRes, questionsRes, blogsRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('mock_test_results').select('id', { count: 'exact', head: true }),
          supabase.from('core_test_questions').select('id', { count: 'exact', head: true }).eq('status', 'published'),
          supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'draft')
        ]);
        
        setStats({
          users: usersRes.count || 0,
          mocksTaken: mocksRes.count || 0,
          questionsLive: questionsRes.count || 0,
          draftPosts: blogsRes.count || 0
        });
      } catch (err) {
        console.error("Error fetching overview stats:", err);
        setLoading(false);
        alert("Error loading overview: " + (err.message || err.details || JSON.stringify(err)));
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats.users, icon: <Users size={24} />, color: 'var(--primary)' },
    { title: 'Mocks Taken', value: stats.mocksTaken, icon: <Layers size={24} />, color: 'var(--success)' },
    { title: 'Live Questions', value: stats.questionsLive, icon: <Database size={24} />, color: 'var(--warning)' },
    { title: 'Draft Posts', value: stats.draftPosts, icon: <FileText size={24} />, color: 'var(--error)' },
  ];

  if (loading) {
    return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading statistics...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '32px' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '32px' }}>Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {statCards.map((card, idx) => (
          <div key={idx} className="premium-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '16px', borderRadius: '12px', background: `${card.color}22`, color: card.color }}>
              {card.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {card.title}
              </p>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminOverview;
