import React from "react";
import './Report.css';
import ReportCard from "./ReportCard";

function Report({ 
    reports = [], 
    canEdit = false, 
    onReportClick, 
    onCreateReport,
    onDeleteReport
}) {
    return (
        <div className="reportSection">
            <div className="reportHeader">
                <h1 className="reportTitle">Отчёты</h1>
                {canEdit && (
                    <button 
                        className="reportButton ok_button"
                        onClick={onCreateReport}
                    >
                        Добавить отчёт
                    </button>
                )}
            </div>
            
            <div className="reports">
                {reports.length > 0 ? (
                    reports.map(report => (
                        <ReportCard 
                            key={report.id}
                            report={report}
                            onReportClick={onReportClick}
                            onDeleteReport={onDeleteReport}
                        />
                    ))
                ) : (
                    <div className="no-reports">
                        <p>Отчётов пока нет</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Report;