import React, { useState } from 'react';
import {
  Flame,
  FlaskConical,
  ShieldAlert,
  Gauge,
  Zap,
  Layers,
  Orbit,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Microscope,
  Cpu,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const EXPERIMENT_ICONS = {
  'bass-ii': Flame,
  'flex': FlaskConical,
  'saffire-i': ShieldAlert,
  'spice': Gauge,
  'e-field': Zap
};

const EXPERIMENT_KEYS = [
  { id: 'bass-ii', name: 'BASS-II', label: 'BASS-II (Solid Spread)', color: '#f97316' },
  { id: 'flex', name: 'FLEX', label: 'FLEX / FLEX-2 (Cool Flames)', color: '#06b6d4' },
  { id: 'saffire-i', name: 'SAFFIRE-I', label: 'SAFFIRE-I (Spacecraft Fire)', color: '#ef4444' },
  { id: 'spice', name: 'SPICE', label: 'SPICE (Laminar Smoke Points)', color: '#a855f7' },
  { id: 'e-field', name: 'E-FIELD Flames', label: 'E-FIELD Flames (Ionic Wind)', color: '#10b981' }
];

export default function ExperimentsView({
  experiments = {},
  experimentalData = {},
  activities = [],
  summary = null
}) {
  const [activeExpId, setActiveExpId] = useState('bass-ii');

  // Find metadata: either by exact key, id match, or designation substring
  const expMetadata =
    experiments[activeExpId] ||
    Object.values(experiments).find(
      (e) =>
        e.id === activeExpId ||
        e.id === `${activeExpId}-flames` ||
        e.name?.toLowerCase().includes(activeExpId.toLowerCase()) ||
        (activeExpId === 'e-field' && (e.name?.toLowerCase().includes('e-field') || e.id?.includes('e-field')))
    ) || {
      name: activeExpId.toUpperCase(),
      fullName: 'NASA Microgravity Combustion Experiment',
      platform: 'International Space Station (ISS)',
      facilityCode: 'NASA-EXP',
      combustionMode: 'Microgravity Combustion Science',
      status: 'Mission Complete / Open Science',
      fuels: [],
      keyParameters: [],
      scientificObjective: 'Investigate fundamental combustion kinetics without buoyant acceleration.'
    };

  const chartDataset = experimentalData[activeExpId];
  const experimentsCount = summary?.experimentsCount || {};
  const localFileCount =
    experimentsCount[expMetadata.name] ??
    experimentsCount[expMetadata.name?.split(' / ')[0]] ??
    0;

  // Filter activities for this experiment across all 5 programs
  const relatedActivities = activities.filter((act) => {
    const actExp = (act.experiment || '').toLowerCase();
    const curId = activeExpId.toLowerCase();
    return (
      actExp.includes(curId) ||
      (curId === 'e-field' && actExp.includes('e-field')) ||
      (curId === 'saffire-i' && actExp.includes('saffire')) ||
      (curId === 'bass-ii' && actExp.includes('bass')) ||
      (curId === 'flex' && actExp.includes('flex')) ||
      (curId === 'spice' && actExp.includes('spice'))
    );
  });

  const activeColor =
    EXPERIMENT_KEYS.find((k) => k.id === activeExpId)?.color || '#00f0ff';
  const Icon = EXPERIMENT_ICONS[activeExpId] || Flame;

  return (
    <div className="experiments-deep-dive-view">
      {/* Page Title & Navigation Banner */}
      <div className="view-banner-header">
        <div className="banner-left">
          <div className="status-indicator-badge">
            <Microscope size={16} className="text-cyan" />
            <span className="mono-title">NASA FLIGHT PROGRAM ARCHIVE</span>
          </div>
          <h1 className="view-main-title">Core Combustion Experiments</h1>
          <p className="view-subtext">
            Comprehensive technical profiles, combustion facilities, test matrices, and peer-reviewed benchmark datasets for NASA&apos;s Flame in Freefall research.
          </p>
        </div>

        <div className="banner-right">
          <div className="repo-pill">
            <Orbit size={14} className="text-cyan" />
            <span>5 ORBITAL MISSIONS CATALOGED</span>
          </div>
        </div>
      </div>

      {/* Experiment Selector Bar */}
      <div className="experiment-nav-tabs">
        {EXPERIMENT_KEYS.map((k) => {
          const TabIcon = EXPERIMENT_ICONS[k.id] || Flame;
          const isActive = activeExpId === k.id;
          return (
            <button
              key={k.id}
              type="button"
              className={`exp-nav-tab ${isActive ? 'active' : ''}`}
              style={{ '--tab-color': k.color }}
              onClick={() => setActiveExpId(k.id)}
            >
              <TabIcon size={18} className="tab-icon" />
              <div className="tab-text-wrap">
                <span className="tab-name">{k.name}</span>
                <span className="tab-detail">{k.label.split('(')[1]?.replace(')', '') || 'Experiment'}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Experiment Main Profile Card */}
      <div
        className="experiment-profile-card"
        style={{ '--accent-color': activeColor }}
      >
        <div className="profile-top-bar">
          <div className="profile-identity">
            <div className="profile-icon-box">
              <Icon size={28} />
            </div>
            <div>
              <div className="identity-tags">
                <span className="facility-tag">{expMetadata.facilityCode || 'NASA-ISS'}</span>
                <span className="status-tag">{expMetadata.status || 'Archived Flight Science'}</span>
              </div>
              <h2 className="profile-title">{expMetadata.fullName || expMetadata.name}</h2>
              <span className="profile-subtitle">Short Designation: <strong>{expMetadata.name}</strong></span>
            </div>
          </div>

          <div className="dataset-telemetry-badge">
            <span className="telemetry-label">DESKTOP DATASET STATUS</span>
            <div className={`telemetry-val ${localFileCount > 0 ? 'text-emerald' : 'text-orange'}`}>
              <FileSpreadsheet size={14} />
              <span>{localFileCount > 0 ? `${localFileCount} Files Connected` : '0 Files (Published Benchmark Active)'}</span>
            </div>
          </div>
        </div>

        {/* Technical Specification Matrix Grid */}
        <div className="specs-matrix-grid">
          <div className="spec-card">
            <span className="spec-label">ORBITAL PLATFORM &amp; FACILITY</span>
            <span className="spec-value text-pure">{expMetadata.platform}</span>
            <p className="spec-desc">Microgravity enclosure providing isolated thermal and atmosphere boundaries.</p>
          </div>

          <div className="spec-card">
            <span className="spec-label">COMBUSTION REGIME &amp; PHYSICS</span>
            <span className="spec-value text-cyan">{expMetadata.combustionMode}</span>
            <p className="spec-desc">Physical mechanism governed by pure diffusion and forced convection without buoyant flow.</p>
          </div>

          <div className="spec-card">
            <span className="spec-label">BENCHMARK DATA SERIES</span>
            <span className="spec-value text-orange">
              {chartDataset ? `${chartDataset.series.length} Flight Data Points` : 'Cataloged Reference Series'}
            </span>
            <p className="spec-desc">
              {chartDataset?.citation || 'Peer-reviewed NASA Glenn Research Center Technical Memorandums.'}
            </p>
          </div>
        </div>

        {/* Scientific Objective Callout */}
        <div className="objective-callout-box">
          <div className="box-header">
            <BookOpen size={16} className="text-cyan" />
            <span className="box-title">PRIMARY SCIENTIFIC OBJECTIVE:</span>
          </div>
          <p className="box-body">{expMetadata.scientificObjective}</p>
        </div>

        {/* Two-Column Deep Breakdown: Fuels & Parameter Matrix */}
        <div className="technical-breakdown-row">
          {/* Target Fuels & Materials */}
          <div className="breakdown-card">
            <div className="breakdown-header">
              <Layers size={16} className="text-orange" />
              <h3>Target Fuels &amp; Materials Tested</h3>
            </div>
            <div className="fuels-list">
              {Array.isArray(expMetadata.fuels) && expMetadata.fuels.length > 0 ? (
                expMetadata.fuels.map((fuel, idx) => {
                  const fuelName = typeof fuel === 'string' ? fuel : fuel.name;
                  const fuelType = typeof fuel === 'object' ? fuel.type : 'Combustion Test Sample';
                  return (
                    <div key={idx} className="fuel-item-row">
                      <div className="fuel-bullet" />
                      <div className="fuel-info">
                        <span className="fuel-name">{fuelName}</span>
                        <span className="fuel-type">{fuelType}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-subtext">Solid fuels, composite fabrics, and liquid hydrocarbons.</div>
              )}
            </div>
          </div>

          {/* Key Measured Parameters & Extinction Limits */}
          <div className="breakdown-card">
            <div className="breakdown-header">
              <Cpu size={16} className="text-cyan" />
              <h3>Measured Variables &amp; Diagnostic Matrix</h3>
            </div>
            <div className="parameters-list-wrap">
              {Array.isArray(expMetadata.keyParameters) && expMetadata.keyParameters.length > 0 ? (
                expMetadata.keyParameters.map((param, idx) => (
                  <div key={idx} className="param-item-row">
                    <span className="param-index">0{idx + 1}</span>
                    <span className="param-name">{param}</span>
                  </div>
                ))
              ) : (
                <div className="empty-subtext">Flame spread velocity, heat flux, oxygen index, and extinction thresholds.</div>
              )}
            </div>
          </div>
        </div>

        {/* Benchmark Analytical Chart for This Experiment */}
        {chartDataset && chartDataset.series && (
          <div className="profile-chart-section">
            <div className="chart-header-row">
              <div>
                <span className="chart-tag">FLIGHT TELEMETRY BENCHMARK</span>
                <h4 className="chart-heading">{chartDataset.title}</h4>
                <p className="chart-sub">
                  Fuel: <strong>{chartDataset.fuel}</strong> | Atmosphere: <strong>{chartDataset.atmosphere}</strong>
                </p>
              </div>

              <div className="source-pill">
                <CheckCircle2 size={13} className="text-cyan" />
                <span>NASA Open Science Verified Data</span>
              </div>
            </div>

            <div className="chart-canvas-wrap">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={chartDataset.series}
                  margin={{ top: 15, right: 25, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" />
                  <XAxis
                    dataKey={chartDataset.xKey}
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                    label={{
                      value: chartDataset.xLabel,
                      position: 'insideBottom',
                      offset: -12,
                      fill: '#94a3b8',
                      fontSize: 11
                    }}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke={activeColor}
                    tick={{ fill: activeColor, fontSize: 11, fontFamily: 'monospace' }}
                    label={{
                      value: chartDataset.yLabel,
                      angle: -90,
                      position: 'insideLeft',
                      fill: activeColor,
                      fontSize: 11
                    }}
                  />
                  {chartDataset.secondaryKey && (
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#ff6b00"
                      tick={{ fill: '#ff6b00', fontSize: 11, fontFamily: 'monospace' }}
                      label={{
                        value: chartDataset.secondaryLabel,
                        angle: 90,
                        position: 'insideRight',
                        fill: '#ff6b00',
                        fontSize: 11
                      }}
                    />
                  )}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a1122',
                      borderColor: 'rgba(0, 240, 255, 0.3)',
                      color: '#f8fafc',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Legend verticalAlign="top" height={32} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey={chartDataset.yKey}
                    name={chartDataset.yLabel}
                    stroke={activeColor}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#030611', stroke: activeColor, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  {chartDataset.secondaryKey && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey={chartDataset.secondaryKey}
                      name={chartDataset.secondaryLabel}
                      stroke="#ff6b00"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3, fill: '#030611', stroke: '#ff6b00', strokeWidth: 1.5 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-citation-box">
              <Info size={14} className="text-secondary" />
              <span>Citation: {chartDataset.citation} — <em>{chartDataset.sourceNote}</em></span>
            </div>
          </div>
        )}

        {/* Peer-Reviewed Publications for this Experiment */}
        <div className="related-literature-section">
          <div className="literature-header">
            <BookOpen size={16} className="text-cyan" />
            <h3>Related Peer-Reviewed Publications &amp; Technical Memorandums</h3>
          </div>

          <div className="literature-grid">
            {relatedActivities.length > 0 ? (
              relatedActivities.map((item) => (
                <div key={item.id} className="literature-card">
                  <div className="lit-top">
                    <span className="lit-type">{item.type}</span>
                    <span className="lit-year">{item.year}</span>
                  </div>
                  <h4 className="lit-title">{item.title}</h4>
                  <p className="lit-authors">Authors: {item.authors}</p>
                  <p className="lit-citation">{item.citation}</p>
                  <div className="lit-bottom">
                    <span className="lit-doi">DOI: {item.doi}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="literature-card">
                <span className="lit-type">NASA Open Science</span>
                <h4 className="lit-title">Peer-Reviewed Mission Flight Reports</h4>
                <p className="lit-citation">
                  Mission dataset and flight reports indexed in NASA Technical Reports Server (NTRS) and Physical Sciences Informatics (PSI).
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
