/**
 * Solar Flare Classification & Space Weather Intelligence Constants
 */

export const FLARE_CLASSES = {
  X: {
    name: 'X-Class (Extreme)',
    description: 'Major solar events capable of planet-wide radio blackouts and long-lasting radiation storms.',
    color: '#ef4444',
    severity: 'critical',
    minFlux: 1e-4 // W/m^2
  },
  M: {
    name: 'M-Class (Medium)',
    description: 'Can cause brief radio blackouts affecting Earth polar regions and minor radiation storms.',
    color: '#f97316',
    severity: 'high',
    minFlux: 1e-5
  },
  C: {
    name: 'C-Class (Small)',
    description: 'Minor events with few noticeable consequences on Earth.',
    color: '#eab308',
    severity: 'moderate',
    minFlux: 1e-6
  },
  B: {
    name: 'B-Class (Background)',
    description: 'Low-level solar background activity.',
    color: '#3b82f6',
    severity: 'low',
    minFlux: 1e-7
  },
  A: {
    name: 'A-Class (Negligible)',
    description: 'Near-baseline solar radiation.',
    color: '#10b981',
    severity: 'minimal',
    minFlux: 1e-8
  }
};

export const SPACE_WEATHER_SCALES = {
  RADIO_BLACKOUT: 'R',
  GEOMAGNETIC_STORM: 'G',
  SOLAR_RADIATION_STORM: 'S'
};
