import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { buildings } from '../../data/buildings';
import { facilities } from '../../data/facilities';
import MapControls from './MapControls';
import MarkerCard from './MarkerCard';
import './CampusMap.css';

const MIN_ZOOM = 0.55;
const MAX_ZOOM = 2.4;

export default function CampusMap({ onOpenReport }) {
  const {
    activeFilter, selectedMarker, setSelectedMarker,
    selectedRoute, fromLocation, toLocation, setFromLocation, setToLocation,
    navigationMode, navigationStep, reports, mapView, setMapView,
    highlightedFacility, setHighlightedFacility, addToast,
  } = useApp();

  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const { zoom, x: panX, y: panY } = mapView;

  // Pointer events for drag-panning
  const onPointerDown = useCallback((e) => {
    if (e.target.closest('.map-controls, .marker-card-float, .map-legend, .building-popup')) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, panX, panY };
    if (containerRef.current?.setPointerCapture) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  }, [panX, panY]);

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setMapView(prev => ({
      ...prev,
      x: dragStart.current.panX + dx,
      y: dragStart.current.panY + dy,
    }));
  }, [setMapView]);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setMapView(prev => ({
      ...prev,
      zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(prev.zoom + delta).toFixed(2))),
    }));
  }, [setMapView]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const zoomIn = () => setMapView(prev => ({ ...prev, zoom: Math.min(MAX_ZOOM, +(prev.zoom + 0.18).toFixed(2)) }));
  const zoomOut = () => setMapView(prev => ({ ...prev, zoom: Math.max(MIN_ZOOM, +(prev.zoom - 0.18).toFixed(2)) }));
  const resetView = () => setMapView({ x: 0, y: 0, zoom: 1 });

  const locateStart = () => {
    if (navigationMode && selectedRoute?.waypoints) {
      const idx = Math.min(navigationStep, selectedRoute.waypoints.length - 1);
      const curr = selectedRoute.waypoints[idx];
      if (curr) {
        setMapView({
          x: (600 - curr.x * 12) * 0.9,
          y: (450 - curr.y * 9) * 0.9,
          zoom: 1.3,
        });
        addToast('Centered on simulated current location', 'info');
        return;
      }
    }
    if (fromLocation) {
      setMapView({
        x: (600 - fromLocation.position.x * 12) * 0.8,
        y: (450 - fromLocation.position.y * 9) * 0.8,
        zoom: 1.25,
      });
      addToast(`Focused on ${fromLocation.name}`, 'info');
    } else {
      resetView();
      addToast('Reset to campus overview', 'info');
    }
  };

  // Filter facilities
  const visibleFacilities = useMemo(() => {
    return facilities.filter(f => {
      if (activeFilter === 'all') return true;
      return f.type === activeFilter;
    });
  }, [activeFilter]);

  const obstacleMarkers = useMemo(() => {
    return reports
      .filter(r => r.status !== 'resolved')
      .map(r => ({
        ...r,
        type: 'obstacle',
        facilityType: 'obstacle',
        position: r.position || { x: 50, y: 50 },
      }));
  }, [reports]);

  const showObstacles = activeFilter === 'all' || activeFilter === 'obstacle';

  // Current navigation waypoint
  const currentNavPoint = useMemo(() => {
    if (!navigationMode || !selectedRoute?.waypoints) return null;
    const pts = selectedRoute.waypoints;
    const idx = Math.min(navigationStep, pts.length - 1);
    return pts[idx];
  }, [navigationMode, selectedRoute, navigationStep]);

  return (
    <div
      className="campus-map-wrapper"
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
    >
      {/* Interactive Map Canvas */}
      <div
        className="campus-map-canvas"
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: '50% 50%',
        }}
      >
        <svg
          className="campus-master-svg"
          viewBox="0 0 1200 900"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <radialGradient id="groundRadial" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#112130" />
              <stop offset="60%" stopColor="#0B1622" />
              <stop offset="100%" stopColor="#070E17" />
            </radialGradient>
            <linearGradient id="lawnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1B472E" />
              <stop offset="100%" stopColor="#113320" />
            </linearGradient>
            <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7E332B" />
              <stop offset="100%" stopColor="#5E241E" />
            </linearGradient>
            <linearGradient id="courtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1B4C68" />
              <stop offset="100%" stopColor="#12354A" />
            </linearGradient>
            <linearGradient id="roadPrimary" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#222F3E" />
              <stop offset="50%" stopColor="#2A394B" />
              <stop offset="100%" stopColor="#222F3E" />
            </linearGradient>
            <linearGradient id="roadSecondary" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1F2A38" />
              <stop offset="100%" stopColor="#17212C" />
            </linearGradient>

            {/* Building Gradients */}
            <linearGradient id="bldgFacade" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2A435E" />
              <stop offset="100%" stopColor="#1C2D40" />
            </linearGradient>
            <linearGradient id="bldgRoofAcademic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1F5C3E" />
              <stop offset="100%" stopColor="#143D29" />
            </linearGradient>
            <linearGradient id="bldgRoofLibrary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2A6496" />
              <stop offset="100%" stopColor="#1A4164" />
            </linearGradient>
            <linearGradient id="bldgRoofAdmin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7B5433" />
              <stop offset="100%" stopColor="#4D331E" />
            </linearGradient>
            <linearGradient id="bldgRoofAudit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5E35B1" />
              <stop offset="100%" stopColor="#3E1E7D" />
            </linearGradient>

            {/* Filters */}
            <filter id="bldgShadow" x="-20%" y="-20%" width="150%" height="150%">
              <feDropShadow dx="8" dy="12" stdDeviation="8" floodColor="rgba(0,0,0,0.65)" />
            </filter>
            <filter id="neonRouteGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="markerGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(0,0,0,0.5)" />
            </filter>

            {/* Patterns */}
            <pattern id="campusGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.8" />
            </pattern>
            <pattern id="plazaPavers" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="16" height="16" fill="#1C2E3D" />
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* 1. Base Ground */}
          <rect width="1200" height="900" fill="url(#groundRadial)" />
          <rect width="1200" height="900" fill="url(#campusGrid)" />

          {/* Campus Boundary Fence */}
          <rect x="30" y="30" width="1140" height="840" rx="20" fill="none" stroke="rgba(46,125,87,0.35)" strokeWidth="2.5" strokeDasharray="14,8" />

          {/* 2. Green Spaces & Lawns */}
          {/* Central Library Lawn & Sunken Amphitheatre */}
          <ellipse cx="624" cy="505" rx="140" ry="105" fill="url(#lawnGrad)" opacity="0.8" />
          <ellipse cx="624" cy="505" rx="100" ry="75" fill="#123824" opacity="0.6" />
          {/* Fountain Pond in Central Plaza */}
          <ellipse cx="624" cy="535" rx="42" ry="24" fill="#0E3D4A" stroke="#00BCD4" strokeWidth="1.8" opacity="0.85" />
          <ellipse cx="624" cy="535" rx="24" ry="12" fill="#155D6E" opacity="0.9" />
          <circle cx="624" cy="535" r="4" fill="#80DEEA" />

          {/* North Academic Greens */}
          <rect x="460" y="240" width="160" height="70" rx="16" fill="url(#lawnGrad)" opacity="0.75" />
          <ellipse cx="540" cy="275" rx="65" ry="30" fill="#123622" opacity="0.5" />

          {/* West Hostel Lawn */}
          <ellipse cx="230" cy="330" rx="90" ry="60" fill="url(#lawnGrad)" opacity="0.75" />
          {/* East Hostel Gardens */}
          <ellipse cx="970" cy="320" rx="85" ry="55" fill="url(#lawnGrad)" opacity="0.75" />
          <ellipse cx="980" cy="480" rx="75" ry="50" fill="url(#lawnGrad)" opacity="0.75" />

          {/* South Greens & Entrance Garden */}
          <ellipse cx="600" cy="790" rx="130" ry="45" fill="url(#lawnGrad)" opacity="0.6" />

          {/* Sports Complex: 400m Athletic Track & Field */}
          <g filter="url(#markerGlow)">
            {/* Running Track Oval */}
            <rect x="170" y="520" width="220" height="150" rx="75" fill="url(#trackGrad)" stroke="#A94438" strokeWidth="2" />
            <rect x="186" y="534" width="188" height="122" rx="61" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="6,4" />
            {/* Inner Football Pitch */}
            <rect x="200" y="546" width="160" height="98" rx="49" fill="#1B4D2E" stroke="#4CAF50" strokeWidth="1.5" />
            {/* Pitch markings */}
            <circle cx="280" cy="595" r="22" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="280" y1="546" x2="280" y2="644" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            {/* Tennis Courts adjacent */}
            <rect x="120" y="540" width="42" height="70" rx="3" fill="url(#courtGrad)" stroke="#00BCD4" strokeWidth="1.2" />
            <line x1="120" y1="575" x2="162" y2="575" stroke="#fff" strokeWidth="0.8" opacity="0.7" />
            <rect x="125" y="548" width="32" height="54" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.6" />
          </g>

          {/* 3. Primary Roadway Network */}
          {/* Main Boulevard (South Entrance from Gate all the way up to Admin) */}
          <rect x="582" y="160" width="36" height="720" rx="4" fill="url(#roadPrimary)" />
          {/* Main Boulevard Curbs */}
          <line x1="582" y1="160" x2="582" y2="880" stroke="#3D536B" strokeWidth="2" />
          <line x1="618" y1="160" x2="618" y2="880" stroke="#3D536B" strokeWidth="2" />
          {/* Lane Center Dashes */}
          {[200, 260, 320, 380, 440, 500, 560, 620, 680, 740, 800, 850].map((y, i) => (
            <line key={`bdash-${i}`} x1="600" y1={y} x2="600" y2={y + 34} stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeDasharray="10,6" />
          ))}

          {/* East-West Main Ring Avenue (Connecting Sports, Canteen, Health Centre) */}
          <rect x="100" y="618" width="1000" height="30" rx="4" fill="url(#roadSecondary)" />
          <line x1="100" y1="618" x2="1100" y2="618" stroke="#3D536B" strokeWidth="1.5" />
          <line x1="100" y1="648" x2="1100" y2="648" stroke="#3D536B" strokeWidth="1.5" />
          {[160, 240, 320, 400, 480, 680, 760, 840, 920, 1000].map((x, i) => (
            <line key={`ewdash-${i}`} x1={x} y1="633" x2={x + 38} y2="633" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeDasharray="8,6" />
          ))}

          {/* Academic Promenade (Connecting AB-1, Library, Auditorium, AB-2) */}
          <rect x="220" y="394" width="760" height="26" rx="4" fill="url(#roadSecondary)" />
          <line x1="220" y1="394" x2="980" y2="394" stroke="#3D536B" strokeWidth="1.5" />
          <line x1="220" y1="420" x2="980" y2="420" stroke="#3D536B" strokeWidth="1.5" />

          {/* North Admin Loop Avenue */}
          <rect x="420" y="210" width="380" height="24" rx="4" fill="url(#roadSecondary)" />

          {/* West Campus Connection */}
          <rect x="226" y="280" width="24" height="350" rx="3" fill="url(#roadSecondary)" />
          {/* East Campus Connection */}
          <rect x="946" y="260" width="24" height="370" rx="3" fill="url(#roadSecondary)" />

          {/* Pedestrian Zebra Crossings */}
          {[
            { x: 582, y: 622, w: 36, h: 22 },
            { x: 582, y: 400, w: 36, h: 20 },
            { x: 420, y: 400, w: 20, h: 20 },
            { x: 740, y: 400, w: 20, h: 20 },
            { x: 582, y: 730, w: 36, h: 20 },
          ].map((z, idx) => (
            <g key={`zebra-${idx}`} opacity="0.65">
              {[0, 5, 10, 15, 20, 25, 30].map(offset => (
                <line
                  key={offset}
                  x1={z.x + offset}
                  y1={z.y}
                  x2={z.x + offset}
                  y2={z.y + z.h}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
              ))}
            </g>
          ))}

          {/* 4. Dedicated Step-Free Accessible Walkways (Glowing Emerald Trails) */}
          <g opacity="0.85">
            {/* South Boulevard to Library Accessible Path */}
            <path d="M 600 828 L 600 648 Q 600 580 624 550 L 624 495" fill="none" stroke="#2E7D57" strokeWidth="5" strokeLinecap="round" strokeDasharray="10,6" />
            <path d="M 600 828 L 600 648 Q 600 580 624 550 L 624 495" fill="none" stroke="#A8E6CF" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="10,6" opacity="0.7" />

            {/* Library to Auditorium Accessible Path */}
            <path d="M 624 495 Q 670 450 720 380" fill="none" stroke="#2E7D57" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="8,5" />
            {/* Library to AB-1 Accessible Path */}
            <path d="M 624 495 Q 520 450 420 405" fill="none" stroke="#2E7D57" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="8,5" />
            {/* Boulevard to Canteen Ramp */}
            <path d="M 600 640 L 576 630" fill="none" stroke="#2E7D57" strokeWidth="4" strokeLinecap="round" />
            {/* Canteen to Health Centre Accessible Path */}
            <path d="M 600 633 L 900 633 L 900 560" fill="none" stroke="#2E7D57" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="9,5" />
            {/* Library to Admin Accessible Loop */}
            <path d="M 624 495 L 624 250" fill="none" stroke="#2E7D57" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="9,5" />
          </g>

          {/* Paved Plazas */}
          <rect x="540" y="580" width="70" height="40" rx="6" fill="url(#plazaPavers)" stroke="rgba(255,255,255,0.12)" />
          <rect x="680" y="390" width="80" height="35" rx="6" fill="url(#plazaPavers)" stroke="rgba(255,255,255,0.12)" />

          {/* Main Parking Lot Layout */}
          <g transform="translate(620, 710)" filter="url(#markerGlow)">
            <rect x="0" y="0" width="100" height="56" rx="6" fill="#141E28" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
            {/* Parking Stalls */}
            {[10, 26, 42, 58, 74, 90].map((px, idx) => (
              <line key={idx} x1={px} y1="2" x2={px} y2="54" stroke="rgba(255,255,255,0.14)" strokeWidth="1" strokeDasharray="3,3" />
            ))}
            {/* Accessible Parking Markings (P ♿) */}
            <rect x="12" y="6" width="22" height="44" rx="3" fill="rgba(33,150,243,0.25)" stroke="#2196F3" strokeWidth="1" />
            <text x="23" y="24" fill="#64B5F6" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">♿</text>
            <text x="23" y="42" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">P</text>
          </g>

          {/* 5. Isometric Campus Trees (Scattered realistic tree clusters) */}
          <g opacity="0.9">
            {[
              // Library surrounds
              [520, 480], [535, 520], [520, 560], [710, 470], [725, 510], [710, 550],
              [550, 440], [690, 440], [580, 470], [665, 470],
              // Central Boulevard trees
              [565, 680], [635, 680], [565, 750], [635, 750], [565, 820], [635, 820],
              [565, 330], [635, 330], [565, 270], [635, 270],
              // Admin Block greenery
              [480, 220], [510, 210], [730, 220], [760, 210],
              // Hostel area trees
              [160, 310], [180, 350], [160, 390], [280, 300], [290, 360],
              [910, 300], [920, 350], [1030, 310], [1040, 360],
              [910, 460], [920, 510], [1030, 470], [1040, 520],
              // Sports & Workshop trees
              [340, 660], [380, 660], [420, 660], [150, 630], [180, 670],
              // Health Centre trees
              [820, 590], [850, 630], [950, 590], [980, 630],
            ].map(([tx, ty], i) => (
              <g key={`tree-${i}`}>
                {/* Shadow */}
                <ellipse cx={tx + 3} cy={ty + 5} rx="8" ry="4.5" fill="rgba(0,0,0,0.4)" />
                {/* Foliage layers */}
                <circle cx={tx} cy={ty} r="8.5" fill="#143D24" />
                <circle cx={tx - 1.5} cy={ty - 2.5} r="6.5" fill="#235E38" />
                <circle cx={tx - 2.5} cy={ty - 4} r="4" fill="#3D8E56" opacity="0.8" />
              </g>
            ))}
          </g>

          {/* 6. Realistic 3D Isometric Buildings */}
          {buildings.map(b => (
            <IsometricBuilding
              key={b.id}
              building={b}
              isSelected={toLocation?.id === b.id || fromLocation?.id === b.id}
              onClick={() => {
                if (!fromLocation) {
                  setFromLocation(b);
                  addToast(`Selected ${b.name} as starting point`, 'info');
                } else if (!toLocation && fromLocation.id !== b.id) {
                  setToLocation(b);
                  addToast(`Selected ${b.name} as destination`, 'info');
                } else {
                  setToLocation(b);
                  addToast(`Target set to ${b.name}`, 'info');
                }
              }}
            />
          ))}

          {/* 7. Active Navigation Route Visualizer */}
          {selectedRoute && selectedRoute.waypoints && (
            <g className="route-layer" filter="url(#neonRouteGlow)">
              {/* Outer broad neon glow */}
              <polyline
                points={selectedRoute.waypoints.map(p => `${p.x * 12},${p.y * 9}`).join(' ')}
                fill="none"
                stroke={selectedRoute.color || '#2E7D57'}
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.38"
              />
              {/* Solid core route line */}
              <polyline
                points={selectedRoute.waypoints.map(p => `${p.x * 12},${p.y * 9}`).join(' ')}
                fill="none"
                stroke={selectedRoute.color || '#2E7D57'}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.95"
              />
              {/* Animated dashed stream */}
              <polyline
                className="route-animated-dash"
                points={selectedRoute.waypoints.map(p => `${p.x * 12},${p.y * 9}`).join(' ')}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="12,12"
                opacity="0.85"
              />

              {/* Waypoint Checkpoint Rings */}
              {selectedRoute.waypoints.map((p, idx) => {
                const isStart = idx === 0;
                const isEnd = idx === selectedRoute.waypoints.length - 1;
                if (isStart || isEnd) return null;
                return (
                  <g key={`wp-${idx}`} transform={`translate(${p.x * 12}, ${p.y * 9})`}>
                    <circle r="6" fill="#112130" stroke={selectedRoute.color || '#2E7D57'} strokeWidth="2.5" />
                    <circle r="2.5" fill="#FFFFFF" />
                  </g>
                );
              })}
            </g>
          )}

          {/* 8. Start (A) & Destination (B) Route Markers */}
          {fromLocation && (
            <g transform={`translate(${fromLocation.position.x * 12}, ${fromLocation.position.y * 9})`} filter="url(#markerGlow)">
              <circle r="18" fill="rgba(46,125,87,0.3)" className="beacon-pulse" />
              <path d="M 0 0 L -12 -26 A 14 14 0 1 1 12 -26 Z" fill="#2E7D57" stroke="#FFFFFF" strokeWidth="2" />
              <text x="0" y="-22" fill="#FFFFFF" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">A</text>
            </g>
          )}

          {toLocation && (
            <g transform={`translate(${toLocation.position.x * 12}, ${toLocation.position.y * 9})`} filter="url(#markerGlow)">
              <circle r="18" fill="rgba(33,150,243,0.3)" className="beacon-pulse" />
              <path d="M 0 0 L -12 -26 A 14 14 0 1 1 12 -26 Z" fill="#2196F3" stroke="#FFFFFF" strokeWidth="2" />
              <text x="0" y="-22" fill="#FFFFFF" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">B</text>
            </g>
          )}

          {/* 9. Live Navigation Current Location Pin */}
          {currentNavPoint && (
            <g transform={`translate(${currentNavPoint.x * 12}, ${currentNavPoint.y * 9})`} className="current-nav-beacon">
              {/* Radar pulse ripples */}
              <circle r="32" fill="none" stroke="#00E676" strokeWidth="1.5" className="radar-wave-1" />
              <circle r="20" fill="none" stroke="#00BCD4" strokeWidth="2" className="radar-wave-2" />
              {/* Direction cone */}
              <polygon points="0,-18 7,10 0,6 -7,10" fill="#00E676" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle r="6" fill="#FFFFFF" stroke="#00E676" strokeWidth="2" />
              <text x="0" y="24" fill="#00E676" fontSize="10" fontWeight="800" textAnchor="middle" stroke="#0B1622" strokeWidth="3" paintOrder="stroke fill">
                YOU ARE HERE
              </text>
            </g>
          )}

          {/* 10. Interactive Facility Markers (Ramps, Elevators, Washrooms, Parking, Obstacles) */}
          {visibleFacilities.map(f => (
            <SvgFacilityMarker
              key={f.id}
              item={f}
              isSelected={selectedMarker?.id === f.id}
              isHighlighted={highlightedFacility === f.id}
              onClick={() => setSelectedMarker(selectedMarker?.id === f.id ? null : f)}
            />
          ))}

          {/* Obstacle Warning Markers */}
          {showObstacles && obstacleMarkers.map(r => (
            <SvgObstacleMarker
              key={r.id}
              report={r}
              isSelected={selectedMarker?.id === r.id}
              onClick={() => setSelectedMarker(selectedMarker?.id === r.id ? null : r)}
            />
          ))}
        </svg>
      </div>

      {/* Floating Selected Marker Details Card */}
      {selectedMarker && (
        <MarkerCard
          item={selectedMarker}
          onClose={() => {
            setSelectedMarker(null);
            setHighlightedFacility(null);
          }}
        />
      )}

      {/* Floating Map Controls */}
      <MapControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetView}
        onLocateStart={locateStart}
        zoom={zoom}
      />

      {/* Map Legend */}
      <MapLegend />

      {/* Campus Map Watermark badge */}
      <div className="map-campus-watermark">
        <span className="watermark-dot" />
        <strong>TIET Patiala Campus</strong> · Accessible Navigation
      </div>
    </div>
  );
}

// ── 3D Isometric Campus Buildings ──
function IsometricBuilding({ building: b, isSelected, onClick }) {
  // Translate 0-100 coordinates to 1200x900
  const cx = b.position.x * 12;
  const cy = b.position.y * 9;

  // Custom 3D shapes per building type
  const dims = getBuildingDimensions(b.id);
  const { w, h, depth, roofType, color, roofColor, accent } = dims;

  const bx = cx - w / 2;
  const by = cy - h / 2;

  return (
    <g
      className={`isometric-bldg-group ${isSelected ? 'bldg-selected' : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Cast Ground Shadow */}
      <rect
        x={bx + depth}
        y={by + depth + 4}
        width={w}
        height={h}
        rx={6}
        fill="rgba(0,0,0,0.55)"
      />

      {/* Facade Front/Left walls */}
      <rect
        x={bx}
        y={by}
        width={w}
        height={h}
        rx={6}
        fill={color || 'url(#bldgFacade)'}
        stroke={isSelected ? '#00E676' : 'rgba(255,255,255,0.18)'}
        strokeWidth={isSelected ? 3 : 1.2}
      />

      {/* Roof Deck / Isometric Top Slab */}
      {roofType === 'dome' ? (
        <ellipse
          cx={cx}
          cy={cy}
          rx={w / 2 - 4}
          ry={h / 2 - 4}
          fill={roofColor || 'url(#bldgRoofAudit)'}
          stroke="#FFFFFF"
          strokeWidth="0.8"
          opacity="0.9"
        />
      ) : roofType === 'library' ? (
        <g>
          {/* Stepped library reading terraces */}
          <rect x={bx + 6} y={by + 6} width={w - 12} height={h - 12} rx={4} fill={roofColor || 'url(#bldgRoofLibrary)'} />
          <rect x={bx + 18} y={by + 14} width={w - 36} height={h - 28} rx={3} fill="#337AB7" opacity="0.85" />
          {/* Glass Skylight Atrium */}
          <polygon
            points={`${cx - 18},${cy} ${cx},${cy - 12} ${cx + 18},${cy} ${cx},${cy + 12}`}
            fill="#80DEEA"
            stroke="#FFFFFF"
            strokeWidth="1"
            opacity="0.8"
          />
        </g>
      ) : (
        <rect
          x={bx + 4}
          y={by + 4}
          width={w - 8}
          height={h - 8}
          rx={4}
          fill={roofColor || 'url(#bldgRoofAcademic)'}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.8"
        />
      )}

      {/* Building Windows / Solar panels */}
      {generateBuildingWindows(bx, by, w, h, roofType)}

      {/* Entrance Ramp indicator if building is accessible */}
      {b.accessible && (
        <g transform={`translate(${cx}, ${by + h + 2})`}>
          <polygon points="-8,-4 8,-4 5,4 -5,4" fill="#2E7D57" stroke="#4CAF50" strokeWidth="1" />
          <text x="0" y="2" fill="#FFFFFF" fontSize="6" fontWeight="bold" textAnchor="middle">♿</text>
        </g>
      )}

      {/* High-Contrast Building Badge Label */}
      <g transform={`translate(${cx}, ${by - 12})`} className="bldg-label-tag">
        <rect
          x="-38"
          y="-13"
          width="76"
          height="18"
          rx="9"
          fill="#0D1E2C"
          stroke={accent || '#4CAF50'}
          strokeWidth="1.2"
          filter="url(#markerGlow)"
        />
        <text
          x="0"
          y="0"
          fill="#F0F4F0"
          fontSize="9.5"
          fontWeight="800"
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          letterSpacing="0.03em"
        >
          {b.shortName}
        </text>
      </g>
    </g>
  );
}

function getBuildingDimensions(id) {
  switch (id) {
    case 'main-gate':
      return { w: 90, h: 36, depth: 4, roofType: 'gate', color: '#1A3326', roofColor: '#2E7D57', accent: '#4CAF50' };
    case 'library':
      return { w: 130, h: 90, depth: 10, roofType: 'library', color: '#1B3550', roofColor: '#2B5880', accent: '#00BCD4' };
    case 'ab1':
      return { w: 120, h: 84, depth: 8, roofType: 'academic', color: '#20394F', roofColor: '#1F5A38', accent: '#4CAF50' };
    case 'ab2':
      return { w: 120, h: 84, depth: 8, roofType: 'academic', color: '#20394F', roofColor: '#1F5A38', accent: '#FF9800' };
    case 'ab3':
      return { w: 110, h: 78, depth: 8, roofType: 'academic', color: '#253B52', roofColor: '#235A3D', accent: '#7C4DFF' };
    case 'auditorium':
      return { w: 125, h: 80, depth: 9, roofType: 'dome', color: '#31234F', roofColor: '#5E35B1', accent: '#B388FF' };
    case 'admin-block':
      return { w: 136, h: 76, depth: 8, roofType: 'admin', color: '#3A2E20', roofColor: '#6B4E2B', accent: '#FFC107' };
    case 'canteen':
      return { w: 100, h: 64, depth: 6, roofType: 'social', color: '#2E3524', roofColor: '#455A2B', accent: '#8BC34A' };
    case 'workshop':
      return { w: 96, h: 62, depth: 6, roofType: 'workshop', color: '#232933', roofColor: '#37474F', accent: '#90A4AE' };
    case 'health-centre':
      return { w: 86, h: 62, depth: 6, roofType: 'health', color: '#1B3838', roofColor: '#0E5A5A', accent: '#F44336' };
    case 'sports-complex':
      return { w: 110, h: 74, depth: 8, roofType: 'sports', color: '#1E2D3D', roofColor: '#26435A', accent: '#2196F3' };
    case 'hostel-bhagat-singh':
    case 'hostel-beas':
    case 'hostel-sutlej':
      return { w: 96, h: 86, depth: 7, roofType: 'hostel', color: '#282E38', roofColor: '#3A4250', accent: '#78909C' };
    case 'parking-main':
      return { w: 90, h: 48, depth: 4, roofType: 'parking', color: '#141E28', roofColor: '#1C2836', accent: '#2196F3' };
    default:
      return { w: 90, h: 60, depth: 6, roofType: 'academic', color: '#20394F', roofColor: '#1F5A38', accent: '#4CAF50' };
  }
}

function generateBuildingWindows(bx, by, bw, bh, roofType) {
  if (roofType === 'dome' || roofType === 'gate' || roofType === 'parking') return null;
  const cols = Math.max(2, Math.floor((bw - 16) / 22));
  const rows = Math.max(1, Math.floor((bh - 20) / 20));
  const wins = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = bx + 12 + c * 22;
      const wy = by + 12 + r * 18;
      const lit = (r + c) % 2 === 0;
      wins.push(
        <rect
          key={`${r}-${c}`}
          x={wx}
          y={wy}
          width={10}
          height={7}
          rx={1.5}
          fill={lit ? 'rgba(255,224,130,0.65)' : 'rgba(128,222,234,0.35)'}
        />
      );
    }
  }
  return wins;
}

// ── SVG Facility Markers ──
function SvgFacilityMarker({ item, isSelected, isHighlighted, onClick }) {
  const cx = item.position.x * 12;
  const cy = item.position.y * 9;
  const isUnavailable = item.status === 'unavailable';

  const cfg = {
    ramp: { color: '#2E7D57', icon: '♿', label: 'Ramp' },
    elevator: { color: '#7C4DFF', icon: '🛗', label: 'Elevator' },
    washroom: { color: '#2196F3', icon: '🚻', label: 'Washroom' },
    parking: { color: '#FF9800', icon: 'P', label: 'Parking' },
    entrance: { color: '#00BCD4', icon: '🚪', label: 'Step-Free Entrance' },
  }[item.type] || { color: '#2E7D57', icon: '♿', label: 'Facility' };

  return (
    <g
      className={`svg-facility-pin ${isSelected ? 'pin-selected' : ''} ${isHighlighted ? 'pin-highlighted' : ''}`}
      transform={`translate(${cx}, ${cy})`}
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
      style={{ cursor: 'pointer' }}
    >
      {/* Outer Pulse ring when selected/highlighted */}
      {(isSelected || isHighlighted) && (
        <circle r="22" fill={cfg.color} opacity="0.35" className="pin-pulse-ring" />
      )}

      {/* Pin Body Drop Pin */}
      <circle r="14" fill="#0C1B28" stroke={cfg.color} strokeWidth={isSelected ? 3 : 2} filter="url(#markerGlow)" />
      <circle r="11" fill={cfg.color} opacity="0.25" />

      {/* Facility Icon */}
      <text
        x="0"
        y="4"
        fill="#FFFFFF"
        fontSize={cfg.icon === 'P' ? '12' : '10'}
        fontWeight="800"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        {cfg.icon}
      </text>

      {/* Maintenance alert dot if unavailable */}
      {isUnavailable && (
        <circle cx="10" cy="-10" r="4.5" fill="#F44336" stroke="#FFFFFF" strokeWidth="1.2" />
      )}
    </g>
  );
}

// ── SVG Obstacle Warning Markers ──
function SvgObstacleMarker({ report, isSelected, onClick }) {
  const cx = (report.position?.x || 50) * 12;
  const cy = (report.position?.y || 50) * 9;

  return (
    <g
      className="svg-obstacle-pin"
      transform={`translate(${cx}, ${cy})`}
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
      style={{ cursor: 'pointer' }}
    >
      <circle r="20" fill="rgba(244,67,54,0.25)" className="pin-pulse-ring" />
      <polygon
        points="0,-15 13,9 -13,9"
        fill="#D32F2F"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        filter="url(#markerGlow)"
      />
      <text x="0" y="6" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        !
      </text>
    </g>
  );
}

// ── Map Legend Component ──
function MapLegend() {
  const [open, setOpen] = useState(false);

  return (
    <div className="map-legend">
      <button className="map-legend-toggle" onClick={() => setOpen(o => !o)}>
        <span className="legend-indicator" />
        <span>Campus Legend</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d={open ? 'M1 7l4-4 4 4' : 'M1 3l4 4 4-4'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="map-legend-body animate-fade-in">
          {[
            { color: '#2E7D57', icon: '♿', label: 'Accessible Ramps' },
            { color: '#7C4DFF', icon: '🛗', label: 'Elevators' },
            { color: '#2196F3', icon: '🚻', label: 'Accessible Washrooms' },
            { color: '#FF9800', icon: 'P', label: 'Accessible Parking' },
            { color: '#00BCD4', icon: '🚪', label: 'Step-Free Entrances' },
            { color: '#F44336', icon: '⚠', label: 'Reported Obstacles' },
            { color: '#4CAF50', icon: '―', label: 'Step-Free Pathway' },
            { color: '#1B3550', icon: '■', label: 'Campus Buildings' },
          ].map(item => (
            <div key={item.label} className="legend-item">
              <span className="legend-badge-icon" style={{ background: `${item.color}25`, color: item.color, border: `1px solid ${item.color}60` }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
