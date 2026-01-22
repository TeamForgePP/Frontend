import api from '../../utils/api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/user/login', credentials);
    
    // Сохраняем токен в localStorage (если бэкенд возвращает его в ответе)
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/user/register', userData);
    return response.data;
  },
  
  logout: async () => {
    try {
      const response = await api.post('/auth/user/logout');
      
      // Очищаем токен при выходе
      localStorage.removeItem('access_token');
      
      return response.data;
    } catch (error) {
      // Даже если логаут на сервере не удался, очищаем локально
      localStorage.removeItem('access_token');
      throw error;
    }
  },
  
  refreshToken: async () => {
    const response = await api.post('/auth/user/refresh');
    
    // Обновляем токен в localStorage
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    
    return response.data;
  }
};