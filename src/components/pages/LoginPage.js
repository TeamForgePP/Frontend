import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import "./LoginPage.css";

function LoginPage(){
    const [isActive, setIsActive] = useState('login');
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    const navigate = useNavigate();

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log("Форма отправлена", formData);
        if (formData.password && formData.username){
            console.log("Переход на домашнюю страницу")
            navigate('/')
        } else {
            alert("Заполните все поля!")
        }
    }
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return(
        <div className="loginContainer">
            <form className="loginForm" onSubmit={handleSubmit}>
                <div className="loginFormTabContainer">
                    <button className={`loginFormTab ${isActive === 'login' ? 'active': ''}`} 
                        onClick={()=> setIsActive('login')}
                        type="button" >ВХОД</button>
                    <button className={`loginFormTab ${isActive === 'register' ? 'active': ''}`} 
                        onClick={()=> setIsActive('register')} 
                        type="button">РЕГИСТРАЦИЯ</button>
                </div>
                <div className="loginFormInputs">
                    <input placeholder="ЛОГИН"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}/>
                    <input placeholder="ПАРОЛЬ"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}/>
                </div>
                <div className="loginBtnContainer">
                    <button className="loginBtn" type="submit" >ВХОД</button>
                </div>

            </form>

        </div>
    )
}

export default LoginPage;