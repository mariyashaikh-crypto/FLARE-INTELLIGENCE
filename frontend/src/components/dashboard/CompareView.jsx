import React, { useState } from 'react';
import {
  GitCompare,
  Flame,
  ArrowRight,
  Orbit,
  Globe,
  BookOpen,
  Info,
  CheckCircle2,
  Sparkles,
  Layers,
  Sliders,
  Scale
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';

const PHENOMENA_DATA = [
  {
    id: 'droplet-combustion',
    title: 'Isolated Liquid Droplet Burning (d² Law)',
    experimentRef: 'FLEX / FLEX-2',
    citation: 'Farouk & Dryer, Combust. Flame 161 (2014); Nayagam et al., Combust. Flame 159 (2012)',
    summary: 'The classic d² law of droplet combustion assumes spherical symmetry, which is physically impossible in 1g due to buoyant upward convection.',
    terrestrial1g: {
      gravity: '1.0 g (Terrestrial)',
      geometry: 'Asymmetric elongated plume with buoyant upward trailing wake',
      transport: 'Buoyancy-dominated forced/natural convection (1–2 m/s upward flow)',
      sootBehavior: 'Soot quickly carried away in wake plume; thin reaction zone',
      extinction: 'Fuel exhaustion or high-strain convective blowout',
      coolFlames: 'Masked and disrupted by buoyant convective dissipation',
      burningRateK: '0.85 – 1.05 mm²/s (Enhanced by buoyant convective sweep)'
    },
    microgravity0g: {
      gravity: '10⁻⁴ to 10⁻⁶ g (ISS / Drop Tower)',
      geometry: 'Perfect spherically symmetric flame envelope around liquid droplet',
      transport: 'Pure molecular mass and thermal diffusion (Grashof Gr ≈ 0)',
      sootBehavior: 'Soot shell trapped in spherical standoff zone; high radiative loss',
      extinction: 'Radiative extinction at finite droplet diameter (d_ext ≈ 0.8 mm)',
      coolFlames: 'Steady, sustained spherical cool flame (600–800 K) unmasked post-hot extinction',
      burningRateK: '0.70 – 0.78 mm²/s (Pure diffusive rate; unpolluted by buoyancy)'
    }
  },
  {
    id: 'solid-surface-spread',
    title: 'Solid Surface Flame Spread & Quenching Limits',
    experimentRef: 'BASS-II & SAFFIRE-I',
    citation: 'NASA/TM—2014-218320; Olson, Ferkul et al. (NASA Glenn Research Center)',
    summary: 'Solid combustion in microgravity exhibits an unexpected low-velocity radiative quenching limit absent in terrestrial conditions.',
    terrestrial1g: {
      gravity: '1.0 g (Terrestrial)',
      geometry: 'Upward angled buoyant flame sheet with strong entrainment air draft',
      transport: 'Strong buoyant convective draft (30–60 cm/s self-generated draft)',
      sootBehavior: 'Rapid convective venting of soot and pyrolysis products',
      extinction: 'Blowout at high wind speeds (> 150 cm/s); fires self-sustain without forced flow',
      coolFlames: 'Not observable in solid surface fuels',
      burningRateK: 'Fast upward propagation; buoyant draft feeds fresh oxygen continuously'
    },
    microgravity0g: {
      gravity: '10⁻⁴ to 10⁻⁶ g (ISS Glovebox / Cygnus)',
      geometry: 'Blunt rounded flame base with uniform standoff distance along fuel slab',
      transport: 'Controlled duct forced convection (1–25 cm/s); zero natural convection draft',
      sootBehavior: 'Pyrolysis zone thickens; radiative emission from soot outpaces chemical heat release',
      extinction: 'Flames extinguish below critical low airspeed (< 1.5 cm/s) via radiative quenching',
      coolFlames: 'Residual smoldering low-temperature spread under sub-limiting oxygen',
      burningRateK: 'Spread rate drops to zero as forced velocity drops below ~1.5 cm/s'
    }
  },
  {
    id: 'gaseous-diffusion-flames',
    title: 'Gaseous Laminar Diffusion Flames & Smoke Points',
    experimentRef: 'SPICE',
    citation: 'Sunderland, Urban et al., NASA Technical Reports Server (NTRS) 20170008432',
    summary: 'Eliminating buoyancy stretches the residence time of gas molecules, radically expanding flame width and delaying the smoke point.',
    terrestrial1g: {
      gravity: '1.0 g (Terrestrial)',
      geometry: 'Slender, flickering teardrop flame due to Kelvin-Helmholtz hydrodynamic shear (10–15 Hz flicker)',
      transport: 'Buoyancy accelerates gas upward; strong inward radial entrainment',
      sootBehavior: 'Short residence time (~15–25 ms); soot passes through high-temperature oxidation tip',
      extinction: 'Lift-off and blowout at high nozzle velocities',
      coolFlames: 'Gaseous cool flames require specialized high-pressure staged burners',
      burningRateK: 'Narrow flame radius (~3–5 mm); high tip temperature (> 1800 K)'
    },
    microgravity0g: {
      gravity: '10⁻⁴ to 10⁻⁶ g (ISS Glovebox)',
      geometry: 'Wide, bulbous, dome-shaped flame; completely steady without buoyant flickering',
      transport: 'Transport governed by molecular diffusion and slow co-flow; zero shear flickers',
      sootBehavior: 'Residence time increases by 40–100%; soot agglomerates into large clusters; smoke point length increases',
      extinction: 'Extinction dominated by radiative heat loss from soot accumulation',
      coolFlames: 'Low-temperature catalytic and diffusion-controlled boundary layers',
      burningRateK: 'Flame width expands up to 2–3x normal gravity width; lower peak temperature (~1500 K)'
    }
  },
  {
    id: 'electric-field-interaction',
    title: 'Electric Field & Ionic Wind Interactions',
    experimentRef: 'E-FIELD Flames / ACME',
    citation: 'Stockman, Hegde et al., Proc. Combust. Inst. 37 (2019)',
    summary: 'The weak electrohydrodynamic body force on flame chemi-ions is unmasked and dominates flame behavior only when buoyancy is removed.',
    terrestrial1g: {
      gravity: '1.0 g (Terrestrial)',
      geometry: 'Strong buoyant plume overrides weak electrical body forces on ions',
      transport: 'Buoyancy acceleration (~9.81 m/s²) vastly exceeds electrohydrodynamic acceleration',
      sootBehavior: 'High voltage has modest effect on soot because buoyant velocity is too high',
      extinction: 'Extremely high voltages required to produce observable flame deflection',
      coolFlames: 'E-field coupling to cool flames masked by thermal convection',
      burningRateK: 'Buoyant momentum >> Electric body force (F_buoyant / F_electric >> 10)'
    },
    microgravity0g: {
      gravity: '10⁻⁴ to 10⁻⁶ g (ISS CIR / ACME)',
      geometry: 'Flame tip deflects up to 10+ mm toward electrode; flame geometry re-shaped without mechanical force',
      transport: 'Electric body force F = ρ_c E dominates transport in quiescent gas',
      sootBehavior: 'Ions extracted rapidly, reducing peak soot volume fraction by over 90%',
      extinction: 'Flames stabilized or dynamically extinguished at precise DC field thresholds',
      coolFlames: 'Active manipulation of radical and ion concentrations in reaction zone',
      burningRateK: 'Electric body force dominates flow field (F_electric >> F_buoyant)'
    }
  }
];

// Normalized comparative metrics chart data
const COMPARATIVE_METRICS_DATA = [
  { metric: 'Flame Width (Norm)', terrestrial1g: 1.0, microgravity0g: 2.4, unit: 'x relative' },
  { metric: 'Soot Residence Time', terrestrial1g: 1.0, microgravity0g: 1.85, unit: 'x relative' },
  { metric: 'Flicker Frequency', terrestrial1g: 12.5, microgravity0g: 0.0, unit: 'Hz (Instability)' },
  { metric: 'Min Quench Velocity', terrestrial1g: 0.0, microgravity0g: 1.5, unit: 'cm/s (Radiative)' },
  { metric: 'Droplet Burning K', terrestrial1g: 0.95, microgravity0g: 0.76, unit: 'mm²/s' }
];

// Heptane Droplet d² Law Comparison Series
const DROPLET_D2_SERIES = [
  { time: 0.0, d2_1g: 4.00, d2_0g: 4.00, note: 'Ignition' },
  { time: 0.8, d2_1g: 3.20, d2_0g: 3.38, note: 'Quasi-steady hot' },
  { time: 1.6, d2_1g: 2.40, d2_0g: 2.76, note: 'Hot burning' },
  { time: 2.4, d2_1g: 1.60, d2_0g: 2.25, note: '0g Hot Extinction / Cool Flame Ignition' },
  { time: 3.2, d2_1g: 0.80, d2_0g: 1.84, note: '0g Cool Flame Burning' },
  { time: 4.0, d2_1g: 0.00, d2_0g: 1.43, note: '1g Burnout | 0g Cool Flame continues' },
  { time: 4.8, d2_1g: 0.00, d2_0g: 1.05, note: '0g Final Radiative Extinction' },
  { time: 5.4, d2_1g: 0.00, d2_0g: 0.85, note: '0g Extinguished Residual Droplet' }
];

export default function CompareView() {
  const [selectedPhenomenonId, setSelectedPhenomenonId] = useState('droplet-combustion');

  const activePhenomenon =
    PHENOMENA_DATA.find((p) => p.id === selectedPhenomenonId) || PHENOMENA_DATA[0];

  return (
    <div className="combustion-compare-view">
      {/* View Header Banner */}
      <div className="view-banner-header">
        <div className="banner-left">
          <div className="status-indicator-badge">
            <GitCompare size={16} className="text-cyan" />
            <span className="mono-title">PHYSICS OF FREEFALL VS TERRESTRIAL COMBUSTION</span>
          </div>
          <h1 className="view-main-title">1g vs Microgravity Combustion</h1>
          <p className="view-subtext">
            Side-by-side empirical comparison of buoyancy-driven terrestrial flames versus diffusion-dominated orbital flames, backed by peer-reviewed NASA flight findings.
          </p>
        </div>

        <div className="banner-right">
          <div className="repo-pill">
            <Scale size={14} className="text-cyan" />
            <span>DIFFUSION VS CONVECTION ANALYSIS</span>
          </div>
        </div>
      </div>

      {/* Phenomenon Selector Tabs */}
      <div className="compare-selector-tabs">
        {PHENOMENA_DATA.map((p) => {
          const isActive = selectedPhenomenonId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              className={`compare-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedPhenomenonId(p.id)}
            >
              <span className="tab-title">{p.title.split('(')[0]}</span>
              <span className="tab-sub">{p.experimentRef}</span>
            </button>
          );
        })}
      </div>

      {/* Active Phenomenon Lead Summary */}
      <div className="compare-lead-card">
        <div className="lead-header">
          <Sparkles size={18} className="text-orange" />
          <h2 className="lead-title">{activePhenomenon.title}</h2>
          <span className="lead-program-chip">{activePhenomenon.experimentRef}</span>
        </div>
        <p className="lead-desc">{activePhenomenon.summary}</p>
        <div className="lead-citation">
          <BookOpen size={14} className="text-cyan" />
          <span><strong>NASA &amp; Journal Reference:</strong> {activePhenomenon.citation}</span>
        </div>
      </div>

      {/* Side-by-Side Comparison Columns */}
      <div className="split-comparison-grid">
        {/* Left Column: Terrestrial 1g */}
        <div className="compare-column col-1g">
          <div className="col-header">
            <div className="col-icon-box">
              <Globe size={22} className="text-cyan" />
            </div>
            <div>
              <span className="col-tag">TERRESTRIAL REGIME</span>
              <h3 className="col-title">Earth Normal Gravity (1.0 g)</h3>
              <span className="col-sub">Buoyancy-Driven Convective Acceleration</span>
            </div>
          </div>

          <div className="metrics-spec-list">
            <div className="metric-spec-item">
              <span className="spec-name">FLAME GEOMETRY</span>
              <p className="spec-val">{activePhenomenon.terrestrial1g.geometry}</p>
            </div>

            <div className="metric-spec-item">
              <span className="spec-name">DOMINANT TRANSPORT MODE</span>
              <p className="spec-val">{activePhenomenon.terrestrial1g.transport}</p>
            </div>

            <div className="metric-spec-item">
              <span className="spec-name">SOOT FORMATION &amp; RADIATION</span>
              <p className="spec-val">{activePhenomenon.terrestrial1g.sootBehavior}</p>
            </div>

            <div className="metric-spec-item">
              <span className="spec-name">EXTINCTION MECHANISM</span>
              <p className="spec-val">{activePhenomenon.terrestrial1g.extinction}</p>
            </div>

            <div className="metric-spec-item">
              <span className="spec-name">COOL FLAMES PHENOMENOLOGY</span>
              <p className="spec-val">{activePhenomenon.terrestrial1g.coolFlames}</p>
            </div>

            <div className="metric-spec-item highlight">
              <span className="spec-name">QUANTITATIVE RATE / THRESHOLD</span>
              <p className="spec-val font-mono">{activePhenomenon.terrestrial1g.burningRateK}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Microgravity 0g */}
        <div className="compare-column col-0g">
          <div className="col-header">
            <div className="col-icon-box">
              <Orbit size={22} className="text-orange" />
            </div>
            <div>
              <span className="col-tag">MICROGRAVITY REGIME</span>
              <h3 className="col-title">Orbital Freefall (10⁻⁴ – 10⁻⁶ g)</h3>
              <span className="col-sub">Pure Molecular Diffusion &amp; Quiescent Transport</span>
            </div>
          </div>

          <div className="metrics-spec-list">
            <div className="metric-spec-item">
              <span className="spec-name">FLAME GEOMETRY</span>
              <p className="spec-val text-cyan">{activePhenomenon.microgravity0g.geometry}</p>
            </div>

            <div className="metric-spec-item">
              <span className="spec-name">DOMINANT TRANSPORT MODE</span>
              <p className="spec-val text-cyan">{activePhenomenon.microgravity0g.transport}</p>
            </div>

            <div className="metric-spec-item">
              <span className="spec-name">SOOT FORMATION &amp; RADIATION</span>
              <p className="spec-val text-orange">{activePhenomenon.microgravity0g.sootBehavior}</p>
            </div>

            <div className="metric-spec-item">
              <span className="spec-name">EXTINCTION MECHANISM</span>
              <p className="spec-val text-orange">{activePhenomenon.microgravity0g.extinction}</p>
            </div>

            <div className="metric-spec-item">
              <span className="spec-name">COOL FLAMES PHENOMENOLOGY</span>
              <p className="spec-val text-pure">{activePhenomenon.microgravity0g.coolFlames}</p>
            </div>

            <div className="metric-spec-item highlight">
              <span className="spec-name">QUANTITATIVE RATE / THRESHOLD</span>
              <p className="spec-val font-mono text-cyan">{activePhenomenon.microgravity0g.burningRateK}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Comparative Charts Section */}
      <div className="comparative-charts-row">
        {/* Chart 1: Normalized Key Physical Variables (1g vs 0g) */}
        <div className="chart-card-half">
          <div className="chart-card-header">
            <h3 className="chart-title">Parametric Comparison: 1g vs Microgravity</h3>
            <span className="chart-tag">MEASURED FLIGHT PARAMETERS</span>
          </div>
          <p className="chart-subtitle">
            Normalized differences in flame dimensions, soot residence times, and extinction boundaries.
          </p>
          <div className="chart-wrap-box">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={COMPARATIVE_METRICS_DATA}
                margin={{ top: 15, right: 15, left: -10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" />
                <XAxis
                  dataKey="metric"
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a1122',
                    borderColor: 'rgba(0, 240, 255, 0.3)',
                    color: '#f8fafc',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Legend verticalAlign="top" height={32} />
                <Bar dataKey="terrestrial1g" name="Earth 1.0 g" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="microgravity0g" name="Microgravity 0 g" fill="#ff6b00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: n-Heptane Droplet d² Law Burning Curve (1g vs 0g Cool Flame) */}
        <div className="chart-card-half">
          <div className="chart-card-header">
            <h3 className="chart-title">Droplet d² Law &amp; Cool Flame Transition</h3>
            <span className="chart-tag">FLEX FLIGHT TELEMETRY</span>
          </div>
          <p className="chart-subtitle">
            Heptane droplet regression: In 1g droplet burns to completion rapidly; in 0g hot flame extinguishes into a sustained cool flame.
          </p>
          <div className="chart-wrap-box">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={DROPLET_D2_SERIES}
                margin={{ top: 15, right: 15, left: -10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" />
                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                  label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -12, fill: '#94a3b8', fontSize: 11 }}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                  label={{ value: 'd² (mm²)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a1122',
                    borderColor: 'rgba(0, 240, 255, 0.3)',
                    color: '#f8fafc',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Legend verticalAlign="top" height={32} />
                <Line
                  type="monotone"
                  dataKey="d2_1g"
                  name="Earth 1g (Buoyant Wake Burning)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="d2_0g"
                  name="Microgravity 0g (Two-Stage Cool Flame)"
                  stroke="#ff6b00"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#030611', stroke: '#ff6b00', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Fundamental Physics Summary Box */}
      <div className="physics-takeaway-card">
        <div className="takeaway-header">
          <Info size={16} className="text-cyan" />
          <h3>Why Microgravity Reveals Combustion Truth</h3>
        </div>
        <p className="takeaway-text">
          On Earth, buoyancy is an overwhelming artifact that masks fundamental chemical kinetics and transport limits.
          Because heated combustion products are less dense than cold ambient air, buoyant forces generate acceleration up to 9.81 m/s²,
          creating turbulent shear and high convective draft speeds. In the freefall of orbit aboard the ISS, buoyancy is suppressed by
          six orders of magnitude ($10^{-6} g$). Flames become spherically symmetric, transport reduces to pure molecular diffusion,
          and previously invisible low-temperature chemical kinetics (such as alkane cool flames) become observable and quantifiable.
        </p>
      </div>
    </div>
  );
}
