import React, { useEffect } from 'react';
import { Clock, Navigation, Star, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sampleRoutes, getRouteKey, getGenericRoutes } from '../../data/routes';
import './RouteCards.css';

const routeTypeConfig = {
  accessible: { label: 'Most Accessible', color: '#2E7D57', icon: '♿' },
  shortest: { label: 'Shortest', color: '#2196F3', icon: '⚡' },
  'fewest-obstacles': { label: 'Fewest Obstacles', color: '#FF9800', icon: '🛡' },
};

export default function RouteCards({ onClose }) {
  const {
    fromLocation, toLocation,
    routeType, setRouteType,
    selectedRoute, setSelectedRoute,
    startNavigation, preferences,
  } = useApp();

  if (!fromLocation || !toLocation) return null;

  const routeKey = getRouteKey(fromLocation.id, toLocation.id);
  const routes = routeKey
    ? sampleRoutes[routeKey].routes
    : getGenericRoutes(fromLocation, toLocation);

  const activeRoutes = routes;

  // Initialize preference-based default route type on load
  useEffect(() => {
    let preferredType = 'accessible';
    if (preferences?.avoidObstacles && !preferences?.avoidStairs) {
      preferredType = 'fewest-obstacles';
    }
    const def = activeRoutes.find(r => r.type === preferredType) || activeRoutes[0];
    if (def) {
      setSelectedRoute(def);
      setRouteType(preferredType);
    }
  }, [fromLocation?.id, toLocation?.id, preferences]);

  const handleSelectType = (type) => {
    setRouteType(type);
    const r = activeRoutes.find(rt => rt.type === type);
    if (r) setSelectedRoute(r);
  };

  const currentRoute = activeRoutes.find(r => r.type === routeType) || activeRoutes[0];

  return (
    <div className="route-cards-panel animate-slide-up">
      {/* Header */}
      <div className="route-cards-header">
        <div className="route-header-locations">
          <span className="route-from">{fromLocation.shortName}</span>
          <span className="route-arrow">→</span>
          <span className="route-to">{toLocation.shortName}</span>
        </div>
        <button className="route-close" onClick={onClose} title="Close Route Panel">✕</button>
      </div>

      {/* Route type tabs */}
      <div className="route-type-tabs">
        {Object.entries(routeTypeConfig).map(([type, cfg]) => (
          <button
            key={type}
            className={`route-tab ${routeType === type ? 'active' : ''}`}
            style={{ '--tab-color': cfg.color }}
            onClick={() => handleSelectType(type)}
          >
            <span className="tab-icon">{cfg.icon}</span>
            <span className="tab-label">{cfg.label}</span>
          </button>
        ))}
      </div>

      {/* Route details */}
      {currentRoute && (
        <div className="route-detail-card animate-fade-in" style={{ '--route-color': currentRoute.color }}>
          <div className="route-stat-row">
            <RouteStatItem icon={<Clock size={13} />} label="Est. Time" value={currentRoute.time} />
            <RouteStatItem icon={<Navigation size={13} />} label="Distance" value={currentRoute.distance} />
            <RouteStatItem
              icon={<Star size={13} />}
              label="Accessibility"
              value={`${currentRoute.accessibilityScore}/100`}
              color={currentRoute.accessibilityScore >= 85 ? '#00E676' : currentRoute.accessibilityScore >= 60 ? '#FFB74D' : '#F44336'}
            />
          </div>

          <div className="route-detail-desc">{currentRoute.description}</div>

          <div className="route-obstacles-row">
            <ObstacleBadge icon="🪜" label="Stairs" value={currentRoute.stairs} alert={currentRoute.stairs > 0} />
            <ObstacleBadge icon="♿" label="Ramps" value={currentRoute.ramps} positive />
            <ObstacleBadge icon="🛗" label="Elevators" value={currentRoute.elevators} positive />
            <ObstacleBadge icon="⚠" label="Obstacles" value={currentRoute.obstacles} alert={currentRoute.obstacles > 0} />
          </div>

          <div className="route-demo-notice">
            📍 Simulated campus route · TIET Patiala demo data
          </div>

          <button className="btn btn-primary route-start-btn" onClick={startNavigation}>
            <Navigation size={16} /> Start Navigation
          </button>
        </div>
      )}
    </div>
  );
}

function RouteStatItem({ icon, label, value, color }) {
  return (
    <div className="route-stat-item">
      <span className="route-stat-icon" style={color ? { color } : {}}>
        {icon}
      </span>
      <div className="route-stat-text">
        <span className="route-stat-value" style={color ? { color } : {}}>{value}</span>
        <span className="route-stat-label">{label}</span>
      </div>
    </div>
  );
}

function ObstacleBadge({ icon, label, value, alert, positive }) {
  const color = alert && value > 0
    ? '#FF5252'
    : positive && value > 0
    ? '#00E676'
    : 'var(--color-text-muted)';
  return (
    <div className="obstacle-badge" style={{ '--ob-color': color }}>
      <span className="ob-icon">{icon}</span>
      <span className="ob-value" style={{ color }}>{value}</span>
      <span className="ob-label">{label}</span>
    </div>
  );
}
