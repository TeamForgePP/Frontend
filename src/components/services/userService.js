import api from '../../utils/api';

export const userService = {
  // Получить данные профиля
  getProfile: async () => {
    try {
      const response = await api.get('/api/user/profile');
      return response;
    } catch (error) {
      console.error('Ошибка получения профиля:', error);
      throw error;
    }
  },

  // Обновить данные профиля
  updateProfile: async (profileData) => {
    try {
      const response = await api.post('/api/user/profile/edit', profileData);
      return response;
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      throw error;
    }
  },

  // Сменить пароль
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/api/user/profile/edit-password', passwordData);
      return response;
    } catch (error) {
      console.error('Ошибка смены пароля:', error);
      throw error;
    }
  },

  // Выход из аккаунта
  logout: async () => {
    try {
      const response = await api.post('/api/user/profile/logout');
      return response;
    } catch (error) {
      console.error('Ошибка выхода:', error);
      throw error;
    }
  }
};