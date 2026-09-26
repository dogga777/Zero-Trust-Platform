import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer demo-token`;
  return config;
});

export const sendAuthDecision = (payload) => api.post('/api/auth/decision', payload);
export const simulateBlastRadius = (identityId) =>
  api.post(`/api/blast-radius/simulate?identity_id=${encodeURIComponent(identityId)}`);
export const fetchAuditLogs = () => api.get('/api/audit/logs');

export default api;