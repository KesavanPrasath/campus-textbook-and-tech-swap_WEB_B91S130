import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_URL || '';
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, '');

const API = axios.create({
  baseURL: normalizedBaseUrl ? `${normalizedBaseUrl}/api` : '/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;