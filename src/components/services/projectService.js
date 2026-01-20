// services/projectService.js
import api from '../../utils/api';

export const projectService = {
  // Получить информацию о проекте
  getProjectInfo: async (projectId) => {
    try {
      const response = await api.get(`/project/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка получения информации о проекте:', error);
      throw error;
    }
  },

  // Редактировать проект
  editProject: async (projectData) => {
    try {
      const response = await api.post('/project/edit', projectData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error('Некорректные данные проекта');
      }
      if (error.response?.status === 403) {
        throw new Error('У вас нет прав для редактирования проекта');
      }
      console.error('Ошибка редактирования проекта:', error);
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
      const response = await api.post('/project/report', reportData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('У вас нет прав для добавления отчета');
      }
      console.error('Ошибка добавления отчета:', error);
      throw error;
    }
  },

  // Загрузить файл отчета
  uploadReportFile: async (uploadData) => {
    try {
      const formData = new FormData();
      Object.entries(uploadData.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('file', uploadData.file);

      const response = await fetch(uploadData.url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки файла');
      }

      return response;
    } catch (error) {
      console.error('Ошибка загрузки файла отчета:', error);
      throw error;
    }
  },

  // Подтвердить загрузку отчета
  finalizeReport: async (reportId) => {
    try {
      const response = await api.post('/project/report/finalize', { report_id: reportId });
      return response.data;
    } catch (error) {
      console.error('Ошибка подтверждения отчета:', error);
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
  },

  // Редактировать отчет
  editReport: async (reportData) => {
    try {
      const response = await api.post('/project/report/edit', reportData);
      return response.data;
    } catch (error) {
      console.error('Ошибка редактирования отчета:', error);
      throw error;
    }
  }
};