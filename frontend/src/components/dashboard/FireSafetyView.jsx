import React, { useState } from 'react';
import {
  ShieldAlert,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Info,
  BookOpen,
  Layers,
  Wind,
  Gauge,
  Sliders,
  FileText,
  LifeBuoy
} from 'lucide-react';

const MATERIAL_MATRIX = [
  {
    name: 'SIBAL Composite Fabric',
    composition: '75% Cotton / 25% Fiberglass (NASA Benchmark)',
    loi1g: '18.5%',
    loi0g: '16.0% (Enhanced in low flow)',
    rating: 'FAIL (Requires Enclosure / Waiver)',
    ratingType: 'fail',
    application: 'SAFFIRE benchmark testing; simulated crew clothing',
    behavior0g: 'Rapid concurrent flame spread at 20 cm/s; sustained flame without dripping'
  },
  {
    name: 'Cast PMMA (Acrylic / Plexiglas)',
    composition: 'Polymethyl Methacrylate thermoplastic',
    loi1g: '17.3%',
    loi0g: '15.5% (Extinction at < 1.5 cm/s)',
    rating: 'FAIL (Unmodified in Crew Cabin)',
    ratingType: 'fail',
    application: 'Glovebox windows, diagnostic viewports, optical components',
    behavior0g: 'Deep bubbling pyrolysis; low-velocity quenching below 1.5 cm/s forced flow'
  },
  {
    name: 'Nomex (Meta-Aramid)',
    composition: 'Aromatic polyamide fiber',
    loi1g: '28.5%',
    loi0g: '26.0%',
    rating: 'PASS (Standard Flight Qualified)',
    ratingType: 'pass',
    application: 'Crew flight suits, thermal blankets, cargo bags',
    behavior0g: 'Self-extinguishes in 21% O2; char layer insulates underlying fiber'
  },
  {
    name: 'Kapton / Polyimide',
    composition: 'Aromatic polyimide film',
    loi1g: '37.0%',
    loi0g: '34.0%',
    rating: 'PASS (High Flammability Resistance)',
    ratingType: 'pass',
    application: 'Spacecraft wire insulation, multilayer thermal insulation (MLI)',
    behavior0g: 'Resistant to open flame; susceptible to arc tracking under high-voltage short'
  },
  {
    name: 'Silicone Elastomer',
    composition: 'Polydimethylsiloxane rubber',
    loi1g: '25.0%',
    loi0g: '22.0%',
    rating: 'CONDITIONAL (Thickness Dependent)',
    ratingType: 'warn',
    application: 'Hatch seals, vibration dampers, potting compounds',
    behavior0g: 'Leaves white silica ash in microgravity; releases combustible volatile siloxanes'
  },
  {
    name: 'Teflon (PTFE)',
    composition: 'Polytetrafluoroethylene fluoropolymer',
    loi1g: '95.0%',
    loi0g: '92.0%',
    rating: 'PASS (Extreme Chemical Stability)',
    ratingType: 'pass',
    application: 'Oxygen lines, cryogenic plumbing, chemical seals',
    behavior0g: 'Non-flammable in standard air; emits toxic fluorinated fumes when heated > 300°C'
  }
];

const SAFFIRE_FLIGHTS = [
  {
    mission: 'SAFFIRE-I',
    year: '2016',
    vehicle: 'Cygnus OA-6',
    sample: '0.4 m × 1.0 m SIBAL composite fabric sheet',
    flow: '20 cm/s forced air',
    atmosphere: 'Cabin Air (21% O₂, 101 kPa)',
    heatPeak: '28 kW peak heat release',
    result: 'World-first full-scale spacecraft fire; confirmed rapid flame propagation across large fabric in microgravity.'
  },
  {
    mission: 'SAFFIRE-II',
    year: '2016',
    vehicle: 'Cygnus OA-5',
    sample: '9 material strips (5 cm × 30 cm: Nomex, PMMA, silicone, cotton)',
    flow: 'Opposed and concurrent duct flow',
    atmosphere: 'Cabin Air (21% O₂, 101 kPa)',
    heatPeak: 'Distributed material tests',
    result: 'Determined low-g Limiting Oxygen Index (LOI) shifts across multiple qualified spacecraft materials.'
  },
  {
    mission: 'SAFFIRE-III',
    year: '2017',
    vehicle: 'Cygnus OA-7',
    sample: 'Large-scale SIBAL sample (0.4 m × 1.0 m)',
    flow: 'Accelerated airflow (25 cm/s)',
    atmosphere: 'Cabin Air (21% O₂, 101 kPa)',
    heatPeak: '32 kW peak heat release',
    result: 'Examined high air-speed fire spread; verified fire response models for crewed spacecraft duct shutdowns.'
  },
  {
    mission: 'SAFFIRE-IV & V',
    year: '2020',
    vehicle: 'Cygnus NG-13 & NG-14',
    sample: 'Thick PMMA slabs, composite Nomex, and SIBAL samples',
    flow: 'Elevated velocity flow duct',
    atmosphere: 'Exploration Atmosphere (26% & 30% O₂, 56 kPa)',
    heatPeak: 'High-temperature flame front',
    result: 'Validated Artemis Exploration Atmosphere flammability limits and tested autonomous post-fire carbon monoxide scrubbers.'
  }
];

export default function FireSafetyView() {
  const [atmosphereMode, setAtmosphereMode] = useState('standard');

  const atmosphereData =
    atmosphereMode === 'standard'
      ? {
          name: 'ISS Standard Atmosphere',
          pressureKpa: 101.3,
          pressurePsia: 14.7,
          o2Pct: 21.0,
          pO2Kpa: 21.3,
          pO2Psia: 3.09,
          flammabilityMultiplier: '1.0x (Baseline Reference)',
          riskLevel: 'Standard Qualified Material Standard (NASA-STD-6001 Test 1)',
          notes: 'Standard sea-level equivalent crew cabin atmosphere aboard the International Space Station.'
        }
      : {
          name: 'Artemis Exploration Atmosphere (Gateway / EVA Prep)',
          pressureKpa: 56.5,
          pressurePsia: 8.2,
          o2Pct: 34.0,
          pO2Kpa: 19.2,
          pO2Psia: 2.79,
          flammabilityMultiplier: '1.6x – 2.2x Accelerated Spread',
          riskLevel: 'Elevated Flammability Hazard (LOI Threshold Shifts)',
          notes: 'Reduced pressure minimizes pre-breathe time for Lunar EVA suits, but elevated 34% O₂ dramatically reduces material ignition energies.'
        };

  return (
    <div className="fire-safety-view">
      {/* View Header Banner */}
      <div className="view-banner-header">
        <div className="banner-left">
          <div className="status-indicator-badge">
            <ShieldAlert size={16} className="text-red" />
            <span className="mono-title">SPACECRAFT FIRE SAFETY &amp; MATERIALS STANDARDS</span>
          </div>
          <h1 className="view-main-title">Fire Safety &amp; Flammability Standards</h1>
          <p className="view-subtext">
            NASA-STD-6001 material flammability qualification, the microgravity fire safety paradox, and empirical findings from the autonomous SAFFIRE mission series.
          </p>
        </div>

        <div className="banner-right">
          <div className="repo-pill">
            <Flame size={14} className="text-red" />
            <span>NASA-STD-6001 COMPLIANCE ARCHIVE</span>
          </div>
        </div>
      </div>

      {/* The Microgravity Fire Safety Paradox Callout */}
      <div className="paradox-callout-card">
        <div className="paradox-header">
          <AlertTriangle size={20} className="text-orange" />
          <div className="paradox-title-group">
            <h3>The &quot;Microgravity Fire Safety Paradox&quot;</h3>
            <span className="paradox-subtitle">Why Terrestrial 1g Flammability Tests Can Be Non-Conservative</span>
          </div>
        </div>
        <p className="paradox-text">
          On Earth, natural convection sweeps cold air into the flame base while hot flue gases rise quickly, cooling horizontal fuel surfaces through rapid buoyant heat dissipation. In orbital microgravity, natural convection is absent. However, spacecraft require continuous forced cabin ventilation (10–25 cm/s) to prevent crew carbon dioxide asphyxiation. In this slow forced convective flow, heat cannot escape upward and instead concentrates directly over the fuel surface. Consequently, materials that safely self-extinguish in standard terrestrial 1g tests can propagate flames aggressively in low-velocity orbital ventilation.
        </p>
      </div>

      {/* Atmosphere Comparison Selector */}
      <div className="atmosphere-selector-card">
        <div className="atm-selector-top">
          <div className="atm-lead">
            <Gauge size={18} className="text-cyan" />
            <h3>Spacecraft Atmosphere Flammability Matrix</h3>
          </div>
          <div className="atm-switch-buttons">
            <button
              type="button"
              className={`atm-btn ${atmosphereMode === 'standard' ? 'active' : ''}`}
              onClick={() => setAtmosphereMode('standard')}
            >
              ISS Standard (14.7 psia / 21% O₂)
            </button>
            <button
              type="button"
              className={`atm-btn ${atmosphereMode === 'artemis' ? 'active' : ''}`}
              onClick={() => setAtmosphereMode('artemis')}
            >
              Artemis Exploration (8.2 psia / 34% O₂)
            </button>
          </div>
        </div>

        <div className="atm-telemetry-row">
          <div className="atm-stat-tile">
            <span className="tile-label">CABIN PRESSURE</span>
            <div className="tile-val font-mono">{atmosphereData.pressurePsia} psia</div>
            <span className="tile-sub font-mono">{atmosphereData.pressureKpa} kPa</span>
          </div>

          <div className="atm-stat-tile">
            <span className="tile-label">OXYGEN CONCENTRATION</span>
            <div className="tile-val font-mono text-cyan">{atmosphereData.o2Pct}% O₂</div>
            <span className="tile-sub font-mono">Volume fraction</span>
          </div>

          <div className="atm-stat-tile">
            <span className="tile-label">OXYGEN PARTIAL PRESSURE</span>
            <div className="tile-val font-mono text-orange">{atmosphereData.pO2Kpa} kPa</div>
            <span className="tile-sub font-mono">{atmosphereData.pO2Psia} psia</span>
          </div>

          <div className="atm-stat-tile">
            <span className="tile-label">FLAME SPREAD MULTIPLIER</span>
            <div className="tile-val font-mono text-pure">{atmosphereData.flammabilityMultiplier}</div>
            <span className="tile-sub">{atmosphereData.riskLevel}</span>
          </div>
        </div>
        <p className="atm-notes-line">
          <strong>Operating Environment Note:</strong> {atmosphereData.notes}
        </p>
      </div>

      {/* Material Flammability Matrix Table */}
      <div className="materials-matrix-card">
        <div className="matrix-header">
          <div className="matrix-title-group">
            <Layers size={18} className="text-cyan" />
            <h3>Spacecraft Materials Flammability &amp; LOI Matrix</h3>
          </div>
          <span className="matrix-badge">NASA-STD-6001 TEST 1 RATINGS</span>
        </div>

        <div className="matrix-table-wrap">
          <table className="materials-table">
            <thead>
              <tr>
                <th>MATERIAL / FABRIC</th>
                <th>COMPOSITION</th>
                <th>1g LOI (%)</th>
                <th>0g LOI SHIFT</th>
                <th>NASA RATING</th>
                <th>MICROGRAVITY BEHAVIOR IN VENTILATION</th>
              </tr>
            </thead>
            <tbody>
              {MATERIAL_MATRIX.map((mat, idx) => (
                <tr key={idx}>
                  <td className="mat-name font-bold text-pure">{mat.name}</td>
                  <td className="mat-comp text-secondary">{mat.composition}</td>
                  <td className="mat-loi font-mono">{mat.loi1g}</td>
                  <td className="mat-loi-0g font-mono text-cyan">{mat.loi0g}</td>
                  <td className="mat-rating">
                    <span className={`rating-pill pill-${mat.ratingType}`}>{mat.rating}</span>
                  </td>
                  <td className="mat-behavior text-secondary">{mat.behavior0g}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SAFFIRE Flight Series Breakdown */}
      <div className="saffire-series-card">
        <div className="saffire-header">
          <div className="saffire-title-group">
            <Flame size={18} className="text-orange" />
            <h3>The SAFFIRE Flight Experiment Program (Cygnus Vehicle)</h3>
          </div>
          <span className="saffire-badge">WORLD FIRST FULL-SCALE ORBITAL FIRE TRIALS</span>
        </div>

        <p className="saffire-intro">
          Because life-threatening large-scale fire tests cannot be conducted with crew aboard the ISS, NASA Glenn Research Center developed the Spacecraft Fire Safety Demonstration (SAFFIRE). Tests are autonomously triggered inside Cygnus cargo vehicles after departing the space station before atmospheric re-entry.
        </p>

        <div className="saffire-missions-grid">
          {SAFFIRE_FLIGHTS.map((saf) => (
            <div key={saf.mission} className="saffire-mission-tile">
              <div className="tile-top-bar">
                <span className="saf-name">{saf.mission}</span>
                <span className="saf-year">{saf.year}</span>
                <span className="saf-vehicle">{saf.vehicle}</span>
              </div>
              <h4 className="saf-sample-title">{saf.sample}</h4>
              <div className="saf-metrics">
                <span className="metric-chip font-mono">Duct Flow: {saf.flow}</span>
                <span className="metric-chip font-mono">Heat: {saf.heatPeak}</span>
              </div>
              <p className="saf-finding">{saf.result}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Fire Protocol Checklist */}
      <div className="emergency-protocol-card">
        <div className="protocol-header">
          <LifeBuoy size={18} className="text-cyan" />
          <h3>Spacecraft Fire Suppression &amp; Cleanup Workflow (ISS / Artemis)</h3>
        </div>

        <div className="protocol-steps-grid">
          <div className="protocol-step">
            <span className="step-badge">PHASE 1</span>
            <h4>Rapid Detection</h4>
            <p>Smoke detectors monitor obscuration. Note: Without buoyant ceiling drift, detectors require active forced cabin airflow to sample aerosol particulates.</p>
          </div>

          <div className="protocol-step">
            <span className="step-badge">PHASE 2</span>
            <h4>Ventilation Interlock</h4>
            <p>Immediate automatic shutdown of ventilation inter-module valves to isolate oxygen supply and starve flame of forced convective flow.</p>
          </div>

          <div className="protocol-step">
            <span className="step-badge">PHASE 3</span>
            <h4>Active Suppression</h4>
            <p>Discharge of Fine Water Mist or CO₂ extinguishers. Crew must physically anchor themselves to prevent reverse recoil in zero gravity.</p>
          </div>

          <div className="protocol-step">
            <span className="step-badge">PHASE 4</span>
            <h4>Atmospheric Scrubbing</h4>
            <p>Carbon monoxide and toxic pyrolysis gas scrubbers activated, or emergency cabin depressurization/re-pressurization protocol initiated.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
