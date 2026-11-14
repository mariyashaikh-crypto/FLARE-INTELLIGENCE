import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  LineChart as ChartIcon,
  BookOpen,
  Info,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

const EXPERIMENT_TABS = [
  { id: 'bass-ii', label: 'BASS-II', subtitle: 'Flame Spread vs Air Velocity' },
  { id: 'flex', label: 'FLEX', subtitle: 'Droplet d² Law & Cool Flames' },
  { id: 'saffire-i', label: 'SAFFIRE-I', subtitle: 'Large-Scale Fire on Cygnus' },
  { id: 'spice', label: 'SPICE', subtitle: 'Laminar Smoke Point Length' },
  { id: 'e-field', label: 'E-FIELD', subtitle: 'Ionic Wind & Soot Control' }
];

export default function ExperimentalChartsSection({
  datasets = {},
  summary = null
}) {
  const [activeTab, setActiveTab] = useState('bass-ii');
  const activeDataset = datasets[activeTab] || datasets['bass-ii'];

  const isConnected = summary?.pathExists;
  const totalCustomFiles = summary?.totalDatasetsFound ?? 0;

  // Custom cyber-tech tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <div className="tooltip-header">
            <span className="tooltip-x-val">
              {activeDataset.xLabel}: <strong>{label}</strong>
            </span>
          </div>
          <div className="tooltip-body">
            {payload.map((entry, index) => (
              <div key={index} className="tooltip-row" style={{ color: entry.color }}>
                <span className="tooltip-name">{entry.name}:</span>
                <span className="tooltip-val font-mono">{entry.value}</span>
              </div>
            ))}
            {payload[0]?.payload?.status && (
              <div className="tooltip-note">Regime: {payload[0].payload.status}</div>
            )}
            {payload[0]?.payload?.regime && (
              <div className="tooltip-note">State: {payload[0].payload.regime}</div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (!activeDataset) {
    return (
      <div className="charts-loading-box">
        <span>Loading NASA Experimental Telemetry Series...</span>
      </div>
    );
  }

  return (
    <div className="experimental-charts-section">
      <div className="section-header-row">
        <div className="header-meta">
          <div className="status-indicator-badge">
            <ChartIcon size={16} className="text-cyan" />
            <span className="mono-title">EXPERIMENTAL BENCHMARKS</span>
          </div>
          <h2 className="section-main-heading">Microgravity Combustion Flight Data</h2>
          <p className="section-subtext">
            Interactive analytical charts powered by verified, peer-reviewed NASA flight mission datasets.
          </p>
        </div>

        {/* Source Authenticity Pill */}
        <div className="source-authenticity-pill">
          <CheckCircle2 size={14} className="text-cyan" />
          <span>NASA OPEN SCIENCE BENCHMARK</span>
        </div>
      </div>

      {/* Tabs Switcher for Experiments */}
      <div className="chart-tabs-bar">
        {EXPERIMENT_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`chart-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-title">{tab.label}</span>
            <span className="tab-sub">{tab.subtitle}</span>
          </button>
        ))}
      </div>

      {/* Chart Canvas & Controls Container */}
      <div className="chart-display-card">
        <div className="chart-info-header">
          <div className="chart-title-group">
            <h3 className="chart-title">{activeDataset.title}</h3>
            <div className="chart-meta-tags">
              <span className="meta-tag">Fuel: {activeDataset.fuel}</span>
              <span className="meta-tag">Atmosphere: {activeDataset.atmosphere}</span>
              <span className="meta-tag">Platform: {activeDataset.facility}</span>
            </div>
          </div>

          <div className="dataset-status-callout">
            <span className="status-label">DATA SOURCE:</span>
            <span className="status-source">
              {totalCustomFiles > 0
                ? `${totalCustomFiles} Custom Desktop File(s) + NASA Benchmark`
                : 'NASA Glenn Published Flight Data (Desktop Folder Pending)'}
            </span>
          </div>
        </div>

        {/* Interactive Chart Viewport */}
        <div className="chart-viewport-wrap">
          <ResponsiveContainer width="100%" height={360}>
            <LineChart
              data={activeDataset.series}
              margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" />
              <XAxis
                dataKey={activeDataset.xKey}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
                label={{
                  value: activeDataset.xLabel,
                  position: 'insideBottom',
                  offset: -15,
                  fill: '#94a3b8',
                  fontSize: 12
                }}
              />
              <YAxis
                yAxisId="left"
                stroke="#00f0ff"
                tick={{ fill: '#00f0ff', fontSize: 12, fontFamily: 'monospace' }}
                label={{
                  value: activeDataset.yLabel,
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#00f0ff',
                  fontSize: 12
                }}
              />
              {activeDataset.secondaryKey && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#ff6b00"
                  tick={{ fill: '#ff6b00', fontSize: 12, fontFamily: 'monospace' }}
                  label={{
                    value: activeDataset.secondaryLabel,
                    angle: 90,
                    position: 'insideRight',
                    fill: '#ff6b00',
                    fontSize: 12
                  }}
                />
              )}
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ color: '#94a3b8', fontSize: 12 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey={activeDataset.yKey}
                name={activeDataset.yLabel}
                stroke="#00f0ff"
                strokeWidth={3}
                dot={{ r: 5, fill: '#030611', stroke: '#00f0ff', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#00f0ff', stroke: '#ffffff', strokeWidth: 2 }}
              />
              {activeDataset.secondaryKey && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey={activeDataset.secondaryKey}
                  name={activeDataset.secondaryLabel}
                  stroke="#ff6b00"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#030611', stroke: '#ff6b00', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#ff6b00', stroke: '#ffffff', strokeWidth: 2 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Scientific Source Reference Annotation */}
        <div className="chart-citation-footer">
          <div className="citation-lead">
            <BookOpen size={15} className="text-cyan" />
            <span className="citation-title">PEER-REVIEWED CITATION &amp; EXPERIMENTAL METADATA:</span>
          </div>
          <p className="citation-text">
            <strong>Reference:</strong> {activeDataset.citation}
          </p>
          <p className="citation-note">
            <em>Measurement Scope:</em> {activeDataset.sourceNote}
          </p>
        </div>
      </div>
    </div>
  );
}
