/**
 * NASA "Flame in Freefall" Challenge
 * Microgravity Combustion Science Constants & Experiment Taxonomy
 */

export const EXPERIMENTS = {
  BASS_II: {
    id: 'bass-ii',
    name: 'BASS-II',
    fullName: 'Burning and Suppression of Solids - II',
    facility: 'ISS Microgravity Science Glovebox',
    combustionType: 'Solid Surface Combustion & Flame Spread',
    fuels: [
      { name: 'PMMA (Polymethyl Methacrylate)', type: 'Cast Acrylic / Plexiglas' },
      { name: 'Cotton-Fiberglass Fabric (SIBAL)', type: 'Composite Textile' },
      { name: 'Nomex', type: 'Flame-Resistant Meta-Aramid' }
    ],
    primaryVariables: ['Duct Flow Velocity (cm/s)', 'Oxygen Concentration (vol %)', 'Fuel Thickness (mm)'],
    criticalPhenomena: ['Low-speed forced flow flame stabilization', 'Radiative flame extinction limits'],
    color: '#f97316'
  },
  FLEX: {
    id: 'flex',
    name: 'FLEX',
    fullName: 'Flame Extinction Experiment',
    facility: 'ISS Multi-user Droplet Combustion Apparatus (MDCA) in CIR',
    combustionType: 'Isolated Liquid Droplet Combustion',
    fuels: [
      { name: 'Heptane', type: 'Pure Alkane' },
      { name: 'Decane', type: 'High-Molecular-Weight Alkane' },
      { name: 'Methanol', type: 'Alcohol' },
      { name: 'Heptane / Iso-octane', type: 'Binary Fuel Blend' }
    ],
    primaryVariables: ['Initial Droplet Diameter (mm)', 'Inert Diluent (N2, CO2, He)', 'Ambient Pressure (atm)'],
    criticalPhenomena: ['Low-temperature "cool flame" chemistry', 'Diffusive spherical burning', 'Radiative droplet extinction'],
    color: '#06b6d4'
  },
  SAFFIRE_I: {
    id: 'saffire-i',
    name: 'SAFFIRE-I',
    fullName: 'Spacecraft Fire Safety Demonstration - I',
    facility: 'Cygnus Autonomous Resupply Vehicle (Post-Departure)',
    combustionType: 'Large-Scale Real Environment Spacecraft Combustion',
    fuels: [
      { name: 'SIBAL Composite Fabric (75% Cotton / 25% Fiberglass)', type: 'Large-scale sample (0.4m x 1.0m)' },
      { name: 'PMMA Solid Slabs', type: 'Thick Thermoplastic' }
    ],
    primaryVariables: ['Flow Duct Speed (0.2 m/s)', 'Radiant Heat Flux (kW/m²)', 'Cabin Pressure (kPa)'],
    criticalPhenomena: ['Realistic spacecraft compartment fire growth', 'Low-g flame spread over large textiles'],
    color: '#ef4444'
  },
  SPICE: {
    id: 'spice',
    name: 'SPICE',
    fullName: 'Smoke Point In Co-flow Experiment',
    facility: 'ISS Microgravity Science Glovebox',
    combustionType: 'Gaseous Laminar Diffusion Flames',
    fuels: [
      { name: 'Methane', type: 'Gas Alkane' },
      { name: 'Ethylene', type: 'Alkene' },
      { name: 'Propane', type: 'Gas Alkane' }
    ],
    primaryVariables: ['Fuel Flow Rate (mg/s)', 'Co-flow Air Velocity (cm/s)', 'Burner Diameter (mm)'],
    criticalPhenomena: ['Smoke point transition', 'Soot formation & radiation in microgravity'],
    color: '#8b5cf6'
  },
  E_FIELD: {
    id: 'e-field',
    name: 'E-FIELD Flames',
    fullName: 'Electric-Field Effects on Laminar Diffusion Flames',
    facility: 'ISS Combustion Integrated Rack / ACME',
    combustionType: 'Ion-Driven Electrically Controlled Gas Flames',
    fuels: [
      { name: 'Methane / Diluent', type: 'Gas Diffusion Flame' },
      { name: 'Ethylene', type: 'Sooting Gaseous Fuel' }
    ],
    primaryVariables: ['Applied High Voltage (0 to ±10 kV)', 'Electrode Gap (mm)', 'Ionic Current (µA)'],
    criticalPhenomena: ['Ionic wind effect', 'Electrical flame stabilization & soot suppression'],
    color: '#10b981'
  }
};

/**
 * Key Diagnostic Physical Metrics for Microgravity Combustion
 */
export const COMBUSTION_METRICS = {
  BURNING_RATE: { label: 'Burn Rate (dr/dt)', unit: 'mm/s', description: 'Regression or flame progression rate' },
  EXTINCTION_LIMIT: { label: 'Extinction Limit', unit: 'cm/s or % O2', description: 'Boundary conditions causing flame blowout or radiative quenching' },
  FLAME_STANDOFF: { label: 'Flame Standoff Distance', unit: 'mm', description: 'Distance between fuel surface and reaction zone' },
  SOOT_FRACTION: { label: 'Soot Volume Fraction (fv)', unit: 'ppm', description: 'Carbon particulate concentration within the flame' },
  OXYGEN_INDEX: { label: 'Limiting Oxygen Index (LOI)', unit: 'vol %', description: 'Minimum O2 required to support sustained combustion' },
  HEAT_RELEASE_RATE: { label: 'Heat Release Rate', unit: 'kW/m²', description: 'Radiant and convective energy release' }
};

// Aliases for backward compatibility
export const EXPERIMENT_LIST = Object.values(EXPERIMENTS);
export const FLARE_CLASSES = EXPERIMENTS; // Deprecated alias
