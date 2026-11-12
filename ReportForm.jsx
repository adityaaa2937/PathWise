import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { buildings } from '../../data/buildings';
import { reportCategories } from '../../data/sampleReports';
import './ReportForm.css';

export default function ReportForm({ onClose }) {
  const { addReport, addToast } = useApp();
  const [form, setForm] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
    severity: 'medium',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.category) errs.category = 'Please select a category';
    if (!form.location) errs.location = 'Please select a location';
    if (!form.description.trim()) errs.description = 'Description is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const building = buildings.find(b => b.id === form.location);
    addReport({
      ...form,
      locationName: building?.name || form.location,
      position: building?.position || { x: 50, y: 50 },
      image: imagePreview,
    });
    setSubmitted(true);
    addToast('Report submitted successfully!', 'success');
    setTimeout(onClose, 2000);
  };

  if (submitted) {
    return (
      <div className="report-form-success">
        <div className="success-icon">✅</div>
        <h3>Report Submitted</h3>
        <p>Your report has been saved locally. This is a demo — reports are not sent to campus authorities.</p>
      </div>
    );
  }

  return (
    <div className="report-form">
      <div className="report-form-header">
        <h2>Report Accessibility Issue</h2>
        <button className="marker-card-close" onClick={onClose}><X size={16}/></button>
      </div>

      <div className="report-form-disclaimer">
        ⚠ This is a demo application. Reports are stored locally only and are not sent to campus authorities.
      </div>

      <form onSubmit={handleSubmit} className="report-form-body" noValidate>
        {/* Title */}
        <div className="form-group">
          <label className="label">Issue Title *</label>
          <input
            className={`input ${errors.title ? 'input-error' : ''}`}
            placeholder="Brief description of the issue"
            value={form.title}
            onChange={e => handleChange('title', e.target.value)}
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="label">Category *</label>
          <select
            className={`input ${errors.category ? 'input-error' : ''}`}
            value={form.category}
            onChange={e => handleChange('category', e.target.value)}
          >
            <option value="">Select category…</option>
            {reportCategories.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          {errors.category && <span className="form-error">{errors.category}</span>}
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="label">Location *</label>
          <select
            className={`input ${errors.location ? 'input-error' : ''}`}
            value={form.location}
            onChange={e => handleChange('location', e.target.value)}
          >
            <option value="">Select campus location…</option>
            {buildings.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          {errors.location && <span className="form-error">{errors.location}</span>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="label">Description *</label>
          <textarea
            className={`input ${errors.description ? 'input-error' : ''}`}
            placeholder="Describe the issue in detail…"
            value={form.description}
            onChange={e => handleChange('description', e.target.value)}
            rows={3}
          />
          {errors.description && <span className="form-error">{errors.description}</span>}
        </div>

        {/* Severity */}
        <div className="form-group">
          <label className="label">Severity</label>
          <div className="severity-row">
            {['low', 'medium', 'high'].map(s => (
              <button
                key={s}
                type="button"
                className={`severity-btn ${form.severity === s ? 'selected' : ''}`}
                data-severity={s}
                onClick={() => handleChange('severity', s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Image upload */}
        <div className="form-group">
          <label className="label">Photo (Optional)</label>
          <label className="image-upload-label">
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            ) : (
              <div className="image-upload-placeholder">
                <span>📸</span>
                <span>Tap to upload photo</span>
              </div>
            )}
          </label>
          {imagePreview && (
            <button type="button" className="btn btn-ghost" style={{ fontSize: '0.75rem', marginTop: 6 }} onClick={() => { setImage(null); setImagePreview(null); }}>
              Remove photo
            </button>
          )}
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
          Submit Report
        </button>
      </form>
    </div>
  );
}

