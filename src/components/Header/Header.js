import React, {useState, useEffect} from 'react';
import "./Header.css";
import sunIcon from '../../assets/basil_sun-outline.svg';
import profileIcon from '../../assets/iconoir_profile-circle.svg';
import notificationIcon from '../../assets/ic_baseline-notifications-none.svg';
import { NavLink } from 'react-router-dom';
import Notifications from '../pages/Notifications';

function Header(){
    const [isOpenNotifications, setIsOpenNotifications] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0);
    const [notificationsData, setNotificationsData] = useState(null);

    useEffect(() => {
        const loadNotificationsData = async () => {
            try {
                const data = await import('../pages/notification.json');
                setNotificationsData(data.default || data);
                setUnreadCount(data.unread_count || 0);
            } catch (error) {
                console.error('Ошибка загрузки уведомлений:', error);
                setUnreadCount(0);
            }
        };

        loadNotificationsData();
    }, []);

    const toggleNotifications = () =>{
        setIsOpenNotifications(!isOpenNotifications)
    }

        return(
        <header>
            <nav>
                <ul>
                    <NavLink
                        to = '/' 
                        className={({ isActive }) => 
                        `navLink ${isActive ? "active" : ""}`
                        }> Главная 
                    </NavLink> 
                    <NavLink
                        to = '/project' 
                        className={({ isActive }) => 
                        `navLink ${isActive ? "active" : ""}`
                        }> Проект 
                    </NavLink> 
                    <NavLink
                        to = '/login' 
                        className={({ isActive }) => 
                        `navLink ${isActive ? "active" : ""}`
                        }> Канбан 
                    </NavLink> 
                    <NavLink
                        to = '/login' 
                        className={({ isActive }) => 
                        `navLink ${isActive ? "active" : ""}`
                        }> Спринты 
                    </NavLink> 
                </ul>
                <div className='nav_buttons'>
                    <NavLink
                    to = "/login"
                    className={({ isActive }) => 
                        `navLinkBtn ${isActive ? "active" : ""}`
                    }>
                        <img src={sunIcon} alt="Тема страницы"/>
                    </NavLink>
                    <NavLink
                    to = "/profile"
                    className={({ isActive }) => 
                        `navLinkBtn ${isActive ? "active" : ""}`
                    }>
                        <img src={profileIcon} alt="Профиль"/>
                    </NavLink>
                    <button className={`notif ${isOpenNotifications ? 'active' : ''} `} 
                    onClick={toggleNotifications}
                    > 
                    <img src={notificationIcon} alt='Уведомления'/>
                    {unreadCount >0 && (
                        <div className='unReadedCurcle'>
                        <p>{unreadCount > 9 ? '9+' : unreadCount}</p>
                    </div>
                    )}
                    
                    
                    
                    </button>

                    
                </div>
            </nav>
            <Notifications
                        isOpen = {isOpenNotifications}
                        onClose={() =>setIsOpenNotifications(false)}
                        setUnreadCount={setUnreadCount}
                    />
            

        </header>
        

    )
}


export default Header