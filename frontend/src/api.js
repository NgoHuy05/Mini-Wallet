// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:1337',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401 || status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;