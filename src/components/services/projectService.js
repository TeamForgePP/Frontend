// services/projectService.js
import api from '../../utils/api';

export const projectService = {
  // Получить список проектов
  getProjects: async () => {
    try {
      const response = await api.get('/api/user/home');
      return response;
    } catch (error) {
      console.error('Ошибка получения проектов:', error);
      throw error;
    }
  },

  // Создать новый проект
  createProject: async (projectData) => {
    try {
      const response = await api.post('/api/user/home/new-project', projectData);
      return response;
    } catch (error) {
      console.error('Ошибка создания проекта:', error);
      throw error;
    }
  },

  // Удалить проект
  deleteProject: async (projectId) => {
    try {
      const response = await api.delete(`/api/user/home/${projectId}/delete`);
      return response;
    } catch (error) {
      console.error('Ошибка удаления проекта:', error);
      throw error;
    }
  },

  // Покинуть проект
  leaveProject: async (projectId) => {
    try {
      const response = await api.post(`/api/user/home/${projectId}/leave`);
      return response;
    } catch (error) {
      console.error('Ошибка выхода из проекта:', error);
      throw error;
    }
  }
};