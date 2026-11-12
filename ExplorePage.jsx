import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CampusMap from '../components/map/CampusMap';
import FilterChips from '../components/map/FilterChips';
import SearchPanel from '../components/navigation/SearchPanel';
import RouteCards from '../components/navigation/RouteCards';
import NavigationMode from '../components/navigation/NavigationMode';
import ReportForm from '../components/reports/ReportForm';
import './ExplorePage.css';

export default function ExplorePage() {
  const { navigationMode, fromLocation, toLocation } = useApp();
  const [showRoutes, setShowRoutes] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);

  // Automatically show route options card when both from & to locations are selected
  useEffect(() => {
    if (fromLocation && toLocation) {
      setShowRoutes(true);
    }
  }, [fromLocation?.id, toLocation?.id]);

  return (
    <div className="explore-page">
      {/* Top Header */}
      <header className="explore-header glass">
        <div className="explore-logo">
          <span className="logo-icon">🧭</span>
          <div>
            <div className="logo-name">Pathwise</div>
            <div className="logo-tagline">Every Path. Every Possibility.</div>
          </div>
        </div>
        <div className="explore-header-actions">
          <span className="header-campus-tag">TIET Patiala Campus</span>
        </div>
      </header>

      {/* Campus Map Container */}
      <main className="explore-map-area">
        <CampusMap onOpenReport={() => setShowReportForm(true)} />

        {/* Regular Exploration Overlays */}
        {!navigationMode && (
          <>
            <FilterChips />
            <SearchPanel onShowRoutes={() => setShowRoutes(true)} />
            {showRoutes && (
              <RouteCards onClose={() => setShowRoutes(false)} />
            )}
            <button
              className="report-fab"
              onClick={() => setShowReportForm(true)}
              title="Report Accessibility Obstacle"
            >
              <AlertTriangle size={20} />
            </button>
          </>
        )}

        {/* Live Navigation Overlay - floats over the active map */}
        {navigationMode && <NavigationMode />}
      </main>

      {/* Accessibility Report Modal */}
      {showReportForm && (
        <div
          className="modal-overlay"
          onClick={e => {
            if (e.target === e.currentTarget) setShowReportForm(false);
          }}
        >
          <div className="modal glass">
            <ReportForm onClose={() => setShowReportForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
