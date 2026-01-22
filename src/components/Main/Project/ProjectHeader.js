import React, { useState } from "react";
import PopUpNewProject from "./PopUpNewProject";
import './ProjectHeader.css';


function ProjectHeader(){
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);

    const openPopUp = () => {
        setIsPopUpOpen(true)
    } 

    const closePopUp = () => {
        setIsPopUpOpen(false)
    } 

    return(
        <div className="projects_info">
            <h1>Твои проекты</h1>
            <button className = "projectsBtn" onClick={openPopUp}>Новый проект</button> 
            <PopUpNewProject
            isOpen = {isPopUpOpen}
            onClose = {closePopUp} />
        </div>
    );       
}

export default ProjectHeader