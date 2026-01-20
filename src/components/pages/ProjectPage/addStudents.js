import React, { useState, useEffect } from "react";
import './addStudents.css';
import { homeService } from "../../services/homeService";


function AddStudents({
    isOpen,
    onClose,
    onAddStudent,
    projectId
}) {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Список доступных ролей
    const availableRoles = ["Frontend", "Backend", "Дизайнер", "Тестировщик", "Аналитик"];

    // Загрузка доступных студентов
    useEffect(() => {
        if (isOpen && projectId) {
            loadAvailableStudents();
        }
    }, [isOpen, projectId]);

    const loadAvailableStudents = async () => {
    try {
        setLoading(true);
        setError(null);
        setSelectedStudent(null);
        setSelectedRoles([]);
        
        // Используем новую ручку для получения пользователей
        const response = await homeService.getUsersForTeam();
        
        console.log('Ответ от users-for-team API:', response);
        
        // Проверяем структуру ответа
        const usersData = response.users || response || [];
        
        // Форматируем данные в соответствии с ожидаемой структурой
        const formattedStudents = usersData.map(user => {
            // В зависимости от структуры ответа адаптируем поля
            const userId = user.id || user.user_id;
            const firstName = user.first_name || user.name || '';
            const lastName = user.last_name || user.surname || '';
            
            return {
                id: userId,
                name: firstName,
                surname: lastName,
                email: user.email || '',
                in_team: user.in_team || false, // учитываем статус в команде
                fullName: `${firstName} ${lastName}`.trim()
            };
        }).filter(student => student.fullName); // Фильтруем пустые
        
        // Можно отфильтровать только тех, кто не в команде (если нужно)
        const availableStudents = formattedStudents.filter(student => !student.in_team);
        
        setAvailableStudents(availableStudents);
        
        if (availableStudents.length === 0) {
            setError('Нет доступных пользователей для приглашения в команду');
        }
    } catch (err) {
        console.error('Ошибка загрузки пользователей:', err);
        setError(err.message || 'Не удалось загрузить список пользователей');
    } finally {
        setLoading(false);
    }
};

    if (!isOpen) {
        return null;
    }

    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        // Сбрасываем выбранные роли при смене студента
        setSelectedRoles([]);
    };

    const handleRoleToggle = (role) => {
        setSelectedRoles(prev => 
            prev.includes(role) 
                ? prev.filter(r => r !== role)
                : [...prev, role]
        );
    };

    const handleInvite = () => {
        if (!selectedStudent) {
            alert("Выберите студента");
            return;
        }

        if (selectedRoles.length === 0) {
            alert("Выберите хотя бы одну роль");
            return;
        }

        const studentWithRoles = {
            ...selectedStudent,
            roles: selectedRoles
        };

        onAddStudent(studentWithRoles);
        
        // Сброс выбора после приглашения
        setSelectedStudent(null);
        setSelectedRoles([]);
    };

    const handleSave = () => {
        if (selectedStudent && selectedRoles.length > 0) {
            const studentWithRoles = {
                ...selectedStudent,
                roles: selectedRoles
            };
            onAddStudent(studentWithRoles);
        }
        onClose();
    };

    const handleClose = () => {
        setSelectedStudent(null);
        setSelectedRoles([]);
        setError(null);
        onClose();
    };

    return (
        <div className="overlay">
            <div className="addStudentsContainer">
                <div className="addStudentsContent">
                    <div className="addStudentsHeader">
                        <button 
                            className="popup-close" 
                            onClick={handleClose}
                        >
                            ×
                        </button>
                        <h1>Добавить нового участника</h1>
                    </div>
                    
                    {loading ? (
                        <div className="loading-message">
                            <div className="spinner-small"></div>
                            <p>Загрузка списка студентов...</p>
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <p>{error}</p>
                            <button 
                                className="retry-btn"
                                onClick={loadAvailableStudents}
                            >
                                Повторить попытку
                            </button>
                        </div>
                    ) : (
                        <div className="studentsSelection">
                            <div className="availableStudents">
                                <div className="studentsHeader">
                                    <h3>Доступные студенты ({availableStudents.length})</h3>
                                    <button 
                                        className="refresh-btn"
                                        onClick={loadAvailableStudents}
                                        title="Обновить список"
                                    >
                                        ⟳
                                    </button>
                                </div>
                                <div className="studentsList">
                                    {availableStudents.map(student => (
                                        <div 
                                            key={student.id}
                                            className={`student-item ${
                                                selectedStudent?.id === student.id ? 'selected' : ''
                                            }`}
                                            onClick={() => handleStudentSelect(student)}
                                        >
                                            <div className="student-name">
                                                <strong>{student.name} {student.surname}</strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="selectedStudentInfo">
                                {selectedStudent ? (
                                    <>
                                        <div className="selectedStudentHeader">
                                            <h3>Выбранный студент</h3>
                                            <div className="selected-student-card">
                                                <div className="student-info">
                                                    <strong>{selectedStudent.name} {selectedStudent.surname}</strong>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="rolesSelection">
                                            <h4>Выберите роли:</h4>
                                            <p className="roles-hint">Можно выбрать несколько ролей</p>
                                            <div className="rolesList">
                                                {availableRoles.map(role => (
                                                    <div 
                                                        key={role}
                                                        className={`role-item ${
                                                            selectedRoles.includes(role) ? 'selected' : ''
                                                        }`}
                                                        onClick={() => handleRoleToggle(role)}
                                                    >
                                                        {role}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="selected-roles-info">
                                                {selectedRoles.length > 0 ? (
                                                    <p>Выбрано ролей: {selectedRoles.length}</p>
                                                ) : (
                                                    <p className="no-roles">Роли не выбраны</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="inviteSection">
                                            <button 
                                                className="invite-btn"
                                                onClick={handleInvite}
                                                disabled={selectedRoles.length === 0}
                                            >
                                                {selectedRoles.length === 0 
                                                    ? "Выберите роли" 
                                                    : `Добавить как ${selectedRoles.join(', ')}`}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="noStudentSelected">
                                        <p>Выберите студента из списка слева</p>
                                        <small>Нажмите на имя студента для выбора</small>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="addStudentsFooter">
                        <button 
                            className="ok_button" 
                            onClick={handleSave}
                            disabled={!selectedStudent || selectedRoles.length === 0}
                        >
                            Сохранить и закрыть
                        </button>
                        <button 
                            className="bad_button" 
                            onClick={handleClose}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddStudents;