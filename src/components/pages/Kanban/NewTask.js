import React, { useState, useEffect } from "react";
import prH from "../../../assets/приоритетH.svg";
import prM from "../../../assets/приоритетM.svg";
import prL from "../../../assets/приоритетL.svg";
import KanbanService from '../../services/kanbanService';
import './NewTask.css';

function NewTask({ isOpen, onClose, taskToEdit, onTaskSaved }) {
  const [taskData, setTaskData] = useState({
    id: '',
    title: '',
    description: '',
    performers: [],
    priority: 'medium',
    deadline: ''
  });
  
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Загрузка участников команды и данных задачи
  useEffect(() => {
    if (isOpen) {
      loadTeamMembers();
      if (taskToEdit) {
        setIsEditing(true);
        loadTaskDetails(taskToEdit.id);
      } else {
        setIsEditing(false);
        resetForm();
      }
    }
  }, [isOpen, taskToEdit]);

  const loadTeamMembers = async () => {
    try {
      const response = await KanbanService.getTeamMembers();
      setTeamMembers(response.members || []);
    } catch (error) {
      console.error('Ошибка при загрузке участников:', error);
    }
  };

  const loadTaskDetails = async (taskId) => {
    try {
      const response = await KanbanService.getTaskDetails(taskId);
      const task = response;
      
      setTaskData({
        id: task.id,
        title: task.title || '',
        description: task.description || '',
        performers: task.performers ? task.performers.map(p => p.id) : [],
        priority: task.priority || 'medium',
        deadline: task.deadline || ''
      });
    } catch (error) {
      console.error('Ошибка при загрузке деталей задачи:', error);
      alert('Не удалось загрузить данные задачи');
      onClose();
    }
  };

  const resetForm = () => {
    setTaskData({
      id: '',
      title: '',
      description: '',
      performers: [],
      priority: 'medium',
      deadline: ''
    });
    setErrors({});
  };

  // Обработка изменений в форме
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очистка ошибки при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Обработка выбора исполнителей
  const handlePerformersChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setTaskData(prev => ({
      ...prev,
      performers: selectedOptions
    }));
    
    if (errors.performers) {
      setErrors(prev => ({ ...prev, performers: '' }));
    }
  };

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};
    
    if (!taskData.title.trim()) {
      newErrors.title = 'Название задачи обязательно';
    }
    
    if (!taskData.description.trim()) {
      newErrors.description = 'Описание задачи обязательно';
    }
    
    if (taskData.performers.length === 0) {
      newErrors.performers = 'Выберите хотя бы одного исполнителя';
    }
    
    if (!taskData.deadline) {
      newErrors.deadline = 'Укажите срок выполнения';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      if (isEditing) {
        // Обновление существующей задачи
        await KanbanService.updateTask(taskData.id, {
          title: taskData.title,
          description: taskData.description,
          performers: taskData.performers,
          priority: taskData.priority,
          deadline: taskData.deadline
        });
        alert('Задача успешно обновлена!');
      } else {
        // Создание новой задачи
        await KanbanService.createNewTask({
          title: taskData.title,
          description: taskData.description,
          performers: taskData.performers,
          priority: taskData.priority,
          deadline: taskData.deadline
        });
        alert('Задача успешно создана!');
      }
      
      // Вызов callback
      if (onTaskSaved) onTaskSaved();
      if (onClose) onClose();
      
    } catch (error) {
      console.error('Ошибка при сохранении задачи:', error);
      alert(error.response?.data?.message || 'Ошибка при сохранении задачи');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="newTaskContainer" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>×</button>
        
        <form onSubmit={handleSubmit}>
          <div className="newTaskHeader">
            <h1>{isEditing ? 'Редактировать задачу' : 'Новая задача'}</h1>
            {isEditing && taskData.key && (
              <p className="taskKey">{taskData.key}</p>
            )}
          </div>
          
          <div className="newTaskContent">
            {/* Название задачи */}
            <div className="form-group">
              <input
                type="text"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                placeholder="Введите название задачи"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
            
            {/* Описание задачи */}
            <div className="form-group">
              <textarea
                name="description"
                value={taskData.description}
                onChange={handleChange}
                placeholder="Введите описание задачи"
                rows="4"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
            
            <div className="newTaskThings">
              {/* Исполнители */}
              <div className="newTaskThing">
                <select
                  name="performers"
                  multiple
                  value={taskData.performers}
                  onChange={handlePerformersChange}
                  className={errors.performers ? 'error' : ''}
                  size="4"
                >
                  <option value="" disabled>Выберите исполнителей</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.first_name} {member.last_name}
                    </option>
                  ))}
                </select>
                {errors.performers && <span className="error-message">{errors.performers}</span>}
                <small className="hint">Удерживайте Ctrl для выбора нескольких</small>
              </div>
              
              {/* Приоритет */}
              <div className="newTaskThing">
                <select
                  name="priority"
                  value={taskData.priority}
                  onChange={handleChange}
                >
                  <option value="high">
                    <img src={prH} alt="Высокий" style={{marginRight: '5px'}} /> Высокий
                  </option>
                  <option value="medium">
                    <img src={prM} alt="Средний" style={{marginRight: '5px'}} /> Средний
                  </option>
                  <option value="low">
                    <img src={prL} alt="Низкий" style={{marginRight: '5px'}} /> Низкий
                  </option>
                </select>
              </div>
              
              {/* Срок выполнения */}
              <div className="newTaskThing">
                <label>Срок выполнения*</label>
                <input
                  type="date"
                  name="deadline"
                  value={taskData.deadline}
                  onChange={handleChange}
                  className={errors.deadline ? 'error' : ''}
                />
                {errors.deadline && <span className="error-message">{errors.deadline}</span>}
              </div>
            </div>
            
            <div className="form-buttons">
              <button 
                type="button" 
                className="btn-cancel"
                onClick={onClose}
                disabled={loading}
              >
                Отмена
              </button>
              <button 
                type="submit" 
                className="btn-save"
                disabled={loading}
              >
                {loading ? 'Сохранение...' : isEditing ? 'Сохранить изменения' : 'Создать задачу'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTask;