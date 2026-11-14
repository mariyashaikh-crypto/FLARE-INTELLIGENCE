# FLARE INTELLIGENCE

A local, lightweight full-stack application for solar and space weather intelligence analysis.

---

## Project Structure

```
FLARE_INTELLIGENCE/
├── backend/
│   ├── package.json         # Node.js backend dependencies and scripts
│   └── server.js            # Express server with /api/health endpoint
├── frontend/
│   ├── index.html           # Main HTML entry point
│   ├── package.json         # Vite + React dependencies and scripts
│   ├── vite.config.js       # Vite configuration with backend proxy
│   ├── public/
│   │   └── vite.svg         # Application icon
│   └── src/
│       ├── App.css          # Application styles
│       ├── App.jsx          # Root React component connecting to /api/health
│       ├── index.css        # Base stylesheet
│       └── main.jsx         # React application entry point
├── data/                    # Reserved folder for NASA dataset files
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

Open a terminal in the root directory:

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

Open another terminal in the root directory:

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

- `GET /api/health`: Returns JSON confirming server operational status:
  ```json
  {
    "status": "ok",
    "message": "FLARE INTELLIGENCE backend server is running",
    "timestamp": "2026-11-13T16:20:00.000Z"
  }
  ```
