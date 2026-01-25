import axios from 'axios';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to auth if we get a 401 AND it's not the initial profile check
    // This prevents a redirect loop if the token is temporarily invalid during boot
    const isAuthMeRequest = error.config?.url?.includes('/auth/me');
    
    if (error.response?.status === 401 && !isAuthMeRequest) {
      localStorage.removeItem('token');
      // Use window.location.replace to avoid clogging history
      if (window.location.pathname !== '/auth') {
        window.location.replace('/auth');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
