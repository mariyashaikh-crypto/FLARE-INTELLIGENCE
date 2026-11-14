import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  BookOpen,
  FileText,
  Sparkles,
  Layers,
  Gauge,
  Tag,
  Copy,
  Check,
  ExternalLink,
  Flame,
  Orbit,
  ArrowUpDown
} from 'lucide-react';
import { COMBUSTION_METRICS } from '../../constants/combustionConstants.js';

export default function SearchView({
  experiments = {},
  experimentalData = {},
  highlights = [],
  activities = [],
  summary = null
}) {
  const [query, setQuery] = useState('');
  const [selectedExp, setSelectedExp] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('relevance');
  const [copiedId, setCopiedId] = useState(null);

  // Build searchable index from all real backend data
  const searchIndex = useMemo(() => {
    const items = [];

    // 1. Experiment metadata items
    Object.values(experiments).forEach((exp) => {
      items.push({
        id: `exp-${exp.id || exp.name}`,
        category: 'Experiment Catalog',
        categoryKey: 'EXPERIMENTS',
        title: `${exp.name}: ${exp.fullName || ''}`,
        experiment: exp.name?.split(' / ')[0] || exp.name,
        facility: exp.platform || 'ISS Orbital Facility',
        snippet: exp.scientificObjective || exp.combustionMode,
        details: [
          `Facility Code: ${exp.facilityCode || 'ISS'}`,
          `Combustion Mode: ${exp.combustionMode}`,
          `Status: ${exp.status}`
        ],
        tags: [
          exp.name,
          exp.facilityCode || 'ISS',
          ...(exp.fuels?.map((f) => (typeof f === 'string' ? f : f.name)) || [])
        ],
        citation: `NASA Flame in Freefall Program: ${exp.fullName} (${exp.facilityCode})`,
        year: 2014
      });
    });

    // 2. Published benchmark experimental series
    Object.entries(experimentalData).forEach(([key, ds]) => {
      items.push({
        id: `dataset-${key}`,
        category: 'Flight Telemetry Benchmark',
        categoryKey: 'BENCHMARKS',
        title: `${ds.title} (${ds.experimentId})`,
        experiment: ds.experimentId,
        facility: ds.facility,
        snippet: ds.sourceNote,
        details: [
          `Tested Fuel: ${ds.fuel}`,
          `Atmosphere: ${ds.atmosphere}`,
          `Data Points: ${ds.series?.length || 0} flight measurements`
        ],
        tags: [ds.experimentId, 'Flight Data', ds.fuel, 'Benchmark'],
        citation: ds.citation,
        year: 2016
      });
    });

    // 3. Research highlights & breakthroughs
    highlights.forEach((h) => {
      items.push({
        id: `highlight-${h.id}`,
        category: 'Scientific Breakthrough',
        categoryKey: 'HIGHLIGHTS',
        title: h.title,
        experiment: h.experiment,
        facility: h.facility,
        snippet: h.summary,
        details: [
          `Lead Investigator: ${h.leadScientist}`,
          `Impact: ${h.impact}`,
          `Category Badge: ${h.badge}`
        ],
        tags: [h.experiment, h.badge, 'Milestone', h.year],
        citation: `${h.title}. Led by ${h.leadScientist} (${h.facility}).`,
        year: parseInt(h.year) || 2015
      });
    });

    // 4. Scholarly publications & citations
    activities.forEach((act) => {
      items.push({
        id: `activity-${act.id}`,
        category: 'Peer-Reviewed Publication',
        categoryKey: 'PUBLICATIONS',
        title: act.title,
        experiment: act.experiment,
        facility: act.type,
        snippet: act.citation,
        details: [
          `Authors: ${act.authors}`,
          `Publication Type: ${act.type}`,
          `Identifier: ${act.doi}`
        ],
        tags: [act.experiment, ...(act.tags || []), act.type],
        citation: `${act.authors}. "${act.title}." ${act.citation}. DOI: ${act.doi}`,
        year: act.year || 2018,
        doi: act.doi
      });
    });

    // 5. Diagnostic combustion parameters
    Object.entries(COMBUSTION_METRICS).forEach(([key, metric]) => {
      items.push({
        id: `param-${key}`,
        category: 'Diagnostic Standard',
        categoryKey: 'METRICS',
        title: `${metric.label} [${metric.unit}]`,
        experiment: 'Cross-Program Standard',
        facility: 'Physical Science Standards',
        snippet: metric.description,
        details: [`Standard Unit: ${metric.unit}`, `Application: NASA Freefall Combustion Evaluation`],
        tags: ['Diagnostic Metric', metric.unit, 'Physics'],
        citation: `NASA Glenn Microgravity Combustion Standard Metric: ${metric.label}`,
        year: 2020
      });
    });

    return items;
  }, [experiments, experimentalData, highlights, activities]);

  // Filter and sort
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    const matches = searchIndex.filter((item) => {
      // 1. Filter by experiment
      if (selectedExp !== 'ALL') {
        const itemExp = item.experiment?.toLowerCase() || '';
        const matchExp = selectedExp.toLowerCase();
        if (!itemExp.includes(matchExp) && !matchExp.includes(itemExp)) {
          return false;
        }
      }

      // 2. Filter by category
      if (selectedCategory !== 'ALL' && item.categoryKey !== selectedCategory) {
        return false;
      }

      // 3. Search query
      if (!q) return true;

      const titleMatch = item.title?.toLowerCase().includes(q);
      const snippetMatch = item.snippet?.toLowerCase().includes(q);
      const citationMatch = item.citation?.toLowerCase().includes(q);
      const tagMatch = item.tags?.some((t) => t?.toLowerCase().includes(q));
      const detailsMatch = item.details?.some((d) => d?.toLowerCase().includes(q));

      return titleMatch || snippetMatch || citationMatch || tagMatch || detailsMatch;
    });

    // Sort
    return matches.sort((a, b) => {
      if (sortBy === 'year-desc') return (b.year || 0) - (a.year || 0);
      if (sortBy === 'year-asc') return (a.year || 0) - (b.year || 0);
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
      return 0; // relevance preserves default index order
    });
  }, [searchIndex, query, selectedExp, selectedCategory, sortBy]);

  const copyCitation = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const SUGGESTED_QUERIES = [
    'Cool flames',
    'Radiative quenching',
    'SIBAL fabric',
    'Ionic wind',
    'Smoke point',
    'NASA-STD-6001',
    'PMMA'
  ];

  return (
    <div className="research-search-view">
      {/* Search Header Banner */}
      <div className="view-banner-header">
        <div className="banner-left">
          <div className="status-indicator-badge">
            <Search size={16} className="text-cyan" />
            <span className="mono-title">CENTRAL REPOSITORY SEARCH</span>
          </div>
          <h1 className="view-main-title">Combustion Research Search</h1>
          <p className="view-subtext">
            Query across flight telemetry records, peer-reviewed publications, technical memorandums, fuel matrices, and NASA microgravity experimental standards.
          </p>
        </div>

        <div className="banner-right">
          <div className="repo-pill">
            <Layers size={14} className="text-cyan" />
            <span>{searchIndex.length} INDEXED SCIENTIFIC RECORDS</span>
          </div>
        </div>
      </div>

      {/* Main Search Control Bar */}
      <div className="search-control-card">
        <div className="search-input-wrapper">
          <Search size={18} className="search-lead-icon" />
          <input
            type="text"
            className="main-search-input"
            placeholder="Search experiments, fuels, author names, DOIs, parameters, or phenomena (e.g. 'droplet', 'cool flame')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setQuery('')}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Suggested Quick Search Pills */}
        <div className="suggested-queries-row">
          <span className="suggested-label">SUGGESTED TOPICS:</span>
          {SUGGESTED_QUERIES.map((sq) => (
            <button
              key={sq}
              type="button"
              className={`suggestion-pill ${query.toLowerCase() === sq.toLowerCase() ? 'active' : ''}`}
              onClick={() => setQuery(sq)}
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Facet Filters & Sort Options Row */}
        <div className="search-filter-controls">
          <div className="filter-group">
            <span className="filter-label">PROGRAM:</span>
            <select
              value={selectedExp}
              onChange={(e) => setSelectedExp(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Programs (5 Core)</option>
              <option value="BASS-II">BASS-II</option>
              <option value="FLEX">FLEX / FLEX-2</option>
              <option value="SAFFIRE-I">SAFFIRE-I</option>
              <option value="SPICE">SPICE</option>
              <option value="E-FIELD">E-FIELD Flames</option>
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">CATEGORY:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Resource Types</option>
              <option value="PUBLICATIONS">Peer-Reviewed Publications</option>
              <option value="BENCHMARKS">Flight Telemetry Benchmarks</option>
              <option value="HIGHLIGHTS">Scientific Breakthroughs</option>
              <option value="EXPERIMENTS">Experiment Catalog</option>
              <option value="METRICS">Diagnostic Metrics</option>
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="relevance">Relevance</option>
              <option value="year-desc">Year (Newest First)</option>
              <option value="year-asc">Year (Oldest First)</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>
          </div>

          <div className="filter-summary-count">
            <span>SHOWING <strong>{filteredResults.length}</strong> OF {searchIndex.length} RECORDS</span>
          </div>
        </div>
      </div>

      {/* Search Results Display Area */}
      <div className="search-results-list">
        {filteredResults.length > 0 ? (
          filteredResults.map((item) => (
            <div key={item.id} className="search-result-card">
              <div className="result-header">
                <div className="badge-row">
                  <span className={`category-chip cat-${item.categoryKey.toLowerCase()}`}>
                    {item.category}
                  </span>
                  <span className="exp-chip">{item.experiment}</span>
                  {item.year && <span className="year-chip">{item.year}</span>}
                </div>

                {item.doi && (
                  <div className="doi-badge" title="Digital Object Identifier">
                    <span>ID: {item.doi}</span>
                  </div>
                )}
              </div>

              <h3 className="result-title">{item.title}</h3>
              <p className="result-snippet">{item.snippet}</p>

              {/* Detail bullet chips */}
              {item.details && item.details.length > 0 && (
                <div className="result-details-row">
                  {item.details.map((detail, idx) => (
                    <span key={idx} className="detail-chip">
                      {detail}
                    </span>
                  ))}
                </div>
              )}

              {/* Tag Cloud */}
              {item.tags && item.tags.length > 0 && (
                <div className="result-tags-row">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="tag-pill">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Citation & Action Footer */}
              <div className="result-footer">
                <div className="citation-preview">
                  <BookOpen size={13} className="text-secondary" />
                  <span className="citation-text-line">{item.citation}</span>
                </div>

                <button
                  type="button"
                  className={`copy-citation-btn ${copiedId === item.id ? 'copied' : ''}`}
                  onClick={() => copyCitation(item.citation, item.id)}
                  title="Copy full academic citation to clipboard"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check size={13} />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy Citation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-search-state">
            <Search size={36} className="empty-icon" />
            <h3 className="empty-title">No matching combustion records found</h3>
            <p className="empty-desc">
              No scientific records match &quot;<strong>{query}</strong>&quot; with the selected filters.
            </p>
            <div className="empty-tips">
              <span>Tips:</span>
              <ul>
                <li>Check your spelling or try broader terms like &quot;diffusion&quot; or &quot;flame&quot;</li>
                <li>Reset the Program or Category filter to &quot;All&quot;</li>
                <li>Try searching by fuel name: PMMA, Heptane, Methane, or SIBAL</li>
              </ul>
            </div>
            <button
              type="button"
              className="reset-filters-btn"
              onClick={() => {
                setQuery('');
                setSelectedExp('ALL');
                setSelectedCategory('ALL');
              }}
            >
              Reset Search &amp; Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
