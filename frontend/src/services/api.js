/**
 * FLARE INTELLIGENCE - Frontend API Service Client
 * Handles communication with local backend endpoints.
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
 * Fetch solar flare events from local dataset service
 * @param {object} [params] - Query parameters
 * @returns {Promise<any>}
 */
export async function fetchSolarFlares(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/flares${query ? `?${query}` : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch solar flares: ${response.statusText}`);
  }
  return response.json();
}
