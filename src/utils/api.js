import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json',
    'Origin': 'http://localhost:3000'
  },
});

// Флаг для отслеживания обновления токена
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Добавляем интерцептор для обновления токена
api.interceptors.response.use(
  (response) => {
    console.log(`🟢 Успешный ответ от ${response.config.url}: ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error(`🔴 Ошибка от ${error.config?.url}:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
      data: error.response?.data
    });
    
    // Если ошибка 401 и это не запрос на обновление токена
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Если уже обновляем токен, добавляем запрос в очередь
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // После успешного обновления токена, повторяем оригинальный запрос
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        console.log('🔄 Пробуем обновить access token...');
        
        // Вызываем ручку refresh token
        const refreshResponse = await api.post('/auth/user/refresh');
        
        if (refreshResponse.status === 200) {
          console.log('✅ Access token успешно обновлен');
          
          // Обрабатываем очередь ожидающих запросов
          processQueue(null, refreshResponse.data);
          
          // Повторяем оригинальный запрос с новым токеном
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Ошибка обновления токена:', refreshError);
        
        // Обрабатываем очередь с ошибкой
        processQueue(refreshError, null);
        
        // Если refresh тоже вернул 401, значит refresh token истек или невалиден
        // Перенаправляем на логин
        if (refreshError.response?.status === 401) {
          console.log('🔴 Refresh token невалиден, перенаправляем на логин');
          
          // Очищаем локальное хранилище
          localStorage.clear();
          
          // Перенаправляем на страницу логина
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Для других ошибок 401 (когда refresh не помог или не пытались)
    if (error.response?.status === 401) {
      console.log('🔴 401 Unauthorized - проверьте куки и токены');
      
      // Проверка: какие куки сейчас доступны
      console.log('🍪 Текущие куки из document.cookie:', document.cookie);
      console.log('🗄️ Токен из localStorage:', localStorage.getItem('access_token'));
      
      // Можно перенаправить на логин
      // localStorage.clear();
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// ✅ Интерцептор для логирования запросов (оставляем как было)
api.interceptors.request.use(
  (config) => {
    console.log(`🔵 Отправляем запрос: ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`🔵 withCredentials: ${config.withCredentials}`);
    console.log(`🔵 Headers:`, config.headers);
    
    // Также добавляем Authorization header из localStorage для подстраховки
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔵 Добавлен Authorization header`);
    }
    
    return config;
  },
  (error) => {
    console.error('🔴 Ошибка в запросе:', error);
    return Promise.reject(error);
  }
);

export default api;