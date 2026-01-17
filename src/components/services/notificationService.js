
import api from '../../utils/api';

export const notificationService = {
  // Получение списка уведомлений
  getNotifications: async () => {
    try {
      const response = await api.get('/user/notifications');
      return response.data;
    } catch (error) {
      console.error('Ошибка получения уведомлений:', error);
      throw error;
    }
  },

  // Отметить все как прочитанные
  markAllAsRead: async () => {
    try {
      const response = await api.patch('/user/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Ошибка отметки всех как прочитанных:', error);
      throw error;
    }
  },

  // Получить информацию о приглашении
  getInvitation: async (invitationId) => {
    try {
      const response = await api.get(`/user/invitations/${invitationId}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка получения приглашения:', error);
      throw error;
    }
  },

  // Принять приглашение (предполагаем, что такая ручка есть)
  acceptInvitation: async (invitationId) => {
    try {
      const response = await api.post(`/user/invitations/${invitationId}/accept`);
      return response.data;
    } catch (error) {
      console.error('Ошибка принятия приглашения:', error);
      throw error;
    }
  },

  // Отклонить приглашение (предполагаем, что такая ручка есть)
  declineInvitation: async (invitationId) => {
    try {
      const response = await api.post(`/api/user/invitations/${invitationId}/decline`);
      return response.data;
    } catch (error) {
      console.error('Ошибка отклонения приглашения:', error);
      throw error;
    }
  }
};