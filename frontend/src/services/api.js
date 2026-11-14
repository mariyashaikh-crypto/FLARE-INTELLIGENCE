/**
 * FLARE INTELLIGENCE - Frontend API Service Client
 * NASA "Flame in Freefall" Microgravity Combustion Intelligence Platform
 */

const BASE_URL = '/api';

/**
 * Check backend health status
 * @returns {Promise<{status: string, message: string, timestamp: string}>}
 */
export async function checkHealth() {
  const response = await fetch(`${BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch reference metadata for NASA's 5 microgravity combustion experiments
 * (BASS-II, FLEX, SAFFIRE-I, SPICE, E-FIELD Flames)
 */
export async function fetchCombustionExperiments() {
  const response = await fetch(`${BASE_URL}/combustion/experiments`);
  if (!response.ok) {
    throw new Error(`Failed to fetch combustion experiments: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch list of indexed combustion datasets from configured Desktop/local path
 */
export async function fetchCombustionDatasets() {
  const response = await fetch(`${BASE_URL}/combustion/datasets`);
  if (!response.ok) {
    throw new Error(`Failed to fetch combustion datasets: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch summary statistics of dataset coverage across experiments
 */
export async function fetchCombustionSummary() {
  const response = await fetch(`${BASE_URL}/combustion/summary`);
  if (!response.ok) {
    throw new Error(`Failed to fetch combustion summary: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch actual NASA published experimental benchmark series
 */
export async function fetchExperimentalData() {
  const response = await fetch(`${BASE_URL}/combustion/experimental-data`);
  if (!response.ok) {
    throw new Error(`Failed to fetch experimental data: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch NASA combustion science research highlights & breakthroughs
 */
export async function fetchResearchHighlights() {
  const response = await fetch(`${BASE_URL}/combustion/highlights`);
  if (!response.ok) {
    throw new Error(`Failed to fetch research highlights: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch peer-reviewed research publications, technical reports & citations
 */
export async function fetchResearchActivities() {
  const response = await fetch(`${BASE_URL}/combustion/research-activity`);
  if (!response.ok) {
    throw new Error(`Failed to fetch research activity: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Backward compatibility alias for combustion datasets
 * @deprecated Use fetchCombustionDatasets instead
 */
export const fetchSolarFlares = fetchCombustionDatasets;
