/**
 * Example: How to use the API configuration
 * 
 * This file demonstrates how to use the centralized API configuration
 * to make backend API calls in your React components.
 */

import { apiConfig, buildApiUrl, isBackendConfigured } from '@/config/api';

/**
 * Example 1: Simple fetch to backend health endpoint
 */
export async function checkBackendHealth() {
  const healthUrl = buildApiUrl(apiConfig.endpoints.health);
  
  try {
    const response = await fetch(healthUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Backend health check failed:', error);
    throw error;
  }
}

/**
 * Example 2: Execute AI task via backend
 */
export async function executeAITask(prompt: string, provider?: string) {
  const aiUrl = buildApiUrl(apiConfig.endpoints.ai.execute);
  
  try {
    const response = await fetch(aiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'text',
        prompt,
        provider,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('AI task execution failed:', error);
    throw error;
  }
}

/**
 * Example 3: Get available AI pipelines
 */
export async function getAIPipelines() {
  const pipelinesUrl = buildApiUrl(apiConfig.endpoints.ai.pipelines);
  
  try {
    const response = await fetch(pipelinesUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch pipelines:', error);
    throw error;
  }
}

/**
 * Example 4: Use in a React component with error handling
 */
export function useBackendAPI() {
  const isConfigured = isBackendConfigured();
  const baseUrl = apiConfig.baseUrl;
  
  return {
    isConfigured,
    baseUrl,
    checkHealth: checkBackendHealth,
    executeAI: executeAITask,
    getPipelines: getAIPipelines,
  };
}

/**
 * Usage in a React component:
 * 
 * import { useBackendAPI } from '@/config/apiExamples';
 * 
 * function MyComponent() {
 *   const { isConfigured, checkHealth, executeAI } = useBackendAPI();
 *   
 *   useEffect(() => {
 *     if (isConfigured) {
 *       checkHealth().then(data => console.log('Backend is healthy:', data));
 *     }
 *   }, [isConfigured]);
 *   
 *   const handleSubmit = async (prompt: string) => {
 *     try {
 *       const result = await executeAI(prompt, 'openai');
 *       console.log('AI response:', result);
 *     } catch (error) {
 *       console.error('Error:', error);
 *     }
 *   };
 *   
 *   return <div>...</div>;
 * }
 */
