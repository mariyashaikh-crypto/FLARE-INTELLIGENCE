import React from 'react';
import {
  FolderCheck,
  FolderSync,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  HardDrive
} from 'lucide-react';

export default function LiveDatasetAvailability({ summary, loading, onRefresh }) {
  const isConnected = summary?.pathExists;
  const configuredPath = summary?.configuredPath || 'Desktop/FLARE_INTELLIGENCE_DATA';
  const experimentsCount = summary?.experimentsCount || {};

  const EXPERIMENT_KEYS = [
    { key: 'BASS-II', name: 'BASS-II', platform: 'ISS Glovebox', focus: 'Solid combustion' },
    { key: 'FLEX', name: 'FLEX / FLEX-2', platform: 'ISS CIR / MDCA', focus: 'Droplet cool flames' },
    { key: 'SAFFIRE-I', name: 'SAFFIRE-I', platform: 'Cygnus Vehicle', focus: 'Large-scale spacecraft fire' },
    { key: 'SPICE', name: 'SPICE', platform: 'ISS Glovebox', focus: 'Laminar smoke points' },
    { key: 'E-FIELD Flames', name: 'E-FIELD Flames', platform: 'ISS CIR / ACME', focus: 'Ionic soot suppression' }
  ];

  return (
    <div className="dataset-availability-card">
      <div className="card-top-header">
        <div className="header-left-group">
          <div className="status-indicator-badge">
            <HardDrive size={18} className="text-cyan" />
            <span className="mono-title">LIVE DATASET REPOSITORY TELEMETRY</span>
          </div>
          <h2 className="section-main-heading">Dataset Availability Matrix</h2>
          <p className="section-subtext">
            Real-time status of local filesystem datasets monitored across the five NASA flight programs.
          </p>
        </div>

        <div className="connection-chip-wrap">
          <span className={`connection-pill ${isConnected ? 'pill-connected' : 'pill-disconnected'}`}>
            {isConnected ? <FolderCheck size={14} /> : <FolderSync size={14} className={loading ? 'spinning' : ''} />}
            <span>{isConnected ? 'DESKTOP FOLDER DETECTED' : 'AWAITING DESKTOP FOLDER'}</span>
          </span>
        </div>
      </div>

      {/* Path Monitor Box */}
      <div className="monitored-path-banner">
        <div className="path-details">
          <span className="path-label">MONITORED DESKTOP PATH:</span>
          <code className="path-text">{configuredPath}</code>
        </div>
        <div className="path-status-tag">
          {isConnected ? (
            <span className="badge-available">
              <CheckCircle2 size={13} /> {summary?.totalDatasetsFound || 0} Files Indexed
            </span>
          ) : (
            <span className="badge-pending">
              <Clock size={13} /> 0 Files Detected (Pending Creation)
            </span>
          )}
        </div>
      </div>

      {/* Per-Experiment Live Availability Table */}
      <div className="availability-table-wrap">
        <table className="availability-table">
          <thead>
            <tr>
              <th>NASA PROGRAM</th>
              <th>ORBITAL FACILITY</th>
              <th>PRIMARY RESEARCH FOCUS</th>
              <th>DESKTOP FILES DETECTED</th>
              <th>REFERENCE BENCHMARK</th>
            </tr>
          </thead>
          <tbody>
            {EXPERIMENT_KEYS.map((exp) => {
              const fileCount = experimentsCount[exp.key] || 0;
              const hasFiles = fileCount > 0;

              return (
                <tr key={exp.key}>
                  <td className="exp-cell font-bold text-pure">{exp.name}</td>
                  <td className="facility-cell">{exp.platform}</td>
                  <td className="focus-cell text-secondary">{exp.focus}</td>
                  <td className="count-cell">
                    {hasFiles ? (
                      <span className="file-count-badge active">
                        <FileSpreadsheet size={13} /> {fileCount} file(s) loaded
                      </span>
                    ) : (
                      <span className="file-count-badge empty">
                        <AlertCircle size={13} /> 0 files (Awaiting .csv/.json)
                      </span>
                    )}
                  </td>
                  <td className="benchmark-cell">
                    <span className="benchmark-ready-pill">
                      <CheckCircle2 size={12} className="text-cyan" /> Published NASA Data Available
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="data-integrity-note">
        <AlertCircle size={15} className="note-icon" />
        <p>
          <strong>Scientific Data Integrity Policy:</strong> All custom dataset counts reflect
          verified local files in your configured Desktop folder. If custom files are absent,
          the dashboard utilizes peer-reviewed NASA flight benchmarks from NASA Technical Reports.
          Zero measurements are fabricated.
        </p>
      </div>
    </div>
  );
}
