import React, { useState } from "react";
import './ProjectCard.css';
import ProjectMap from "./ProjectMap";
import UniPopUp from "../../UniPopUp";
import { homeService } from '../../services/homeService';
import { useNavigate } from 'react-router-dom';

function ProjectCard({ project, onProjectDeleted }) {
    const [isDeletePopUpOpen, setIsDeletePopUpOpen] = useState(false);
    const [isLeavePopUpOpen, setIsLeavePopUpOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Для отладки
    console.log('ProjectCard получил проект:', project);
    console.log('role поле:', project?.role);
    console.log('roles поле:', project?.roles);

    // Защита от undefined
    if (!project) {
        console.warn('ProjectCard получил undefined project');
        return (
            <div className="uniInnerSection">
                <div className="project-error-placeholder">
                    <p>Данные проекта не загружены</p>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Не указан';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    const formatRole = (role) => {
        console.log('formatRole получил:', role);
        if (!role) return 'Не указана';
        
        // Если role - массив
        if (Array.isArray(role)) {
            const formatted = role.join(', ');
            console.log('Отформатированный массив:', formatted);
            return formatted;
        }
        
        // Если role - строка
        if (typeof role === 'string') {
            const formatted = role === '-' ? 'Не указана' : role;
            console.log('Отформатированная строка:', formatted);
            return formatted;
        }
        
        console.log('Нераспознанный формат role:', typeof role);
        return 'Не указана';
    };

    const handleOpenProject = () => {
        navigate(`/project/${project.id}`);
    };

    const handleDeleteProject = async () => {
        setLoading(true);
        try {
            await homeService.deleteProject(project.id);
            if (onProjectDeleted) {
                onProjectDeleted(project.id);
            }
        } catch (error) {
            console.error('Ошибка удаления проекта:', error);
            alert(error.response?.data?.message || 'Не удалось удалить проект');
        } finally {
            setLoading(false);
            setIsDeletePopUpOpen(false);
        }
    };

    const handleLeaveProject = async () => {
        setLoading(true);
        try {
            await homeService.leaveProject(project.id);
            if (onProjectDeleted) {
                onProjectDeleted(project.id);
            }
        } catch (error) {
            console.error('Ошибка выхода из проекта:', error);
            alert(error.response?.data?.message || 'Не удалось покинуть проект');
        } finally {
            setLoading(false);
            setIsLeavePopUpOpen(false);
        }
    };

    const openDeletePopUp = () => {
        setIsDeletePopUpOpen(true);
    };

    const openLeavePopUp = () => {
        setIsLeavePopUpOpen(true);
    };

    const closeDeletePopUp = () => {
        setIsDeletePopUpOpen(false);
    };

    const closeLeavePopUp = () => {
        setIsLeavePopUpOpen(false);
    };

    return (
        <div className="uniInnerSection">
            <div className="project_die_info">
                <div className="project_die_text">
                    <h2>{project.name || 'Без названия'}</h2>
                    <span className={`status_badge ${project.is_completed ? 'completed' : 'in-progress'}`}>
                        {project.is_completed ? 'Завершен' : 'В разработке'}
                    </span>
                </div>
                <div className="project_die_actions">
                    <button 
                        className="ok_button" 
                        onClick={handleOpenProject}
                        disabled={loading}
                    >
                        Открыть
                    </button>
                    
                    {project.allowed_actions?.can_leave && (
                        <button 
                            className="bad_button"
                            onClick={openLeavePopUp}
                            disabled={loading}
                        >
                            Покинуть
                        </button>
                    )}
                    
                    {project.allowed_actions?.can_delete && (
                        <button 
                            className="bad_button" 
                            onClick={openDeletePopUp}
                            disabled={loading}
                        >
                            Удалить
                        </button>
                    )}
                </div>
            </div>

            <div className="project_die_main_info">
                <p>
                    <strong>Текущий спринт:</strong> 
                    {project.current_sprint_seq ? `${project.current_sprint_seq} – ${project.current_sprint_name}` : 'Не указан'}
                </p>
                {/* Исправлено: project.role вместо project.roles */}
                <p><strong>Твоя роль:</strong> {formatRole(project.role)}</p>
                <p>
                    <strong>Ближайший дедлайн:</strong> 
                    {formatDate(project.nearest_deadline)}
                </p>
            </div>
            
            {project.sprint_map && project.sprint_map.length > 0 && (
                <ProjectMap sprints={project.sprint_map} />
            )}

            {/* Попап удаления проекта */}
            <UniPopUp 
                isOpen={isDeletePopUpOpen}
                onClose={closeDeletePopUp}
                popupHeader="ВНИМАНИЕ"
                popupText1="Вы уверены, что хотите удалить проект?"
                popupText2="Это действие нельзя будет отменить."
                popupOkText="Отмена"
                popupNoText="Удалить"
                onConfirm={handleDeleteProject}
                loading={loading}
            />

            {/* Попап выхода из проекта */}
            <UniPopUp 
                isOpen={isLeavePopUpOpen}
                onClose={closeLeavePopUp}
                popupHeader="ВНИМАНИЕ"
                popupText1="Вы уверены, что хотите покинуть проект?"
                popupText2="Вы сможете вернуться только по приглашению."
                popupOkText="Остаться"
                popupNoText="Покинуть"
                onConfirm={handleLeaveProject}
                loading={loading}
            />
        </div>
    );
}

export default ProjectCard;