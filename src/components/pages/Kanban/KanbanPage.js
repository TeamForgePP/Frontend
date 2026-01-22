
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
  const [sprintsList, setSprintsList] = useState([]);
  const [selectedSprintId, setSelectedSprintId] = useState("current");
  const [draggedTask, setDraggedTask] = useState(null);
  
  // Получение данных канбан-доски
  const fetchKanbanData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await KanbanService.getKanbanData();
      console.log('Данные канбан-доски:', data);
      console.log('Задачи:', data.tasks);
      
      // Отладка статусов
      if (data.tasks && data.tasks.length > 0) {
        console.log('Статусы задач:');
        data.tasks.forEach(task => {
          console.log(`- "${task.title}": статус = "${task.status}"`);
        });
      }
      
      setKanbanData(data);
    } catch (err) {
      console.error('Ошибка загрузки канбан-доски:', err);
      setError('Не удалось загрузить данные канбан-доски');
    } finally {
      setLoading(false);
    }
  };

  const fetchSprintsList = async () => {
    try {
      const data = await KanbanService.getNumberOfSprints();
      console.log('Список спринтов:', data);
      setSprintsList(data.sprints || []);
    } catch (err) {
      console.error('Ошибка загрузки списка спринтов:', err);
    }
  };

  // Получение данных по конкретному спринту
  const fetchSprintData = async (sprintId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await KanbanService.getSprintTasks(sprintId);
      console.log('Данные спринта:', sprintId, data);
      setKanbanData(data);
      setSelectedSprintId(sprintId);
    } catch (err) {
      console.error('Ошибка загрузки спринта:', err);
      setError('Не удалось загрузить данные спринта');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKanbanData();
    fetchSprintsList();
  }, []);

  // Обработчик смены спринта
  const handleSprintChange = (e) => {
    const sprintId = e.target.value;
    setSelectedSprintId(sprintId);
    
    if (sprintId === "current") {
      fetchKanbanData();
    } else {
      fetchSprintData(sprintId);
    }
  };

  // Обработчик создания новой задачи
  const handleNewTaskClick = () => {
    setEditingTask(null); 
    setShowTaskModal(true);
  };

  // Обработчик клика по задаче - ПРОСМОТР
  const handleTaskClick = (task) => {
    console.log('Просмотр задачи:', task);
    setEditingTask(task); 
    setShowTaskModal(true);
  };

  // Обработчик сохранения задачи
  const handleTaskSaved = () => {
    console.log('Задача сохранена, обновляю данные...');
    
    if (selectedSprintId && selectedSprintId !== "current") {
      fetchSprintData(selectedSprintId);
    } else {
      fetchKanbanData();
    }
  };

  // Drag and Drop функции
  const handleDragStart = (e, task) => {
    console.log('Начали перетаскивание задачи:', task);
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    
    if (!draggedTask) return;
    
    console.log(`Перемещаем задачу ${draggedTask.id} в статус: ${newStatus}`);
    
    // Маппинг статусов для API
    const statusMapping = {
      'new': 'TO_DO',
      'in_progress': 'IN_PROGRESS',
      'review': 'IN_REVIEW',
      'testing': 'IN_TEST',
      'done': 'DONE'
    };
    
    const apiStatus = statusMapping[newStatus] || newStatus.toUpperCase();
    
    try {
      setLoading(true);
      
      // Отправляем запрос на изменение статуса
      await KanbanService.updateTaskStatus(draggedTask.id, apiStatus);
      
      console.log(`Статус задачи ${draggedTask.id} изменен на ${apiStatus}`);
      
      // Обновляем данные
      if (selectedSprintId && selectedSprintId !== "current") {
        await fetchSprintData(selectedSprintId);
      } else {
        await fetchKanbanData();
      }
      
    } catch (error) {
      console.error('Ошибка при изменении статуса:', error);
      alert('Не удалось изменить статус задачи');
    } finally {
      setLoading(false);
      setDraggedTask(null);
    }
  };

  // Группировка задач по статусам
  const getTasksByStatus = (status) => {
    if (!kanbanData || !kanbanData.tasks) {
      return [];
    }
    
    // Маппинг статусов: фронтенд -> бэкенд
    const statusMapping = {
      'new': ['to_do', 'todo', 'new', 'новая', 'TO_DO'],
      'in_progress': ['in_progress', 'in progress', 'в работе', 'IN_PROGRESS'],
      'review': ['review', 'ревью', 'на ревью', 'IN_REVIEW'],
      'testing': ['testing', 'тестирование', 'на тестировании', 'IN_TEST'],
      'done': ['done', 'готово', 'выполнено', 'DONE']
    };
    
    const backendStatuses = statusMapping[status] || [status];
    
    const filteredTasks = kanbanData.tasks.filter(task => {
      if (!task.status) return false;
      const taskStatus = task.status.toLowerCase().trim();
      return backendStatuses.some(s => s.toLowerCase() === taskStatus);
    });
    
    console.log(`Задачи для статуса "${status}": ${filteredTasks.length}`);
    
    return filteredTasks;
  };

  // Рендер загрузки
  if (loading && !kanbanData) {
    return (
      <div className="projectMainContainer">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Загрузка канбан-доски...</p>
        </div>
      </div>
    );
  }

  // Рендер ошибки
  if (error || !kanbanData) {
    return (
      <div className="projectMainContainer">
        <Header />
        <div className="error-container">
          <h2>Ошибка</h2>
          <p>{error || 'Данные канбан-доски не найдены'}</p>
          <button onClick={fetchKanbanData}>Повторить попытку</button>
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
              value={selectedSprintId}
            >
              <option value="current">Текущий спринт</option>
              {sprintsList.map((sprint, index) => (
                <option key={sprint.id || index} value={sprint.id}>
                  Спринт {sprint.seq || index + 1} - {sprint.name || ''}
                </option>
              ))}
            </select>
            <button 
              onClick={handleNewTaskClick}
            >
              + Создать задачу
            </button>
          </div>
        </div>

        <div className="columnNames">
          <h2>Новые (To Do)</h2>
          <h2>В работе</h2>
          <h2>Ревью</h2>
          <h2>Тестирование</h2>
          <h2>Готово</h2>
        </div>

        <div className="kanbanContent">
          {/* Колонка "Новые (To Do)" */}
          <div 
            className="kanbanColumn"
            onDragOver={(e) => handleDragOver(e, 'new')}
            onDrop={(e) => handleDrop(e, 'new')}
          >
            <div className="tasksContainer">
              {getTasksByStatus('new').map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  style={{ cursor: 'grab' }}
                >
                  <KanbanTask 
                    task={task} 
                    onTaskClick={handleTaskClick}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Колонка "В работе" */}
          <div 
            className="kanbanColumn"
            onDragOver={(e) => handleDragOver(e, 'in_progress')}
            onDrop={(e) => handleDrop(e, 'in_progress')}
          >
            <div className="tasksContainer">
              {getTasksByStatus('in_progress').map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  style={{ cursor: 'grab' }}
                >
                  <KanbanTask 
                    task={task} 
                    onTaskClick={handleTaskClick}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Колонка "Ревью" */}
          <div 
            className="kanbanColumn"
            onDragOver={(e) => handleDragOver(e, 'review')}
            onDrop={(e) => handleDrop(e, 'review')}
          >
            <div className="tasksContainer">
              {getTasksByStatus('review').map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  style={{ cursor: 'grab' }}
                >
                  <KanbanTask 
                    task={task} 
                    onTaskClick={handleTaskClick}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Колонка "Тестирование" */}
          <div 
            className="kanbanColumn"
            onDragOver={(e) => handleDragOver(e, 'testing')}
            onDrop={(e) => handleDrop(e, 'testing')}
          >
            <div className="tasksContainer">
              {getTasksByStatus('testing').map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  style={{ cursor: 'grab' }}
                >
                  <KanbanTask 
                    task={task} 
                    onTaskClick={handleTaskClick}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Колонка "Готово" */}
          <div 
            className="kanbanColumn"
            onDragOver={(e) => handleDragOver(e, 'done')}
            onDrop={(e) => handleDrop(e, 'done')}
          >
            <div className="tasksContainer">
              {getTasksByStatus('done').map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  style={{ cursor: 'grab' }}
                >
                  <KanbanTask 
                    task={task} 
                    onTaskClick={handleTaskClick}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Инструкция по drag-and-drop */}
        <div style={{
          marginTop: '20px',
          padding: '10px',
          background: '#f3f0ff',
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#333',
          border: '1px solid var(--purple)'
        }}>
          💡 <strong>Инструкция:</strong> Перетаскивайте задачи между колонками для изменения статуса. Кликните на задачу для просмотра деталей.
        </div>
      </div>

      {/* Модальное окно для просмотра/создания задачи */}
      {showTaskModal && (
        <NewTask
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          taskToEdit={editingTask} // Передаем задачу для просмотра или null для создания
          onTaskSaved={handleTaskSaved}
        />
      )}
    </div>
  );
}

export default KanbanPage;
