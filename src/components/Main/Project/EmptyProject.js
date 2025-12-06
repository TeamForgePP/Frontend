import React from "react";
import "./EmptyProject.css"

function EmptyProject(){
    return(
        <div className="emptyProjectContainer">
            <div className="emptyProjectContent">
                <p className="emptyProjectText">У тебя ещё нет проектов</p>
                <div className="emptyButtonContainer">
                    <button className="emptyButton">Создать проект</button>
                </div>
            </div>
            
        </div>
        
    )
}

export default EmptyProject