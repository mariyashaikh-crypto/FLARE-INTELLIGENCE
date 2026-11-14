import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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
const NODE_ENV = process.env.NODE_ENV || 'development';

// 1. Security & Hardening: Disable Express fingerprinting
app.disable('x-powered-by');

// 2. Security Headers Middleware (Production-grade, zero external dependencies)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// 3. Environment-Aware CORS Configuration
const allowedOriginSetting = process.env.CORS_ORIGIN || process.env.FRONTEND_ORIGIN;
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. curl, server-to-server, tests)
    if (!origin) return callback(null, true);
    if (NODE_ENV !== 'production' || !allowedOriginSetting) {
      return callback(null, true);
    }
    const origins = allowedOriginSetting.split(',').map((o) => o.trim());
    if (origins.includes(origin) || origins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS policy'));
  },
  methods: ['GET', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};
app.use(cors(corsOptions));

// 4. Request Body Validation with Safe Size Limit
app.use(express.json({ limit: '512kb' }));

// 5. Health Check Endpoint (Preserved & Verified)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'FLARE INTELLIGENCE backend server is running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// 6. NASA Flame in Freefall Microgravity Combustion Routes
app.use('/api/combustion', combustionRouter);
app.use('/api/flames', combustionRouter);
app.use('/api/flares', combustionRouter); // Backward compatibility alias

// 7. Safe 404 Route Handler for undefined endpoints
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// 8. Centralized Safe Error Handling Middleware
// Prevents leaking internal stack traces in production
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const isProd = NODE_ENV === 'production';
  const statusCode = err.status || 500;
  console.error(`[BACKEND ERROR] ${req.method} ${req.url}:`, err.message);

  res.status(statusCode).json({
    status: 'error',
    message: isProd && statusCode === 500 ? 'Internal server error' : err.message,
    ...(isProd ? {} : { stack: err.stack })
  });
});

// Start the server only when executed directly (not when imported in test suites)
const currentFilePath = fileURLToPath(import.meta.url);
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFilePath);

let serverInstance = null;
if (isDirectRun && process.env.NODE_ENV !== 'test') {
  serverInstance = app.listen(PORT, () => {
    console.log(`FLARE INTELLIGENCE server running in ${NODE_ENV} mode on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Combustion API: http://localhost:${PORT}/api/combustion/summary`);
  });
}

export { app, serverInstance };
export default app;
