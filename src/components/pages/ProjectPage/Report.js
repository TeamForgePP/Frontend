import React from "react";
import './Report.css'
import ReportCard from "./ReportCard";

function Report(){
    return(
        <div className="reportSection">
            <div className="reportHeader">
                <p className="reportTitle">Отчёты</p>
                <button className="reportButton">Добавить отчёт</button>
            </div>
            <div className="reports">
                <ReportCard/>

            </div>

        </div>

    )
}

export default Report;