import api from '../../utils/api';

export const userService = {
  // Получить данные профиля
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      console.error('Ошибка получения профиля:', error);
      throw error;
    }
  },

  // Обновить данные профиля
  updateProfile: async (profileData) => {
    try {
      const response = await api.post('/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      throw error;
    }
  },

  // Сменить пароль
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/user/profile/edit-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Ошибка смены пароля:', error);
      throw error;
    }
  },

  // Выход из аккаунта
  logout: async () => {
    try {
      const response = await api.post('/auth/user/logout');
      return response.data;
    } catch (error) {
      console.error('Ошибка выхода:', error);
      throw error;
    }
  }
};