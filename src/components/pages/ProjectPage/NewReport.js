import React, { useState, useEffect } from "react";
import "./NewReport.css";

function NewReport({ isOpen, onClose, reportData = null, onSubmit, loading = false }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        fileName: ""
    });

    // Заполняем форму данными отчета при открытии или изменении reportData
    useEffect(() => {
        if (reportData) {
            setFormData({
                name: reportData.name || "",
                description: reportData.description || "",
                fileName: reportData.fileName || reportData.file_name || ""
            });
        } else {
            // Сбрасываем форму при создании нового отчета
            setFormData({
                name: "",
                description: "",
                fileName: ""
            });
        }
    }, [reportData, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                fileName: file.name
            }));
        }
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
                            <label htmlFor="name">Название</label>
                            <input 
                                className="inputText"
                                id="name"
                                name="name"
                                placeholder="Введите название отчёта"
                                value={formData.name}
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