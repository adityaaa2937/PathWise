import React, { useState } from 'react';
import { User, Mail, MapPin, BookOpen, Heart, Bookmark, Clock, AlertTriangle, Save, Edit3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildings } from '../data/buildings';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

export default function ProfilePage() {
  const {
    profile, setProfile, preferences, setPreferences,
    savedLocations, recentSearches, reports,
    toggleSavedLocation, addToast, setHighlightedFacility, setToLocation,
  } = useApp();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });

  const userReports = reports.filter(r => !r.demo);

  const handleSaveProfile = () => {
    setProfile(editForm);
    setEditMode(false);
    addToast('Profile saved!', 'success');
  };

  const handlePrefToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    addToast('Preference updated', 'success');
  };

  const handleViewSaved = (location) => {
    setToLocation(location);
    addToast(`Navigating to ${location.name}`, 'info');
    navigate('/explore');
  };

  const initials = profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="profile-page">
      <div className="profile-scroll">
        {/* Avatar + header */}
        <div className="profile-hero glass">
          <div className="profile-avatar">
            <span>{initials}</span>
          </div>
          {editMode ? (
            <div className="profile-edit-form">
              {[
                { key: 'name', label: 'Name', placeholder: 'Your name' },
                { key: 'email', label: 'Email', placeholder: 'email@thapar.edu' },
                { key: 'rollNo', label: 'Roll No.', placeholder: 'BE22B1234' },
                { key: 'department', label: 'Department', placeholder: 'Department' },
                { key: 'year', label: 'Year', placeholder: '1st Year' },
              ].map(({ key, label, placeholder }) => (
                <div className="edit-row" key={key}>
                  <label className="label">{label}</label>
                  <input
                    className="input"
                    value={editForm[key]}
                    placeholder={placeholder}
                    onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="edit-actions">
                <button className="btn btn-primary" onClick={handleSaveProfile}><Save size={13}/> Save</button>
                <button className="btn btn-ghost" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <h2 className="profile-name">{profile.name}</h2>
              <p className="profile-roll">{profile.rollNo} · {profile.year}</p>
              <p className="profile-dept">{profile.department}</p>
              <div className="profile-meta-row">
                <span className="profile-meta-item"><Mail size={12}/>{profile.email}</span>
                <span className="profile-meta-item"><MapPin size={12}/>{profile.campus}</span>
              </div>
              <button className="btn btn-ghost profile-edit-btn" onClick={() => setEditMode(true)}>
                <Edit3 size={13}/> Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Stats strip */}
        <div className="profile-stats glass">
          <StatItem icon={<Bookmark size={16}/>} label="Saved" value={savedLocations.length}/>
          <div className="stat-divider"/>
          <StatItem icon={<Clock size={16}/>} label="Searches" value={recentSearches.length}/>
          <div className="stat-divider"/>
          <StatItem icon={<AlertTriangle size={16}/>} label="Reports" value={userReports.length}/>
        </div>

        {/* Accessibility Preferences */}
        <div className="profile-section glass">
          <h3 className="section-title"><Heart size={15}/> Accessibility Preferences</h3>
          <div className="prefs-list">
            {[
              { key: 'avoidStairs', label: 'Avoid Stairs', desc: 'Prefer routes without stairways' },
              { key: 'preferStepFree', label: 'Prefer Step-Free Routes', desc: 'Prioritise fully flat or ramped paths' },
              { key: 'preferRamps', label: 'Prefer Ramp Routes', desc: 'Choose routes that use ramps' },
              { key: 'avoidObstacles', label: 'Avoid Reported Obstacles', desc: 'Skip paths with community-reported issues' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="pref-row" onClick={() => handlePrefToggle(key)}>
                <div className="pref-text">
                  <span className="pref-label">{label}</span>
                  <span className="pref-desc">{desc}</span>
                </div>
                <div className={`pref-toggle ${preferences[key] ? 'on' : 'off'}`}>
                  <div className="pref-toggle-thumb"/>
                </div>
              </div>
            ))}
          </div>
          <p className="prefs-note">These preferences influence simulated route suggestions.</p>
        </div>

        {/* Saved Locations */}
        {savedLocations.length > 0 && (
          <div className="profile-section glass">
            <h3 className="section-title"><Bookmark size={15}/> Saved Locations</h3>
            <div className="saved-list">
              {savedLocations.map(loc => (
                <div key={loc.id} className="saved-item">
                  <MapPin size={14} color="#4CAF50"/>
                  <span className="saved-name">{loc.name}</span>
                  <div className="saved-actions">
                    <button className="btn btn-ghost saved-btn" onClick={() => handleViewSaved(loc)}>Navigate</button>
                    <button className="btn btn-danger saved-btn" onClick={() => toggleSavedLocation(loc)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="profile-section glass">
            <h3 className="section-title"><Clock size={15}/> Recent Searches</h3>
            <div className="saved-list">
              {recentSearches.map((rs, i) => {
                const from = buildings.find(b => b.id === rs.from);
                const to = buildings.find(b => b.id === rs.to);
                if (!from || !to) return null;
                return (
                  <div key={i} className="saved-item">
                    <Clock size={13} color="var(--color-text-muted)"/>
                    <span className="saved-name">{from.shortName} → {to.shortName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* User Reports */}
        {userReports.length > 0 && (
          <div className="profile-section glass">
            <h3 className="section-title"><AlertTriangle size={15}/> Your Reports</h3>
            {userReports.map(r => (
              <div key={r.id} className="user-report-item">
                <span className="user-report-title">{r.title}</span>
                <span className="user-report-status" style={{ color: { reported: '#F44336', 'under-review': '#FF9800', resolved: '#4CAF50' }[r.status] || '#F44336' }}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="profile-bottom-space"/>
      </div>
    </div>
  );
}

function StatItem({ icon, label, value }) {
  return (
    <div className="stat-item">
      <span className="stat-icon">{icon}</span>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

