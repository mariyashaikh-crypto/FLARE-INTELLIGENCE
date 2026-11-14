# FLARE INTELLIGENCE

A local, lightweight full-stack application for solar and space weather intelligence analysis.

---

## Project Structure

```
FLARE_INTELLIGENCE/
├── backend/
│   ├── routes/
│   │   └── flares.js        # Dataset routes for solar flares
│   ├── services/
│   │   └── datasetService.js# Local NASA dataset file loader & parser
│   ├── package.json         # Node.js backend dependencies and scripts
│   ├── package-lock.json
│   └── server.js            # Express server with /api/health & /api/flares
├── frontend/
│   ├── public/
│   │   └── vite.svg         # Application icon
│   ├── src/
│   │   ├── components/      # Modular UI components
│   │   │   ├── common/      # Reusable UI widgets
│   │   │   └── dashboard/   # Dashboard widgets (metrics, timeline, overview)
│   │   ├── constants/
│   │   │   └── flareConstants.js # Solar flare classifications & severity scales
│   │   ├── services/
│   │   │   └── api.js       # Frontend API client
│   │   ├── App.css          # Application styles
│   │   ├── App.jsx          # Root React component connecting to /api/health
│   │   ├── index.css        # Base stylesheet
│   │   └── main.jsx         # React application entry point
│   ├── index.html           # Main HTML entry point
│   ├── package.json         # Vite + React dependencies and scripts
│   ├── package-lock.json
│   └── vite.config.js       # Vite configuration with backend proxy
├── data/                    # Reserved directory for local NASA datasets (.csv / .json)
├── .gitignore               # Standard Node.js & environment gitignore
└── README.md                # Project documentation and startup guide
```

---

## Prerequisites

- **Node.js** (v18.x or newer recommended; tested on v26.x)
- **npm** (v9.x or newer)

---

## Installation & Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## Running the Applications

### 1. Start the Backend Server

From the `backend` directory:

```bash
cd backend
npm run dev
```

* Alternatively, start with `npm start`.
* The server will run on: `http://localhost:5000`
* Health check endpoint: `http://localhost:5000/api/health`

### 2. Start the Frontend Development Server

From the `frontend` directory:

```bash
cd frontend
npm run dev
```

* The React + Vite application will run on: `http://localhost:5173`
* Vite automatically proxies `/api` requests to the Express backend at `http://localhost:5000`.

---

## API Endpoints

- `GET /api/health`: Confirms server operational status:
  ```json
  {
    "status": "ok",
    "message": "FLARE INTELLIGENCE backend server is running",
    "timestamp": "2026-11-14T04:15:00.000Z"
  }
  ```
- `GET /api/flares`: Returns status and summary of local NASA dataset files available in `data/`.
