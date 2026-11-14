import React from 'react';
import { Orbit, Activity, ShieldCheck, Compass, Radio, Layers } from 'lucide-react';
import InteractiveEarth from './InteractiveEarth.jsx';

export default function OverviewHeroSection({ summary, onExplorePrograms }) {
  const isConnected = summary?.pathExists;
  const totalDatasets = summary?.totalDatasetsFound ?? 0;

  return (
    <section className="overview-hero-section">
      {/* 3D Interactive Earth Canvas Stage */}
      <div className="hero-3d-stage">
        <InteractiveEarth />
      </div>

      {/* Mission Control HUD Telemetry Overlay */}
      <div className="hero-hud-overlay">
        <div className="hud-left">
          <div className="mission-tag">
            <span className="pulsing-beacon" />
            <span>ORBITAL FLAME SCIENCE TELEMETRY</span>
          </div>

          <h1 className="hero-title">
            Combustion in Freefall <span className="title-gradient">&amp; Microgravity</span>
          </h1>

          <p className="hero-narrative">
            Live telemetry, flammability extinction boundaries, and non-buoyant combustion physics
            derived from NASA experiments aboard the International Space Station and Cygnus modules.
          </p>

          {/* Real-time Orbital Telemetry Readouts */}
          <div className="orbital-metrics-ribbon">
            <div className="telemetry-box">
              <span className="label">ORBITAL REGIME</span>
              <span className="val text-cyan">Low Earth Orbit</span>
              <span className="sub">Altitude ~408 km</span>
            </div>

            <div className="telemetry-box">
              <span className="label">GRAVITATIONAL ACCEL</span>
              <span className="val text-orange">10⁻⁶ g</span>
              <span className="sub">Freefall Quenched</span>
            </div>

            <div className="telemetry-box">
              <span className="label">ISS INCLINATION</span>
              <span className="val text-cyan">51.6°</span>
              <span className="sub">Speed: 7.66 km/s</span>
            </div>

            <div className="telemetry-box">
              <span className="label">DATASET REPO</span>
              <span className={`val ${isConnected ? 'text-emerald' : 'text-orange'}`}>
                {isConnected ? `${totalDatasets} Files` : 'Waiting'}
              </span>
              <span className="sub">Desktop Sync</span>
            </div>
          </div>

          {/* Orbital Research Platforms Badges */}
          <div className="platforms-row">
            <span className="platform-pill active">
              <span className="pill-dot-cyan" />
              ISS Glovebox (BASS-II • SPICE)
            </span>
            <span className="platform-pill active">
              <span className="pill-dot-cyan" />
              ISS CIR / MDCA (FLEX • E-FIELD)
            </span>
            <span className="platform-pill active">
              <span className="pill-dot-orange" />
              Cygnus Vehicle (SAFFIRE-I)
            </span>
          </div>

          <div className="interaction-hint">
            <Compass size={14} className="hint-icon" />
            <span>Drag mouse to rotate 3D Earth • Scroll to inspect orbital trajectories</span>
          </div>
        </div>
      </div>
    </section>
  );
}
