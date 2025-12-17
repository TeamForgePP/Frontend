import React from "react";
import "./ComandCard.css"
import profilImg from '../../../assets/iconoir_profile-circle.svg';

function ComandCard({
    id,
    name = "Иван",
    surname = "Иванов",
    role = "Backend",
    onRemove
}) {

    const handleRemove = (e) => {
        e.stopPropagation();
        if (onRemove) {
            onRemove(id);
        }
    };
   
    return(
        <div className="comandCardContainer">
            <div className="comandContent">
                <div className="comandImg">
                    <img src={profilImg} 
                    alt={`${name} ${surname}`
                    }/>
                </div>
                <div className="comandText">
                    <p>{name} {surname}</p>
                    <p>{role}</p>
                </div>
                <button className="bad_button" onClick={handleRemove}>Исключить</button>
            </div>
        </div>
    )
}

export default ComandCard;