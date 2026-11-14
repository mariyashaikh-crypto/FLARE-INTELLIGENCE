import React, { useState } from 'react';
import {
  Sparkles,
  FlaskConical,
  Flame,
  ShieldCheck,
  Zap,
  Gauge,
  Award,
  BookOpen
} from 'lucide-react';

export default function ResearchHighlights({ highlights = [] }) {
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const filteredHighlights = selectedFilter === 'ALL'
    ? highlights
    : highlights.filter((h) => h.experiment.toUpperCase().includes(selectedFilter));

  const FILTERS = [
    { id: 'ALL', label: 'All Highlights' },
    { id: 'FLEX', label: 'FLEX (Cool Flames)' },
    { id: 'BASS', label: 'BASS-II (Solid Extinction)' },
    { id: 'SAFFIRE', label: 'SAFFIRE-I (Spacecraft Fire)' },
    { id: 'SPICE', label: 'SPICE (Sooting)' },
    { id: 'E-FIELD', label: 'E-FIELD (Ionic Wind)' }
  ];

  return (
    <div className="research-highlights-section">
      <div className="section-header-row">
        <div className="header-meta">
          <div className="status-indicator-badge">
            <Sparkles size={16} className="text-orange" />
            <span className="mono-title">SCIENTIFIC BREAKTHROUGHS</span>
          </div>
          <h2 className="section-main-heading">Combustion Research Highlights</h2>
          <p className="section-subtext">
            Key empirical discoveries and microgravity combustion milestones achieved across NASA orbital missions.
          </p>
        </div>

        {/* Category Filters */}
        <div className="highlights-filter-bar">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter-btn ${selectedFilter === f.id ? 'active' : ''}`}
              onClick={() => setSelectedFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="highlights-grid">
        {filteredHighlights.length > 0 ? (
          filteredHighlights.map((item) => (
          <div key={item.id} className="highlight-card">
            <div className="highlight-card-top">
              <span className="exp-badge">{item.experiment}</span>
              <span className="category-badge">{item.badge}</span>
              <span className="year-pill">{item.year}</span>
            </div>

            <h3 className="highlight-title">{item.title}</h3>

            <div className="highlight-scientists">
              <Award size={14} className="text-cyan" />
              <span>{item.leadScientist}</span>
              <span className="facility-dot">•</span>
              <span className="facility-name">{item.facility}</span>
            </div>

            <p className="highlight-summary">{item.summary}</p>

            <div className="impact-box">
              <span className="impact-label">AEROSPACE &amp; SCIENTIFIC IMPACT:</span>
              <p className="impact-text">{item.impact}</p>
            </div>
          </div>
        ))
        ) : (
          <div className="empty-results-box">
            <Sparkles size={24} className="text-muted" />
            <p>No highlights found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
