import React from 'react';
import {
  Flame,
  Orbit,
  Layers,
  Database,
  Activity,
  Compass,
  FileSpreadsheet
} from 'lucide-react';
import MetricCard from './MetricCard.jsx';
import ExperimentCard from './ExperimentCard.jsx';
import DatasetStatusBanner from './DatasetStatusBanner.jsx';
import OverviewHeroSection from './OverviewHeroSection.jsx';
import LiveDatasetAvailability from './LiveDatasetAvailability.jsx';
import ExperimentalChartsSection from './ExperimentalChartsSection.jsx';
import ResearchHighlights from './ResearchHighlights.jsx';
import ResearchActivitySection from './ResearchActivitySection.jsx';
import { COMBUSTION_METRICS } from '../../constants/combustionConstants.js';

export default function OverviewView({
  experiments = {},
  experimentalData = {},
  highlights = [],
  activities = [],
  summary = null,
  health = null,
  loading = false,
  onRefresh = () => {},
  onSelectExperiment = () => {}
}) {
  const experimentList = Object.values(experiments);
  const totalDatasets = summary?.totalDatasetsFound ?? 0;
  const isConnected = summary?.pathExists;
  const experimentsCount = summary?.experimentsCount || {};

  return (
    <div className="overview-view">
      {/* 1. 3D Interactive Earth Hero Section */}
      <OverviewHeroSection
        summary={summary}
        onExplorePrograms={onSelectExperiment}
      />

      {/* 2. Top Telemetry KPI Row */}
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

      {/* 3. Live Dataset Availability & Per-Experiment Matrix (Requirement 2) */}
      <LiveDatasetAvailability
        summary={summary}
        loading={loading}
        onRefresh={onRefresh}
      />

      {/* 4. Interactive Charts Using Actual Available Experimental Data (Requirement 4) */}
      <ExperimentalChartsSection
        datasets={experimentalData}
        summary={summary}
      />

      {/* 5. Core NASA Microgravity Combustion Overview Cards (Requirement 1) */}
      <div className="dashboard-section">
        <div className="section-header">
          <div className="header-left">
            <h2 className="section-title">Core NASA Microgravity Combustion Programs</h2>
            <p className="section-subtitle">
              Expandable experiment cards with facility codes, fuels, key variables, and live file counts.
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
                fileCount={experimentsCount[exp.name] ?? experimentsCount[exp.name?.split(' / ')[0]] ?? 0}
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

      {/* 6. Combustion Research Highlights (Requirement 3) */}
      <ResearchHighlights highlights={highlights} />

      {/* 7. Recent Research Activity & Source References (Requirement 5) */}
      <ResearchActivitySection activities={activities} />

      {/* 8. Diagnostic Combustion Parameters Reference Table */}
      <div className="dashboard-section" style={{ marginTop: '2.5rem' }}>
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
