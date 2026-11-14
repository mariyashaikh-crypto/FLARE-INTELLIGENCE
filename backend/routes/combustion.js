import express from 'express';
import { scanDatasets, resolveDatasetPath } from '../services/datasetService.js';

const router = express.Router();

/**
 * Metadata for NASA's Flame in Freefall Combustion Science Experiments
 */
export const EXPERIMENT_METADATA = {
  'BASS-II': {
    id: 'bass-ii',
    name: 'BASS-II',
    fullName: 'Burning and Suppression of Solids - II',
    platform: 'International Space Station (ISS) Microgravity Science Glovebox',
    combustionMode: 'Solid surface flame spread and extinction in microgravity',
    fuels: ['PMMA (Polymethyl Methacrylate)', 'Cotton-fiberglass blends', 'Nomex', 'Thin flat sheets and cylindrical fuels'],
    keyParameters: [
      'Concurrent and opposed flow velocity (cm/s)',
      'Oxygen concentration (16% - 30%)',
      'Solid fuel thickness (mm)',
      'Extinction limit velocity'
    ],
    scientificObjective: 'Investigate flame extinction limits and burning rates of solid fuels in low-velocity forced flows to improve spacecraft fire safety materials standards.'
  },
  'FLEX': {
    id: 'flex',
    name: 'FLEX / FLEX-2',
    fullName: 'Flame Extinction Experiment',
    platform: 'ISS Multi-user Droplet Combustion Apparatus (MDCA) in CIR',
    combustionMode: 'Spherically symmetric liquid droplet combustion and cool flames',
    fuels: ['Heptane', 'Methanol', 'Decane', 'Heptane/Iso-octane mixtures'],
    keyParameters: [
      'Initial droplet diameter (0.5 mm - 5 mm)',
      'Ambient gas composition (O2/N2/CO2/He)',
      'Cool flame transition temperature',
      'Extinction droplet diameter (d_ext)'
    ],
    scientificObjective: 'Study droplet burning rates, radiative extinction, and low-temperature "cool flame" chemistry unmasked by microgravity diffusion.'
  },
  'SAFFIRE-I': {
    id: 'saffire-i',
    name: 'SAFFIRE-I',
    fullName: 'Spacecraft Fire Safety Demonstration - I',
    platform: 'Cygnus Resupply Spacecraft (post-ISS departure)',
    combustionMode: 'Large-scale solid material flammability in low gravity',
    fuels: ['SIBAL fabric (75% cotton / 25% fiberglass)', 'Plexiglas (PMMA) sample (0.4m x 1.0m)'],
    keyParameters: [
      'Forced air flow duct velocity (20 cm/s)',
      'Flue gas temperature & radiant flux',
      'Flame spread rate (mm/s)',
      'Oxygen consumption rate'
    ],
    scientificObjective: 'Demonstrate realistic, large-scale fire growth and material flammability in an uncrewed spacecraft module.'
  },
  'SPICE': {
    id: 'spice',
    name: 'SPICE',
    fullName: 'Smoke Point In Co-flow Experiment',
    platform: 'ISS Microgravity Science Glovebox (MSG)',
    combustionMode: 'Gaseous laminar co-flow diffusion flames',
    fuels: ['Methane', 'Ethylene', 'Propane', 'Propylene'],
    keyParameters: [
      'Fuel flow rate (mg/s)',
      'Co-flow air velocity (cm/s)',
      'Laminar smoke point flame length',
      'Soot yield and radiation fraction'
    ],
    scientificObjective: 'Determine the smoke point of gaseous fuels in microgravity to understand sooting tendencies and radiative heat loss.'
  },
  'E-FIELD Flames': {
    id: 'e-field-flames',
    name: 'E-FIELD Flames',
    fullName: 'Electric-Field Effects on Laminar Diffusion Flames',
    platform: 'ISS Combustion Integrated Rack (CIR) / ACME',
    combustionMode: 'Gas-phase diffusion flames subjected to DC electric fields',
    fuels: ['Methane', 'Ethylene with diluents'],
    keyParameters: [
      'Applied electric potential (0 to +/- 10 kV)',
      'Ion current density (uA/cm2)',
      'Flame shape and soot distribution',
      'Extinction voltage limit'
    ],
    scientificObjective: 'Investigate how ion-driven electrical body forces alter flame stability, soot generation, and pollutant emissions in microgravity.'
  }
};

/**
 * GET /api/combustion/experiments
 * Returns reference catalog for the 5 NASA combustion experiments
 */
router.get('/experiments', (req, res) => {
  res.status(200).json({
    status: 'ok',
    challenge: 'NASA Flame in Freefall Challenge',
    domain: 'Microgravity Combustion Science',
    experiments: EXPERIMENT_METADATA
  });
});

/**
 * GET /api/combustion/datasets
 * Scans the configured dataset folder (FLARE_DATASET_PATH or Desktop/FLARE_INTELLIGENCE_DATA)
 */
router.get('/datasets', (req, res) => {
  try {
    const scanResult = scanDatasets();
    res.status(200).json({
      status: 'ok',
      challenge: 'NASA Flame in Freefall',
      ...scanResult
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * GET /api/combustion/summary
 * Returns high-level summary of datasets and experiment coverage
 */
router.get('/summary', (req, res) => {
  try {
    const scanResult = scanDatasets();
    const pathInfo = resolveDatasetPath();

    res.status(200).json({
      status: 'ok',
      challenge: 'NASA Flame in Freefall',
      domain: 'Microgravity Combustion Science',
      configuredPath: pathInfo.path,
      pathSource: pathInfo.source,
      pathExists: pathInfo.exists,
      totalDatasetsFound: scanResult.totalFiles,
      experimentsTracked: Object.keys(EXPERIMENT_METADATA),
      experimentsCount: scanResult.experimentsCount
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * Default router fallback: also alias GET /api/flares to /api/combustion/datasets
 * so any legacy or existing caller continues to work seamlessly.
 */
router.get('/', (req, res) => {
  try {
    const scanResult = scanDatasets();
    res.status(200).json({
      status: 'ok',
      challenge: 'NASA Flame in Freefall',
      domain: 'Microgravity Combustion Science',
      ...scanResult
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
