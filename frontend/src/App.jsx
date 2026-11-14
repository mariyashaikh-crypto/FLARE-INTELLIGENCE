import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHealthStatus(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to reach backend:', err);
        setHealthStatus({ status: 'offline', message: 'Backend unreachable' });
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>FLARE INTELLIGENCE</h1>
        <p className="subtitle">Project Scaffold Initialized</p>
      </header>

      <main className="content">
        <div className="card">
          <h2>Backend Health Status</h2>
          {loading ? (
            <p className="status-text">Checking /api/health...</p>
          ) : (
            <div className="status-info">
              <p>
                <strong>Status:</strong>{' '}
                <span className={healthStatus?.status === 'ok' ? 'badge-ok' : 'badge-error'}>
                  {healthStatus?.status || 'Unknown'}
                </span>
              </p>
              {healthStatus?.message && (
                <p>
                  <strong>Message:</strong> {healthStatus.message}
                </p>
              )}
              {healthStatus?.timestamp && (
                <p>
                  <strong>Timestamp:</strong> {healthStatus.timestamp}
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
