import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [combustionSummary, setCombustionSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Verify health endpoint
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHealthStatus(data);
      })
      .catch((err) => {
        console.error('Failed to reach backend health endpoint:', err);
        setHealthStatus({ status: 'offline', message: 'Backend unreachable' });
      });

    // 2. Fetch combustion dataset configuration summary
    fetch('/api/combustion/summary')
      .then((res) => res.json())
      .then((data) => {
        setCombustionSummary(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Combustion summary endpoint check:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>FLARE INTELLIGENCE</h1>
        <p className="subtitle">
          NASA &quot;Flame in Freefall&quot; Challenge — Microgravity Combustion Science Platform
        </p>
      </header>

      <main className="content">
        {/* Backend Health Status Card (Preserved & Verified) */}
        <div className="card">
          <h2>Backend Health Status</h2>
          {healthStatus ? (
            <div className="status-info">
              <p>
                <strong>Status:</strong>{' '}
                <span className={healthStatus.status === 'ok' ? 'badge-ok' : 'badge-error'}>
                  {healthStatus.status}
                </span>
              </p>
              {healthStatus.message && (
                <p>
                  <strong>Message:</strong> {healthStatus.message}
                </p>
              )}
              {healthStatus.timestamp && (
                <p>
                  <strong>Timestamp:</strong> {healthStatus.timestamp}
                </p>
              )}
            </div>
          ) : (
            <p className="status-text">Checking /api/health...</p>
          )}
        </div>

        {/* Dataset Path Configuration Card */}
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h2>NASA Combustion Datasets Configuration</h2>
          {loading ? (
            <p className="status-text">Detecting dataset path...</p>
          ) : (
            <div className="status-info">
              <p>
                <strong>Domain:</strong> Microgravity Combustion Science (BASS-II, FLEX, SAFFIRE-I, SPICE, E-FIELD Flames)
              </p>
              <p>
                <strong>Configured Folder:</strong>{' '}
                <code>{combustionSummary?.configuredPath || 'Desktop/FLARE_INTELLIGENCE_DATA'}</code>
              </p>
              <p>
                <strong>Dataset Folder Status:</strong>{' '}
                <span className={combustionSummary?.pathExists ? 'badge-ok' : 'badge-warn'}>
                  {combustionSummary?.pathExists ? 'Connected' : 'Pending Folder Creation'}
                </span>
              </p>
              <p>
                <strong>Datasets Indexed:</strong> {combustionSummary?.totalDatasetsFound || 0} file(s)
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
