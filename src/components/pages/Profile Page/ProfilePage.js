import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./ProfilePage.css";
import Header from "../../Header/Header";
import UniPopUp from "../../UniPopUp";
import edit from '../../../assets/edit.svg';
import exit from '../../../assets/exit.svg';
import profile from '../../../assets/profileBig.svg';
import ProfileEdit from "./ProfileEdit";
import { userService } from '../../services/userService';

function ProfilePage() {
    const [isPopUpOpen, setPopUpOpen] = useState(false);
    const [isEditPopUpOpen, setEditPopUpOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Загружаем данные профиля при монтировании
    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getProfile();
            setUserData(data);
        } catch (err) {
            console.error('Ошибка загрузки профиля:', err);
            setError('Не удалось загрузить данные профиля');
            // Если ошибка 401 (не авторизован), перенаправляем на логин
            if (err.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const openPopUp = () => {
        setPopUpOpen(true);
    };

    const closePopUp = () => {
        setPopUpOpen(false);
    };

    const openEditPopUp = () => {
        setEditPopUpOpen(true);
    };

    const closeEditPopUp = () => {
        setEditPopUpOpen(false);
        // Обновляем данные после редактирования
        loadProfileData();
    };

    // Обработчик выхода из аккаунта
    const handleLogout = async () => {
        try {
            await userService.logout();
            // Перенаправляем на страницу входа
            navigate('/login');
        } catch (error) {
            console.error('Ошибка выхода:', error);
            alert('Не удалось выйти из аккаунта');
        }
    };

    // Функция для форматирования ролей
    const formatRoles = (roles) => {
        if (!roles || !Array.isArray(roles)) return '';
        return roles.join(', ');
    };

    // Функция для получения полного ФИО
    const getFullName = () => {
        if (!userData) return '';
        const { first_name, last_name, patronymic } = userData;
        return `${last_name || ''} ${first_name || ''} ${patronymic || ''}`.trim();
    };

    if (loading) {
        return (
            <div className="profileMainContainer">
                <Header />
                <div className="uniSection">
                    <h1 className="profileHeader">Профиль</h1>
                    <div className="loading">Загрузка данных...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profileMainContainer">
                <Header />
                <div className="uniSection">
                    <h1 className="profileHeader">Профиль</h1>
                    <div className="error">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="profileMainContainer">
            <Header />
            <div className="uniSection">
                <h1 className="profileHeader">Профиль</h1>
                <div className="uniInnerSection">
                    <div className="profileContent">
                        <div className="profileImgContainer">
                            <img src={profile} alt="profile img" />
                        </div>
                        <div className="profileInfo">
                            <p><strong>ФИО:</strong> {getFullName()}</p>
                            <p><strong>Группа:</strong> {userData?.group || 'Не указана'}</p>
                            <p><strong>Роль:</strong> {formatRoles(userData?.roles)}</p>
                            <p><strong>Почта:</strong> {userData?.email || 'Не указана'}</p>
                        </div>
                        <div className="profileTabs">
                            <button className="profileEdit" onClick={openEditPopUp} title="Редактировать">
                                <img src={edit} alt="edit img" />
                            </button>
                            <button className="profileExit" onClick={openPopUp} title="Выйти">
                                <img src={exit} alt="exit img" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <UniPopUp 
                isOpen={isPopUpOpen}
                onClose={closePopUp}
                popupHeader="ВНИМАНИЕ"
                popupText1="Вы действительно хотите выйти из аккаунта?"
                popupText2="Это действие нельзя будет отменить."
                popupOkText="Остаться"
                popupNoText="Покинуть"
                onConfirm={handleLogout} // Добавляем обработчик подтверждения
            />
            
            <ProfileEdit
                isOpen={isEditPopUpOpen}
                onClose={closeEditPopUp}
                userData={userData} // Передаем данные пользователя
                onProfileUpdate={loadProfileData} // Колбэк для обновления данных
            />
        </div>
    );
}

export default ProfilePage;