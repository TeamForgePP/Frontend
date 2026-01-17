// services/projectService.js
import api from '../../utils/api';

export const projectService = {
  // Получить список проектов
  getProjects: async () => {
    try {
      const response = await api.get('/user/home');
      return response.data; // Возвращаем data, а не весь response
    } catch (error) {
      console.error('Ошибка получения проектов:', error);
      throw error;
    }
  },

  // Создать новый проект
  createProject: async (projectData) => {
    try {
      const response = await api.post('/user/home/new-project', projectData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('Проект с таким названием уже существует');
      }
      if (error.response?.status === 403) {
        throw new Error('У вас нет прав для создания проекта');
      }
      if (error.response?.status === 422) {
        throw new Error('Ошибка валидации данных');
      }
      console.error('Ошибка создания проекта:', error);
      throw error;
    }
  },

  // Удалить проект
  deleteProject: async (projectId) => {
    try {
      const response = await api.delete(`/user/home/${projectId}/delete`);
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
      const response = await api.post(`/user/home/${projectId}/leave`);
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
  }
};