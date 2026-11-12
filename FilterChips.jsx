import React from 'react';
import { useApp } from '../../context/AppContext';
import { facilityTypes } from '../../data/facilities';
import './FilterChips.css';

export default function FilterChips() {
  const { activeFilter, setActiveFilter } = useApp();

  return (
    <div className="filter-chips-bar">
      <div className="filter-chips-scroll">
        {facilityTypes.map(ft => (
          <button
            key={ft.id}
            className={`chip filter-chip ${activeFilter === ft.id ? 'active' : ''}`}
            style={{
              '--chip-color': ft.color,
              borderColor: activeFilter === ft.id ? ft.color : 'transparent',
              background: activeFilter === ft.id
                ? `${ft.color}22`
                : 'var(--glass-bg)',
              color: activeFilter === ft.id ? ft.color : 'var(--color-text-muted)',
            }}
            onClick={() => setActiveFilter(ft.id)}
          >
            <span
              className="chip-dot"
              style={{ background: activeFilter === ft.id ? ft.color : 'rgba(255,255,255,0.3)' }}
            />
            {ft.label}
          </button>
        ))}
      </div>
    </div>
  );
}

