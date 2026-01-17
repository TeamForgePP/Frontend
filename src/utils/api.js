import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // ✅ ОБЯЗАТЕЛЬНО true для отправки кук
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json',
    'Origin': 'http://localhost:3000'
  },
});

// ✅ ДОБАВЬТЕ интерцептор для логирования
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

// ✅ ДОБАВЬТЕ интерцептор для логирования ответов
api.interceptors.response.use(
  (response) => {
    console.log(`🟢 Успешный ответ от ${response.config.url}: ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`🔴 Ошибка от ${error.config?.url}:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
      data: error.response?.data
    });
    
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

export default api;