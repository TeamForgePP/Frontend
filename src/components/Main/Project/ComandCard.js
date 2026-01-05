import React, { useState } from "react";
import "./ComandCard.css";
import profilImg from '../../../assets/iconoir_profile-circle.svg';

function ComandCard({
    id,
    name = "Иван",
    surname = "Иванов",
    role = "Backend",
    onRemove,
    onUpdate,
    disabled = false
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name, surname, role });

    const handleSave = () => {
        if (onUpdate) {
            onUpdate(id, editData);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({ name, surname, role });
        setIsEditing(false);
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        if (onRemove && !disabled) {
            onRemove(id);
        }
    };

    if (isEditing) {
        return (
            <div className="comandCardContainer">
                <div className="comandContent">
                    <div className="comandImg">
                        <img src={profilImg} alt={`${name} ${surname}`} />
                    </div>
                    <div className="editInputs">
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                            placeholder="Имя"
                            disabled={disabled}
                        />
                        <input
                            type="text"
                            value={editData.surname}
                            onChange={(e) => setEditData({...editData, surname: e.target.value})}
                            placeholder="Фамилия"
                            disabled={disabled}
                        />
                        <input
                            type="text"
                            value={editData.role}
                            onChange={(e) => setEditData({...editData, role: e.target.value})}
                            placeholder="Роль"
                            disabled={disabled}
                        />
                    </div>
                    <div className="editButtons">
                        <button className="ok_button" onClick={handleSave} disabled={disabled}>
                            Сохранить
                        </button>
                        <button className="bad_button" onClick={handleCancel} disabled={disabled}>
                            Отмена
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="comandCardContainer"
            onClick={() => !disabled && setIsEditing(true)}
            style={{ cursor: disabled ? 'default' : 'pointer' }}
        >
            <div className="comandContent">
                <div className="comandImg">
                    <img src={profilImg} alt={`${name} ${surname}`} />
                </div>
                <div className="comandText">
                    <p>{name} {surname}</p>
                    <p>{role}</p>
                </div>
                <button 
                    className="bad_button" 
                    onClick={handleRemove}
                    disabled={disabled}
                >
                    Исключить
                </button>
            </div>
        </div>
    );
}

export default ComandCard;