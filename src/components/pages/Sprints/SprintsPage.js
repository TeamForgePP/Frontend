import React from "react";
import "./SprintsPage.css";
import Header from "../../Header/Header";
import open from '../../../assets/open.svg'


function SprintsPage(){
    return(
            <div className="projectMainContainer">
                <Header />
                <div className="uniSection">
                    <div className="projectHeaderText">
                        <h1>Текущий спринт:</h1>
                        <h1>Предполагаемая дата завершения:</h1>
                    </div>
                    <div className="uniInnerSection">
                        <h1>Цель</h1>
                        <p>Какая-то цель</p>
                        <h1>Описание</h1>
                        <p>Какая-то цель</p>
                        <button className="doneBtn">Завешить спринт и начать новый</button>
                    </div>
                    <div className="projectHeaderText">
                        <h1>Текущие спринты</h1>
                        <button>Новый спринт</button>
                    </div>
                    <div className="uniInnerSection sprints">
                        <div className="sprint">
                            <p>1-Создание Базового окружения проекта</p>
                            <button>
                                <img src={open} alt="Открыть спринт"></img>
                            </button>
                        </div>
                        <div className="sprint">
                            <p>1-Создание Базового окружения проекта</p>
                            <button>
                                <img src={open} alt="Открыть спринт"></img>
                            </button>
                        </div>
                    </div>

                    <div className="projectHeaderText">
                        <h1>Текущие спринты</h1>
                        <button>Новый спринт</button>
                    </div>
                    <div className="uniInnerSection sprints">
                        <div className="sprint">
                            <p>1-Создание Базового окружения проекта</p>
                            <button>
                                <img src={open} alt="Открыть спринт"></img>
                            </button>
                            
                        </div>
                        <div className="sprint">
                            <p>1-Создание Базового окружения проекта</p>
                            <button>
                                <img src={open} alt="Открыть спринт"></img>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default SprintsPage;