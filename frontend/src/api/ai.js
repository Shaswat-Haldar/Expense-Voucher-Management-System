// Import the shared Axios instance
import api from './axios.js';

export const generateExpenseDescription = (data) =>
  api.post('/ai/generate-description', data);
