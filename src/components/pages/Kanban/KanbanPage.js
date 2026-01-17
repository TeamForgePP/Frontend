import React, { useState, useEffect } from "react";
import './KanbanPage.css';
import Header from "../../Header/Header";
import KanbanTask from "./KanbanTask";
import NewTask from "./NewTask";
import KanbanService from '../../services/kanbanService';

function KanbanPage() {
  const [kanbanData, setKanbanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Получение данных канбан-доски
  const fetchKanbanData = async () => {
    setLoading(true);
    try {
      const data = await KanbanService.getKanbanData();
      setKanbanData(data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить данные канбан-доски');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Получение данных по конкретному спринту
  const fetchSprintData = async (sprintId) => {
    setLoading(true);
    try {
      const data = await KanbanService.getSprintTasks(sprintId);
      setKanbanData(data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить данные спринта');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKanbanData();
  }, []);

  // Обработчик смены спринта
  const handleSprintChange = (e) => {
    const sprintId = e.target.value;
    if (sprintId === "current") {
      fetchKanbanData();
    } else {
      fetchSprintData(sprintId);
    }
  };

  // Обработчик создания новой задачи
  const handleNewTaskClick = () => {
    setEditingTask(null); // Сбрасываем задачу для редактирования
    setShowTaskModal(true);
  };

  // Обработчик клика по задаче
  const handleTaskClick = (task) => {
    setEditingTask(task); // Устанавливаем задачу для редактирования
    setShowTaskModal(true);
  };

  // Обработчик сохранения задачи
  const handleTaskSaved = () => {
    // Обновляем данные
    if (kanbanData?.selected_sprint?.id) {
      fetchSprintData(kanbanData.selected_sprint.id);
    } else {
      fetchKanbanData();
    }
  };

  // Группировка задач по статусам
  const getTasksByStatus = (status) => {
    if (!kanbanData || !kanbanData.tasks) return [];
    return kanbanData.tasks.filter(task => task.status === status);
  };

  if (loading) {
    return (
      <div className="projectMainContainer">
        <Header />
        <div className="uniSection">
          <div className="loading">Загрузка канбан-доски...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projectMainContainer">
        <Header />
        <div className="uniSection">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="projectMainContainer">
      <Header />
      <div className="uniSection">
        <div className="projectHeader">
          <h1 className="projectHeaderText">{kanbanData?.project?.name || 'Канбан-доска'}</h1>
          <div className="projectHeaderBtns">
            
            <select 
              className="sprint-selector"
              onChange={handleSprintChange}
              defaultValue="current"
            >
              <option value="current">Текущий спринт</option>
              <option value="1">Спринт 1</option>
              <option value="2">Спринт 2</option>
              <option value="3">Спринт 3</option>
              <option value="4">Спринт 4</option>
            </select>
          </div>
        </div>

        <div className="columnNames">
          <h2>Новые</h2>
          <h2>В работе</h2>
          <h2>Ревью</h2>
          <h2>Тестирование</h2>
          <h2>Готово</h2>
        </div>

        <div className="kanbanContent">
          <div className="kanbanColumn">
            <div className="tasksContainer">
              {getTasksByStatus('new').map(task => (
                <KanbanTask 
                  key={task.id} 
                  task={task} 
                  onTaskClick={handleTaskClick}
                />
              ))}
            </div>
          </div>
          <div className="kanbanColumn">
            <div className="tasksContainer">
              {getTasksByStatus('in_progress').map(task => (
                <KanbanTask 
                  key={task.id} 
                  task={task} 
                  onTaskClick={handleTaskClick}
                />
              ))}
              <button 
              className="new-task-btn"
              onClick={handleNewTaskClick}
            >
              Новая задача
            </button>
            </div>
          </div>
          <div className="kanbanColumn">
            <div className="tasksContainer">
              {getTasksByStatus('review').map(task => (
                <KanbanTask 
                  key={task.id} 
                  task={task} 
                  onTaskClick={handleTaskClick}
                />
              ))}
              <button 
              className="new-task-btn"
              onClick={handleNewTaskClick}
            >
              Новая задача
            </button>
            </div>
          </div>
          <div className="kanbanColumn">
            <div className="tasksContainer">
              {getTasksByStatus('testing').map(task => (
                <KanbanTask 
                  key={task.id} 
                  task={task} 
                  onTaskClick={handleTaskClick}
                />
              ))}
              <button 
              className="new-task-btn"
              onClick={handleNewTaskClick}
            >
              Новая задача
            </button>
            </div>
          </div>
          <div className="kanbanColumn">
            <div className="tasksContainer">
              {getTasksByStatus('done').map(task => (
                <KanbanTask 
                  key={task.id} 
                  task={task} 
                  onTaskClick={handleTaskClick}
                />
              ))}
              <button 
              className="new-task-btn"
              onClick={handleNewTaskClick}
            >
              Новая задача
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно для создания/редактирования задачи */}
      {showTaskModal && (
        <NewTask
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          taskToEdit={editingTask}
          onTaskSaved={handleTaskSaved}
        />
      )}
    </div>
  );
}

export default KanbanPage;