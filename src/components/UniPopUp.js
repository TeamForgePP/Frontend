import React, {useState} from "react";
import "./UniPopUp.css"

function UniPopUp({
    isOpen = false,
    onClose,
    popupHeader,
    popupText1,
    popupText2, 
    popupOkText = "ОК",
    popupNoText = "Отмена",
    onConfirm,
    loading = false,
    hideCloseButton = false,
    showOnlyConfirm = false,
    confirmButtonVariant = "primary",
    customClassName = "",
    disableBackdropClose = false
}){

    const handleOkClick = () => {
        if (onClose && !loading) {
            onClose();
        }
    };

    const handleNoClick = () => {
        if (onConfirm && !loading) {
            onConfirm();
        }
        if (!loading) {
            onClose?.();
        }
    };

    const handleOverlayClick = () => {
        if (!disableBackdropClose && !loading) {
            onClose?.();
        }
    };

    if (!isOpen) {
        return null;
    }

    return(
        <div className="overlay" onClick={handleOverlayClick}>
           <div className={`UniPopUp ${customClassName}`} onClick={(e) => e.stopPropagation()}>
                {!hideCloseButton && (
                    <button 
                        className="Unipopup-close" 
                        onClick={onClose}
                        disabled={loading}
                    >
                        ×
                    </button>
                )}
                <div className="popup_content">
                    <div className="popup_header">
                        <h2>{popupHeader}</h2>
                    </div>
                    <div className="popup_body">
                        <div className="popup_text">
                            <p>{popupText1}</p>
                            {popupText2 && <p>{popupText2}</p>}
                        </div>
                        <div class="btn_container">
                            {!showOnlyConfirm && (
                                <button 
                                    className="ok_button"  
                                    onClick={handleOkClick}
                                    disabled={loading}
                                >
                                    {popupOkText}
                                </button>
                            )}
                            <button 
                                className={`bad_button ${confirmButtonVariant === 'danger' ? 'danger-button' : ''}`} 
                                onClick={handleNoClick}
                                disabled={loading}
                            >
                                {loading ? 'Обработка...' : popupNoText}
                            </button>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    )
}

export default UniPopUp;