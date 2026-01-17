import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import "./LoginPage.css";

function LoginPage(){
    const [isActive, setIsActive] = useState('login');
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    // В функции handleSubmit
const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!formData.username || !formData.password) {
        setErrorMessage("Заполните все поля!");
        return;
    }

    setIsLoading(true);

    try {
        const credentials = {
            email: formData.username,
            password: formData.password
        };
        
        console.log("Отправляем данные:", credentials);
        
        const response = await fetch('http://localhost:8000/api/auth/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify(credentials),
            credentials: 'include'  // ✅ Важно!
        });
        
        console.log("Статус ответа:", response.status);
        
        // Проверяем, установил ли сервер куки
        const setCookieHeader = response.headers.get('set-cookie');
        console.log("Set-Cookie header от сервера:", setCookieHeader);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Ошибка сервера:", errorText);
            throw new Error(`Ошибка ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log("Ответ сервера:", data);
        
        // ❌ УБРАТЬ ВСЕ document.cookie - сервер сам установит куки
        // ❌ НЕ устанавливаем куки вручную
        
        // ✅ Только сохраняем в localStorage для информации
        localStorage.setItem('access_token', data.access_token);
        if (data.refresh_token) {
            localStorage.setItem('refresh_token', data.refresh_token);
        }
        
        console.log("✅ Сервер должен установить куки автоматически");
        
        // Даем время серверу установить куки
        setTimeout(() => {
            navigate('/');
        }, 100);
        
    } catch (error) {
        console.error("Ошибка:", error);
        setErrorMessage("Ошибка входа: " + error.message);
    } finally {
        setIsLoading(false);
    }
};
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrorMessage(""); // Сбрасываем ошибку при изменении полей
    };

    return(
        <div className="loginContainer">
            <form className="loginForm" onSubmit={handleSubmit}>
                <div className="loginFormTabContainer">
                    <button 
                        className={`loginFormTab ${isActive === 'login' ? 'active': ''}`} 
                        onClick={() => {
                            setIsActive('login');
                            setErrorMessage("");
                        }}
                        type="button"
                    >
                        ВХОД
                    </button>
                    <button 
                        className={`loginFormTab ${isActive === 'register' ? 'active': ''}`} 
                        onClick={() => {
                            setIsActive('register');
                            setErrorMessage("");
                        }}
                        type="button"
                    >
                        РЕГИСТРАЦИЯ
                    </button>
                </div>
                
                <div className="loginFormInputs">
                    <input 
                        placeholder="ЛОГИН"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    <input 
                        placeholder="ПАРОЛЬ"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>
                
                {errorMessage && (
                    <div style={{
                        position: 'absolute',
                        bottom: '90px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 'calc(100% - 80px)',
                        color: '#d32f2f',
                        textAlign: 'center',
                        fontSize: '14px',
                        padding: '10px',
                        zIndex: 1
                    }}>
                        {errorMessage}
                    </div>
                )}
                
                <div className="loginBtnContainer">
                    <button 
                        className="loginBtn" 
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "ЗАГРУЗКА..." : (isActive === 'login' ? "ВХОД" : "РЕГИСТРАЦИЯ")}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default LoginPage;