import React from 'react';
import {
  Navigation, ChevronRight, ChevronLeft, X, CheckCircle2,
  ArrowUp, CornerUpLeft, CornerUpRight, CornerRightDown, MapPin,
  ShieldCheck, AlertCircle, Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { navigationSteps } from '../../data/routes';
import './NavigationMode.css';

export default function NavigationMode() {
  const {
    exitNavigation, selectedRoute, navigationStep,
    nextNavigationStep, fromLocation, toLocation,
    setMapView,
  } = useApp();

  const routeType = selectedRoute?.type || 'accessible';
  const steps = selectedRoute?.steps || navigationSteps[routeType] || navigationSteps.accessible;
  const totalSteps = steps.length;
  const currentStep = steps[Math.min(navigationStep, totalSteps - 1)];
  const isComplete = navigationStep >= totalSteps - 1;
  const progress = Math.min(100, Math.round(((navigationStep + 1) / totalSteps) * 100));

  const nextStepPreview = steps[navigationStep + 1];

  // Helper icon renderer
  const renderStepIcon = (iconName) => {
    switch (iconName) {
      case 'corner-up-left':
        return <CornerUpLeft size={22} />;
      case 'corner-up-right':
        return <CornerUpRight size={22} />;
      case 'corner-right-down':
        return <CornerRightDown size={22} />;
      case 'map-pin':
        return <MapPin size={22} />;
      default:
        return <ArrowUp size={24} />;
    }
  };

  return (
    <div className="nav-mode-floating-layer">
      {/* 1. Compact Top Navigation HUD */}
      <div className="nav-top-hud glass animate-fade-in">
        <div className="nav-hud-left">
          <div className="nav-status-pulse" />
          <div className="nav-hud-route-info">
            <div className="nav-hud-title">
              <span className="hud-from">{fromLocation?.shortName || 'Start'}</span>
              <span className="hud-arrow">→</span>
              <span className="hud-to">{toLocation?.shortName || 'Destination'}</span>
            </div>
            <div className="nav-hud-sub">
              <span className="hud-metric">{selectedRoute?.distance || '450 m'}</span>
              <span>·</span>
              <span className="hud-metric">{selectedRoute?.time || '6 min'}</span>
              <span>·</span>
              <span className="hud-metric hud-type-badge">{selectedRoute?.name || 'Most Accessible'}</span>
            </div>
          </div>
        </div>

        <div className="nav-hud-right">
          <span className="nav-sim-badge">SIMULATED NAVIGATION</span>
          <button className="nav-hud-exit-btn" onClick={exitNavigation} title="Exit Navigation">
            <X size={16} />
            <span className="exit-btn-text">Exit</span>
          </button>
        </div>

        {/* Progress track at bottom of top HUD */}
        <div className="nav-hud-progress-track">
          <div className="nav-hud-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* 2. Floating Bottom Turn-by-Turn Instruction Card */}
      <div className="nav-floating-card-wrapper animate-slide-up">
        <div className="nav-turn-card glass">
          {isComplete ? (
            /* Destination Reached View */
            <div className="nav-arrived-view">
              <div className="arrived-icon-wrap">
                <CheckCircle2 size={42} color="#00E676" />
              </div>
              <div className="arrived-text">
                <span className="arrived-badge">DESTINATION REACHED</span>
                <h3 className="arrived-title">You have arrived at {toLocation?.name}!</h3>
                <p className="arrived-desc">
                  Step-free route completed successfully. {selectedRoute?.ramps || 0} ramps used.
                </p>
              </div>
              <button className="btn btn-primary arrived-done-btn" onClick={exitNavigation}>
                Finish & Return to Explore
              </button>
            </div>
          ) : (
            /* Active Turn-by-Turn View */
            <div className="nav-turn-view">
              <div className="nav-turn-main-row">
                {/* Big Direction Icon */}
                <div className="turn-icon-badge">
                  {renderStepIcon(currentStep?.icon)}
                </div>

                {/* Instruction Text & Distance */}
                <div className="turn-text-block">
                  <div className="turn-step-pill">
                    STEP {navigationStep + 1} OF {totalSteps}
                  </div>
                  <h4 className="turn-instruction-text">
                    {currentStep?.direction}
                  </h4>
                  <div className="turn-distance-metric">
                    <Navigation size={13} color="#00E676" />
                    <span>In {currentStep?.distance || '50 m'}</span>
                  </div>
                </div>
              </div>

              {/* Next Step Preview Bar */}
              {nextStepPreview && (
                <div className="turn-next-preview">
                  <span className="preview-label">NEXT:</span>
                  <span className="preview-text">{nextStepPreview.direction}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="turn-action-row">
                <button
                  className="btn btn-primary turn-next-btn"
                  onClick={() => nextNavigationStep(totalSteps)}
                >
                  <span>Next Step</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
