import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');

/**
 * Scan data directory for available NASA dataset files
 * @returns {Array<{fileName: string, size: number, modified: Date}>}
 */
export function getAvailableDatasets() {
  if (!fs.existsSync(DATA_DIR)) {
    return [];
  }

  const files = fs.readdirSync(DATA_DIR);
  return files
    .filter(file => !file.startsWith('.') && (file.endsWith('.csv') || file.endsWith('.json')))
    .map(file => {
      const filePath = path.join(DATA_DIR, file);
      const stat = fs.statSync(filePath);
      return {
        fileName: file,
        size: stat.size,
        modified: stat.mtime
      };
    });
}

/**
 * Read and parse local JSON or raw dataset file safely
 * @param {string} fileName 
 * @returns {any}
 */
export function readDataset(fileName) {
  const filePath = path.join(DATA_DIR, path.basename(fileName));
  if (!fs.existsSync(filePath)) {
    throw new Error(`Dataset file not found: ${fileName}`);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  if (fileName.endsWith('.json')) {
    return JSON.parse(content);
  }
  return content;
}
