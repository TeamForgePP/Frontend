import React from "react";
import './ReportCard.css';

function ReportCard(){
    return(
        <div className="reportCardContainer">
            <div className="reportCardHeader">
                <div className="reportCardHeaderText">
                    <p>Крутой заголовок</p>
                    <p>Отправил: Кто-то</p>
                </div>
                <div className="reportCardBtns">
                    <button className="ok_button">Редактировать</button>
                    <button className="bad_button">Удалить</button>
                </div>
            </div>
            <input type="file"
            onChange={(e) => console.log(e.target.files[0])}></input>
            <p>Описание</p>
            <textarea className="textAreaText"></textarea>
        </div>

    )
}

export default ReportCard