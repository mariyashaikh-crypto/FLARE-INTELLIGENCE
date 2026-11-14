import React from 'react';
import { Flame, FlaskConical, Gauge, ShieldAlert, Zap } from 'lucide-react';

const EXPERIMENT_ICONS = {
  'BASS-II': Flame,
  'FLEX': FlaskConical,
  'SAFFIRE-I': ShieldAlert,
  'SPICE': Gauge,
  'E-FIELD Flames': Zap
};

const EXPERIMENT_COLORS = {
  'BASS-II': '#f97316',
  'FLEX': '#06b6d4',
  'SAFFIRE-I': '#ef4444',
  'SPICE': '#a855f7',
  'E-FIELD Flames': '#10b981'
};

export default function ExperimentCard({ experiment, onSelect }) {
  if (!experiment) return null;

  const Icon = EXPERIMENT_ICONS[experiment.name] || Flame;
  const brandColor = EXPERIMENT_COLORS[experiment.name] || '#00f0ff';

  return (
    <div
      className="mission-experiment-card"
      style={{ '--card-accent': brandColor }}
      onClick={() => onSelect && onSelect(experiment)}
    >
      <div className="card-top">
        <div className="icon-pill" style={{ color: brandColor, borderColor: `${brandColor}40` }}>
          <Icon size={20} />
        </div>
        <div className="exp-meta">
          <span className="exp-code">{experiment.id?.toUpperCase() || experiment.name}</span>
          <h3 className="exp-name">{experiment.name}</h3>
        </div>
      </div>

      <p className="exp-fullname">{experiment.fullName}</p>

      <div className="exp-section">
        <span className="section-label">PLATFORM:</span>
        <span className="section-val">{experiment.platform}</span>
      </div>

      <div className="exp-section">
        <span className="section-label">COMBUSTION REGIME:</span>
        <span className="section-val">{experiment.combustionMode}</span>
      </div>

      {experiment.fuels && experiment.fuels.length > 0 && (
        <div className="exp-fuels">
          <span className="section-label">TARGET FUELS:</span>
          <div className="fuel-tags">
            {experiment.fuels.slice(0, 3).map((fuel, idx) => (
              <span key={idx} className="fuel-tag">
                {typeof fuel === 'string' ? fuel : fuel.name}
              </span>
            ))}
            {experiment.fuels.length > 3 && (
              <span className="fuel-tag more">+{experiment.fuels.length - 3}</span>
            )}
          </div>
        </div>
      )}

      <p className="exp-desc">{experiment.scientificObjective}</p>
    </div>
  );
}
