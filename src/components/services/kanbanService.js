import api from '../../utils/api';

class KanbanService {
  // Получение данных канбан-доски для актуального спринта
  getKanbanData = async () => {
    try {
      const response = await api.get('/kanban');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении данных канбан-доски:', error);
      throw error;
    }
  };

  // Получение тасок по конкретному спринту
  getSprintTasks = async (sprintId) => {
    try {
      const response = await api.get(`/kanban/${sprintId}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении тасок спринта:', error);
      throw error;
    }
  };

  // Создание новой задачи
  createNewTask = async (taskData) => {
    try {
      const response = await api.post('/kanban/new-task', taskData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
      throw error;
    }
  };

  // Получение всех участников команды
  getTeamMembers = async () => {
    try {
      const response = await api.get('/kanban/team-members');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении участников команды:', error);
      throw error;
    }
  };

  // Получение деталей задачи
  getTaskDetails = async (taskId) => {
    try {
      const response = await api.get(`/projects/kanban/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении деталей задачи:', error);
      throw error;
    }
  };

  // Обновление статуса задачи
  updateTaskStatus = async (taskId, status) => {
    try {
      const response = await api.post('/kanban/update-status', {
        task_id: taskId,
        status: status
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении статуса задачи:', error);
      throw error;
    }
  };

  // Обновление задачи
  updateTask = async (taskId, taskData) => {
    try {
      const response = await api.put(`/projects/kanban/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
      throw error;
    }
  };
}

export default new KanbanService();