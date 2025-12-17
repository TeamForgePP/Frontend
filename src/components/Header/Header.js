import React from 'react';
import "./Header.css";
import sunIcon from '../../assets/basil_sun-outline.svg';
import profileIcon from '../../assets/iconoir_profile-circle.svg';
import notificationIcon from '../../assets/ic_baseline-notifications-none.svg';
import { NavLink } from 'react-router-dom';

class Header extends React.Component{
    render(){
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
                    <NavLink
                    to = "/login"
                    className={({ isActive }) => 
                        `navLinkBtn ${isActive ? "active" : ""}`
                    }>
                        <img src={notificationIcon} alt="Уведомления"/>
                    </NavLink>
                </div>
            </nav>
        </header>
    

        )
    }
}


export default Header