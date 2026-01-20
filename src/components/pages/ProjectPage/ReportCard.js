import React, { useState } from "react";
import './ReportCard.css';
import UniPopUp from "../../UniPopUp";

function ReportCard({ report, onReportClick, onDeleteReport, canEdit = false }) {
    const [isDeletePopUpOpen, setIsDeletePopUpOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const openDeletePopUp = (e) => {
        e.stopPropagation(); // Предотвращаем всплытие события
        setIsDeletePopUpOpen(true);
    };

    const closeDeletePopUp = () => {
        setIsDeletePopUpOpen(false);
    };

    const handleDeleteReport = async () => {
        try {
            setLoading(true);
            if (onDeleteReport) {
                await onDeleteReport(report.id);
            }
            closeDeletePopUp();
        } catch (error) {
            console.error('Ошибка удаления отчета:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (e) => {
        e.stopPropagation(); // Предотвращаем всплытие события
        if (onReportClick) {
            onReportClick(report);
        }
    };

    // Форматируем дату
    const formatDate = (dateString) => {
        if (!dateString) return 'Дата не указана';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    // Получаем имя отправителя из отчета или используем значение по умолчанию
    const getSenderName = () => {
        return report.sender_name || report.author || 'Неизвестный автор';
    };

    return (
        <div 
            className="reportCardContainer"
            onClick={canEdit ? handleEditClick : undefined}
            style={{ cursor: canEdit ? 'pointer' : 'default' }}
        >
            <div className="reportCardHeader">
                <div className="reportCardHeaderText">
                    <h3>{report.name || report.title || 'Без названия'}</h3>
                    <div className="reportCardMeta">
                        <span className="reportSender">Отправил: {getSenderName()}</span>
                        <span className="reportDate">{formatDate(report.createdAt || report.created_at)}</span>
                    </div>
                </div>
                
                {canEdit && (
                    <div className="reportCardBtns">
                        <button 
                            className="ok_button" 
                            onClick={handleEditClick}
                        >
                            Редактировать
                        </button>
                        <button 
                            className="bad_button" 
                            onClick={openDeletePopUp}
                        >
                            Удалить
                        </button>
                    </div>
                )}
            </div>
            
            {/* Ссылка на файл */}
            {report.fileUrl || report.file_url ? (
                <div className="reportFileLink">
                    <a 
                        href={report.fileUrl || report.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="reportFileLink"
                    >
                        {report.fileName || report.file_name || 'Скачать файл'}
                    </a>
                </div>
            ) : (
                <div className="noFileMessage">
                    <p>Файл не прикреплен</p>
                </div>
            )}
            
            <div className="reportDescription">
                <h3><strong>Описание</strong></h3>
                <p>{report.description || 'Описание отсутствует'}</p>
            </div>

            {/* Попап удаления отчета */}
            <UniPopUp 
                isOpen={isDeletePopUpOpen}
                onClose={closeDeletePopUp}
                popupHeader="ВНИМАНИЕ"
                popupText1={`Вы действительно хотите удалить отчёт «${report.name || report.title || 'Без названия'}»?`}
                popupText2="Это действие нельзя будет отменить."
                popupOkText="Отменить"
                popupNoText="Удалить"
                onConfirm={handleDeleteReport}
                loading={loading}
            />
        </div>
    );
}

export default ReportCard;