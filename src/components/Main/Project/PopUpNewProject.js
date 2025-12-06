import React,{useState} from "react";
import "./PopUpNewProject.css"
import ComandCard from "./ComandCard";
import plus from "../../../assets/plus.svg"

function PopUpNewProject({
    isOpen = false,
    onClose,}){

    const [team, setTeam] = useState([
        { id: 1, name: "Иван", surname: "Иванов", role: "Backend" },
        { id: 2, name: "Мария", surname: "Петрова", role: "Frontend" },
        { id: 3, name: "Арина", surname: "Сидорова", role: "Дизайнер" },
        { id: 4, name: "Ольга", surname: "Смирнова", role: "Тестировщик" }
    ]);

    const handleRemoveMember = (id) => {
        setTeam(team.filter(member => member.id !== id));
    };

    const handleAddMember = () => {
        const newId = team.length > 0 ? Math.max(...team.map(m => m.id)) + 1 : 1;
        const newMember = {
            id: newId,
            name: "Новый",
            surname: "Участник",
            role: "Роль"
        };
        setTeam([...team, newMember]);
    };

   const handleOkClick = () => {
        if (onClose) {
        onClose();
        }
    };

    if (!isOpen){
        return null
    }
    
    return(
        <div className="overlay">
            <div className="popUpNewProject">
                <div className="popUpNewProjectContent">
                    <button className="popup-close" onClick={onClose}>×</button>
                    <h2>Новый проект</h2>
                    <div className="NewProjectMain">
                        <p>Название</p>
                        <input></input>
                        <p>Описание</p>
                        <textarea></textarea>
                        <p>Команда</p>
                        <div className="newProjectComand">
                            {team.map(member => (
                                <ComandCard
                                    key={member.id}
                                    id={member.id}
                                    name={member.name}
                                    surname={member.surname}
                                    role={member.role}
                                    onRemove={handleRemoveMember}
                                />
                            ))}
                            <div className="emptyCard"
                            onClick={handleAddMember}
                            title="Добавить участника">
                                <div className="emptyIconContainer">
                                    <img src={plus} alt="plus"/>
                                </div>
                            </div>
                        </div>
                        <p>Git организация</p>
                        <input></input>
                    </div>
                    <div className="buttonContainer">
                        <button onClick={handleOkClick}>Создать</button>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default PopUpNewProject;