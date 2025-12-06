import React from 'react';
import './ProjectMap.css';
import arrow from '../../../assets/Arrow 1.svg';

function ProjectMap() {
  const mapItems = [
    { id: 1, title: "1 – Базовое окружение проекта", date: "до 30 окт. 2025 г." },
    { id: 2, title: "2 – Базовое окружение проекта", date: "до 30 окт. 2025 г." },
    { id: 3, title: "3 – Базовое окружение проекта", date: "до 30 окт. 2025 г." },
    { id: 4, title: "4 – Базовое окружение проекта", date: "до 30 окт. 2025 г." },
    { id: 5, title: "5 – Базовое окружение проекта", date: "до 30 окт. 2025 г." },
    { id: 5, title: "6 – Базовое окружение проекта", date: "до 30 окт. 2025 г." }
  ];

  return (
    <div className="map_section">
      <p className="map_title">Карта</p>
      <div className="map_container">
        <div className="map">
          {mapItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <div className="map_item">
                <p>{item.title}</p>
                <p className="map_date">{item.date}</p>
              </div>
              {index < mapItems.length - 1 && (
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