import React, {useState} from "react";
import './ProfileEdit.css';
import profile from'../../../assets/iconoir_profile-circle.svg';
import key from '../../../assets/key.svg';
import emailIcon from '../../../assets/e-mail.svg';


function ProfileEdit({
    isOpen = false,
    onClose}){

    const [editingAvatar, setEditingAvatar] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);

    const [userData, setUserData] = useState({
        email: "user@example.com",
    });

    const [newEmail, setNewEmail] = useState(userData.email);
    const [emailError, setEmailError] = useState("");

    const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
    });
    const [passwordError, setPasswordError] = useState("");
    
    const handlePasswordSubmit = () => {
        if (passwords.newPassword.length < 8) {
            setPasswordError("Пароль должен быть минимум 8 символов");
        } else if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordError("Пароли не совпадают");
        }  else {
            setEditingPassword(false);
        }
    };

    const handleEmailSubmit = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!newEmail) {
            setEmailError("Поле не может быть пустым");
            return;
        }
        
        if (!emailRegex.test(newEmail)) {
            setEmailError("Введите корректный email");
            return;
        }
        
        setUserData({...userData, email: newEmail});
        console.log("Новая почта сохранена:", newEmail);

        setEditingEmail(false);
        setEmailError("");
    };

    if (!isOpen){
        return null
    }

    return(
        <div className="overlay">
            <div className="editContainer">
                <button className="popup-close" onClick={onClose} >×</button>
                <h1>Учётная запись</h1>
                <div className="editSection">
                    <div className="editAllSection">
                        <img src={profile} alt="Avatar"/>
                        <div className="editInfo">
                            <h2>Изображение</h2>
                            {!editingAvatar ? (
                                <div>
                                    <button className="textEditButton"
                                        onClick={() => setEditingAvatar(true)}>Изменить
                                    </button>
                                </div>
                                
                            ) : ( 
                                <div className="editForm">
                                    <div className="editInputs">
                                        <input 
                                        type="file" 
                                        accept="image/*"
                                        className="fileInput"
                                    />
                                    </div>
                                    <div className="editFormButtons">
                                        <button 
                                            className="ok_button"
                                            onClick={() => {
                                                setEditingAvatar(false);
                                            }}
                                        >
                                            Сохранить
                                        </button>
                                        <button 
                                            className="bad_button"
                                            onClick={() => setEditingAvatar(false)}
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </div>
                            )}     
                        </div>
                    </div>
                    <div className="editAllSection">
                        <img src={emailIcon} alt="Email"/>
                        <div className="editInfo">
                            <h2>Почта</h2>
                            {!editingEmail ? (
                                <div>
                                <p className="emailText">{userData.email}</p>
                                <button className="textEditButton"
                                onClick={() => setEditingEmail(true)}>Изменить</button>
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
                                    />
                                    {emailError && <p style={{color: 'red', fontSize: '14px'}}>{emailError}</p>}
                                    </div>
                                    <div className="editFormButtons">
                                        <button 
                                            className="ok_button"
                                            onClick={() => {
                                                handleEmailSubmit();
                                            }}
                                        >
                                            Сохранить
                                        </button>
                                        <button 
                                            className="bad_button"
                                            onClick={() => {setEditingEmail(false);
                                                setNewEmail(userData.email);
                                                setEmailError('')
                                            }}
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                        </div>
                    </div>
                    <div className="editAllSection">
                        <img src={key} alt="Password"/>
                        <div className="editInfo">
                            <h2>Пароль</h2>
                            {!editingPassword ? (
                                <div>
                                    <button className="textEditButton"
                                        onClick={() => setEditingPassword(true)}>Изменить
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
                                        />
                                        <input 
                                            type="password" 
                                            placeholder="Новый пароль"
                                            className="passwordInput"
                                            value={passwords.newPassword}
                                            onChange={(e) => {
                                                setPasswords({...passwords, newPassword: e.target.value});
                                                setPasswordError(""); 
                                            }}
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
                                        />
                                        {passwordError && <p style={{color: 'red', fontSize: '14px'}}>{passwordError}</p>}
                                    </div>
                                    <div className="editFormButtons">
                                        <button 
                                            className="ok_button"
                                            onClick={handlePasswordSubmit}
                                        >
                                            Сохранить
                                        </button>
                                        <button 
                                            className="bad_button"
                                            onClick={() => {
                                                setEditingPassword(false);
                                                setPasswordError("");
                                                setPasswords("")}
                                            }

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
            

    )
}

export default ProfileEdit;