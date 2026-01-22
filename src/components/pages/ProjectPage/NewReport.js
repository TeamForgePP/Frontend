import React, { useState, useEffect } from "react";
import "./NewReport.css";

function NewReport({ isOpen, onClose, reportData = null, onSubmit, loading = false }) {
     const [formData, setFormData] = useState({
        title: "",
        description: "",
        teacher_note: "",
        fileName: "",
        file: null
    });

    useEffect(() => {
        if (reportData) {
            setFormData({
                title: reportData.title || reportData.name || "",
                description: reportData.description || "",
                teacher_note: reportData.teacher_note || "",
                fileName: reportData.fileName || reportData.file_name || "",
                file: null
            });
        } else {
            setFormData({
                title: "",
                description: "",
                teacher_note: "",
                fileName: "",
                file: null
            });
        }
    }, [reportData, isOpen]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                file: file,
                fileName: file.name
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(formData);
        }
    };

    return (
        <div className="overlay">
            <div className="popUpNewProject">
                <div className="popUpNewProjectContent">
                    <button 
                        className="popup-close" 
                        onClick={onClose}
                        disabled={loading}
                    >
                        ×
                    </button>
                    <h2>{reportData ? "Редактировать отчёт" : "Новый отчёт"}</h2>
                    
                    <form className="NewProjectMain" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">Название</label>
                            <input 
                                className="inputText"
                                id="title"                           
                                name="title"                         
                                placeholder="Введите название отчёта"
                                value={formData.title}               
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="description">Описание</label>
                            <textarea 
                                className="textAreaText"
                                id="description"
                                name="description"
                                placeholder="Опишите отчёт"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="teacher_note">Примечание преподавателя</label>
                            <textarea 
                                className="textAreaText"
                                id="teacher_note"
                                name="teacher_note"
                                placeholder="Примечание (необязательно)"
                                value={formData.teacher_note}
                                onChange={handleInputChange}
                                rows={2}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="file">Загрузить файл</label>
                            <input 
                                className="inputText"
                                id="file"
                                type="file"
                                onChange={handleFileChange}
                                disabled={loading}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="fileName">Сохранить как</label>
                            <input 
                                className="inputText"
                                id="fileName"
                                name="fileName"
                                placeholder="Название файла"
                                value={formData.fileName}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>
                        
                        <div className="buttonContainer">
                            <button 
                                type="submit" 
                                className="ok_button"
                                disabled={loading}
                            >
                                {loading 
                                    ? 'Сохранение...' 
                                    : reportData 
                                        ? "Сохранить изменения" 
                                        : "Создать отчёт"
                                }
                            </button>
                            <button 
                                type="button" 
                                className="bad_button" 
                                onClick={onClose}
                                disabled={loading}
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default NewReport;