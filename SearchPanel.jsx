import React, { useState, useEffect } from 'react';
import { Search, ArrowUpDown, MapPin, Clock, X, Navigation2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { buildings } from '../../data/buildings';
import { sampleRoutes, getRouteKey, getGenericRoutes } from '../../data/routes';
import './SearchPanel.css';

export default function SearchPanel({ onShowRoutes }) {
  const {
    fromLocation, setFromLocation,
    toLocation, setToLocation,
    setSelectedRoute, routeType,
    recentSearches, addRecentSearch,
    addToast,
  } = useApp();

  const [fromQuery, setFromQuery] = useState(fromLocation?.name || '');
  const [toQuery, setToQuery] = useState(toLocation?.name || '');
  const [fromFocus, setFromFocus] = useState(false);
  const [toFocus, setToFocus] = useState(false);

  // Sync display when context changes
  useEffect(() => { setFromQuery(fromLocation?.name || ''); }, [fromLocation]);
  useEffect(() => { setToQuery(toLocation?.name || ''); }, [toLocation]);

  const fromResults = fromQuery.length > 0
    ? buildings.filter(b => b.name.toLowerCase().includes(fromQuery.toLowerCase()) || b.shortName.toLowerCase().includes(fromQuery.toLowerCase())).slice(0, 5)
    : [];

  const toResults = toQuery.length > 0
    ? buildings.filter(b => b.name.toLowerCase().includes(toQuery.toLowerCase()) || b.shortName.toLowerCase().includes(toQuery.toLowerCase())).slice(0, 5)
    : [];

  const recentBuildings = recentSearches.map(rs => {
    const from = buildings.find(b => b.id === rs.from);
    const to = buildings.find(b => b.id === rs.to);
    return { from, to };
  }).filter(r => r.from && r.to);

  const handleSwap = () => {
    const prevFrom = fromLocation;
    const prevTo = toLocation;
    setFromLocation(prevTo);
    setToLocation(prevFrom);
    if (prevTo && prevFrom) {
      const key = getRouteKey(prevTo.id, prevFrom.id);
      const routes = key ? sampleRoutes[key].routes : getGenericRoutes(prevTo, prevFrom);
      const def = routes.find(r => r.type === routeType) || routes[0];
      if (def) setSelectedRoute(def);
    }
  };

  const handleSearch = () => {
    if (!fromLocation || !toLocation) {
      addToast('Please select both a start and destination', 'warning');
      return;
    }
    const key = getRouteKey(fromLocation.id, toLocation.id);
    const routes = key ? sampleRoutes[key].routes : getGenericRoutes(fromLocation, toLocation);
    const def = routes.find(r => r.type === routeType) || routes[0];
    if (def) setSelectedRoute(def);

    addRecentSearch(fromLocation, toLocation);
    onShowRoutes();
    addToast(`Generated routes between ${fromLocation.shortName} and ${toLocation.shortName}`, 'info');
  };

  const handleRecentSelect = (r) => {
    setFromLocation(r.from);
    setToLocation(r.to);
    const key = getRouteKey(r.from.id, r.to.id);
    const routes = key ? sampleRoutes[key].routes : getGenericRoutes(r.from, r.to);
    const def = routes.find(rt => rt.type === routeType) || routes[0];
    if (def) setSelectedRoute(def);
    onShowRoutes();
  };

  return (
    <div className="search-panel glass animate-fade-in">
      {/* From field */}
      <div className="search-field-wrap">
        <div className={`search-field ${fromFocus ? 'focused' : ''}`}>
          <div className="search-field-icon from-icon">
            <div className="field-dot from-dot" />
          </div>
          <input
            className="search-input"
            placeholder="From: Starting point (e.g. Main Gate)"
            value={fromQuery}
            onChange={e => { setFromQuery(e.target.value); setFromLocation(null); }}
            onFocus={() => setFromFocus(true)}
            onBlur={() => setTimeout(() => setFromFocus(false), 200)}
          />
          {fromQuery && (
            <button className="search-clear" onClick={() => { setFromQuery(''); setFromLocation(null); }} title="Clear starting point">
              <X size={13} />
            </button>
          )}
        </div>
        {fromFocus && fromQuery.length > 0 && (
          <LocationDropdown
            results={fromResults}
            onSelect={b => { setFromLocation(b); setFromQuery(b.name); setFromFocus(false); }}
          />
        )}
        {fromFocus && fromQuery.length === 0 && recentBuildings.length > 0 && (
          <RecentSearches recent={recentBuildings} onSelect={handleRecentSelect} />
        )}
      </div>

      {/* Swap button */}
      <button className="swap-btn" onClick={handleSwap} title="Swap locations">
        <ArrowUpDown size={14} />
      </button>

      {/* To field */}
      <div className="search-field-wrap">
        <div className={`search-field ${toFocus ? 'focused' : ''}`}>
          <div className="search-field-icon">
            <MapPin size={13} color="#2196F3" />
          </div>
          <input
            className="search-input"
            placeholder="To: Destination (e.g. Library)"
            value={toQuery}
            onChange={e => { setToQuery(e.target.value); setToLocation(null); }}
            onFocus={() => setToFocus(true)}
            onBlur={() => setTimeout(() => setToFocus(false), 200)}
          />
          {toQuery && (
            <button className="search-clear" onClick={() => { setToQuery(''); setToLocation(null); }} title="Clear destination">
              <X size={13} />
            </button>
          )}
        </div>
        {toFocus && toQuery.length > 0 && (
          <LocationDropdown
            results={toResults}
            onSelect={b => { setToLocation(b); setToQuery(b.name); setToFocus(false); }}
          />
        )}
      </div>

      {/* Search button */}
      <button className="btn btn-primary search-go-btn" onClick={handleSearch}>
        <Navigation2 size={15} /> Find Accessible Routes
      </button>
    </div>
  );
}

function LocationDropdown({ results, onSelect }) {
  if (!results.length) return (
    <div className="location-dropdown">
      <div className="location-empty">No locations found</div>
    </div>
  );
  return (
    <div className="location-dropdown animate-fade-in">
      {results.map(b => (
        <button key={b.id} className="location-item" onMouseDown={() => onSelect(b)}>
          <MapPin size={13} color="var(--color-text-muted)" />
          <div className="location-item-text">
            <span className="location-name">{b.name}</span>
            <span className="location-type">{b.type} · {b.shortName}</span>
          </div>
          {b.accessible && <span className="accessible-badge" title="Step-free accessible">♿</span>}
        </button>
      ))}
    </div>
  );
}

function RecentSearches({ recent, onSelect }) {
  return (
    <div className="location-dropdown animate-fade-in">
      <div className="dropdown-label"><Clock size={11} /> Recent Destinations</div>
      {recent.slice(0, 3).map((r, i) => (
        <button key={i} className="location-item" onMouseDown={() => onSelect(r)}>
          <Clock size={13} color="var(--color-text-muted)" />
          <div className="location-item-text">
            <span className="location-name">{r.from.shortName} → {r.to.shortName}</span>
            <span className="location-type">{r.from.name} to {r.to.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
