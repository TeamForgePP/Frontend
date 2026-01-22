
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
      const response = await api.get(`/kanban/sprints/${sprintId}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении тасок спринта:', error);
      throw error;
    }
  };

  // Создание новой задачи
  createNewTask = async (taskData) => {
    try {
      // Добавим логирование для отладки
      console.log('Отправка данных задачи на сервер:', taskData);
      
      const response = await api.post('/kanban/new-task', taskData);
      console.log('Ответ сервера:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
      console.error('Детали ошибки:', error.response?.data);
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

  // Получение количества спринтов
  getNumberOfSprints = async () => {
    try {
      const response = await api.get('/kanban/sprints');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении количества спринтов:', error);
      throw error;
    }
  };

  // Получение деталей задачи
  getTaskDetails = async (taskId) => {
    try {
      const response = await api.get(`/kanban/tasks/${taskId}`);
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
      console.log('Обновление задачи:', taskId, taskData);
      const response = await api.put(`/projects/kanban/${taskId}`, taskData);
      console.log('Ответ при обновлении:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
      console.error('Детали ошибки:', error.response?.data);
      throw error;
    }
  };
}

export default new KanbanService();
