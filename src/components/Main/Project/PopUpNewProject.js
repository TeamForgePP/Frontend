import React, { useState } from "react";
import "./PopUpNewProject.css";
import ProjectComandEdit from "./ProjectComandEdit";
import AddStudents from "../../pages/ProjectPage/addStudents";
import { homeService } from '../../services/homeService';

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
    const [localTeam, setLocalTeam] = useState([]); // Локальное состояние для отображения команды
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isAddStudentsOpen, setIsAddStudentsOpen] = useState(false);

    const handleTeamUpdate = (team) => {
        // Сохраняем локальную команду для отображения
        setLocalTeam(team);
        
        // Преобразуем команду в формат API для отправки
        const apiTeam = team.map(member => ({
            id: member.id,
            roles: Array.isArray(member.roles) ? member.roles : [member.role || ""]
        }));
        
        setFormData(prev => ({ 
            ...prev, 
            team: apiTeam 
        }));
    };

    const handleAddStudent = (student) => {
        const newMember = {
            id: student.id || `temp_${Date.now()}`,
            name: student.name,
            surname: student.surname,
            role: student.roles ? student.roles.join(', ') : student.role || "",
            roles: student.roles || []
        };
        
        // Обновляем локальную команду
        const updatedTeam = [...localTeam, newMember];
        setLocalTeam(updatedTeam);
        
        // Преобразуем в формат API и обновляем formData
        const apiTeam = updatedTeam.map(member => ({
            id: member.id,
            roles: Array.isArray(member.roles) ? member.roles : [member.role || ""]
        }));
        
        setFormData(prev => ({ 
            ...prev, 
            team: apiTeam 
        }));
        
        closeAddStudents();
    };

    const openAddStudents = () => {
        setIsAddStudentsOpen(true);
    };

    const closeAddStudents = () => {
        setIsAddStudentsOpen(false);
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
            // Подготавливаем данные для отправки в правильном формате
            const projectData = {
                name: formData.name,
                description: formData.description,
                team: formData.team,
                git_organization: formData.git_organization || ""
            };
            
            await homeService.createProject(projectData);
            
            // Сброс формы
            setFormData({
                name: "",
                description: "",
                team: [],
                git_organization: ""
            });
            setLocalTeam([]);
            
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
                        />
                        
                        <p>Описание</p>
                        <textarea 
                            className="textAreaText"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            disabled={loading}
                        />
                        
                        <div className="section-header">
                            <p style={{ marginBottom: '10px' }}>Команда</p>
                            <button 
                                className="add-member-btn ok_button"
                                onClick={openAddStudents}
                                disabled={loading}
                                style={{
                                    marginBottom: '15px',
                                    padding: '8px 16px',
                                    fontSize: '14px'
                                }}
                            >
                                + Добавить участника
                            </button>
                        </div>
                        
                        <ProjectComandEdit 
                            team={localTeam} // Передаем локальную команду для отображения
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

            <AddStudents
                isOpen={isAddStudentsOpen}
                onClose={closeAddStudents}
                onAddStudent={handleAddStudent}
                projectId={null}
            />
        </div>
    );
}

export default PopUpNewProject;