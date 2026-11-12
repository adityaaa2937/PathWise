import React, { useState, useMemo } from 'react';
import { Search, MapPin, CheckCircle, XCircle, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { facilities, facilityTypes } from '../data/facilities';
import { useApp } from '../context/AppContext';
import './FacilitiesPage.css';

const typeIcons = {
  ramp: '♿',
  elevator: '🛗',
  washroom: '🚻',
  parking: 'P',
  entrance: '🚪',
  obstacle: '⚠',
};

const typeColors = {
  ramp: '#2E7D57',
  elevator: '#7C4DFF',
  washroom: '#2196F3',
  parking: '#FF9800',
  entrance: '#00BCD4',
};

export default function FacilitiesPage() {
  const navigate = useNavigate();
  const { setHighlightedFacility, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = useMemo(() => {
    return facilities.filter(f => {
      const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.buildingName.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'all' || f.type === filterType;
      const matchStatus = filterStatus === 'all' || f.status === filterStatus;
      return matchSearch && matchType && matchStatus;
    });
  }, [search, filterType, filterStatus]);

  const handleViewOnMap = (f) => {
    setHighlightedFacility(f.id);
    addToast(`Highlighted ${f.name} on map`, 'info');
    navigate('/explore');
  };

  return (
    <div className="facilities-page">
      {/* Header */}
      <div className="page-header glass">
        <div>
          <h1 className="page-title">Accessibility Facilities</h1>
          <p className="page-subtitle">Browse campus accessible facilities</p>
        </div>
        <span className="demo-tag">Demo Data</span>
      </div>

      {/* Filters bar */}
      <div className="facilities-filters glass">
        <div className="search-field" style={{ flex: 1 }}>
          <Search size={14} color="var(--color-text-muted)"/>
          <input
            className="search-input"
            placeholder="Search facilities or buildings…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input filter-select"
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          {facilityTypes.filter(ft => ft.id !== 'all' && ft.id !== 'obstacle').map(ft => (
            <option key={ft.id} value={ft.id}>{ft.label}</option>
          ))}
        </select>
        <select
          className="input filter-select"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {/* Results count */}
      <div className="facilities-count">
        {filtered.length} {filtered.length === 1 ? 'facility' : 'facilities'} found
      </div>

      {/* Cards grid */}
      <div className="facilities-grid">
        {filtered.length === 0 ? (
          <div className="facilities-empty">
            <Filter size={40} opacity={0.3}/>
            <p>No facilities match your filters.</p>
          </div>
        ) : (
          filtered.map(f => (
            <FacilityCard key={f.id} facility={f} onViewMap={() => handleViewOnMap(f)} />
          ))
        )}
      </div>
    </div>
  );
}

function FacilityCard({ facility: f, onViewMap }) {
  const color = typeColors[f.type] || '#4CAF50';
  const icon = typeIcons[f.type] || '♿';
  const isAvailable = f.status === 'available';

  return (
    <div className="facility-card glass animate-fade-in">
      {/* Icon */}
      <div className="facility-card-icon" style={{ background: `${color}20`, border: `1.5px solid ${color}40` }}>
        <span style={{ color, fontSize: f.type === 'parking' ? '1rem' : '1.2rem', fontWeight: 800 }}>{icon}</span>
      </div>

      {/* Content */}
      <div className="facility-card-content">
        <div className="facility-card-header">
          <h3 className="facility-card-name">{f.name}</h3>
          <span
            className="facility-status-badge"
            style={{
              color: isAvailable ? '#4CAF50' : '#F44336',
              background: isAvailable ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)',
              border: `1px solid ${isAvailable ? 'rgba(76,175,80,0.25)' : 'rgba(244,67,54,0.25)'}`,
            }}
          >
            {isAvailable ? <CheckCircle size={11}/> : <XCircle size={11}/>}
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <div className="facility-building">
          <MapPin size={11}/> {f.buildingName}
        </div>

        <p className="facility-desc">{f.description}</p>

        {f.demo && (
          <div className="facility-demo-notice">Demo — not verified information</div>
        )}

        <button className="btn btn-ghost facility-map-btn" onClick={onViewMap}>
          <MapPin size={13}/> View on Map
        </button>
      </div>
    </div>
  );
}

