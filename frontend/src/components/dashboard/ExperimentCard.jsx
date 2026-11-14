import React, { useState } from 'react';
import {
  Flame,
  FlaskConical,
  Gauge,
  ShieldAlert,
  Zap,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const EXPERIMENT_ICONS = {
  'BASS-II': Flame,
  'FLEX': FlaskConical,
  'FLEX / FLEX-2': FlaskConical,
  'SAFFIRE-I': ShieldAlert,
  'SPICE': Gauge,
  'E-FIELD Flames': Zap
};

const EXPERIMENT_COLORS = {
  'BASS-II': '#f97316',
  'FLEX': '#06b6d4',
  'FLEX / FLEX-2': '#06b6d4',
  'SAFFIRE-I': '#ef4444',
  'SPICE': '#a855f7',
  'E-FIELD Flames': '#10b981'
};

export default function ExperimentCard({ experiment, fileCount = 0 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!experiment) return null;

  const Icon = EXPERIMENT_ICONS[experiment.name] || Flame;
  const brandColor = EXPERIMENT_COLORS[experiment.name] || '#00f0ff';
  const hasLocalFiles = fileCount > 0;

  return (
    <div
      className={`mission-experiment-card ${isExpanded ? 'card-expanded' : ''}`}
      style={{ '--card-accent': brandColor }}
    >
      <div className="card-top">
        <div className="icon-pill" style={{ color: brandColor, borderColor: `${brandColor}40` }}>
          <Icon size={20} />
        </div>
        <div className="exp-meta">
          <span className="exp-code">{experiment.facilityCode || experiment.id?.toUpperCase()}</span>
          <h3 className="exp-name">{experiment.name}</h3>
        </div>
        <div className="exp-status-chip" style={{ color: brandColor, borderColor: `${brandColor}30` }}>
          {experiment.status || 'Active Science'}
        </div>
      </div>

      <p className="exp-fullname">{experiment.fullName}</p>

      {/* Primary specs preview */}
      <div className="exp-section">
        <span className="section-label">PLATFORM / FACILITY:</span>
        <span className="section-val">{experiment.platform}</span>
      </div>

      <div className="exp-section">
        <span className="section-label">COMBUSTION REGIME:</span>
        <span className="section-val">{experiment.combustionMode}</span>
      </div>

      {/* Live Files Indicator */}
      <div className="live-files-row">
        <span className="section-label">DATASET STATUS:</span>
        <span className={`file-status-indicator ${hasLocalFiles ? 'text-emerald' : 'text-muted'}`}>
          <FileSpreadsheet size={13} />
          {hasLocalFiles ? `${fileCount} Desktop File(s) Detected` : '0 Desktop Files (Benchmark Active)'}
        </span>
      </div>

      {/* Fuel list */}
      {experiment.fuels && experiment.fuels.length > 0 && (
        <div className="exp-fuels">
          <span className="section-label">TARGET FUELS &amp; MATERIALS:</span>
          <div className="fuel-tags">
            {experiment.fuels.map((fuel, idx) => (
              <span key={idx} className="fuel-tag">
                {typeof fuel === 'string' ? fuel : fuel.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Expandable Technical Details Drawer */}
      {isExpanded && (
        <div className="exp-expanded-drawer">
          {experiment.keyParameters && (
            <div className="drawer-section">
              <span className="section-label">KEY MEASURED PARAMETERS:</span>
              <ul className="parameters-list">
                {experiment.keyParameters.map((param, idx) => (
                  <li key={idx} className="param-item">
                    <span className="param-bullet" style={{ backgroundColor: brandColor }} />
                    <span>{param}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="drawer-section">
            <span className="section-label">SCIENTIFIC OBJECTIVE:</span>
            <p className="objective-text">{experiment.scientificObjective}</p>
          </div>
        </div>
      )}

      {/* Card Action Toggle */}
      <button
        type="button"
        className="card-expand-btn"
        onClick={() => setIsExpanded((prev) => !prev)}
        style={{ color: brandColor }}
      >
        <span>{isExpanded ? 'Hide Technical Matrix' : 'View Full Parameter Matrix'}</span>
        {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
    </div>
  );
}
