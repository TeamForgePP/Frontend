import React , {useState} from "react";
import './ProjectCard.css';
import ProjectMap from "./ProjectMap";
import UniPopUp from "../../UniPopUp";

function ProjectCard(){
      const [isPopUpOpen, setIsPopUpOpen] = useState(false);

      const openPopUp = () => {
          setIsPopUpOpen(true);
      }
      
      const closePopUp = () => {
          setIsPopUpOpen(false);
      }

    return(
      <div className="uniInnerSection">
        <div className="project_die_info">
          <div className="project_die_text">
            <h2>TeamForgePP</h2>
            <span className="status_badge">В разработке</span>
          </div>
          <div className="project_die_actions">
            <button className="ok_button">Открыть</button>
            <button className="bad_button" onClick={openPopUp}>
              Удалить
            </button>
          </div>
        </div>

        <div className="project_die_main_info">
          <p><strong>Текущий спринт:</strong> 2 – Базовое окружение проекта</p>
          <p><strong>Твоя роль:</strong> ТЕАМLEAD</p>
          <p><strong>Ближайший дедлайн:</strong> 30.10.2025</p>
        </div>
        <ProjectMap />
        <UniPopUp 
                isOpen={isPopUpOpen}
                onClose={closePopUp}
                popupHeader="ВНИМАНИЕ"
                popupText1="Вы уверены, что хотите удалить проект?"
                popupText2="Это действие нельзя будет отменить."
                popupOkText="Остаться"
                popupNoText="Покинуть"
            />
      </div>
    )
}

export default ProjectCard