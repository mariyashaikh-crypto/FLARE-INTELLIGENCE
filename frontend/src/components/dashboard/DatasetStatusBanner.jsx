import React from 'react';
import { FolderCheck, FolderSync, Info, AlertTriangle, RefreshCw } from 'lucide-react';

export default function DatasetStatusBanner({ summary, loading, onRefresh }) {
  const isConnected = summary?.pathExists;
  const totalFiles = summary?.totalDatasetsFound ?? 0;
  const configuredPath = summary?.configuredPath || 'Desktop/FLARE_INTELLIGENCE_DATA';

  return (
    <div className={`dataset-status-banner ${isConnected ? 'banner-connected' : 'banner-pending'}`}>
      <div className="banner-left">
        <div className="banner-icon">
          {isConnected ? <FolderCheck size={24} /> : <FolderSync size={24} />}
        </div>
        <div className="banner-content">
          <div className="banner-title-row">
            <h4 className="banner-title">
              {isConnected
                ? 'External NASA Combustion Datasets: Active'
                : 'Desktop Dataset Folder: Ready for Data'}
            </h4>
            <span className={`status-pill ${isConnected ? 'pill-active' : 'pill-pending'}`}>
              {isConnected ? `${totalFiles} Files Indexed` : 'Listening for Folder'}
            </span>
          </div>

          <p className="banner-description">
            {isConnected ? (
              <>
                Reading microgravity combustion data from:{' '}
                <code className="path-code">{configuredPath}</code>
              </>
            ) : (
              <>
                The dataset service is monitoring for your Desktop folder:{' '}
                <code className="path-code">{configuredPath}</code>. Drop your BASS-II, FLEX,
                SAFFIRE-I, SPICE, or E-FIELD dataset files (<code className="ext">.csv</code>,{' '}
                <code className="ext">.json</code>, <code className="ext">.tsv</code>) directly into this folder.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="banner-right">
        <button
          type="button"
          className="refresh-btn"
          onClick={onRefresh}
          disabled={loading}
          title="Rescan dataset directory"
        >
          <RefreshCw size={14} className={loading ? 'spinning' : ''} />
          <span>{loading ? 'Scanning...' : 'Rescan'}</span>
        </button>
      </div>
    </div>
  );
}
