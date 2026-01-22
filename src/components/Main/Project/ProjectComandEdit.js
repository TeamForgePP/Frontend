import React, { useState, useEffect } from "react";
import ComandCard from "./ComandCard";
import plus from "../../../assets/plus.svg";
import './ProjectComandEdit.css';
import profilImg from '../../../assets/iconoir_profile-circle.svg';
import { projectService } from "../../services/projectService"; 

function ProjectComandEdit({ 
  team = [], 
  projectId, 
  onRemoveMember, 
  onUpdateMember, 
  onTeamUpdate, 
  disabled = false 
}) {
  const [localTeam, setLocalTeam] = useState([]);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    setLocalTeam(team.map(member => ({
      ...member,
      id: member.user_id || member.id,
      name: member.name || member.first_name || '',
      surname: member.surname || member.last_name || '',
      role: member.role || (Array.isArray(member.roles) ? member.roles.join(', ') : '')
    })));
  }, [team]);

  const handleRemoveMember = async (memberId) => {
    if (!projectId || disabled || isRemoving) {
      console.log('Условия не выполнены:', { projectId, disabled, isRemoving });
      return;
    }
    
    try {
      setIsRemoving(true);
      
      console.log('Начинаем удаление участника:', { projectId, memberId });
      
      // Вызываем сервис удаления участника
      await projectService.removeMember(projectId, memberId);
      
      // Обновляем локальное состояние
      const updatedTeam = localTeam.filter(member => member.id !== memberId);
      setLocalTeam(updatedTeam);
      
      // Уведомляем родительский компонент
      if (onRemoveMember) {
        onRemoveMember(memberId);
      }
      
      // Если есть onTeamUpdate, вызываем его
      if (onTeamUpdate) {
        onTeamUpdate(updatedTeam);
      }
      
      console.log('Участник успешно удален');
      
    } catch (error) {
      console.error('Ошибка при удалении участника:', error);
      alert(error.message || 'Не удалось исключить участника из команды');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleUpdate = (id, updates) => {
    if (disabled || !onUpdateMember) return;
    
    // Обновляем локальное состояние
    const newTeam = localTeam.map(member => 
      member.id === id ? { ...member, ...updates } : member
    );
    setLocalTeam(newTeam);
    
    // Уведомляем родителя
    onUpdateMember(id, updates);
    
    // Если есть onTeamUpdate, вызываем его
    if (onTeamUpdate) {
      onTeamUpdate(newTeam);
    }
  };

  // Если не в режиме редактирования - показываем статичный список
  if (disabled) {
    return (
      <div className="comandSection static-team">
        <div className="teamListStatic">
          {localTeam.length > 0 ? (
            localTeam.map(member => (
              <div key={member.id} className="teamMemberStatic">
                <div className="comandImg">
                    <img src={profilImg} alt={`${member.name} ${member.surname}`} />
                </div>
                <span className="memberName">
                  {member.name} {member.surname}
                </span>
                <span className="memberRole">
                  {member.role || "Роль не указана"}
                </span>
              </div>
            ))
          ) : (
            <div className="no-team-message">
              <p>В команде пока нет участников</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // В режиме редактирования - показываем редактируемые карточки
  return (
    <div className="comandSection editable-team">
      <div className="comandHeader">
      </div>
      
      <div className="newProjectComand">
        {localTeam.length > 0 ? (
          localTeam.map(member => (
            <ComandCard
              key={member.id}
              id={member.id}
              name={member.name}
              surname={member.surname}
              role={member.role}
              onRemove={handleRemoveMember}
              onUpdate={handleUpdate}
              disabled={disabled || isRemoving}
            />
          ))
        ) : (
          <div className="teamPlaceholder">
            <p>Добавьте участников через кнопку "Добавить участника"</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectComandEdit;