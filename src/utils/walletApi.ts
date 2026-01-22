import axios from 'axios';

const WALLET_API_URL = (import.meta as any).env.VITE_SAFEWALLET_API_URL || 'http://localhost:8000/api';

const walletApi = axios.create({
  baseURL: WALLET_API_URL,
});

walletApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default walletApi;
