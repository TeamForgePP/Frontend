import React, { useState } from "react";
import "./KanbanTask.css";
import prH from "../../../assets/приоритетH.svg";
import prM from "../../../assets/приоритетM.svg";
import prL from "../../../assets/приоритетL.svg";

function KanbanTask({ task, onTaskClick }) {
  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Получение иконки приоритета
  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'высокий':
        return prH;
      case 'medium':
      case 'средний':
        return prM;
      case 'low':
      case 'низкий':
        return prL;
      default:
        return prM;
    }
  };

  const handleClick = (e) => {
    e.stopPropagation(); // Останавливаем всплытие
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  return (
    <div className="taskContainer" onClick={handleClick}>
      <p className="taskTitle">{task.title || 'Без названия'}</p>
      
      {task.tags && task.tags.length > 0 && (
        <div className="taskTags">
          {task.tags.map((tag, index) => (
            <span key={index} className="taskRole">
              {typeof tag === 'object' ? tag.name : tag}
            </span>
          ))}
        </div>
      )}
      
      {task.deadline && (
        <p className="taskDate">{formatDate(task.deadline)}</p>
      )}
      
      {task.performers && task.performers.length > 0 && (
        <div className="taskPeople">
          {task.performers.slice(0, 3).map((performer, index) => (
            <div key={index} className="taskPerson" title={`${performer.first_name} ${performer.last_name}`}>
              {performer.avatar_url ? (
                <img 
                  src={performer.avatar_url} 
                  alt={`${performer.first_name} ${performer.last_name}`} 
                  className="avatar-img"
                />
              ) : (
                <div className="avatarPlaceholder">
                  {performer.first_name?.[0]}{performer.last_name?.[0]}
                </div>
              )}
            </div>
          ))}
          {task.performers.length > 3 && (
            <span className="morePeople" title="Ещё исполнители">
              +{task.performers.length - 3}
            </span>
          )}
        </div>
      )}
      
      <div className="taskFooter">
        <p>{task.key || '??-??'}</p>
        <img 
          src={getPriorityIcon(task.priority)} 
          alt={`Приоритет: ${task.priority}`}
          title={`Приоритет: ${task.priority}`}
        />
      </div>
    </div>
  );
}

export default KanbanTask;