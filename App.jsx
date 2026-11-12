import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ExplorePage from './pages/ExplorePage';
import FacilitiesPage from './pages/FacilitiesPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import ToastContainer from './components/ui/ToastContainer';
import BottomNav from './components/ui/BottomNav';
import './index.css';
import './App.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Routes>
            <Route path="/" element={<Navigate to="/explore" replace />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
          <BottomNav />
          <ToastContainer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
