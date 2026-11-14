import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_WORKSPACE_DATA = path.resolve(__dirname, '../../data');

/**
 * Resolve the active dataset directory path.
 * Priority:
 * 1. Process environment variable (FLARE_DATASET_PATH or DATASET_PATH)
 * 2. User Desktop folder: ~/Desktop/FLARE_INTELLIGENCE_DATA
 * 3. OneDrive Desktop folder: ~/OneDrive/Desktop/FLARE_INTELLIGENCE_DATA
 * 4. Workspace fallback: ./data
 */
export function resolveDatasetPath() {
  if (process.env.FLARE_DATASET_PATH && fs.existsSync(process.env.FLARE_DATASET_PATH)) {
    return {
      path: path.resolve(process.env.FLARE_DATASET_PATH),
      source: 'environment_variable (FLARE_DATASET_PATH)',
      exists: true
    };
  }

  if (process.env.DATASET_PATH && fs.existsSync(process.env.DATASET_PATH)) {
    return {
      path: path.resolve(process.env.DATASET_PATH),
      source: 'environment_variable (DATASET_PATH)',
      exists: true
    };
  }

  const standardDesktop = path.join(os.homedir(), 'Desktop', 'FLARE_INTELLIGENCE_DATA');
  if (fs.existsSync(standardDesktop)) {
    return {
      path: standardDesktop,
      source: 'desktop_folder',
      exists: true
    };
  }

  const oneDriveDesktop = path.join(os.homedir(), 'OneDrive', 'Desktop', 'FLARE_INTELLIGENCE_DATA');
  if (fs.existsSync(oneDriveDesktop)) {
    return {
      path: oneDriveDesktop,
      source: 'onedrive_desktop_folder',
      exists: true
    };
  }

  // Fallback to configured path even if not yet created on disk
  const preferredPath = process.env.FLARE_DATASET_PATH || standardDesktop;
  const workspaceFallbackExists = fs.existsSync(LOCAL_WORKSPACE_DATA);

  return {
    path: workspaceFallbackExists ? LOCAL_WORKSPACE_DATA : preferredPath,
    source: workspaceFallbackExists ? 'workspace_fallback' : 'desktop_default',
    exists: workspaceFallbackExists,
    preferredPath
  };
}

/**
 * Identify combustion experiment from filename or directory
 * @param {string} filePath 
 * @returns {string} Experiment name
 */
export function categorizeExperiment(filePath) {
  const lower = filePath.toLowerCase();
  if (lower.includes('bass')) return 'BASS-II';
  if (lower.includes('flex')) return 'FLEX';
  if (lower.includes('saffire')) return 'SAFFIRE-I';
  if (lower.includes('spice')) return 'SPICE';
  if (lower.includes('e-field') || lower.includes('efield')) return 'E-FIELD Flames';
  return 'General Microgravity Combustion';
}

/**
 * Scan configured dataset folder recursively for combustion data files (Read-Only)
 * @returns {{ datasetDir: string, exists: boolean, source: string, totalFiles: number, files: Array<any>, experimentsCount: Record<string, number> }}
 */
export function scanDatasets() {
  const dirInfo = resolveDatasetPath();

  if (!dirInfo.exists || !fs.existsSync(dirInfo.path)) {
    return {
      datasetDir: dirInfo.path,
      exists: false,
      source: dirInfo.source,
      totalFiles: 0,
      files: [],
      experimentsCount: {
        'BASS-II': 0,
        'FLEX': 0,
        'SAFFIRE-I': 0,
        'SPICE': 0,
        'E-FIELD Flames': 0,
        'General Microgravity Combustion': 0
      },
      message: `Dataset folder not found at ${dirInfo.path}. Set FLARE_DATASET_PATH or place FLARE_INTELLIGENCE_DATA on your Desktop.`
    };
  }

  const allowedExtensions = ['.csv', '.json', '.txt', '.dat', '.tsv'];
  const filesList = [];
  const experimentsCount = {
    'BASS-II': 0,
    'FLEX': 0,
    'SAFFIRE-I': 0,
    'SPICE': 0,
    'E-FIELD Flames': 0,
    'General Microgravity Combustion': 0
  };

  function walkSync(currentDir) {
    let entries = [];
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walkSync(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (allowedExtensions.includes(ext)) {
          const stats = fs.statSync(fullPath);
          const relativePath = path.relative(dirInfo.path, fullPath);
          const experiment = categorizeExperiment(relativePath);

          experimentsCount[experiment] = (experimentsCount[experiment] || 0) + 1;
          filesList.push({
            name: entry.name,
            relativePath,
            experiment,
            extension: ext,
            sizeBytes: stats.size,
            modifiedAt: stats.mtime
          });
        }
      }
    }
  }

  walkSync(dirInfo.path);

  return {
    datasetDir: dirInfo.path,
    exists: true,
    source: dirInfo.source,
    totalFiles: filesList.length,
    files: filesList,
    experimentsCount,
    message: `Indexed ${filesList.length} combustion dataset file(s) from ${dirInfo.path}`
  };
}

/**
 * Read-only file inspection for authorized combustion dataset files
 * @param {string} relativeFilePath 
 * @returns {any}
 */
export function readDatasetFile(relativeFilePath) {
  const dirInfo = resolveDatasetPath();
  const safePath = path.resolve(dirInfo.path, relativeFilePath);

  // Prevent path traversal outside dataset root
  if (!safePath.startsWith(path.resolve(dirInfo.path))) {
    throw new Error('Access denied: Invalid dataset path traversal');
  }

  if (!fs.existsSync(safePath)) {
    throw new Error(`Dataset file not found: ${relativeFilePath}`);
  }

  const content = fs.readFileSync(safePath, 'utf-8');
  if (safePath.endsWith('.json')) {
    return JSON.parse(content);
  }
  return content;
}
