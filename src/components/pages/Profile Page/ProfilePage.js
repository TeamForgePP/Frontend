import React, { useState } from "react";
import { NavLink } from 'react-router-dom';
import "./ProfilePage.css";
import Header from "../../Header/Header";
import UniPopUp from "../../UniPopUp";
import edit from '../../../assets/edit.svg';
import exit from '../../../assets/exit.svg';
import profile from '../../../assets/profileBig.svg'
import ProfileEdit from "./ProfileEdit";


function ProfilePage(){
    const [isPopUpOpen, setPopUpOpen] = useState(false)
    const [isEditPopUpOpen, setEditPopUpOpen] = useState(false)

    const openPopUp = () =>{
        setPopUpOpen(true)
    }

    const closePopUp= () =>{
        setPopUpOpen(false)
    }

    const openEditPopUp = () =>{
        setEditPopUpOpen(true)
    }

    const closeEditPopUp= () =>{
        setEditPopUpOpen(false)
    }


    return(
        <div className="profileMainContainer">
            <Header/>
            <div className="uniSection">
                <h1 className="profileHeader">Профиль</h1>
                <div className="uniInnerSection">
                    <div className="profileContent">
                        <div className="profileImgContainer">
                            <img src={profile} alt="profile img"></img>
                        </div>
                        <div className="profileInfo">
                            <p><strong>ФИО:</strong>Морозова Дарья Олеговна</p>
                            <p><strong>Группа:</strong>БПИ2402</p>
                            <p><strong>Роль:</strong>Frontend</p>
                            <p><strong>Команды:</strong>Господи помоги</p>
                            <p><strong>Почта:</strong>Суперпочта</p>
                        </div>
                        <div className="profileTabs">
                            <button className="profileEdit">
                                <img src={edit} alt="edit img" onClick={openEditPopUp} title="Редактировать"></img>
                            </button>
                            <button className="profileExit">
                                <img src={exit} alt="edit exit" title="Выйти" onClick={openPopUp}></img>
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
            />
            <ProfileEdit
            isOpen={isEditPopUpOpen}
            onClose={closeEditPopUp}/>
        </div>
    )
}

export default ProfilePage