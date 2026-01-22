import React, { useState, useEffect } from "react";
import './NewSprint.css';
import date from '../../../assets/date.svg';
import { sprintsService } from '../../services/sprintsService';

function NewSprint({ isOpen, onClose, sprintId, onSuccess }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Данные формы
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    goal: "",
    description: ""
  });

  // При открытии/закрытии окна
  useEffect(() => {
    if (isOpen) {
      if (sprintId) {
        // Загружаем данные существующего спринта
        loadSprintData(sprintId);
        setIsEditing(false); // Просмотр для существующего спринта
      } else {
        // Сбрасываем форму для нового спринта
        setFormData({
          name: "",
          start_date: "",
          end_date: "",
          goal: "",
          description: ""
        });
        setIsEditing(true); // Редактирование для нового спринта
      }
    }
  }, [isOpen, sprintId]);

  // Загрузка данных спринта
  const loadSprintData = async (id) => {
    setLoading(true);
    try {
      const data = await sprintsService.getSprintById(id);
      setFormData(data);
    } catch (error) {
      console.error("Ошибка загрузки спринта:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      if (sprintId) {
        await sprintsService.updateSprint(sprintId, formData);
        onSuccess?.("Спринт обновлен!");
      } else {
        await sprintsService.createSprint(formData);
        onSuccess?.("Новый спринт создан!");
      }
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      onSuccess?.("Ошибка: " + error.message);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  if (!isOpen) return null;

  // Определяем, что показывать в правой части заголовка
  const renderHeaderRight = () => {
    if (!sprintId || isEditing) {
      return (
        <button 
          className="green_button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Сохранение..." : (sprintId ? "Сохранить" : "Создать")}
        </button>
      );
    }
    
    return (
      <button 
        className="ok_button"
        onClick={handleEditClick}
      >
        Редактировать
      </button>
    );
  };

  return (
    <div className="overlay">
      <div className="popUpNewProject">
        <div className="popUpNewProjectContent">
          <div className="newSprintHeader">
            <div className="newSprintHeaderLeft">       
              <h1>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Название спринта"
                    className="title-input"
                  />
                ) : (
                  sprintId ? formData.name : "Новый спринт"
                )}
              </h1>
              {sprintId && !isEditing && (
                <span className="status_badge completed">
                  Завершен
                </span>
              )}
            </div>
            <div className="newSprintHeaderRight">
              {renderHeaderRight()}
            </div>
            <button className="popup-close" onClick={onClose}>
              ×
            </button>
          </div>
          
          <div className="newSprintDate">
            {isEditing ? (
              <div className="date-inputs">
                <input
                  type="date"
                  name="start_date"
                  value={sprintsService.formatDateForInput(formData.start_date)}
                  onChange={handleChange}
                />
                <span>-</span>
                <input
                  type="date"
                  name="end_date"
                  value={sprintsService.formatDateForInput(formData.end_date)}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <p>{sprintsService.formatDate(formData.start_date)} - {sprintsService.formatDate(formData.end_date)}</p>
            )}
          </div>
          
          <h3>Цель</h3>
          {isEditing ? (
            <textarea
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="Опишите цель спринта"
              rows="2"
            />
          ) : (
            <p>{formData.goal}</p>
          )}
          
          <h3>Описание</h3>
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Детальное описание задач спринта"
              rows="4"
            />
          ) : (
            <p>{formData.description}</p>
          )}
        </div>    
      </div>
    </div>
  );
}

export default NewSprint;