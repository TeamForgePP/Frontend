import React, { useState } from "react";
import "./PopUpNewProject.css";
import ProjectComandEdit from "./ProjectComandEdit";
import { projectService } from '../../services/projectService';

function PopUpNewProject({
    isOpen = false,
    onClose,
    onProjectCreated
}) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        team: [],
        git_organization: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTeamUpdate = (team) => {
        // Преобразуем команду в формат API
        const apiTeam = team.map(member => ({
            id: member.id,
            roles: [member.role] // Здесь нужно уточнить формат ролей
        }));
        setFormData(prev => ({ ...prev, team: apiTeam }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async () => {
        // Валидация
        if (!formData.name.trim()) {
            setError("Введите название проекта");
            return;
        }

        if (!formData.description.trim()) {
            setError("Введите описание проекта");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await projectService.createProject(formData);
            
            // Сброс формы
            setFormData({
                name: "",
                description: "",
                team: [],
                git_organization: ""
            });
            
            // Закрытие попапа
            onClose();
            
            // Уведомление родителя
            if (onProjectCreated) {
                onProjectCreated();
            }
            
        } catch (err) {
            console.error('Ошибка создания проекта:', err);
            setError(err.response?.data?.message || "Не удалось создать проект");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="overlay">
            <div className="popUpNewProject">
                <div className="popUpNewProjectContent">
                    <button 
                        className="popup-close" 
                        onClick={onClose}
                        disabled={loading}
                    >
                        ×
                    </button>
                    <h2>Новый проект</h2>
                    
                    {error && (
                        <div className="error-message" style={{color: 'red', marginBottom: '15px'}}>
                            {error}
                        </div>
                    )}
                    
                    <div className="NewProjectMain">
                        <p>Название</p>
                        <input 
                            className="inputText"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={loading}
                            placeholder="Введите название проекта"
                        />
                        
                        <p>Описание</p>
                        <textarea 
                            className="textAreaText"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            disabled={loading}
                            placeholder="Опишите проект"
                        />
                        
                        <ProjectComandEdit 
                            onTeamUpdate={handleTeamUpdate}
                            disabled={loading}
                        />
                        
                        <p>Git организация (необязательно)</p>
                        <input 
                            className="inputText"
                            name="git_organization"
                            value={formData.git_organization}
                            onChange={handleInputChange}
                            disabled={loading}
                            placeholder="Название организации на GitHub/GitLab"
                        />
                    </div>
                    
                    <div className="buttonContainer">
                        <button 
                            onClick={handleSubmit}
                            disabled={loading || !formData.name || !formData.description}
                            style={{
                                opacity: (loading || !formData.name || !formData.description) ? 0.6 : 1,
                                cursor: (loading || !formData.name || !formData.description) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Создание...' : 'Создать'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopUpNewProject;