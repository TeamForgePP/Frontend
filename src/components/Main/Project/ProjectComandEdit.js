import React, { useState, useEffect } from "react";
import ComandCard from "./ComandCard";
import plus from "../../../assets/plus.svg";
import './ProjectComandEdit.css';

function ProjectComandEdit({ onTeamUpdate, disabled = false }) {
    const [team, setTeam] = useState([
        { id: 1, name: "Иван", surname: "Иванов", role: "Backend" },
        { id: 2, name: "Мария", surname: "Петрова", role: "Frontend" },
        { id: 3, name: "Арина", surname: "Сидорова", role: "Дизайнер" },
    ]);

    // Уведомляем родителя об изменениях команды
    useEffect(() => {
        if (onTeamUpdate) {
            onTeamUpdate(team);
        }
    }, [team, onTeamUpdate]);

    const handleRemoveMember = (id) => {
        if (disabled) return;
        setTeam(team.filter(member => member.id !== id));
    };

    const handleAddMember = () => {
        if (disabled) return;
        const newId = team.length > 0 ? Math.max(...team.map(m => m.id)) + 1 : 1;
        const newMember = {
            id: newId,
            name: "Новый",
            surname: "Участник",
            role: "Роль"
        };
        setTeam([...team, newMember]);
    };

    const handleUpdateMember = (id, updates) => {
        if (disabled) return;
        setTeam(team.map(member => 
            member.id === id ? { ...member, ...updates } : member
        ));
    };

    return (
        <div className="comandSection">
            <p className="comandTitle">Команда</p>
            <div className="newProjectComand">
                {team.map(member => (
                    <ComandCard
                        key={member.id}
                        id={member.id}
                        name={member.name}
                        surname={member.surname}
                        role={member.role}
                        onRemove={handleRemoveMember}
                        onUpdate={handleUpdateMember}
                        disabled={disabled}
                    />
                ))}
                <div 
                    className="emptyCard"
                    onClick={handleAddMember}
                    title="Добавить участника"
                    style={{ 
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        opacity: disabled ? 0.5 : 1 
                    }}
                >
                    <div className="emptyIconContainer">
                        <img src={plus} alt="plus"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectComandEdit;