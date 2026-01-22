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

  // Получить информацию о приглашении
  getInvitation: async (invitation_Id) => {
    try {
      const response = await api.get(`/invitations/${invitation_Id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка получения приглашения:', error);
      throw error;
    }
  },

  // Принять приглашение
  acceptInvitation: async (invitation_Id) => {
    try {
      const response = await api.post(`/invitations/${invitation_Id}/accept`);
      return response.data;
    } catch (error) {
      console.error('Ошибка принятия приглашения:', error);
      throw error;
    }
  },

  // Отклонить приглашение
  declineInvitation: async (invitation_Id) => {
    try {
      const response = await api.post(`/invitations/${invitation_Id}/decline`);
      return response.data;
    } catch (error) {
      console.error('Ошибка отклонения приглашения:', error);
      throw error;
    }
  }
};