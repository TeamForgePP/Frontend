import api from '../../utils/api';

export const homeService = {
  // Получить список проектов
  getProjects: async () => {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      console.error('Ошибка получения проектов:', error);
      throw error;
    }
  },

  // Создать новый проект
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('Проект с таким названием уже существует');
      }
      if (error.response?.status === 403) {
        throw new Error('У вас нет прав для создания проекта');
      }
      console.error('Ошибка создания проекта:', error);
      throw error;
    }
  },

  // Удалить проект
  deleteProject: async (projectId) => {
    try {
      const response = await api.delete(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Проект не найден или уже удалён');
      }
      if (error.response?.status === 403) {
        throw new Error('У вас нет прав для удаления проекта');
      }
      console.error('Ошибка удаления проекта:', error);
      throw error;
    }
  },

  // Покинуть проект
  leaveProject: async (projectId) => {
    try {
      const response = await api.post(`/projects/${projectId}/leave`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Проект не найден');
      }
      if (error.response?.status === 403) {
        throw new Error('У вас нет прав для выхода из проекта');
      }
      console.error('Ошибка выхода из проекта:', error);
      throw error;
    }
  },

  // Получить пользователей для команды (новая ручка)
  getUsersForTeam: async () => {
    try {
      const response = await api.get('/projects/users-for-team');
      return response.data;
    } catch (error) {
      console.error('Ошибка получения пользователей для команды:', error);
      
      // Обработка специфичных ошибок
      if (error.response?.status === 403) {
        throw new Error('У вас нет прав для просмотра списка пользователей');
      }
      if (error.response?.status === 401) {
        throw new Error('Требуется авторизация');
      }
      
      throw error;
    }
  }
};