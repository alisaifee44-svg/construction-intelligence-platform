import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000, // 2 minute timeout for AI responses
});

/**
 * Upload an image for safety analysis.
 */
export async function analyzeSafety(imageFile, context = '') {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('context', context);
  const response = await api.post('/safety/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

/**
 * Upload an image for crack detection.
 */
export async function analyzeCracks(imageFile, context = '') {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('context', context);
  const response = await api.post('/crack/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

/**
 * Evaluate a property for real estate valuation.
 */
export async function evaluateProperty(propertyData) {
  const response = await api.post('/valuation/evaluate', propertyData);
  return response.data;
}

/**
 * Create a construction project plan.
 */
export async function createProjectPlan(projectData) {
  const response = await api.post('/planning/create', projectData);
  return response.data;
}

/**
 * Get daily site assistance and weather advisory.
 */
export async function getDailyBriefing(siteData) {
  const response = await api.post('/assistant/daily-briefing', siteData);
  return response.data;
}

/**
 * Ask a construction knowledge question.
 */
export async function askQuestion(question, context = '') {
  const response = await api.post('/knowledge/ask', { question, context });
  return response.data;
}

/**
 * Check backend health.
 */
export async function checkHealth() {
  const response = await api.get('/health');
  return response.data;
}

export default api;
