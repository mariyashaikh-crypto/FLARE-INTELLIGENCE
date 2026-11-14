
/**
 * FLARE INTELLIGENCE - Frontend API Service Client
 * NASA "Flame in Freefall" Microgravity Combustion Intelligence Platform
 */

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const BASE_URL = `${API_ORIGIN}/api`;

/**
 * Check backend health status
 */
export async function checkHealth() {
  const response = await fetch(`${BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch metadata for NASA's 5 microgravity combustion experiments
 */
export async function fetchCombustionExperiments() {
  const response = await fetch(`${BASE_URL}/combustion/experiments`);
  if (!response.ok) {
    throw new Error(`Failed to fetch combustion experiments: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch indexed combustion datasets
 */
export async function fetchCombustionDatasets() {
  const response = await fetch(`${BASE_URL}/combustion/datasets`);
  if (!response.ok) {
    throw new Error(`Failed to fetch combustion datasets: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch dataset coverage summary
 */
export async function fetchCombustionSummary() {
  const response = await fetch(`${BASE_URL}/combustion/summary`);
  if (!response.ok) {
    throw new Error(`Failed to fetch combustion summary: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch NASA published experimental benchmark series
 */
export async function fetchExperimentalData() {
  const response = await fetch(`${BASE_URL}/combustion/experimental-data`);
  if (!response.ok) {
    throw new Error(`Failed to fetch experimental data: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch NASA combustion science research highlights
 */
export async function fetchResearchHighlights() {
  const response = await fetch(`${BASE_URL}/combustion/highlights`);
  if (!response.ok) {
    throw new Error(`Failed to fetch research highlights: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch research publications and technical reports
 */
export async function fetchResearchActivities() {
  const response = await fetch(`${BASE_URL}/combustion/research-activity`);
  if (!response.ok) {
    throw new Error(`Failed to fetch research activity: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Backward compatibility alias
 * @deprecated Use fetchCombustionDatasets instead
 */
export const fetchSolarFlares = fetchCombustionDatasets;
