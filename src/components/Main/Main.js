// Main.js - если нужно глобальное состояние
import React, { useState, useEffect } from "react";
import ProjectsSection from "./Project/ProjectsSection";
import EmptyProject from "./Project/EmptyProject";
import './Main.css';
import { homeService } from '../../components/services/homeService';

function Main() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        loadProjects();
    }, []);


    const loadProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await homeService.getProjects();
            setProjects(data.projects || []);
        } catch (err) {
            console.error('Ошибка загрузки проектов:', err);
            setError('Не удалось загрузить проекты');
        } finally {
            setLoading(false);
        }
    };

    const handleProjectCreated = () => {
        loadProjects(); // Перезагружаем список после создания
    };

    const handleProjectDeleted = () => {
        loadProjects(); // Перезагружаем список после удаления
    };

    if (loading) {
        return (
            <main>
                <div className="loading-container">
                    <div className="loading-container">
              <div className="spinner"></div>
              <p>Загрузка...</p>
            </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <div className="error-container">
                    <div className="error">{error}</div>
                    <div>
                        <button onClick={loadProjects} className="retry-button">
                            Попробовать снова
                        </button>
                    </div>
                    
                </div>
            </main>
        );
    }

    return (
        <main>
            {projects.length === 0 ? (
                <EmptyProject onProjectCreated={handleProjectCreated} />
            ) : (
                <ProjectsSection 
                    projects={projects}
                    onProjectCreated={handleProjectCreated}
                    onProjectDeleted={handleProjectDeleted}
                />
            )}
        </main>
    );
}

export default Main;