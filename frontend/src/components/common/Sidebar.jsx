import React from 'react';
import {
  LayoutDashboard,
  Flame,
  Search,
  GitCompare,
  Zap,
  Orbit,
  ShieldAlert,
  History,
  ChevronLeft,
  ChevronRight,
  FolderSync,
  FolderCheck
} from 'lucide-react';

export const SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: 'Main' },
  { id: 'experiments', label: 'Experiments', icon: Flame, badge: '5 Core' },
  { id: 'search', label: 'Research Search', icon: Search },
  { id: 'compare', label: 'Compare', icon: GitCompare },
  { id: 'electric-field', label: 'Electric Field', icon: Zap },
  { id: 'gravity-analysis', label: 'Gravity Analysis', icon: Orbit },
  { id: 'fire-safety', label: 'Fire Safety', icon: ShieldAlert },
  { id: 'incidents', label: 'Historical Incidents', icon: History }
];

export default function Sidebar({
  activeView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
  summary
}) {
  const isConnected = summary?.pathExists;
  const totalFiles = summary?.totalDatasetsFound ?? 0;

  return (
    <aside className={`mission-sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <div className="sidebar-header">
        {!isCollapsed && <span className="nav-heading">TELEMETRY NAVIGATION</span>}
        <button
          type="button"
          className="collapse-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-menu">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectView(item.id)}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="item-icon-wrap">
                <Icon size={18} className="item-icon" />
              </div>

              {!isCollapsed && (
                <div className="item-text-wrap">
                  <span className="item-label">{item.label}</span>
                  {item.badge && <span className="item-badge">{item.badge}</span>}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer telemetry */}
      <div className="sidebar-footer">
        <div className="footer-status-box" title={summary?.configuredPath || 'Desktop/FLARE_INTELLIGENCE_DATA'}>
          <div className="status-indicator-icon">
            {isConnected ? (
              <FolderCheck size={16} className="text-cyan" />
            ) : (
              <FolderSync size={16} className="text-orange" />
            )}
          </div>
          {!isCollapsed && (
            <div className="footer-text">
              <span className="footer-label">DATASET REPO</span>
              <span className="footer-val">
                {isConnected ? `${totalFiles} Files Connected` : 'Listening on Desktop'}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
