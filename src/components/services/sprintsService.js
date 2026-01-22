import api from '../../utils/api';

export const sprintsService = {
  // Получить информацию о спринтах
  getSprints: async () => {
    try {
      const response = await api.get('/sprints');
      return response.data;
    } catch (error) {
      console.error('Ошибка получения спринтов:', error);
      throw error;
    }
  },

  // Получить информацию о конкретном спринте
  getSprintById: async (sprintId) => {
    try {
      const response = await api.get(`/sprints/${sprintId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Спринт не найден');
      }
      console.error('Ошибка получения спринта:', error);
      throw error;
    }
  },

  // Создать новый спринт
  createSprint: async (sprintData) => {
    try {
      const response = await api.post('/sprints/new-sprint', sprintData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('Спринт уже существует');
      }
      if (error.response?.status === 400) {
        throw new Error('Введены неверные данные');
      }
      console.error('Ошибка создания спринта:', error);
      throw error;
    }
  },

  // Редактировать спринт
  updateSprint: async (sprintId, sprintData) => {
    try {
      const response = await api.patch(`/sprints/${sprintId}`, sprintData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Спринт не найден');
      }
      if (error.response?.status === 409) {
        throw new Error('Спринт уже завершен');
      }
      if (error.response?.status === 400) {
        throw new Error('Неверно введены данные');
      }
      console.error('Ошибка редактирования спринта:', error);
      throw error;
    }
  },

  // Завершить спринт и начать новый
  completeSprint: async (sprintId) => {
    try {
      const response = await api.post(`/sprints/${sprintId}/complete`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Спринт не найден');
      }
      if (error.response?.status === 409) {
        throw new Error('Спринт уже завершен или нет следующего спринта для переключения');
      }
      console.error('Ошибка завершения спринта:', error);
      throw error;
    }
  },

  // Форматирование даты для отображения
  formatDate: (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  },

  // Форматирование даты для формы (YYYY-MM-DD)
  formatDateForInput: (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
};