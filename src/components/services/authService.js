import api from '../../utils/api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/user/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/user/register', userData);
    return response.data;
  }
};