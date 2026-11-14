import React, { useState, useEffect } from 'react';
import {
  Flame,
  Menu,
  RefreshCw,
  Wifi,
  WifiOff,
  FolderCheck,
  FolderSync,
  Clock,
  Radio
} from 'lucide-react';

export default function TopNav({
  isSidebarCollapsed,
  onToggleSidebar,
  health,
  summary,
  loading,
  onRefresh
}) {
  const [utcTime, setUtcTime] = useState('');

  // Live mission clock (UTC)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const iso = now.toISOString().replace('T', ' • ').replace('Z', ' UTC');
      setUtcTime(iso);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isServerOnline = health?.status === 'ok';
  const isDataConnected = summary?.pathExists;
  const datasetsCount = summary?.totalDatasetsFound ?? 0;

  return (
    <header className="top-nav">
      <div className="nav-left">
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expand navigation sidebar' : 'Collapse navigation sidebar'}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu size={20} />
        </button>

        <div className="brand-group">
          <div className="brand-icon-wrap">
            <Flame size={22} className="flame-glow-icon" />
          </div>
          <div className="brand-titles">
            <span className="brand-name">FLARE INTELLIGENCE</span>
            <span className="brand-badge">NASA FLAME IN FREEFALL</span>
          </div>
        </div>
      </div>

      <div className="nav-center">
        {/* Mission Telemetry Clock */}
        <div className="mission-clock">
          <Clock size={14} className="clock-icon" />
          <span className="clock-label">MISSION TIME:</span>
          <span className="clock-time">{utcTime || 'SYNCHRONIZING...'}</span>
        </div>
      </div>

      <div className="nav-right">
        {/* API Health Live Badge */}
        <div
          className={`telemetry-pill ${isServerOnline ? 'pill-online' : 'pill-offline'}`}
          title={`Backend Server Status: ${health?.status || 'connecting'}`}
        >
          {isServerOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
          <span className="pill-dot" />
          <span className="pill-text">{isServerOnline ? 'API LIVE' : 'DISCONNECTED'}</span>
        </div>

        {/* Dataset Path Badge */}
        <div
          className={`telemetry-pill ${isDataConnected ? 'pill-data-ok' : 'pill-data-wait'}`}
          title={`Dataset Folder: ${summary?.configuredPath || 'Desktop/FLARE_INTELLIGENCE_DATA'}`}
        >
          {isDataConnected ? <FolderCheck size={13} /> : <FolderSync size={13} />}
          <span className="pill-text">
            {isDataConnected ? `DATA: ${datasetsCount} FILES` : 'DATA: DESKTOP PENDING'}
          </span>
        </div>

        {/* Refresh Action */}
        <button
          type="button"
          className="nav-action-btn"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh telemetry and rescan datasets"
        >
          <RefreshCw size={14} className={loading ? 'spinning' : ''} />
        </button>
      </div>
    </header>
  );
}
