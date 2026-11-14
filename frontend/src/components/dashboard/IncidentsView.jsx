import React, { useState } from 'react';
import {
  History,
  AlertOctagon,
  Flame,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  FileText,
  LifeBuoy
} from 'lucide-react';

const HISTORICAL_INCIDENTS = [
  {
    id: 'apollo-1',
    name: 'Apollo 1 (AS-204)',
    date: 'January 27, 1967',
    location: 'Launch Complex 34, Cape Kennedy, Florida',
    gravityRegime: '1.0 g (Terrestrial Pre-launch Test)',
    atmosphere: '100% Pure Oxygen at 16.7 psia (115 kPa Hyperbaric)',
    severity: 'Catastrophic (Loss of Crew: Grissom, White, Chaffee)',
    rootCause: 'Electrical arcing from damaged Teflon-insulated wire under pilot couch',
    materialsInvolved: 'Extensive Velcro strips (> 1000 sq ft), nylon netting, polyurethane foam, flammable suits',
    combustionPhysics:
      'In 100% pure oxygen pressurized above atmospheric level (16.7 psia), materials that are fire-resistant in normal air become near-explosive flammables. Flame spread across the cabin in under 9 seconds, creating massive heat release that caused cabin pressure to spike to 29–36 psia, rupturing the Command Module pressure vessel.',
    investigationFindings:
      'NASA Apollo 204 Review Board identified that pure hyperbaric oxygen eliminated any combustion safety margin. The inward-opening plug door hatch required 90 seconds to unlatch against internal positive pressure, trapping the crew.',
    safetyLegacy: [
      'Abolished 100% pure oxygen at sea level; adopted 60% N₂ / 40% O₂ mixed gas during pad operations.',
      'Re-engineered outward-opening quick-release hatch capable of egress in < 5 seconds.',
      'Established NASA-STD-6001: complete elimination of flammable non-metallic materials and Velcro pathways.',
      'All electrical wiring routed through sealed stainless steel conduits with double insulation.'
    ]
  },
  {
    id: 'mir-1997',
    name: 'Mir Space Station Kvant-1 Fire',
    date: 'February 23, 1997',
    location: 'Kvant-1 Module, Mir Space Station (Low Earth Orbit)',
    gravityRegime: '10⁻⁴ g (Orbital Microgravity)',
    atmosphere: 'Standard 1.0 atm Station Air (21% O₂, 79% N₂)',
    severity: 'Critical Spaceflight Emergency (Crew Evacuation Threat)',
    rootCause: 'Thermal runaway in Solid Fuel Oxygen Generator (SFOG / "Vika" candle)',
    materialsInvolved: 'Sodium chlorate (NaClO₃) chemical core, iron powder casing, cellulose filter cartridge',
    combustionPhysics:
      'The oxygen-generating chemical candle experienced internal contamination, converting the generator into a chemical blowtorch jetting flame for 90–120 seconds. In microgravity, absence of buoyant convection prevented hot smoke from stratifying along the ceiling; instead, toxic aerosol smoke dispersed spherically and uniformly throughout the station modules. Molten slag droplets sputtered into the cabin in freefall.',
    investigationFindings:
      'Crew vision was reduced to near zero within minutes. Standard gas masks were required. Extinguisher discharge in zero gravity caused substantial physical recoil on crew members, demonstrating the necessity of foot-restraint footholds during emergency fire suppression.',
    safetyLegacy: [
      'ISS redesigned oxygen generation using Water Electrolysis (OGS) as primary source, keeping candles as emergency backup only.',
      'Standardized ISS crew emergency breathing masks with integrated communication radios and optical seals.',
      'Developed microgravity-specific fire extinguisher nozzles with reduced momentum discharge recoil.',
      'Installed active airflow interlock cutoffs to prevent smoke transfer between pressurized modules.'
    ]
  },
  {
    id: 'apollo-13',
    name: 'Apollo 13 Cryogenic Oxygen Tank 2',
    date: 'April 13, 1970',
    location: '200,000 miles from Earth (Cislunar Space Transit)',
    gravityRegime: 'Microgravity (Zero-g Coast Phase)',
    atmosphere: 'Supercritical Liquid Oxygen (Cryogenic 900–1000 psia, -180°C)',
    severity: 'Mission Critical Failure (Loss of Service Module Power & Life Support)',
    rootCause: 'Damaged Teflon wire insulation on internal tank de-stratification stir fan',
    materialsInvolved: 'Teflon-insulated copper wiring, aluminium conduit, supercritical pure oxygen',
    combustionPhysics:
      'A ground testing heating cycle had melted the thermostat switch and degraded the Teflon wire insulation. When the crew initiated a tank stir cycle, electrical arcing in supercritical pure oxygen ignited the Teflon insulation. Combustion rapidly spread along the aluminium conduit in the hyper-dense oxygen environment, creating catastrophic over-pressure that blew off Service Module outer panel 4.',
    investigationFindings:
      'Combustion can occur in supercritical fluids when high-energy electrical ignition is introduced. The Apollo 13 Review Board determined that submerged electrical motors in cryogenic oxygen tanks represented an intolerable single-point failure.',
    safetyLegacy: [
      'Removed de-stratification fan motors and heating element switches from inside cryogenic tanks entirely.',
      'Added a third independent emergency cryogenic oxygen tank located in a separate bay.',
      'All internal tank instrumentation re-routed with stainless steel and ceramic potting materials.'
    ]
  },
  {
    id: 'shuttle-spacelab',
    name: 'Space Shuttle Electrical Smoldering Events (STS-6 & STS-35)',
    date: '1983 & 1990',
    location: 'Orbiter Avionics Bay & Spacelab Module, Low Earth Orbit',
    gravityRegime: 'Microgravity (10⁻⁵ g)',
    atmosphere: '14.7 psia Cabin Air (21% O₂)',
    severity: 'Contained In-Flight Electrical Anomalies',
    rootCause: 'Resistive electrical overheating and wire insulation charring in avionics racks',
    materialsInvolved: 'Polyimide / Kapton wiring harness insulation, electrical connectors',
    combustionPhysics:
      'Smoldering in microgravity occurs in the absence of buoyant convective cooling. In enclosed electronics bays without direct fan airflow, low-temperature oxidative pyrolysis can proceed undetected for hours, slowly releasing toxic carbon monoxide and particulate smoke without generating an open visible flame.',
    investigationFindings:
      'Terrestrial smoke detectors relying on optical obscuration from upward rising smoke plumes fail to trigger promptly in microgravity avionics bays unless forced extraction fans actively pull air through the detector chamber.',
    safetyLegacy: [
      'Mandated active duct smoke detectors with continuous suction sampling across all electronics bays.',
      'Replaced standard Kapton insulation with arc-track-resistant cross-linked Tefzel and composite fluoropolymers.',
      'Implemented real-time carbon monoxide sensor arrays with multi-point automated acoustic alarms.'
    ]
  }
];

export default function IncidentsView() {
  const [selectedIncidentId, setSelectedIncidentId] = useState('apollo-1');

  const activeIncident =
    HISTORICAL_INCIDENTS.find((inc) => inc.id === selectedIncidentId) || HISTORICAL_INCIDENTS[0];

  return (
    <div className="incidents-history-view">
      {/* View Header Banner */}
      <div className="view-banner-header">
        <div className="banner-left">
          <div className="status-indicator-badge">
            <History size={16} className="text-orange" />
            <span className="mono-title">FORENSIC CASE STUDIES &amp; LESSONS LEARNED</span>
          </div>
          <h1 className="view-main-title">Historical Spaceflight Fire Incidents</h1>
          <p className="view-subtext">
            Forensic combustion physics, accident investigation findings, and resulting NASA spacecraft safety overhauls across Apollo, Mir, and Space Shuttle missions.
          </p>
        </div>

        <div className="banner-right">
          <div className="repo-pill">
            <AlertOctagon size={14} className="text-orange" />
            <span>ACCIDENT FORENSIC ARCHIVE</span>
          </div>
        </div>
      </div>

      {/* Crucial Mandatory Disclaimer Banner */}
      <div className="forensic-disclaimer-banner">
        <AlertOctagon size={22} className="disclaimer-icon text-orange" />
        <div className="disclaimer-text">
          <h3 className="disclaimer-title">IMPORTANT SCIENTIFIC CLASSIFICATION NOTICE</h3>
          <p className="disclaimer-body">
            This module contains forensic case studies of historical spaceflight accidents and equipment failures.
            <strong> These incidents are strictly separated from NASA&apos;s controlled microgravity combustion research experiments</strong> (BASS-II, FLEX, SAFFIRE-I, SPICE, and E-FIELD Flames), which are safe, sealed, scientific flight investigations. The data below is presented strictly for aerospace engineering safety analysis, materials qualification context, and historical lessons learned.
          </p>
        </div>
      </div>

      {/* Incident Selector Tabs */}
      <div className="incident-selector-bar">
        {HISTORICAL_INCIDENTS.map((inc) => {
          const isActive = selectedIncidentId === inc.id;
          return (
            <button
              key={inc.id}
              type="button"
              className={`incident-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedIncidentId(inc.id)}
            >
              <span className="incident-tab-title">{inc.name}</span>
              <span className="incident-tab-year">{inc.date.split(',')[1]?.trim() || 'Mission'}</span>
            </button>
          );
        })}
      </div>

      {/* Active Incident Case Study Profile */}
      <div className="incident-profile-card">
        <div className="incident-card-top">
          <div>
            <div className="incident-meta-tags">
              <span className="meta-tag date-tag">
                <Calendar size={13} /> {activeIncident.date}
              </span>
              <span className="meta-tag location-tag">{activeIncident.location}</span>
              <span className="meta-tag gravity-tag text-cyan">{activeIncident.gravityRegime}</span>
            </div>
            <h2 className="incident-title">{activeIncident.name}</h2>
            <span className="incident-severity text-red font-mono">SEVERITY: {activeIncident.severity}</span>
          </div>
        </div>

        {/* Incident Quick Parameters Grid */}
        <div className="incident-specs-grid">
          <div className="incident-spec-tile">
            <span className="tile-label">ATMOSPHERIC ENVIRONMENT</span>
            <p className="tile-val font-mono">{activeIncident.atmosphere}</p>
          </div>

          <div className="incident-spec-tile">
            <span className="tile-label">ROOT IGNITION SOURCE</span>
            <p className="tile-val text-orange">{activeIncident.rootCause}</p>
          </div>

          <div className="incident-spec-tile">
            <span className="tile-label">PRIMARY MATERIALS INVOLVED</span>
            <p className="tile-val">{activeIncident.materialsInvolved}</p>
          </div>
        </div>

        {/* Forensic Combustion Physics Deep Dive */}
        <div className="forensic-section-card">
          <div className="section-head">
            <Flame size={18} className="text-orange" />
            <h3>Forensic Combustion Physics Progression</h3>
          </div>
          <p className="section-body">{activeIncident.combustionPhysics}</p>
        </div>

        {/* Formal Investigation Board Findings */}
        <div className="forensic-section-card">
          <div className="section-head">
            <FileText size={18} className="text-cyan" />
            <h3>Official Board Findings &amp; Failure Mechanics</h3>
          </div>
          <p className="section-body">{activeIncident.investigationFindings}</p>
        </div>

        {/* NASA Engineering Standards Overhaul & Safety Legacy */}
        <div className="safety-legacy-card">
          <div className="legacy-head">
            <ShieldCheck size={18} className="text-emerald" />
            <h3>Resulting NASA Safety Standards &amp; Engineering Overhauls</h3>
          </div>
          <div className="legacy-items-list">
            {activeIncident.safetyLegacy.map((legacy, idx) => (
              <div key={idx} className="legacy-item">
                <CheckCircle2 size={16} className="text-emerald check-icon" />
                <p className="legacy-text">{legacy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparative Forensic Risk Matrix */}
      <div className="forensic-matrix-card">
        <div className="matrix-head">
          <Layers size={18} className="text-cyan" />
          <h3>Cross-Incident Forensic Comparison Matrix</h3>
        </div>

        <div className="matrix-table-wrap">
          <table className="incident-comparison-table">
            <thead>
              <tr>
                <th>INCIDENT</th>
                <th>GRAVITY STATE</th>
                <th>ATMOSPHERE &amp; PRESSURE</th>
                <th>IGNITION SOURCE</th>
                <th>KEY SAFETY STANDARD CREATED</th>
              </tr>
            </thead>
            <tbody>
              {HISTORICAL_INCIDENTS.map((inc) => (
                <tr key={inc.id} className={selectedIncidentId === inc.id ? 'active-row' : ''}>
                  <td className="font-bold text-pure">{inc.name}</td>
                  <td className="text-cyan">{inc.gravityRegime.split('(')[0]}</td>
                  <td className="font-mono">{inc.atmosphere.split('(')[0]}</td>
                  <td className="text-secondary">{inc.rootCause}</td>
                  <td className="text-emerald">{inc.safetyLegacy[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
