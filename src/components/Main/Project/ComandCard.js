import React, { useState } from "react";
import "./ComandCard.css";
import profilImg from '../../../assets/iconoir_profile-circle.svg';
import UniPopUp from "../../UniPopUp";

function ComandCard({
    id,
    name = "Иван",
    surname = "Иванов",
    role = "Backend",
    onRemove,
    disabled = false
}) {
    const [isDeletePopUpOpen, setIsDeletePopUpOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRemoveClick = (e) => {
        e.stopPropagation();
        if (onRemove && !disabled) {
            setIsDeletePopUpOpen(true);
        }
    };

    const closeDeletePopUp = () => {
        setIsDeletePopUpOpen(false);
    };

    const handleConfirmRemove = () => {
        if (onRemove && !disabled) {
            setIsLoading(true);
            try {
                onRemove(id);
                closeDeletePopUp();
            } catch (error) {
                console.error('Ошибка при удалении:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="static-team">
            <div className="teamMemberStatic">
                <div className="comandImg">
                    <img src={profilImg} alt={`${name} ${surname}`} />
                </div>
                <div className="comandText">
                    <span>{name} {surname}</span>
                    <span className="memberRole">{role}</span>
                </div>
                <button 
                    className="bad_button" 
                    onClick={handleRemoveClick}
                    disabled={disabled}
                >
                    Исключить
                </button>
            </div>
            
            {/* Попап подтверждения исключения */}
            <UniPopUp 
                isOpen={isDeletePopUpOpen}
                onClose={closeDeletePopUp}
                popupHeader="ВНИМАНИЕ"
                popupText1={`Вы действительно хотите исключить ${name} ${surname} из команды?`}
                popupText2=""
                popupOkText="Оставить в команде"
                popupNoText="Исключить"
                onConfirm={handleConfirmRemove}
                loading={isLoading}
            />
        </div>
    );
}

export default ComandCard;