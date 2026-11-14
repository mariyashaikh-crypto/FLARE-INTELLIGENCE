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

### 1. Start the Backend Server

From the `backend` directory:

```bash
cd backend
npm run dev
```

* Standard production start: `npm start`
* URL: `http://localhost:5000`
* Health Check: `http://localhost:5000/api/health`
* Combustion Summary: `http://localhost:5000/api/combustion/summary`
* Experiment Catalog: `http://localhost:5000/api/combustion/experiments`
* Dataset Index: `http://localhost:5000/api/combustion/datasets`

### 2. Start the Frontend Development Server

From the `frontend` directory:

```bash
cd frontend
npm run dev
```

* URL: `http://localhost:5173`
* Vite automatically proxies `/api` calls to the Express backend at `http://localhost:5000`.

---

## API Endpoints

- `GET /api/health`: Confirms backend server operational status:
  ```json
  {
    "status": "ok",
    "message": "FLARE INTELLIGENCE backend server is running",
    "timestamp": "2026-11-14T04:20:00.000Z"
  }
  ```
- `GET /api/combustion/summary`: Returns configured dataset path, connection status, and file counts per experiment.
- `GET /api/combustion/experiments`: Returns detailed scientific metadata for BASS-II, FLEX, SAFFIRE-I, SPICE, and E-FIELD Flames.
- `GET /api/combustion/datasets`: Recursively indexes all available dataset files (`.csv`, `.json`, `.txt`, `.tsv`, `.dat`) in read-only mode.
