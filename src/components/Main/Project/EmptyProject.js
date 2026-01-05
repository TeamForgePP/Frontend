import React, { useState } from "react";
import "./EmptyProject.css";
import PopUpNewProject from "./PopUpNewProject";

function EmptyProject({ onProjectCreated }) {
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);

    const openPopUp = () => {
        setIsPopUpOpen(true);
    };

    const closePopUp = () => {
        setIsPopUpOpen(false);
        if (onProjectCreated) {
            onProjectCreated();
        }
    };

    return (
        <div className="emptyProjectContainer">
            <div className="emptyProjectContent">
                <p className="emptyProjectText">У тебя ещё нет проектов</p>
                <div className="emptyButtonContainer">
                    <button className="emptyButton" onClick={openPopUp}>
                        Создать проект
                    </button>
                </div>
            </div>
            
            <PopUpNewProject
                isOpen={isPopUpOpen}
                onClose={closePopUp}
                onProjectCreated={onProjectCreated}
            />
        </div>
    );
}

export default EmptyProject;