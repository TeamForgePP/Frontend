// services/projectService.js
import api from '../../utils/api';

export const projectService = {
  // Получить информацию о проекте
  getProjectInfo: async () => {
    try {
      console.log('getProjectInfo вызывается');
      const response = await api.get(`/project`);
      return response.data;
    } catch (error) {
      console.error('Ошибка получения информации о проекте:', error);
      throw error;
    }
  },

  // Редактировать проект
  editProject: async (projectData) => {
    try {
      console.log('editProject получает данные:', projectData);
      
      // Отправляем данные как есть
      const response = await api.post('/project/edit', projectData);
      console.log('Ответ сервера:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка редактирования проекта:', error);
      console.error('Детали ошибки:', error.response?.data);
      
      if (error.response?.status === 400) {
        throw new Error('Некорректные данные проекта');
      }
      if (error.response?.status === 403) {
        throw new Error('У вас нет прав для редактирования проекта');
      }
      throw error;
    }
  },

  // Завершить проект
  finishProject: async (projectId) => {
    try {
      const response = await api.post('/project/finish', { project_id: projectId });
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('У вас нет прав для завершения проекта');
      }
      console.error('Ошибка завершения проекта:', error);
      throw error;
    }
  },

  // Удалить участника из проекта
  removeMember: async (projectId, userId) => {
    try {
      const response = await api.delete(`/project/${projectId}/member/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Участник не найден в проекте');
      }
      if (error.response?.status === 403) {
        throw new Error('У вас нет прав для удаления участника');
      }
      console.error('Ошибка удаления участника:', error);
      throw error;
    }
  },

  // Пригласить участника
  inviteMember: async (projectId, userData) => {
    try {
      const response = await api.post(`/project/${projectId}/invite`, userData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('Пользователь уже в проекте');
      }
      if (error.response?.status === 403) {
        throw new Error('У вас нет прав для приглашения');
      }
      console.error('Ошибка приглашения участника:', error);
      throw error;
    }
  },

  // Получить список доступных для приглашения пользователей
  getAvailableUsers: async (projectId) => {
    try {
      const response = await api.get(`/project/${projectId}/available-users`);
      return response.data;
    } catch (error) {
      console.error('Ошибка получения списка пользователей:', error);
      throw error;
    }
  },

  // === МЕТОДЫ ДЛЯ ОТЧЕТОВ ===

  // Добавить отчет
  addReport: async (reportData) => {
    try {
      console.log('addReport получает данные (JSON):', reportData);
      
      // Отправляем как JSON
      const response = await api.post('/project/report', reportData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Отчет успешно добавлен:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка добавления отчета:', error);
      console.error('Детали ошибки:', error.response?.data);
      
      if (error.response?.status === 403) {
        throw new Error('У вас нет прав для добавления отчета');
      }
      if (error.response?.status === 400) {
        const errorMsg = error.response.data?.message || error.response.data?.detail || 'Некорректные данные отчета';
        throw new Error(errorMsg);
      }
      throw error;
    }
  },

  // Редактировать отчет
  editReport: async (reportData) => {
    try {
      console.log('editReport получает данные (JSON):', reportData);
      
      // Отправляем как JSON
      const response = await api.post('/project/report/edit', reportData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Отчет успешно отредактирован:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка редактирования отчета:', error);
      console.error('Детали ошибки:', error.response?.data);
      throw error;
    }
  },

  // Удалить отчет 
  deleteReport: async (reportId) => {
    try {
      const response = await api.delete(`/project/report/${reportId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Отчет не найден или уже удален');
      }
      console.error('Ошибка удаления отчета:', error);
      throw error;
    }
  }
};