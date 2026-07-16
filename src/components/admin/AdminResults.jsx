import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Loader2, Search, Filter } from 'lucide-react';

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState('');
  const [filterScore, setFilterScore] = useState('All');

  useEffect(() => {
    fetchResults();
  }, [searchUser, filterScore]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      let query = supabase.from('mock_test_results').select('*, mock_tests(test_name)').order('created_at', { ascending: false });
      
      if (searchUser) {
        query = query.eq('user_id', searchUser);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      let filteredData = data || [];
      if (filterScore !== 'All') {
        const threshold = parseInt(filterScore, 10);
        if (filterScore.includes('+')) {
          filteredData = filteredData.filter(r => r.score >= threshold);
        } else {
          filteredData = filteredData.filter(r => r.score < threshold);
        }
      }
      
      setResults(filteredData);
    } catch (err) {
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--ink)', marginBottom: '8px' }}>Mock Test Results</h1>
          <p style={{ color: 'var(--ink-muted)' }}>View analytics and scores from user mock tests.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', background: 'var(--paper)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(43, 36, 56, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <Search size={18} color="var(--ink-muted)" />
          <input 
            type="text"
            placeholder="Search by User ID..."
            value={searchUser}
            onChange={e => setSearchUser(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(43, 36, 56, 0.2)', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="var(--ink-muted)" />
          <select 
            value={filterScore} 
            onChange={e => setFilterScore(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(43, 36, 56, 0.2)', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}
          >
            <option value="All">All Scores</option>
            <option value="15+">Score 15+</option>
            <option value="10+">Score 10+</option>
            <option value="10">Below 10</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
          <Loader2 size={32} className="spin" color="var(--sky)" />
        </div>
      ) : results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', background: 'var(--paper)', borderRadius: '12px', border: '1px solid rgba(43, 36, 56, 0.1)' }}>
          <p style={{ color: 'var(--ink-muted)', fontSize: '1.1rem' }}>No results found.</p>
        </div>
      ) : (
        <div style={{ background: 'var(--paper)', borderRadius: '12px', border: '1px solid rgba(43, 36, 56, 0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(43, 36, 56, 0.03)', borderBottom: '1px solid rgba(43, 36, 56, 0.1)' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-muted)' }}>Date</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-muted)' }}>User ID</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-muted)' }}>Test Module</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-muted)' }}>Score</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-muted)' }}>Completion</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, idx) => (
                <tr key={r.id || idx} style={{ borderBottom: '1px solid rgba(43, 36, 56, 0.05)' }}>
                  <td style={{ padding: '16px 24px', fontSize: '0.95rem', color: 'var(--ink-muted)' }}>
                    {new Date(r.created_at).toLocaleDateString()} {new Date(r.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--sky)' }}>
                    {r.user_id.slice(0, 8)}...
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '0.95rem', fontWeight: 500 }}>
                    {r.mock_tests?.test_name || r.mock_test_id.slice(0, 8)}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 700,
                      background: r.score >= 10 ? 'rgba(122, 139, 111, 0.1)' : 'rgba(228, 87, 74, 0.1)',
                      color: r.score >= 10 ? 'var(--sage)' : 'var(--coral)'
                    }}>
                      {r.score}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '0.95rem' }}>
                    {r.completion_percentage ? `${Math.round(r.completion_percentage)}%` : 'N/A'}
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

export default AdminResults;
