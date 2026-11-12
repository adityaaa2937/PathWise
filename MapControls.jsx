import React from 'react';
import { Plus, Minus, RotateCcw, Crosshair, Compass } from 'lucide-react';
import './MapControls.css';

export default function MapControls({ onZoomIn, onZoomOut, onReset, onLocateStart, zoom }) {
  return (
    <div className="map-controls">
      <button className="map-ctrl-btn" onClick={onZoomIn} title="Zoom In">
        <Plus size={16} />
      </button>
      <div className="map-ctrl-zoom-label">{Math.round(zoom * 100)}%</div>
      <button className="map-ctrl-btn" onClick={onZoomOut} title="Zoom Out">
        <Minus size={16} />
      </button>
      <div className="map-ctrl-divider" />
      <button className="map-ctrl-btn" onClick={onReset} title="Reset View">
        <RotateCcw size={14} />
      </button>
      <button className="map-ctrl-btn locate-btn" onClick={onLocateStart} title="Locate Starting Point / Current Position (Simulated)">
        <Crosshair size={15} />
      </button>
      <div className="map-ctrl-divider" />
      <button className="map-ctrl-btn compass" onClick={onReset} title="Compass / Reset Orientation">
        <Compass size={16} />
      </button>
    </div>
  );
}
