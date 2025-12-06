import React from 'react';
import './Header.css';
import sunIcon from '../../assets/basil_sun-outline.svg';
import profileIcon from '../../assets/iconoir_profile-circle.svg';
import notificationIcon from '../../assets/ic_baseline-notifications-none.svg';

class Header extends React.Component{
    render(){
        return(
        <header>
            <nav>
                <ul>
                    <li>
                        <a href="#">
                            <p>Главная</p>
                        </a> 
                    </li>
                    <li>
                        <a href="#">
                            <p>Проект</p>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <p>Канбан</p>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <p>Спринты</p>
                        </a>
    
                    </li>
                </ul>
                <div className='nav_buttons'>
                    <button>
                        <img src={sunIcon} alt="Тема страницы"/>
                    </button>
                    <button>
                        <img src={profileIcon} alt="Профиль"/>
                    </button>
                    <button>
                        <img src={notificationIcon} alt="Уведомления"/>           
                    </button>
                </div>
            </nav>
        </header>
    

        )
    }
}


export default Header