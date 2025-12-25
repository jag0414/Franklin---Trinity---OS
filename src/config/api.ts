// API Configuration for Backend Services
// This file centralizes the API base URL configuration for the backend services

/**
 * Get the API base URL from environment variables
 * Falls back to localhost in development if not set
 */
export const getApiBaseUrl = (): string => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (apiBaseUrl) {
    return apiBaseUrl;
  }
  
  // Fallback to localhost for local development
  return 'http://localhost:8000';
};

/**
 * API configuration object
 */
export const apiConfig = {
  baseUrl: getApiBaseUrl(),
  endpoints: {
    health: '/health',
    ai: {
      execute: '/api/ai/execute',
      pipelines: '/api/ai/pipelines',
    },
  },
};

/**
 * Helper function to build full API URLs
 */
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = apiConfig.baseUrl;
  // Remove trailing slash from baseUrl and leading slash from endpoint if both exist
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${cleanBase}${cleanEndpoint}`;
};

/**
 * Check if backend API is configured
 */
export const isBackendConfigured = (): boolean => {
  return !!import.meta.env.VITE_API_BASE_URL;
};
