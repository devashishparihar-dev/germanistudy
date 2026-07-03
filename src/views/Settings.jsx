import React, { useState } from 'react';
import { Moon, Sun, Bell, Globe, Shield, User, ToggleLeft, ToggleRight } from 'lucide-react';
import ExamSidebar from '../components/ExamSidebar';

const Settings = ({ setCurrentView, isDarkMode, setIsDarkMode }) => {
  const [notifications, setNotifications] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [language, setLanguage] = useState('English');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      <ExamSidebar setCurrentView={setCurrentView} />
      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <header style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Platform Settings</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Customize your learning environment.</p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Theme Settings */}
            <section className="premium-card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                {isDarkMode ? <Moon size={20} color="var(--primary-blue)" /> : <Sun size={20} color="var(--primary-blue)" />} Theme Selection
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Dark Mode</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Toggle dark appearance for the platform</div>
                </div>
                <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDarkMode ? 'var(--primary-blue)' : 'var(--text-muted)' }}>
                  {isDarkMode ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                </button>
              </div>
            </section>

            {/* General Settings */}
            <section className="premium-card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Bell size={20} color="var(--primary-blue)" /> Preferences
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Push Notifications</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Receive updates on practice goals</div>
                  </div>
                  <button onClick={() => setNotifications(!notifications)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: notifications ? 'var(--primary-blue)' : 'var(--text-muted)' }}>
                    {notifications ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}><Globe size={16} style={{ display: 'inline', marginRight: '6px' }}/> Language</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Select your preferred language</div>
                  </div>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-main)', outline: 'none' }}>
                    <option value="English">English</option>
                    <option value="German">German (Deutsch)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Account */}
            <section className="premium-card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <User size={20} color="var(--primary-blue)" /> Account
              </h3>

              <div style={{ marginTop: '24px' }}>
                 <button onClick={() => setCurrentView('Profile')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <User size={18} /> Manage Account Details
                 </button>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
