# FLARE INTELLIGENCE

A full-stack intelligence and analytics platform developed for **NASA's "Flame in Freefall" Challenge**, focusing on **Microgravity Combustion Science**.

The platform is designed to ingest, process, and analyze combustion data across five core NASA microgravity research experiments:
1. **BASS-II** (Burning and Suppression of Solids - II)
2. **FLEX** (Flame Extinction Experiment / Droplet Combustion)
3. **SAFFIRE-I** (Spacecraft Fire Safety Demonstration)
4. **SPICE** (Smoke Point In Co-flow Experiment)
5. **E-FIELD Flames** (Electric-Field Effects on Laminar Diffusion Flames)

---

## Project Structure

```
FLARE_INTELLIGENCE/
├── backend/
│   ├── routes/
│   │   ├── combustion.js    # NASA combustion experiments & dataset endpoints
│   │   └── flares.js        # Compatibility route pointing to combustion router
│   ├── services/
│   │   └── datasetService.js# Read-only dataset scanner & loader (configurable path)
│   ├── package.json         # Node.js backend dependencies and scripts
│   ├── package-lock.json
│   └── server.js            # Express server with /api/health & /api/combustion
├── frontend/
│   ├── public/
│   │   └── vite.svg         # Application icon
│   ├── src/
│   │   ├── components/      # Modular UI components
│   │   │   ├── common/      # Reusable widgets
│   │   │   └── dashboard/   # Combustion dashboard components
│   │   ├── constants/
│   │   │   ├── combustionConstants.js # BASS-II, FLEX, SAFFIRE, SPICE, E-FIELD taxonomy
│   │   │   └── flareConstants.js      # Compatibility re-export
│   │   ├── services/
│   │   │   └── api.js       # Frontend API client
│   │   ├── App.css          # Application styles
│   │   ├── App.jsx          # Root component verifying health & dataset config
│   │   ├── index.css        # Base stylesheet
│   │   └── main.jsx         # React application entry point
│   ├── index.html           # Main HTML entry point
│   ├── package.json         # Vite + React dependencies and scripts
│   ├── package-lock.json
│   └── vite.config.js       # Vite configuration with backend proxy
├── data/                    # Local workspace fallback folder for NASA datasets
├── .env.example             # Template for configurable dataset folder path
├── .gitignore               # Standard Node.js & environment gitignore
└── README.md                # Project documentation and guide
```

---

## Dataset Configuration

The backend is configured to read your external NASA combustion datasets from your Desktop without modifying or moving original files.

### Configuration Methods

1. **Automatic Desktop Detection**:
   If a folder named `FLARE_INTELLIGENCE_DATA` exists on your Desktop (`C:\Users\<username>\Desktop\FLARE_INTELLIGENCE_DATA`), it is automatically detected and indexed in read-only mode.

2. **Custom Path via `.env`**:
   Copy `.env.example` to `.env` (or edit `.env`):
   ```env
   PORT=5000
   FLARE_DATASET_PATH=C:\Users\<username>\Desktop\FLARE_INTELLIGENCE_DATA
   ```

3. **Workspace Fallback**:
   If no external folder is set or found, the backend safely falls back to `./data` inside the workspace.

---

## Prerequisites

- **Node.js** (v18.x or newer recommended; tested on v26.x)
- **npm** (v9.x or newer)

---

## Running the Applications

### Development Mode

**Backend** (from project root):
```bash
cd backend
npm run dev
```
> Starts with `nodemon` for auto-reload on file changes. URL: `http://localhost:5000`

**Frontend** (from project root):
```bash
cd frontend
npm run dev
```
> Vite dev server with HMR at `http://localhost:5173`. All `/api` calls are proxied to the backend.

### Production Mode

**Backend:**
```bash
cd backend
npm start
# Or with explicit environment:
NODE_ENV=production PORT=5000 CORS_ORIGIN=https://your-domain.com node server.js
```

**Frontend build:**
```bash
cd frontend
npm run build
# Output: frontend/dist/ — serve with any static file server
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Backend server port |
| `NODE_ENV` | `development` | `development` or `production` (controls CORS, error detail, HSTS) |
| `CORS_ORIGIN` | *(all origins in dev)* | Comma-separated allowed frontend origins in production, e.g. `https://your-domain.com` |
| `FRONTEND_ORIGIN` | *(alias for CORS_ORIGIN)* | Alternative env var name for allowed frontend origin |
| `FLARE_DATASET_PATH` | `~/Desktop/FLARE_INTELLIGENCE_DATA` | Absolute path to local NASA dataset folder |

Set via `.env` file in the project root (copy from `.env.example`), or as shell environment variables.

---

## Running Backend Tests

The backend ships with an automated test suite covering all API endpoints (zero external dependencies — uses Node.js built-in `node:test`):

```bash
cd backend
npm test
# Or from project root:
npm test --prefix backend
```

Expected output: **8/8 tests pass**, exit code 0. Tests cover:
1. `GET /api/health` — status, message, security headers
2. `GET /api/combustion/summary` — schema, experiment list, path status
3. `GET /api/combustion/experiments` — full metadata catalog for all 5 experiments
4. `GET /api/combustion/experimental-data` — published NASA benchmark datasets
5. `GET /api/combustion/highlights` — research highlights with citations
6. `GET /api/combustion/research-activity` — scholarly DOI-linked activities
7. `GET /api/combustion/datasets` — dataset directory scanner
8. `GET /api/nonexistent-route` — safe 404 JSON response

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status, environment, timestamp |
| `GET` | `/api/combustion/summary` | Dataset path, connection status, file counts per experiment |
| `GET` | `/api/combustion/experiments` | Scientific metadata for BASS-II, FLEX, SAFFIRE-I, SPICE, E-FIELD Flames |
| `GET` | `/api/combustion/experimental-data` | Published NASA benchmark datasets (chart-ready series) |
| `GET` | `/api/combustion/highlights` | Key research highlights and breakthroughs |
| `GET` | `/api/combustion/research-activity` | Scholarly publications with DOIs |
| `GET` | `/api/combustion/datasets` | Recursive index of all local dataset files (read-only) |

**Health check response example:**
```json
{
  "status": "ok",
  "message": "FLARE INTELLIGENCE backend server is running",
  "environment": "development",
  "timestamp": "2026-11-14T04:20:00.000Z"
}
```
