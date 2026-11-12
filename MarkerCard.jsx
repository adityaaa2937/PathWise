import React from 'react';
import { useApp } from '../../context/AppContext';
import { buildings } from '../../data/buildings';
import { MapPin, Navigation, Bookmark, BookmarkCheck, X, AlertTriangle, Info } from 'lucide-react';
import './MarkerCard.css';

const typeLabels = {
  ramp: 'Accessible Ramp',
  elevator: 'Elevator',
  washroom: 'Accessible Washroom',
  parking: 'Accessible Parking',
  entrance: 'Step-Free Entrance',
  obstacle: 'Reported Obstacle',
};

const statusColours = {
  available: { color: '#00E676', label: 'Operational' },
  unavailable: { color: '#FF5252', label: 'Under Maintenance' },
  reported: { color: '#FF5252', label: 'Reported' },
  'under-review': { color: '#FFB74D', label: 'Under Review' },
  resolved: { color: '#00E676', label: 'Resolved' },
};

export default function MarkerCard({ item, onClose }) {
  const {
    fromLocation, setFromLocation,
    setToLocation, toggleSavedLocation,
    isLocationSaved, addToast,
  } = useApp();

  const isObstacle = item.type === 'obstacle';
  const statusCfg = statusColours[item.status] || statusColours.available;
  const building = buildings.find(b => b.id === item.building || b.id === item.location);

  const handleDirections = () => {
    if (building) {
      if (!fromLocation) {
        const gate = buildings.find(b => b.id === 'main-gate');
        if (gate) setFromLocation(gate);
      }
      setToLocation(building);
      addToast(`Set destination to ${building.name}`, 'info');
    }
    onClose();
  };

  const handleSave = () => {
    if (building) {
      toggleSavedLocation(building);
      addToast(isLocationSaved(building.id) ? 'Removed from saved locations' : `${building.name} saved!`, 'success');
    }
  };

  return (
    <div className="marker-card-float animate-slide-up">
      <div className="marker-card-header">
        <div className="marker-card-type-badge" style={{ color: isObstacle ? '#FF5252' : '#00E676' }}>
          {isObstacle ? <AlertTriangle size={14} /> : <Info size={14} />}
          <span>{typeLabels[item.type] || 'Facility'}</span>
        </div>
        <button className="marker-card-close" onClick={onClose} title="Close card">
          <X size={16} />
        </button>
      </div>

      <h3 className="marker-card-title">{item.name || item.title}</h3>

      <div className="marker-card-meta">
        <span className="marker-card-location">
          <MapPin size={12} color="#00BCD4" />
          {item.buildingName || item.locationName || 'Campus Building'}
        </span>
        <span className="marker-card-status" style={{ color: statusCfg.color }}>
          <span className="status-dot" style={{ background: statusCfg.color }} />
          {statusCfg.label}
        </span>
      </div>

      {item.description && (
        <p className="marker-card-desc">{item.description}</p>
      )}

      {item.demo && (
        <div className="marker-card-demo-notice">
          📍 Demo accessibility information — TIET Patiala Campus
        </div>
      )}

      <div className="marker-card-actions">
        <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.82rem', padding: '9px 14px' }} onClick={handleDirections}>
          <Navigation size={14} /> Get Directions
        </button>
        {building && (
          <button className="btn btn-ghost" style={{ padding: '9px 12px' }} onClick={handleSave} title={isLocationSaved(building.id) ? 'Remove saved' : 'Save location'}>
            {isLocationSaved(building.id) ? <BookmarkCheck size={16} color="#00E676" /> : <Bookmark size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
