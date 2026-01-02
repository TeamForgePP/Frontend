import React , {useEffect, useState} from "react";
import './ProjectCard.css';
import ProjectMap from "./ProjectMap";
import UniPopUp from "../../UniPopUp";

function ProjectCard(){ 
      const [isPopUpOpen, setIsPopUpOpen] = useState(false);
      const [projectData, setProjectData] = useState({});

      const fetchHomeInfo = async () =>{
        try{
          const response = await fetch('user/home',{
            method:'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
           
          if (response.ok){
            const realData = await response.json();
            const firstProject = realData.projects[0];

            setProjectData({
              name: firstProject.name,
              status: firstProject.is_completed ? "Завершен" : "В разработке",
              currentSprint: `${firstProject.current_sprint_seq} – ${firstProject.current_sprint_name}`,
              role: firstProject.roles[0],
              deadline: firstProject.nearest_deadline
            });
            console.log('Данные получены с сервера!');
            } else {
              throw new Error('Сервер вернул ошибку');
            }
          }
          catch (error) {
          console.log('Бэкенд не отвечает, используем данные по умолчанию');

          const defaultData = {
            name: "TeamForgePP",
            status: "В разработке",
            currentSprint: "4 – Базовое окружение проекта",
            role: "Какая-то",
            deadline: "30.10.2025"
          };

          setProjectData(defaultData);
        }
      };

      useEffect(() =>{
        fetchHomeInfo();
      }, []);

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
            <h2>{projectData.name}</h2>
            <span className="status_badge">{projectData.status}</span>
          </div>
          <div className="project_die_actions">
            <button className="ok_button">Открыть</button>
            <button className="bad_button" onClick={openPopUp}>
              Удалить
            </button>
          </div>
        </div>

        <div className="project_die_main_info">
          <p><strong>Текущий спринт:</strong> {projectData.currentSprint}</p>
          <p><strong>Твоя роль:</strong>{projectData.role}</p>
          <p><strong>Ближайший дедлайн:</strong> {projectData.deadline}</p>
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