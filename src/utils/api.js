import axios from 'axios';

/**
 * API client for TeamForge (production)
 * Frontend: https://team-forge.ru
 * Backend:  https://api.team-forge.ru
 */

const api = axios.create({
  baseURL: 'https://api.team-forge.ru/api',
  withCredentials: true, // 🔴 ОБЯЗАТЕЛЬНО для cookies
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ===== TOKEN REFRESH QUEUE =====
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

// ===== RESPONSE INTERCEPTOR =====
api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => api(originalRequest));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // 🔄 refresh token via cookie
          await api.post('/auth/user/refresh');
          processQueue(null);
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
);

export default api;
