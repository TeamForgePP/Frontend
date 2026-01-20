import React, { useState, useEffect } from "react";
import './ProfileEdit.css';
import profileIcon from '../../../assets/iconoir_profile-circle.svg';
import keyIcon from '../../../assets/key.svg';
import emailIcon from '../../../assets/e-mail.svg';
import { userService } from '../../services/userService';

function ProfileEdit({
    isOpen = false,
    onClose,
    userData,
    onProfileUpdate
}) {
    const [editingAvatar, setEditingAvatar] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);
    const [editingName, setEditingName] = useState(false);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        patronymic: "",
        email: "",
    });

    const [newEmail, setNewEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordError, setPasswordError] = useState("");

    const [nameData, setNameData] = useState({
        first_name: "",
        last_name: "",
        patronymic: ""
    });
    const [nameError, setNameError] = useState("");

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Инициализируем данные при открытии
    useEffect(() => {
        if (isOpen && userData) {
            setFormData({
                first_name: userData.first_name || "",
                last_name: userData.last_name || "",
                patronymic: userData.patronymic || "",
                email: userData.email || "",
            });
            setNewEmail(userData.email || "");
            setNameData({
                first_name: userData.first_name || "",
                last_name: userData.last_name || "",
                patronymic: userData.patronymic || "",
            });
        }
    }, [isOpen, userData]);

    const handleEmailSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!newEmail) {
            setEmailError("Поле не может быть пустым");
            return;
        }
        
        if (!emailRegex.test(newEmail)) {
            setEmailError("Введите корректный email");
            return;
        }

        if (newEmail === userData.email) {
            setEditingEmail(false);
            return;
        }

        setLoading(true);
        setEmailError("");
        
        try {
            await userService.updateProfile({
                ...formData,
                email: newEmail
            });
            
            setFormData(prev => ({ ...prev, email: newEmail }));
            setSuccessMessage("Email успешно обновлен!");
            
            setTimeout(() => {
                setSuccessMessage("");
                setEditingEmail(false);
                if (onProfileUpdate) onProfileUpdate();
            }, 1500);
            
        } catch (error) {
            console.error('Ошибка обновления email:', error);
            setEmailError(error.response?.data?.message || "Ошибка обновления email");
        } finally {
            setLoading(false);
        }
    };

    const handleNameSubmit = async () => {
        if (!nameData.first_name || !nameData.last_name) {
            setNameError("Имя и фамилия обязательны");
            return;
        }

        setLoading(true);
        setNameError("");
        
        try {
            await userService.updateProfile({
                first_name: nameData.first_name,
                last_name: nameData.last_name,
                patronymic: nameData.patronymic,
                email: formData.email
            });
            
            setFormData({
                ...formData,
                first_name: nameData.first_name,
                last_name: nameData.last_name,
                patronymic: nameData.patronymic
            });
            
            setSuccessMessage("Данные успешно обновлены!");
            
            setTimeout(() => {
                setSuccessMessage("");
                setEditingName(false);
                if (onProfileUpdate) onProfileUpdate();
            }, 1500);
            
        } catch (error) {
            console.error('Ошибка обновления данных:', error);
            setNameError(error.response?.data?.message || "Ошибка обновления данных");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async () => {
        if (passwords.newPassword.length < 8) {
            setPasswordError("Пароль должен быть минимум 8 символов");
            return;
        }
        
        if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordError("Пароли не совпадают");
            return;
        }

        if (!passwords.oldPassword) {
            setPasswordError("Введите старый пароль");
            return;
        }

        setLoading(true);
        setPasswordError("");
        
        try {
            await userService.changePassword({
                old_password: passwords.oldPassword,
                new_password: passwords.newPassword
            });
            
            setSuccessMessage("Пароль успешно изменен!");
            
            setTimeout(() => {
                setSuccessMessage("");
                setEditingPassword(false);
                setPasswords({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            }, 1500);
            
        } catch (error) {
            console.error('Ошибка смены пароля:', error);
            setPasswordError(
                error.response?.data?.message === "неверный текущий пароль" 
                    ? "Неверный текущий пароль" 
                    : error.response?.data?.message || "Ошибка смены пароля"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarSubmit = async (file) => {
        // Здесь будет реализация загрузки аватара
        // Если API для загрузки аватара не предусмотрено, можно показывать сообщение
        alert("Загрузка аватара в разработке");
        setEditingAvatar(false);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="overlay">
            <div className="editContainer">
                <button className="popup-close" onClick={onClose} disabled={loading}>×</button>
                <h1>Учётная запись</h1>
                
                {successMessage && (
                    <div className="success-message" style={{color: 'green', textAlign: 'center', marginBottom: '15px'}}>
                        {successMessage}
                    </div>
                )}
                
                {/* Секция аватара */}
                <div className="editSection">
                    <div className="editAllSection">
                        <img src={profileIcon} alt="Avatar"/>
                        <div className="editInfo">
                            <h2>Изображение</h2>
                            {!editingAvatar ? (
                                <div>
                                    <button 
                                        className="textEditButton"
                                        onClick={() => setEditingAvatar(true)}
                                        disabled={loading}
                                    >
                                        Изменить
                                    </button>
                                </div>
                            ) : ( 
                                <div className="editForm">
                                    <div className="editInputs">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            className="fileInput"
                                            disabled={loading}
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    handleAvatarSubmit(file);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="editFormButtons">
                                        <button 
                                            className="bad_button"
                                            onClick={() => setEditingAvatar(false)}
                                            disabled={loading}
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </div>
                            )}     
                        </div>
                    </div>
                </div>

                {/* Секция почты */}
                <div className="editSection">
                    <div className="editAllSection">
                        <img src={emailIcon} alt="Email"/>
                        <div className="editInfo">
                            <h2>Почта</h2>
                            {!editingEmail ? (
                                <div>
                                    <p className="emailText">{formData.email}</p>
                                    <button 
                                        className="textEditButton"
                                        onClick={() => setEditingEmail(true)}
                                        disabled={loading}
                                    >
                                        Изменить
                                    </button>
                                </div>
                            ) : (
                                <div className="editForm">
                                    <p>Введите почту</p>
                                    <div className="editInputs">
                                        <input 
                                            type="email" 
                                            value={newEmail}
                                            onChange={(e) => {
                                                setNewEmail(e.target.value);
                                                setEmailError("");
                                            }}
                                            className="emailInput"
                                            disabled={loading}
                                        />
                                        {emailError && <p style={{color: 'red', fontSize: '14px'}}>{emailError}</p>}
                                    </div>
                                    <div className="editFormButtons">
                                        <button 
                                            className="ok_button"
                                            onClick={handleEmailSubmit}
                                            disabled={loading}
                                        >
                                            {loading ? 'Сохранение...' : 'Сохранить'}
                                        </button>
                                        <button 
                                            className="bad_button"
                                            onClick={() => {
                                                setEditingEmail(false);
                                                setNewEmail(formData.email);
                                                setEmailError('');
                                            }}
                                            disabled={loading}
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Секция пароля */}
                <div className="editSection">
                    <div className="editAllSection">
                        <img src={keyIcon} alt="Password"/>
                        <div className="editInfo">
                            <h2>Пароль</h2>
                            {!editingPassword ? (
                                <div>
                                    <button 
                                        className="textEditButton"
                                        onClick={() => setEditingPassword(true)}
                                        disabled={loading}
                                    >
                                        Изменить
                                    </button>
                                </div>
                            ) : (
                                <div className="editForm">
                                    <p>Введите пароль</p>
                                    <div className="editInputs">
                                        <input 
                                            type="password" 
                                            placeholder="Старый пароль"
                                            className="passwordInput"
                                            value={passwords.oldPassword}
                                            onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                                            disabled={loading}
                                        />
                                        <input 
                                            type="password" 
                                            placeholder="Новый пароль (минимум 8 символов)"
                                            className="passwordInput"
                                            value={passwords.newPassword}
                                            onChange={(e) => {
                                                setPasswords({...passwords, newPassword: e.target.value});
                                                setPasswordError(""); 
                                            }}
                                            disabled={loading}
                                        />
                                        <input 
                                            type="password" 
                                            placeholder="Повторите новый пароль"
                                            className="passwordInput"
                                            value={passwords.confirmPassword}
                                            onChange={(e) => {
                                                setPasswords({...passwords, confirmPassword: e.target.value});
                                                setPasswordError(""); 
                                            }}
                                            disabled={loading}
                                        />
                                        {passwordError && <p style={{color: 'red', fontSize: '14px'}}>{passwordError}</p>}
                                    </div>
                                    <div className="editFormButtons">
                                        <button 
                                            className="ok_button"
                                            onClick={handlePasswordSubmit}
                                            disabled={loading}
                                        >
                                            {loading ? 'Сохранение...' : 'Сохранить'}
                                        </button>
                                        <button 
                                            className="bad_button"
                                            onClick={() => {
                                                setEditingPassword(false);
                                                setPasswordError("");
                                                setPasswords({
                                                    oldPassword: "",
                                                    newPassword: "",
                                                    confirmPassword: ""
                                                });
                                            }}
                                            disabled={loading}
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileEdit;