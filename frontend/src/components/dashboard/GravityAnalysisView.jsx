import React, { useState, useMemo } from 'react';
import {
  Orbit,
  Globe,
  Sliders,
  Scale,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
  BookOpen,
  ArrowRight
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
  ReferenceLine
} from 'recharts';

// Preset configurations for realistic space environments
const GRAVITY_PRESETS = [
  {
    name: 'ISS Crew Cabin Ventilation',
    lengthCm: 10,
    velocityCmPerSec: 15,
    desc: 'Standard nominal ventilation airflow inside ISS Destiny / Columbus modules.'
  },
  {
    name: 'Lunar Habitat (Artemis)',
    lengthCm: 15,
    velocityCmPerSec: 10,
    desc: 'Low-speed ventilation expected in 0.16g Artemis lunar surface habitat.'
  },
  {
    name: 'SAFFIRE Resupply Duct',
    lengthCm: 40,
    velocityCmPerSec: 20,
    desc: 'Forced flow air duct inside Cygnus vehicle during SAFFIRE-I experiment.'
  },
  {
    name: 'Micro-Droplet Combustion',
    lengthCm: 0.5,
    velocityCmPerSec: 2,
    desc: 'Small droplet combustion scale inside CIR/MDCA chamber.'
  }
];

export default function GravityAnalysisView() {
  const [lengthCm, setLengthCm] = useState(10);
  const [velocityCmPerSec, setVelocityCmPerSec] = useState(15);
  const [activePreset, setActivePreset] = useState('ISS Crew Cabin Ventilation');

  // Physical constants
  // Air at T_inf = 300 K: nu = 1.5e-5 m^2/s, beta = 1 / 300 K = 0.00333 1/K
  // Flame temp difference: Delta T = 1400 K
  const calculations = useMemo(() => {
    const L = Math.max(lengthCm / 100, 0.001); // in meters
    const U = Math.max(velocityCmPerSec / 100, 0.001); // in m/s
    const nu = 1.5e-5; // m^2/s
    const betaDeltaT = (1 / 300) * 1400; // ~ 4.666

    const Re = (U * L) / nu;

    const REGIMES = [
      {
        id: 'earth',
        name: 'Earth Terrestrial',
        gCoeff: 1.0,
        gVal: 9.81,
        color: '#38bdf8',
        bodyType: 'Terrestrial Gravity'
      },
      {
        id: 'mars',
        name: 'Mars Surface',
        gCoeff: 0.38,
        gVal: 3.71,
        color: '#f97316',
        bodyType: 'Martian Gravity (Arsia Mons)'
      },
      {
        id: 'moon',
        name: 'Moon Surface',
        gCoeff: 0.166,
        gVal: 1.62,
        color: '#a855f7',
        bodyType: 'Lunar Gravity (Artemis)'
      },
      {
        id: 'iss',
        name: 'ISS Orbit (Microgravity)',
        gCoeff: 0.00001,
        gVal: 0.0001,
        color: '#00f0ff',
        bodyType: 'Freefall Orbit (LEO)'
      }
    ];

    return REGIMES.map((r) => {
      // Grashof number = (g * beta * DeltaT * L^3) / nu^2
      const Gr = (r.gVal * betaDeltaT * Math.pow(L, 3)) / Math.pow(nu, 2);
      // Richardson number = Gr / Re^2 = (g * beta * DeltaT * L) / U^2
      const Ri = (r.gVal * betaDeltaT * L) / Math.pow(U, 2);
      // Froude number = U / sqrt(g * L)
      const Fr = U / Math.sqrt(r.gVal * L);

      let regimeType = '';
      let riskLevel = '';
      let regimeDesc = '';

      if (Ri > 10) {
        regimeType = 'Natural Buoyancy Dominated';
        riskLevel = 'Standard Terrestrial Risk';
        regimeDesc = 'Strong buoyant draft feeds flame; smoke rises rapidly to ceiling.';
      } else if (Ri >= 0.1 && Ri <= 10) {
        regimeType = 'Mixed Convection (High Hazard)';
        riskLevel = 'Critical Hazard: Mixed Convection';
        regimeDesc =
          'Buoyant updraft and forced ventilation interact constructively, creating concentrated thermal spread without sufficient buoyant cooling.';
      } else {
        regimeType = 'Forced / Diffusion Dominated';
        riskLevel = 'Extinction via Radiative Quenching';
        regimeDesc =
          'Buoyancy is completely negligible; flame spread depends entirely on forced duct velocity.';
      }

      return {
        ...r,
        Re: Math.round(Re),
        Gr: Gr,
        GrScientific: Gr.toExponential(2),
        Ri: Ri,
        RiFormatted: Ri < 0.01 ? Ri.toExponential(2) : Ri.toFixed(2),
        Fr: Fr.toFixed(2),
        regimeType,
        riskLevel,
        regimeDesc
      };
    });
  }, [lengthCm, velocityCmPerSec]);

  const chartData = useMemo(() => {
    return calculations.map((c) => ({
      name: c.name.split(' ')[0],
      Grashof: parseFloat(Math.log10(Math.max(c.Gr, 1)).toFixed(2)),
      Richardson: parseFloat(Math.log10(Math.max(c.Ri, 0.0001)).toFixed(2)),
      rawRi: c.RiFormatted,
      rawGr: c.GrScientific,
      gVal: c.gVal
    }));
  }, [calculations]);

  const applyPreset = (preset) => {
    setLengthCm(preset.lengthCm);
    setVelocityCmPerSec(preset.velocityCmPerSec);
    setActivePreset(preset.name);
  };

  return (
    <div className="gravity-analysis-view">
      {/* View Header Banner */}
      <div className="view-banner-header">
        <div className="banner-left">
          <div className="status-indicator-badge">
            <Orbit size={16} className="text-cyan" />
            <span className="mono-title">PLANETARY GRAVITY LEVEL SENSITIVITY</span>
          </div>
          <h1 className="view-main-title">Gravity Level &amp; Buoyancy Analysis</h1>
          <p className="view-subtext">
            Evaluation of Grashof (Gr), Richardson (Ri), and Reynolds (Re) nondimensional scaling across Earth, Mars (0.38g), Moon (0.16g), and orbital microgravity.
          </p>
        </div>

        <div className="banner-right">
          <div className="repo-pill">
            <Scale size={14} className="text-cyan" />
            <span>NONDIMENSIONAL COMBUSTION SCALING</span>
          </div>
        </div>
      </div>

      {/* Preset Buttons Bar */}
      <div className="gravity-preset-bar">
        <span className="preset-label">REAL-WORLD PRESETS:</span>
        {GRAVITY_PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            className={`gravity-preset-btn ${activePreset === p.name ? 'active' : ''}`}
            onClick={() => applyPreset(p)}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Interactive Scaling Parameters Card */}
      <div className="gravity-calculator-card">
        <div className="calc-header">
          <Sliders size={18} className="text-cyan" />
          <h3>Interactive Boundary Parameter Controls</h3>
        </div>

        <div className="calc-sliders-grid">
          {/* Characteristic Length Scale Slider */}
          <div className="slider-item">
            <div className="slider-header-row">
              <span className="param-label">CHARACTERISTIC LENGTH SCALE (L):</span>
              <span className="param-val font-mono">{lengthCm} cm</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={lengthCm}
              onChange={(e) => {
                setLengthCm(parseInt(e.target.value));
                setActivePreset('Custom');
              }}
              className="calc-range-slider"
            />
            <div className="slider-sub">Sample or duct dimension (0.01 m to 0.50 m)</div>
          </div>

          {/* Forced Air Convective Velocity Slider */}
          <div className="slider-item">
            <div className="slider-header-row">
              <span className="param-label">FORCED AIR FLOW VELOCITY (U∞):</span>
              <span className="param-val font-mono">{velocityCmPerSec} cm/s</span>
            </div>
            <input
              type="range"
              min="2"
              max="50"
              step="1"
              value={velocityCmPerSec}
              onChange={(e) => {
                setVelocityCmPerSec(parseInt(e.target.value));
                setActivePreset('Custom');
              }}
              className="calc-range-slider"
            />
            <div className="slider-sub">Ventilation or fan duct airspeed (0.02 m/s to 0.50 m/s)</div>
          </div>
        </div>
      </div>

      {/* 4-Regime Comparative Grid */}
      <div className="regimes-display-grid">
        {calculations.map((regime) => (
          <div
            key={regime.id}
            className="regime-card"
            style={{ '--regime-color': regime.color }}
          >
            <div className="regime-card-top">
              <span className="regime-gravity font-mono">{regime.gVal} m/s²</span>
              <span className="regime-coeff">({regime.gCoeff} g₀)</span>
            </div>

            <h3 className="regime-name">{regime.name}</h3>
            <span className="regime-body-type">{regime.bodyType}</span>

            {/* Calculated Physical Nondimensional Numbers */}
            <div className="nondimensional-stats">
              <div className="stat-row">
                <span className="stat-label">Grashof Number (Gr):</span>
                <span className="stat-val font-mono">{regime.GrScientific}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Richardson Number (Ri):</span>
                <span className="stat-val font-mono text-cyan">{regime.RiFormatted}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Reynolds Number (Re):</span>
                <span className="stat-val font-mono">{regime.Re}</span>
              </div>
            </div>

            {/* Regime Classification Badge */}
            <div className="regime-classification">
              <span className="class-label">TRANSPORT REGIME:</span>
              <span className="class-tag">{regime.regimeType}</span>
            </div>

            <p className="regime-explanation">{regime.regimeDesc}</p>
          </div>
        ))}
      </div>

      {/* Logarithmic Scaling Chart Section */}
      <div className="gravity-chart-card">
        <div className="chart-card-header">
          <div>
            <span className="chart-tag">NONDIMENSIONAL REGIME CLASSIFICATION</span>
            <h3 className="chart-title">Logarithmic Comparison: Grashof (Gr) &amp; Richardson (Ri)</h3>
            <p className="chart-subtitle">
              Log₁₀ scale highlights the multi-order-of-magnitude collapse in buoyant forces from Earth to orbital microgravity.
            </p>
          </div>
        </div>

        <div className="chart-viewport-box">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" />
              <ReferenceLine y={0} stroke="rgba(255, 255, 255, 0.25)" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'Log₁₀(Dimensionless Scale)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div style={{
                        backgroundColor: '#0a1122',
                        border: '1px solid rgba(0, 240, 255, 0.3)',
                        borderRadius: '6px',
                        padding: '0.65rem 0.85rem',
                        fontSize: '12px',
                        fontFamily: 'monospace'
                      }}>
                        <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>{label} Gravity ({data.gVal} m/s²)</div>
                        <div style={{ color: '#38bdf8' }}>Grashof: {data.rawGr} (Log₁₀ = {data.Grashof})</div>
                        <div style={{ color: '#ff6b00' }}>Richardson: {data.rawRi} (Log₁₀ = {data.Richardson})</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={32} />
              <Bar dataKey="Grashof" name="Log₁₀(Grashof Number: Buoyancy / Viscous)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Richardson" name="Log₁₀(Richardson Number: Natural / Forced)" fill="#ff6b00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="regime-threshold-legend">
          <div className="legend-chip">
            <span className="legend-dot" style={{ background: '#38bdf8' }} />
            <span><strong>Ri &gt; 10:</strong> Natural Convection Dominates (Earth 1g)</span>
          </div>
          <div className="legend-chip">
            <span className="legend-dot" style={{ background: '#f97316' }} />
            <span><strong>0.1 ≤ Ri ≤ 10:</strong> Mixed Convection / Maximum Flammability (Moon &amp; Mars)</span>
          </div>
          <div className="legend-chip">
            <span className="legend-dot" style={{ background: '#00f0ff' }} />
            <span><strong>Ri &lt; 0.1:</strong> Pure Diffusion / Forced Flow (ISS Microgravity)</span>
          </div>
        </div>
      </div>

      {/* Scientific Limitations & Empirical Disclaimers */}
      <div className="scientific-limitations-card">
        <div className="limitations-header">
          <AlertTriangle size={18} className="text-orange" />
          <h3>Scientific Limitations &amp; Extrapolation Boundaries</h3>
        </div>
        <div className="limitations-body">
          <p>
            <strong>1. Partial-Gravity Hazard Paradox:</strong> Contrary to intuition, partial gravity on the Moon (0.16g) and Mars (0.38g) can produce higher flammability hazards than either Earth (1g) or orbit (0g). In terrestrial 1g, strong buoyant flow carries heat away from fuel surfaces; in microgravity, lack of oxygen can starve flames. In partial gravity (where Ri ≈ 1), buoyant flow is slow enough to avoid convective cooling yet strong enough to continuously supply oxygen.
          </p>
          <p>
            <strong>2. Ground-Based Drop Tower Constraints:</strong> NASA drop towers (such as the 2.2-Second and 5.18-Second Zero Gravity Facilities at NASA GRC) provide pristine microgravity (10⁻⁵ g), but the brief duration limits combustion trials to thin ignition stages. Full-scale material burns require extended orbital flight trials like SAFFIRE.
          </p>
          <p>
            <strong>3. Centrifuge Inaccuracies:</strong> Simulating Lunar and Martian gravity aboard orbital centrifuges introduces Coriolis forces (2 · ω × v) that do not exist on actual planetary surfaces, creating artificial flame asymmetry that must be mathematically decoupled.
          </p>
        </div>
      </div>
    </div>
  );
}
