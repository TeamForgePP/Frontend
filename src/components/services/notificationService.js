import api from '../../utils/api';

export const notificationService = {
  // Получение списка уведомлений
  getNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Ошибка получения уведомлений:', error);
      throw error;
    }
  },

  // Отметить все как прочитанные
  markAllAsRead: async () => {
    try {
      const response = await api.patch('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Ошибка отметки всех как прочитанных:', error);
      throw error;
    }
  },

  // Получить информацию о приглашении по ID уведомления
  getInvitationByNotificationId: async (notificationId) => {
    try {
      const response = await api.get(`/invitations/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка получения приглашения по ID уведомления:', error);
      throw error;
    }
  },

  // Принять приглашение
  acceptInvitation: async (notificationId) => {
    try {
      const response = await api.post(`/invitations/${notificationId}/accept`);
      return response.data;
    } catch (error) {
      console.error('Ошибка принятия приглашения:', error);
      throw error;
    }
  },

  // Отклонить приглашение
  declineInvitation: async (notificationId) => {
    try {
      const response = await api.post(`/invitations/${notificationId}/reject`);
      return response.data;
    } catch (error) {
      console.error('Ошибка отклонения приглашения:', error);
      throw error;
    }
  }
};