import React, {useState} from "react";
import "./UniPopUp.css"

function UniPopUp({
    isOpen = false,
    onClose,
    popupHeader,
    popupText1,
    popupText2, 
    popupOkText,
    popupNoText}){

    const handleOkClick = () => {
        if (onClose) {
        onClose();
        }
    };

    const handleNoClick = () => {
        if (onClose) {
        onClose(); 
        }
    };

    // Если попап не открыт - не показываем его
    if (!isOpen) {
        return null;
    }


    return(
        <div className="overlay" onClick={onClose}>
           <div className="UniPopUp" onClick={(e) => e.stopPropagation()}>
            <button class="Unipopup-close" onClick={onClose}>×</button>
                <div className="popup_content">
                    <div className="popup_header">
                        <h2>{popupHeader}</h2>
                    </div>
                    <div className="popup_body">
                        <div className="popup_text">
                            <p>{popupText1}</p>
                            <p>{popupText2}</p>
                        </div>
                        <div class="btn_container">
                            <button className="ok_button"  onClick={handleOkClick}>{popupOkText}</button>
                            <button className="bad_button" onClick={handleNoClick}>{popupNoText}</button>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
        
    )
}

export default UniPopUp;