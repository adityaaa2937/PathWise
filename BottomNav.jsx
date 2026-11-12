import React from 'react';
import { NavLink } from 'react-router-dom';
import { Map, Navigation, Building2, AlertTriangle, User } from 'lucide-react';
import './BottomNav.css';

const navItems = [
  { to: '/explore', icon: Map, label: 'Explore' },
  { to: '/facilities', icon: Building2, label: 'Facilities' },
  { to: '/reports', icon: AlertTriangle, label: 'Reports' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav glass">
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <item.icon size={20} className="bottom-nav-icon"/>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

