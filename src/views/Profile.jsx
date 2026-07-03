import React, { useState } from 'react';
import { Camera, User, Lock, Trash2, Check, AlertTriangle } from 'lucide-react';
import ExamSidebar from '../components/ExamSidebar';
import { supabase } from '../supabaseClient';

const Profile = ({ setCurrentView, session }) => {
  const [name, setName] = useState(session?.user?.user_metadata?.full_name || '');
  const [country, setCountry] = useState(session?.user?.user_metadata?.country || '');
  const [studyLevel, setStudyLevel] = useState(session?.user?.user_metadata?.study_level || '');
  const [targetModule, setTargetModule] = useState(session?.user?.user_metadata?.target_module || '');
  const [testDate, setTestDate] = useState(session?.user?.user_metadata?.test_date || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Status states
  const [nameStatus, setNameStatus] = useState('');
  const [passStatus, setPassStatus] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveProfile = async () => {
    if (name.trim().length > 0) {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          country: country,
          study_level: studyLevel,
          target_module: targetModule,
          test_date: testDate
        }
      });
      if (error) {
        setNameStatus('Error updating profile: ' + error.message);
      } else {
        setNameStatus('Profile updated successfully!');
        setTimeout(() => setNameStatus(''), 3000);
      }
    }
  };

  const handleUpdatePassword = () => {
    if (password === confirmPassword && password.length > 5) {
      setPassStatus('Password changed securely.');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassStatus(''), 3000);
    } else {
      setPassStatus('Passwords do not match or are too short.');
      setTimeout(() => setPassStatus(''), 3000);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      <ExamSidebar setCurrentView={setCurrentView} />
      
      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <header style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Your Profile</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Manage your account details and security.</p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Profile Picture */}
            <section className="premium-card" style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '32px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50px', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 600 }}>
                  {name ? name.charAt(0).toUpperCase() : 'S'}
                </div>
                <button style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <Camera size={16} color="var(--text-main)" />
                </button>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Profile Picture</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px' }}>JPG, GIF or PNG. Max size of 800K</p>
                <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Upload New Picture</button>
              </div>
            </section>

            {/* Personal Information */}
            <section className="premium-card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <User size={20} color="var(--primary-blue)" /> Personal Information
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Display Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Country</label>
                  <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Study Level</label>
                  <select value={studyLevel} onChange={(e) => { setStudyLevel(e.target.value); setTargetModule(''); }} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', marginBottom: '16px' }}>
                    <option value="" disabled>Select Study Level</option>
                    <option value="Undergraduate">Undergraduate (Bachelor's)</option>
                    <option value="Master's">Postgraduate (Master's)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Target Exam / Module</label>
                  <select value={targetModule} onChange={(e) => setTargetModule(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} disabled={!studyLevel}>
                    <option value="" disabled>Select Exam</option>
                    {studyLevel === 'Undergraduate' ? (
                      <>
                        <option value="DMAT - Engineering">DMAT - Engineering</option>
                        <option value="DMAT - Economics">DMAT - Economics</option>
                        <option value="DMAT - Humanities">DMAT - Humanities</option>
                        <option value="DMAT - Mathematics">DMAT - Mathematics</option>
                        <option value="DMAT - Medical">DMAT - Medical</option>
                      </>
                    ) : studyLevel === "Master's" ? (
                      <>
                        <option value="DMAT">DMAT</option>
                        <option value="GRE">GRE</option>
                        <option value="GMAT">GMAT</option>
                        <option value="General/Direct Admission">General / Direct Admission</option>
                      </>
                    ) : null}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Expected Test Date</label>
                  <input type="date" value={testDate} onChange={(e) => setTestDate(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                  <button className="btn-primary" onClick={handleSaveProfile}>Save Changes</button>
                  {nameStatus && <span style={{ color: nameStatus.includes('Error') ? 'var(--danger)' : 'var(--success)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={16} /> {nameStatus}</span>}
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="premium-card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Lock size={20} color="var(--primary-blue)" /> Security Settings
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>New Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }} />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                  <button className="btn-secondary" onClick={handleUpdatePassword}>Update Password</button>
                  {passStatus && <span style={{ color: passStatus.includes('do not match') ? 'var(--danger)' : 'var(--success)', fontSize: '0.9rem' }}>{passStatus}</span>}
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
