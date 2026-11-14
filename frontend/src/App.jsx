import React, { useState, useEffect, useCallback } from 'react';
import TopNav from './components/common/TopNav.jsx';
import Sidebar from './components/common/Sidebar.jsx';
import OverviewView from './components/dashboard/OverviewView.jsx';
import PlaceholderView from './components/dashboard/PlaceholderView.jsx';
import {
  checkHealth,
  fetchCombustionSummary,
  fetchCombustionExperiments,
  fetchExperimentalData,
  fetchResearchHighlights,
  fetchResearchActivities
} from './services/api.js';
import './App.css';

export default function App() {
  const [activeView, setActiveView] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Real backend telemetry state
  const [health, setHealth] = useState(null);
  const [summary, setSummary] = useState(null);
  const [experiments, setExperiments] = useState({});
  const [experimentalData, setExperimentalData] = useState({});
  const [highlights, setHighlights] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(Date.now());

  const loadTelemetry = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch health endpoint
      try {
        const healthData = await checkHealth();
        setHealth(healthData);
      } catch (err) {
        console.error('Failed to reach /api/health:', err);
        setHealth({ status: 'offline', message: 'Backend unreachable' });
      }

      // 2. Fetch dataset configuration summary
      try {
        const summaryData = await fetchCombustionSummary();
        setSummary(summaryData);
      } catch (err) {
        console.warn('Combustion summary error:', err);
      }

      // 3. Fetch combustion experiments metadata
      try {
        const expData = await fetchCombustionExperiments();
        if (expData?.experiments) {
          setExperiments(expData.experiments);
        }
      } catch (err) {
        console.warn('Combustion experiments error:', err);
      }

      // 4. Fetch NASA published experimental datasets
      try {
        const dataRes = await fetchExperimentalData();
        if (dataRes?.datasets) {
          setExperimentalData(dataRes.datasets);
        }
      } catch (err) {
        console.warn('Experimental datasets error:', err);
      }

      // 5. Fetch research highlights
      try {
        const hlRes = await fetchResearchHighlights();
        if (hlRes?.highlights) {
          setHighlights(hlRes.highlights);
        }
      } catch (err) {
        console.warn('Highlights error:', err);
      }

      // 6. Fetch scholarly research activity & source references
      try {
        const actRes = await fetchResearchActivities();
        if (actRes?.activities) {
          setActivities(actRes.activities);
        }
      } catch (err) {
        console.warn('Research activities error:', err);
      }
    } finally {
      setLoading(false);
      setLastRefreshed(Date.now());
    }
  }, []);

  useEffect(() => {
    loadTelemetry();
  }, [loadTelemetry]);

  return (
    <div className="mission-dashboard-shell">
      {/* Top Mission Control Bar */}
      <TopNav
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        health={health}
        summary={summary}
        loading={loading}
        onRefresh={loadTelemetry}
      />

      <div className="dashboard-main-layout">
        {/* Collapsible Sidebar */}
        <Sidebar
          activeView={activeView}
          onSelectView={(viewId) => setActiveView(viewId)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          summary={summary}
        />

        {/* Viewport Content Area */}
        <main className="dashboard-viewport">
          <div className="viewport-inner">
            {activeView === 'overview' ? (
              <OverviewView
                experiments={experiments}
                experimentalData={experimentalData}
                highlights={highlights}
                activities={activities}
                summary={summary}
                health={health}
                loading={loading}
                onRefresh={loadTelemetry}
                onSelectExperiment={() => setActiveView('experiments')}
              />
            ) : (
              <PlaceholderView viewId={activeView} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
