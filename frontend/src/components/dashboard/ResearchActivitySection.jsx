import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  BookMarked,
  Tag,
  Search,
  Calendar,
  UserCheck
} from 'lucide-react';

export default function ResearchActivitySection({ activities = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExp, setSelectedExp] = useState('ALL');

  const filtered = activities.filter((item) => {
    const matchesExp = selectedExp === 'ALL' || item.experiment === selectedExp;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.citation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesExp && matchesSearch;
  });

  const EXPERIMENT_FILTERS = ['ALL', 'BASS-II', 'FLEX', 'SAFFIRE-I', 'SPICE', 'E-FIELD Flames'];

  return (
    <div className="research-activity-section">
      <div className="section-header-row">
        <div className="header-meta">
          <div className="status-indicator-badge">
            <BookMarked size={16} className="text-cyan" />
            <span className="mono-title">SCHOLARLY REPOSITORY &amp; CITATIONS</span>
          </div>
          <h2 className="section-main-heading">Recent Research Activity &amp; Publications</h2>
          <p className="section-subtext">
            Peer-reviewed literature, NASA Technical Memorandums (NASA/TM), and conference proceedings
            documenting orbital microgravity combustion trials.
          </p>
        </div>

        {/* Search input */}
        <div className="activity-search-box">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search author, keyword, or report ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="activity-search-input"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="activity-filters-row">
        {EXPERIMENT_FILTERS.map((exp) => (
          <button
            key={exp}
            type="button"
            className={`filter-pill-btn ${selectedExp === exp ? 'active' : ''}`}
            onClick={() => setSelectedExp(exp)}
          >
            {exp === 'ALL' ? 'All NASA Publications' : exp}
          </button>
        ))}
      </div>

      {/* Publications Cards Grid */}
      <div className="activity-cards-grid">
        {filtered.length > 0 ? (
          filtered.map((pub) => (
            <div key={pub.id} className="publication-card">
              <div className="pub-header">
                <span className="pub-type-badge">{pub.type}</span>
                <span className="pub-exp-badge">{pub.experiment}</span>
                <span className="pub-year">
                  <Calendar size={12} /> {pub.year}
                </span>
              </div>

              <h4 className="pub-title">{pub.title}</h4>

              <div className="pub-authors">
                <UserCheck size={13} className="text-secondary" />
                <span>{pub.authors}</span>
              </div>

              <div className="pub-citation-box">
                <span className="citation-lead">SOURCE CITATION:</span>
                <p className="citation-body">{pub.citation}</p>
              </div>

              <div className="pub-footer">
                <div className="pub-doi-badge">
                  <span>ID: {pub.doi}</span>
                </div>

                <div className="pub-tags">
                  {pub.tags.map((tag, idx) => (
                    <span key={idx} className="pub-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-results-box">
            <FileText size={24} className="text-muted" />
            <p>No research records found matching &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
