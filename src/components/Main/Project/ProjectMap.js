import React from 'react';
import './ProjectMap.css';
import arrow from '../../../assets/Arrow 1.svg';

function ProjectMap({ sprints = [] }) {
    if (!sprints || sprints.length === 0) {
        return (
            <div className="map_section">
                <p className="map_title">Карта спринтов</p>
                <div className="no-sprints">Нет информации о спринтах</div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return `до ${date.toLocaleDateString('ru-RU', options)} г.`;
    };

    return (
        <div className="map_section">
            <p className="map_title">Карта спринтов</p>
            <div className="map_container">
                <div className="map">
                    {sprints.map((sprint, index) => (
                        <React.Fragment key={sprint.id}>
                            <div className="map_item">
                                <p>{sprint.seq ? `${sprint.seq} – ` : ''}{sprint.name}</p>
                                <p className="map_date">{formatDate(sprint.deadline)}</p>
                            </div>
                            {index < sprints.length - 1 && (
                                <img src={arrow} alt="Стрелка" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProjectMap;