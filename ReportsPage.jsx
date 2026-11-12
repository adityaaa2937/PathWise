import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Clock, MapPin, ThumbsUp, ThumbsDown, Filter, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { reportCategories, reportStatuses } from '../data/sampleReports';
import ReportForm from '../components/reports/ReportForm';
import './ReportsPage.css';

export default function ReportsPage() {
  const navigate = useNavigate();
  const { reports, voteStillPresent, voteResolved, updateReportStatus, setHighlightedFacility, addToast } = useApp();
  const [filterStatus, setFilterStatus] = useState('all');
  const [showReportForm, setShowReportForm] = useState(false);

  const filtered = reports.filter(r => filterStatus === 'all' || r.status === filterStatus);

  const handleViewMap = (r) => {
    if (r.position) setHighlightedFacility(r.id);
    addToast(`Showing ${r.title} on map`, 'info');
    navigate('/explore');
  };

  const handleStillPresent = (id) => {
    voteStillPresent(id);
    addToast('Feedback recorded', 'success');
  };

  const handleResolved = (id) => {
    voteResolved(id);
    updateReportStatus(id, 'resolved');
    addToast('Marked as resolved', 'success');
  };

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="page-header glass">
        <div>
          <h1 className="page-title">Accessibility Reports</h1>
          <p className="page-subtitle">Community-reported obstacles</p>
        </div>
        <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '8px 14px' }} onClick={() => setShowReportForm(true)}>
          <Plus size={14}/> Report
        </button>
      </div>

      {/* Disclaimer */}
      <div className="reports-disclaimer">
        ⚠ Reports are demo submissions — not sent to campus authorities.
      </div>

      {/* Filters */}
      <div className="reports-filter-bar glass">
        {['all', 'reported', 'under-review', 'resolved'].map(s => (
          <button
            key={s}
            className={`chip ${filterStatus === s ? 'active' : ''}`}
            style={{
              background: filterStatus === s ? 'rgba(46,125,87,0.2)' : 'transparent',
              borderColor: filterStatus === s ? 'var(--color-primary-light)' : 'transparent',
              color: filterStatus === s ? 'var(--color-primary-lighter)' : 'var(--color-text-muted)',
            }}
            onClick={() => setFilterStatus(s)}
          >
            {s === 'all' ? 'All' : reportStatuses[s]?.label || s}
          </button>
        ))}
      </div>

      {/* Reports list */}
      <div className="reports-list">
        {filtered.length === 0 ? (
          <div className="reports-empty">
            <CheckCircle size={40} opacity={0.3} color="#4CAF50"/>
            <p>No reports in this category.</p>
          </div>
        ) : (
          filtered.map(r => (
            <ReportCard
              key={r.id}
              report={r}
              onViewMap={() => handleViewMap(r)}
              onStillPresent={() => handleStillPresent(r.id)}
              onResolved={() => handleResolved(r.id)}
            />
          ))
        )}
      </div>

      {showReportForm && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowReportForm(false); }}>
          <div className="modal glass">
            <ReportForm onClose={() => setShowReportForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function ReportCard({ report: r, onViewMap, onStillPresent, onResolved }) {
  const st = reportStatuses[r.status] || reportStatuses.reported;
  const severity = { low: '#4CAF50', medium: '#FF9800', high: '#F44336' }[r.severity] || '#FF9800';
  const cat = reportCategories.find(c => c.id === r.category)?.label || r.category;

  return (
    <div className={`report-card glass animate-fade-in ${r.status === 'resolved' ? 'resolved' : ''}`}>
      <div className="report-card-header">
        <div className="report-card-title-row">
          <AlertTriangle size={14} color={severity}/>
          <h3 className="report-card-title">{r.title}</h3>
        </div>
        <span className="report-status-badge" style={{ color: st.color, background: `${st.color}18`, border: `1px solid ${st.color}35` }}>
          {st.label}
        </span>
      </div>

      <div className="report-card-meta">
        <span className="report-meta-item"><MapPin size={11}/>{r.locationName}</span>
        <span className="report-meta-item">
          <span className="severity-dot" style={{ background: severity }}/>
          {r.severity.charAt(0).toUpperCase() + r.severity.slice(1)} severity
        </span>
        <span className="report-meta-item"><Clock size={11}/>{r.dateReported}</span>
      </div>

      <div className="report-category-tag">{cat}</div>

      <p className="report-desc">{r.description}</p>

      {r.demo && (
        <div className="report-demo-notice">Demo report — not verified or submitted</div>
      )}

      <div className="report-feedback-row">
        <span className="report-feedback-label">Still present?</span>
        <button className="feedback-btn" onClick={onStillPresent}>
          <ThumbsUp size={12}/> Yes ({r.stillPresent || 0})
        </button>
        <button className="feedback-btn resolved-btn" onClick={onResolved}>
          <ThumbsDown size={12}/> Resolved ({r.resolved || 0})
        </button>
        <button className="btn btn-ghost report-map-btn" onClick={onViewMap}>
          <MapPin size={12}/> Map
        </button>
      </div>
    </div>
  );
}

