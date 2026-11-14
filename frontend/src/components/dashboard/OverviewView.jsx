import React from 'react';
import {
  Flame,
  Orbit,
  Layers,
  Database,
  ShieldCheck,
  Zap,
  Activity,
  Compass
} from 'lucide-react';
import MetricCard from './MetricCard.jsx';
import ExperimentCard from './ExperimentCard.jsx';
import DatasetStatusBanner from './DatasetStatusBanner.jsx';
import OverviewHeroSection from './OverviewHeroSection.jsx';
import { COMBUSTION_METRICS } from '../../constants/combustionConstants.js';

export default function OverviewView({
  experiments = {},
  summary = null,
  health = null,
  loading = false,
  onRefresh = () => {},
  onSelectExperiment = () => {}
}) {
  const experimentList = Object.values(experiments);
  const totalDatasets = summary?.totalDatasetsFound ?? 0;
  const isConnected = summary?.pathExists;

  return (
    <div className="overview-view">
      {/* 3D Interactive Earth Hero Section */}
      <OverviewHeroSection
        summary={summary}
        onExplorePrograms={onSelectExperiment}
      />

      {/* Top Telemetry KPI Row */}
      <div className="kpi-grid">
        <MetricCard
          title="ACTIVE NASA PROGRAMS"
          value="5"
          unit="Experiments"
          subtitle="BASS-II, FLEX, SAFFIRE, SPICE, E-FIELD"
          icon={Flame}
          accent="orange"
          badge="Active Science"
          badgeType="accent"
        />

        <MetricCard
          title="MICROGRAVITY PLATFORMS"
          value="3"
          unit="Orbital Facilities"
          subtitle="ISS Glovebox, ISS CIR/MDCA, Cygnus"
          icon={Orbit}
          accent="cyan"
          badge="Microgravity"
          badgeType="cyan"
        />

        <MetricCard
          title="COMBUSTION REGIMES"
          value="4"
          unit="Physical Modes"
          subtitle="Solid Spread, Droplet, Gas Co-flow, E-Field"
          icon={Layers}
          accent="purple"
          badge="Multiphase"
          badgeType="purple"
        />

        <MetricCard
          title="INDEXED LOCAL DATASETS"
          value={totalDatasets}
          unit="Data Files"
          subtitle={
            isConnected
              ? 'External Desktop Folder Connected'
              : 'Waiting for files in Desktop folder'
          }
          icon={Database}
          accent={isConnected && totalDatasets > 0 ? 'emerald' : 'orange'}
          badge={isConnected ? 'Connected' : 'Listening'}
          badgeType={isConnected ? 'emerald' : 'warn'}
        />
      </div>

      {/* Dataset Connection Banner */}
      <DatasetStatusBanner
        summary={summary}
        loading={loading}
        onRefresh={onRefresh}
      />

      {/* NASA Combustion Experiments Catalog Grid */}
      <div className="dashboard-section">
        <div className="section-header">
          <div className="header-left">
            <h2 className="section-title">Core NASA Microgravity Combustion Programs</h2>
            <p className="section-subtitle">
              Fundamental combustion science and spacecraft fire safety programs hosted on orbit.
            </p>
          </div>
          <span className="section-count">
            {experimentList.length} PROGRAMS TRACKED
          </span>
        </div>

        <div className="experiments-grid">
          {experimentList.length > 0 ? (
            experimentList.map((exp) => (
              <ExperimentCard
                key={exp.id || exp.name}
                experiment={exp}
                onSelect={onSelectExperiment}
              />
            ))
          ) : (
            <div className="empty-loading-card">
              <Activity className="spinning" size={24} />
              <span>Loading NASA Combustion Program Registry...</span>
            </div>
          )}
        </div>
      </div>

      {/* Diagnostic Combustion Metrics Reference */}
      <div className="dashboard-section">
        <div className="section-header">
          <div className="header-left">
            <h2 className="section-title">Microgravity Combustion Diagnostic Parameters</h2>
            <p className="section-subtitle">
              Key quantitative indicators evaluated in freefall without buoyant convective acceleration.
            </p>
          </div>
        </div>

        <div className="parameters-grid">
          {Object.entries(COMBUSTION_METRICS).map(([key, metric]) => (
            <div key={key} className="parameter-card">
              <div className="param-top">
                <span className="param-label">{metric.label}</span>
                <span className="param-unit">{metric.unit}</span>
              </div>
              <p className="param-desc">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
