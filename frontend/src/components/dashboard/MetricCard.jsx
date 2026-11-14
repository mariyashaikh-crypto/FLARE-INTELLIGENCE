import React from 'react';

export default function MetricCard({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  accent = 'cyan', // 'cyan' | 'orange' | 'emerald' | 'purple'
  badge,
  badgeType = 'default'
}) {
  const accentClasses = {
    cyan: 'metric-accent-cyan',
    orange: 'metric-accent-orange',
    emerald: 'metric-accent-emerald',
    purple: 'metric-accent-purple'
  }[accent] || 'metric-accent-cyan';

  return (
    <div className={`mission-metric-card ${accentClasses}`}>
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        {Icon && (
          <div className="metric-icon-wrap">
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="metric-body">
        <div className="metric-value-row">
          <span className="metric-value">{value}</span>
          {unit && <span className="metric-unit">{unit}</span>}
        </div>
        {subtitle && <p className="metric-subtitle">{subtitle}</p>}
      </div>

      {badge && (
        <div className="metric-footer">
          <span className={`metric-badge badge-${badgeType}`}>{badge}</span>
        </div>
      )}
    </div>
  );
}
