import express from 'express';
import cors from 'cors';
import flaresRouter from './routes/flares.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'FLARE INTELLIGENCE backend server is running',
    timestamp: new Date().toISOString()
  });
});

// Solar flare datasets route
app.use('/api/flares', flaresRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
