import react from "react";
import "./ProjectPage.css";
import Header from "../../Header/Header";
import ProjectComand from "../../Main/Project/ProjectComand";
import Report from "./Report";

function ProjectPage(){
    return(
        <div className="projectMainContainer">
            <Header/>
            <div className="uniSection">
                <div className="projectHeader">
                    <h1 className="projectHeaderText">TeamForgePP</h1>
                    <div className="projectHeaderBtns">
                        <button >Редактировать</button>
                        <button > Завершить проект</button>
                    </div>
                </div>
                
                <div className="uniInnerSection">
                    <ProjectComand/>
                    <p className="reportInf">Git организация</p>
                    <input className="inputText"></input>
                    <p className="reportInf">Описание</p>
                    <textarea className="textAreaText"></textarea>
                    <Report/>

                </div>
            </div>
        </div>

    )
}

export default ProjectPage;