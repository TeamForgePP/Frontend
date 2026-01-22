
import React, { useState, useEffect } from "react";
import prH from "../../../assets/приоритетH.svg";
import prM from "../../../assets/приоритетM.svg";
import prL from "../../../assets/приоритетL.svg";
import KanbanService from '../../services/kanbanService';
import './NewTask.css';

function NewTask({ isOpen, onClose, taskToEdit, onTaskSaved }) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    performers: [],
    priority: 'medium',
    deadline: '',
    tag: 'backend',
    status: 'TO_DO'
  });
  
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false); 

  // Загрузка участников команды и данных задачи
  useEffect(() => {
    if (isOpen) {
      loadTeamMembers();
      
      if (taskToEdit) {
        // Режим просмотра существующей задачи
        setIsEditing(true);
        setIsReadOnly(true); // Только чтение
        loadTaskDetails(taskToEdit.id);
      } else {
        // Режим создания новой задачи
        setIsEditing(false);
        setIsReadOnly(false); // Можно редактировать
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

  // Загрузка деталей задачи для просмотра
  const loadTaskDetails = async (taskId) => {
    try {
      const response = await KanbanService.getTaskDetails(taskId);
      const task = response;
      
      const performerIds = task.performers ? task.performers.map(p => p.id) : [];
      
      setTaskData({
        title: task.title || '',
        description: task.description || '',
        performers: performerIds,
        priority: task.priority || 'medium',
        deadline: task.deadline || '',
        tag: task.tag || 'backend',
        status: task.status || 'TO_DO'
      });
    } catch (error) {
      console.error('Ошибка при загрузке деталей задачи:', error);
      alert('Не удалось загрузить данные задачи');
      onClose();
    }
  };

  const resetForm = () => {
    setTaskData({
      title: '',
      description: '',
      performers: [],
      priority: 'medium',
      deadline: '',
      tag: 'backend',
      status: 'TO_DO'
    });
    setErrors({});
  };

  // Обработка изменений в форме - только если не readOnly
  const handleChange = (e) => {
    if (isReadOnly) return; 
    
    const { name, value } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Обработка выбора исполнителей - только если не readOnly
  const handlePerformersChange = (e) => {
    if (isReadOnly) return;
    
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

  // Отправка формы - только для создания
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isReadOnly) {
      onClose();
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const taskPayload = {
        title: taskData.title,
        description: taskData.description,
        performers: taskData.performers.map(id => ({ id })),
        priority: taskData.priority,
        deadline: taskData.deadline,
        tag: taskData.tag,
        status: taskData.status
      };
      
      console.log('Создание новой задачи:', taskPayload);
      
      // Только создание новой задачи (редактирование отключено)
      await KanbanService.createNewTask(taskPayload);
      
      if (onTaskSaved) onTaskSaved();
      if (onClose) onClose();
      
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
      console.error('Детали ошибки:', error.response?.data);
      alert(error.response?.data?.detail?.[0]?.msg || error.message || 'Ошибка при создании задачи');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Форматирование даты для отображения
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="newTaskContainer" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>×</button>
        
        <form onSubmit={handleSubmit}>
          <div className="newTaskHeader">
            <h1>{isReadOnly ? 'Просмотр задачи' : isEditing ? 'Редактировать задачу' : 'Новая задача'}</h1>
            {taskToEdit?.key && (
              <p className="taskKey">{taskToEdit.key}</p>
            )}
          </div>
          
          <div className="newTaskContent">
            {/* Название задачи */}
            <div className="form-group">
              <p>Название задачи</p>
              {isReadOnly ? (
                <div className="read-only-field">{taskData.title || 'Не указано'}</div>
              ) : (
                <input
                  type="text"
                  name="title"
                  value={taskData.title}
                  onChange={handleChange}
                  placeholder="Введите название задачи"
                  className={errors.title ? 'error' : ''}
                  disabled={isReadOnly}
                />
              )}
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
            
            {/* Описание задачи */}
            <div className="form-group">
              <p>Описание задачи</p>
              {isReadOnly ? (
                <div className="read-only-field">{taskData.description || 'Не указано'}</div>
              ) : (
                <textarea
                  name="description"
                  value={taskData.description}
                  onChange={handleChange}
                  placeholder="Введите описание задачи"
                  rows="4"
                  className={errors.description ? 'error' : ''}
                  disabled={isReadOnly}
                />
              )}
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
            
            <div className="newTaskThings">
              {/* Исполнители */}
              <div className="newTaskThing">
                <p>Исполнители</p>
                {isReadOnly ? (
                  <div className="read-only-field">
                    {taskData.performers.length > 0 ? (
                      <div>
                        {teamMembers
                          .filter(member => taskData.performers.includes(member.id))
                          .map(member => (
                            <div key={member.id} style={{marginBottom: '5px'}}>
                              {member.first_name} {member.last_name}
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      'Не назначены'
                    )}
                  </div>
                ) : (
                  <>
                    <select
                      name="performers"
                      multiple
                      value={taskData.performers}
                      onChange={handlePerformersChange}
                      className={errors.performers ? 'error' : ''}
                      disabled={isReadOnly}
                    >
                      
                      {teamMembers.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.first_name} {member.last_name}
                        </option>
                      ))}
                    </select>
                    <small className="hint">Удерживайте Ctrl для выбора нескольких</small>
                    {errors.performers && <span className="error-message">{errors.performers}</span>}
                  </>
                )}
              </div>
              
              {/* Приоритет */}
              <div className="newTaskThing">
                <p>Приоритет</p>
                {isReadOnly ? (
                  <div className="read-only-field">
                    {taskData.priority === 'high' ? 'Высокий' : 
                     taskData.priority === 'medium' ? 'Средний' : 
                     taskData.priority === 'low' ? 'Низкий' : 
                     taskData.priority}
                  </div>
                ) : (
                  <select
                    name="priority"
                    value={taskData.priority}
                    onChange={handleChange}
                    disabled={isReadOnly}
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
                )}
              </div>
              
              {/* Тег */}
              <div className="newTaskThing">
                <p>Тег</p>
                {isReadOnly ? (
                  <div className="read-only-field">{taskData.tag || 'Не указан'}</div>
                ) : (
                  <select
                    name="tag"
                    value={taskData.tag}
                    onChange={handleChange}
                    disabled={isReadOnly}
                  >
                    <option value="backend">Backend</option>
                    <option value="frontend">Frontend</option>
                    <option value="design">Design</option>
                    <option value="devops">DevOps</option>
                    <option value="business_analyst">Business_analyst</option>
                    <option value="manager">Manager</option>
                    <option value="product_manager">Product_manager</option>
                  </select>
                )}
              </div>
              
              {/* Срок выполнения */}
              <div className="newTaskThing">
                <p>Дедлайн</p>
                {isReadOnly ? (
                  <div className="read-only-field">
                    {taskData.deadline ? formatDate(taskData.deadline) : 'Не указан'}
                  </div>
                ) : (
                  <>
                    <input
                      type="date"
                      name="deadline"
                      value={taskData.deadline}
                      onChange={handleChange}
                      className={errors.deadline ? 'error' : ''}
                      disabled={isReadOnly}
                    />
                    {errors.deadline && <span className="error-message">{errors.deadline}</span>}
                  </>
                )}
              </div>
              
              {/* Статус */}
              <div className="newTaskThing">
                <p>Статус</p>
                <div className="read-only-field">
                  {taskData.status === 'TO_DO' ? 'Новая (To Do)' :
                   taskData.status === 'IN_PROGRESS' ? 'В работе' :
                   taskData.status === 'REVIEW' ? 'На ревью' :
                   taskData.status === 'TESTING' ? 'Тестирование' :
                   taskData.status === 'DONE' ? 'Готово' :
                   taskData.status}
                </div>
              </div>
            </div>
            
            <div className="form-buttons">
              {isReadOnly ? (
                <button 
                  type="button" 
                  
                  onClick={onClose}
                >
                  Закрыть
                </button>
              ) : (
                <>
                  <button 
                    type="button" 
                    
                    onClick={onClose}
                    disabled={loading}
                  >
                    Отмена
                  </button>
                  <button 
                    type="submit" 
                    className="green_button"
                    disabled={loading}
                  >
                    {loading ? 'Создание...' : 'Создать задачу'}
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTask;
