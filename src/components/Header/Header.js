import React, {useState, useEffect} from 'react';
import "./Header.css";
import sunIcon from '../../assets/basil_sun-outline.svg';
import profileIcon from '../../assets/iconoir_profile-circle.svg';
import notificationIcon from '../../assets/ic_baseline-notifications-none.svg';
import { NavLink } from 'react-router-dom';
import Notifications from '../pages/Notifications/Notifications';
import Notifications_invite from '../pages/Notifications/Notifications_invite';
import { notificationService } from '../services/notificationService';

function Header() {
    const [isOpenNotifications, setIsOpenNotifications] = useState(false);
    const [isOpenInvite, setIsOpenInvite] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedInvitationId, setSelectedInvitationId] = useState(null);
    const [notificationsLoading, setNotificationsLoading] = useState(false);

    // Загружаем количество непрочитанных при монтировании
    useEffect(() => {
        loadUnreadCount();
    }, []);

    const loadUnreadCount = async () => {
        try {
            const data = await notificationService.getNotifications();
            setUnreadCount(data.unread_count || 0);
        } catch (error) {
            console.error('Ошибка загрузки уведомлений:', error);
        }
    };

    const toggleNotifications = async () => {
        if (!isOpenNotifications) {
            setIsOpenNotifications(true);
        } else {
            setIsOpenNotifications(false);
        }
    };

    const handleInvitationClick = (invitationId) => {
        console.log('Открываем приглашение:', invitationId);
        setSelectedInvitationId(invitationId);
        setIsOpenInvite(true);
        setIsOpenNotifications(false);
    };

    const handleInviteClose = () => {
        setIsOpenInvite(false);
        setSelectedInvitationId(null);
        // Обновляем счетчик после действий с приглашением
        loadUnreadCount();
    };

    return (
        <header>
            <nav>
                <ul>
                    <NavLink
                        to='/'
                        className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}
                    >
                        Главная
                    </NavLink>
                    <NavLink
                        to='/project'
                        className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}
                    >
                        Проект
                    </NavLink>
                    <NavLink
                        to='/kanban'
                        className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}
                    >
                        Канбан
                    </NavLink>
                    <NavLink
                        to='/sprints'
                        className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}
                    >
                        Спринты
                    </NavLink>
                </ul>
                <div className='nav_buttons'>
                    <NavLink
                        to="/theme"
                        className={({ isActive }) => `navLinkBtn ${isActive ? "active" : ""}`}
                    >
                        <img src={sunIcon} alt="Тема страницы"/>
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) => `navLinkBtn ${isActive ? "active" : ""}`}
                    >
                        <img src={profileIcon} alt="Профиль"/>
                    </NavLink>
                    <button
                        className={`notif ${isOpenNotifications ? 'active' : ''}`}
                        onClick={toggleNotifications}
                        disabled={notificationsLoading}
                    >
                        <img src={notificationIcon} alt='Уведомления'/>
                        {unreadCount > 0 && (
                            <div className='unReadedCurcle'>
                                <p>{unreadCount > 9 ? '9+' : unreadCount}</p>
                            </div>
                        )}
                    </button>
                </div>
            </nav>

            <Notifications
                isOpen={isOpenNotifications}
                onClose={() => setIsOpenNotifications(false)}
                setUnreadCount={setUnreadCount}
                onInvitationClick={handleInvitationClick}
                loading={notificationsLoading}
                setLoading={setNotificationsLoading}
            />

            <Notifications_invite
                isOpen={isOpenInvite}
                onClose={handleInviteClose}
                invitationId={selectedInvitationId}
            />
        </header>
    );
}

export default Header;