import express from 'express';
import cors from 'cors';
import fs from 'fs';
import combustionRouter from './routes/combustion.js';

// Auto-load .env configuration if present
const envCandidates = ['.env', '../.env', 'backend/.env'];
for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
          if (key && !process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
    break;
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint (Preserved & verified)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'FLARE INTELLIGENCE backend server is running',
    timestamp: new Date().toISOString()
  });
});

// NASA Flame in Freefall Microgravity Combustion Routes
app.use('/api/combustion', combustionRouter);
app.use('/api/flames', combustionRouter);
app.use('/api/flares', combustionRouter); // Backward compatibility alias

// Start the server
app.listen(PORT, () => {
  console.log(`FLARE INTELLIGENCE server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Combustion API: http://localhost:${PORT}/api/combustion/summary`);
});
