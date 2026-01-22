import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api"; // 🔴 ВАЖНО: используем axios-клиент
import "./LoginPage.css";

function LoginPage() {
    const [isActive, setIsActive] = useState("login");
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

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
                password: formData.password,
            };

            // ✅ ВСЁ ЧЕРЕЗ api.js (cookies + https + refresh)
            await api.post("/auth/user/login", credentials);

            // ❌ НЕ трогаем document.cookie
            // ❌ НЕ сохраняем токены вручную
            // сервер сам поставит cookies

            navigate("/");
        } catch (error) {
            console.error("Ошибка входа:", error);
            setErrorMessage("Неверный логин или пароль");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setErrorMessage("");
    };

    return (
        <div className="loginContainer">
            <form className="loginForm" onSubmit={handleSubmit}>
                <div className="loginFormTabContainer">
                    <button
                        className={`loginFormTab ${isActive === "login" ? "active" : ""}`}
                        type="button"
                        onClick={() => setIsActive("login")}
                    >
                        ВХОД
                    </button>
                    <button
                        className={`loginFormTab ${isActive === "register" ? "active" : ""}`}
                        type="button"
                        onClick={() => setIsActive("register")}
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
                    <div style={{ color: "#d32f2f", textAlign: "center" }}>
                        {errorMessage}
                    </div>
                )}

                <div className="loginBtnContainer">
                    <button className="loginBtn" type="submit" disabled={isLoading}>
                        {isLoading ? "ЗАГРУЗКА..." : "ВХОД"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;
