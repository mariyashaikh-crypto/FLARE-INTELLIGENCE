import React from 'react';
import {
  Flame,
  Search,
  GitCompare,
  Zap,
  Orbit,
  ShieldAlert,
  History,
  Layers,
  Construction
} from 'lucide-react';

const TAB_CONFIGS = {
  experiments: {
    title: 'Experiments Deep Dive',
    subtitle: 'Detailed telemetry, run history, and sample matrices for BASS-II, FLEX, SAFFIRE-I, SPICE, and E-FIELD.',
    icon: Flame,
    color: '#ff6b00',
    tags: ['ISS Science Glovebox', 'CIR / MDCA', 'Cygnus Vehicle', 'ACME Rack'],
    scope: 'In-depth breakdown of solid flame spread, spherical droplet extinction, and gaseous smoke points.'
  },
  search: {
    title: 'Combustion Research Search',
    subtitle: 'Query experiment logs, fuel formulations, and microgravity combustion literature.',
    icon: Search,
    color: '#00f0ff',
    tags: ['Full-text indexing', 'Fuel Filters', 'ISS Expedition Runs'],
    scope: 'Search across NASA combustion datasets, test matrices, and thermal imaging annotations.'
  },
  compare: {
    title: 'Comparative Flammability Analysis',
    subtitle: 'Side-by-side parametric comparison across microgravity vs 1g terrestrial conditions.',
    icon: GitCompare,
    color: '#a855f7',
    tags: ['1g vs 0g Burn Rates', 'Quenching Boundaries', 'Oxygen Index Comparison'],
    scope: 'Evaluate how the absence of buoyant plume convection alters extinction diameters and flame geometry.'
  },
  'electric-field': {
    title: 'Electric Field & Ionic Wind Analysis',
    subtitle: 'E-FIELD Flames experiment telemetry: High-voltage DC modulation of diffusion flames.',
    icon: Zap,
    color: '#10b981',
    tags: ['±10 kV Applied Potential', 'Ionic Current Density', 'Soot Suppression'],
    scope: 'Investigating electric body forces on weakly ionized flame gases to manipulate flame stability and carbon soot.'
  },
  'gravity-analysis': {
    title: 'Gravity Level Sensitivity & Buoyancy Analysis',
    subtitle: 'Evaluation of Richardson and Grashof numbers across microgravity, Lunar (0.16g), and Martian (0.38g) regimes.',
    icon: Orbit,
    color: '#38bdf8',
    tags: ['Microgravity 10⁻⁴g', 'Drop Tower 10⁻⁶g', 'Variable Gravity Scaling'],
    scope: 'Modeling non-buoyant diffusion and low-speed forced convection in partial-gravity space environments.'
  },
  'fire-safety': {
    title: 'Spacecraft Fire Safety & Flammability Limits',
    subtitle: 'SAFFIRE and BASS-II spacecraft fire safety standards and extinction criteria.',
    icon: ShieldAlert,
    color: '#ef4444',
    tags: ['NASA-STD-6001', 'SIBAL Fabric', 'Hypobaric Cabin Atmospheres', 'Extinction Limits'],
    scope: 'Fire growth models for crewed spacecraft modules, low-velocity duct ventilation, and suppression protocols.'
  },
  incidents: {
    title: 'Historical Spaceflight Fire Incidents',
    subtitle: 'Chronicle and scientific analysis of combustion and thermal incidents in crewed space missions.',
    icon: History,
    color: '#f59e0b',
    tags: ['Mir Station 1997 Kvant-1', 'Apollo 1 Analysis', 'Oxygen Candle Chemistry'],
    scope: 'Lessons learned, forensic combustion physics, and safety evolution for Artemis and deep-space transit.'
  }
};

export default function PlaceholderView({ viewId = 'experiments' }) {
  const config = TAB_CONFIGS[viewId] || {
    title: 'Module Telemetry',
    subtitle: 'NASA Flame in Freefall Intelligence subsystem.',
    icon: Layers,
    color: '#00f0ff',
    tags: ['Telemetry Subsystem'],
    scope: 'Microgravity combustion analytics module.'
  };

  const Icon = config.icon;

  return (
    <div className="placeholder-view">
      <div className="module-banner" style={{ '--mod-color': config.color }}>
        <div className="mod-icon">
          <Icon size={32} />
        </div>
        <div className="mod-text">
          <div className="status-chip">
            <span className="dot" />
            <span>MODULE INITIALIZED • AWAITING DATA STREAM</span>
          </div>
          <h1 className="mod-title">{config.title}</h1>
          <p className="mod-subtitle">{config.subtitle}</p>
        </div>
      </div>

      <div className="module-card">
        <div className="card-heading">
          <Construction size={18} className="warn-icon" />
          <h3>Scientific Scope & Analytical Objectives</h3>
        </div>
        <p className="scope-text">{config.scope}</p>

        <div className="tags-row">
          {config.tags.map((tag, idx) => (
            <span key={idx} className="spec-tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="telemetry-box">
          <span className="box-title">SYSTEM STATUS NOTE:</span>
          <p>
            This module will automatically hydrate with analytical charts and data tables when
            corresponding experiment datasets (<code className="ext">.csv</code>,{' '}
            <code className="ext">.json</code>) are placed in your desktop folder{' '}
            <code>Desktop/FLARE_INTELLIGENCE_DATA</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
