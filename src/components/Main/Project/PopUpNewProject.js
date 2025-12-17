import React from "react";
import "./PopUpNewProject.css"
// import ComandCard from "./ComandCard";
// import plus from "../../../assets/plus.svg"
import ProjectComand from "./ProjectComand";

function PopUpNewProject({
    isOpen = false,
    onClose,}){

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
                        <p >Название</p>
                        <input className="inputText"></input>
                        <p>Описание</p>
                        <textarea className="textAreaText"></textarea>
                        <ProjectComand/>
                        <p>Git организация</p>
                        <input className="inputText"></input>
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