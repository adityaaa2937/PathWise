import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { sampleReports } from '../data/sampleReports';
import { buildings } from '../data/buildings';

const AppContext = createContext(null);

const defaultPreferences = {
  avoidStairs: true,
  preferStepFree: true,
  preferRamps: false,
  avoidObstacles: true,
};

const defaultProfile = {
  name: 'Arjun Sharma',
  email: 'arjun.sharma@thapar.edu',
  rollNo: 'BE22B1234',
  department: 'Computer Science & Engineering',
  campus: 'Thapar Institute, Patiala',
  year: '3rd Year',
};

export function AppProvider({ children }) {
  // Persisted state
  const [reports, setReports] = useLocalStorage('pathwise-reports', sampleReports);
  const [preferences, setPreferences] = useLocalStorage('pathwise-prefs', defaultPreferences);
  const [savedLocations, setSavedLocations] = useLocalStorage('pathwise-saved', [
    buildings.find(b => b.id === 'library'),
    buildings.find(b => b.id === 'health-centre'),
  ]);
  const [recentSearches, setRecentSearches] = useLocalStorage('pathwise-recent', [
    { from: 'main-gate', to: 'library' },
    { from: 'library', to: 'auditorium' },
  ]);
  const [profile, setProfile] = useLocalStorage('pathwise-profile', defaultProfile);

  // Ephemeral UI state
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeType, setRouteType] = useState('accessible');
  const [navigationMode, setNavigationMode] = useState(false);
  const [navigationStep, setNavigationStep] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [highlightedFacility, setHighlightedFacility] = useState(null);
  const [mapView, setMapView] = useState({ x: 0, y: 0, zoom: 1 });

  // Toast helpers
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Reports
  const addReport = useCallback((report) => {
    const newReport = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'reported',
      dateReported: new Date().toISOString().split('T')[0],
      reportedBy: profile.name,
      stillPresent: 0,
      resolved: 0,
      demo: false,
    };
    setReports(prev => [newReport, ...prev]);
    return newReport;
  }, [profile.name, setReports]);

  const updateReportStatus = useCallback((reportId, newStatus) => {
    setReports(prev =>
      prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r)
    );
  }, [setReports]);

  const voteStillPresent = useCallback((reportId) => {
    setReports(prev =>
      prev.map(r => r.id === reportId ? { ...r, stillPresent: (r.stillPresent || 0) + 1 } : r)
    );
  }, [setReports]);

  const voteResolved = useCallback((reportId) => {
    setReports(prev =>
      prev.map(r => r.id === reportId ? { ...r, resolved: (r.resolved || 0) + 1 } : r)
    );
  }, [setReports]);

  // Saved locations
  const toggleSavedLocation = useCallback((building) => {
    setSavedLocations(prev => {
      const exists = prev.some(l => l.id === building.id);
      if (exists) return prev.filter(l => l.id !== building.id);
      return [...prev, building];
    });
  }, [setSavedLocations]);

  const isLocationSaved = useCallback((buildingId) => {
    return savedLocations.some(l => l.id === buildingId);
  }, [savedLocations]);

  // Recent searches
  const addRecentSearch = useCallback((from, to) => {
    setRecentSearches(prev => {
      const newSearch = { from: from.id, to: to.id };
      const filtered = prev.filter(s => !(s.from === from.id && s.to === to.id));
      return [newSearch, ...filtered].slice(0, 5);
    });
  }, [setRecentSearches]);

  // Navigation
  const startNavigation = useCallback(() => {
    setNavigationMode(true);
    setNavigationStep(0);
  }, []);

  const exitNavigation = useCallback(() => {
    setNavigationMode(false);
    setNavigationStep(0);
  }, []);

  const nextNavigationStep = useCallback((totalSteps) => {
    setNavigationStep(prev => Math.min(prev + 1, totalSteps - 1));
  }, []);

  const resetMap = useCallback(() => {
    setMapView({ x: 0, y: 0, zoom: 1 });
  }, []);

  const value = {
    // State
    reports,
    preferences,
    savedLocations,
    recentSearches,
    profile,
    selectedMarker,
    activeFilter,
    fromLocation,
    toLocation,
    selectedRoute,
    routeType,
    navigationMode,
    navigationStep,
    toasts,
    highlightedFacility,
    mapView,

    // Setters
    setPreferences,
    setProfile,
    setSelectedMarker,
    setActiveFilter,
    setFromLocation,
    setToLocation,
    setSelectedRoute,
    setRouteType,
    setHighlightedFacility,
    setMapView,

    // Actions
    addToast,
    removeToast,
    addReport,
    updateReportStatus,
    voteStillPresent,
    voteResolved,
    toggleSavedLocation,
    isLocationSaved,
    addRecentSearch,
    startNavigation,
    exitNavigation,
    nextNavigationStep,
    resetMap,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

