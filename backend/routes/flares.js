import express from 'express';
import { getAvailableDatasets } from '../services/datasetService.js';

const router = express.Router();

/**
 * GET /api/flares
 * Returns summary of available local flare datasets
 */
router.get('/', (req, res) => {
  try {
    const datasets = getAvailableDatasets();
    res.status(200).json({
      status: 'ok',
      totalDatasets: datasets.length,
      datasets: datasets,
      message: datasets.length === 0 
        ? 'No local datasets found in data/ directory yet. Place NASA CSV/JSON files in the data folder.' 
        : 'Datasets indexed successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
