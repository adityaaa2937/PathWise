import React from 'react';
import './MapMarker.css';

const markerConfig = {
  ramp: { color: '#2E7D57', bg: 'rgba(46,125,87,0.2)', border: 'rgba(46,125,87,0.5)', icon: '♿', label: 'Ramp' },
  elevator: { color: '#7C4DFF', bg: 'rgba(124,77,255,0.2)', border: 'rgba(124,77,255,0.5)', icon: '🛗', label: 'Elevator' },
  washroom: { color: '#2196F3', bg: 'rgba(33,150,243,0.2)', border: 'rgba(33,150,243,0.5)', icon: '🚻', label: 'Washroom' },
  parking: { color: '#FF9800', bg: 'rgba(255,152,0,0.2)', border: 'rgba(255,152,0,0.5)', icon: 'P', label: 'Parking' },
  entrance: { color: '#00BCD4', bg: 'rgba(0,188,212,0.2)', border: 'rgba(0,188,212,0.5)', icon: '🚪', label: 'Entrance' },
  obstacle: { color: '#F44336', bg: 'rgba(244,67,54,0.2)', border: 'rgba(244,67,54,0.5)', icon: '⚠', label: 'Obstacle' },
};

export default function MapMarker({ item, markerType, isSelected, isHighlighted, onClick }) {
  const config = markerConfig[item.type] || markerConfig.obstacle;
  const isUnavailable = item.status === 'unavailable';

  return (
    <button
      className={`map-marker ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''} ${isUnavailable ? 'unavailable' : ''}`}
      style={{
        left: `${item.position.x}%`,
        top: `${item.position.y}%`,
        '--marker-color': config.color,
        '--marker-bg': config.bg,
        '--marker-border': config.border,
      }}
      onClick={onClick}
      title={item.name}
    >
      <span className="marker-icon">{config.icon}</span>
      {isUnavailable && <span className="marker-unavail">!</span>}
      <span className="marker-pulse" />
    </button>
  );
}

