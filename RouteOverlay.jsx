import React from 'react';

export default function RouteOverlay({ route, from, to }) {
  if (!route || !route.waypoints || route.waypoints.length < 2) return null;

  const pts = route.waypoints;

  // Build SVG polyline points string from percentage positions
  const pointsStr = pts.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg
      className="route-overlay-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}
    >
      <defs>
        <filter id="routeGlow">
          <feGaussianBlur stdDeviation="0.8" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Glow shadow */}
      <polyline
        points={pointsStr}
        fill="none"
        stroke={route.color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
        filter="url(#routeGlow)"
      />

      {/* Main route line */}
      <polyline
        points={pointsStr}
        fill="none"
        stroke={route.color}
        strokeWidth="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2,1.2"
        opacity="0.9"
      />

      {/* Waypoint dots */}
      {pts.slice(1, -1).map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="1.2"
          fill={route.color}
          opacity="0.8"
        />
      ))}
    </svg>
  );
}

