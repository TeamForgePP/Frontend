import React, { useState, useEffect } from "react";
import checkAll from "../../assets/checkAll.svg"
import notificationsData from './notification.json';
import "./Notifications.css"

function Notifications({
    isOpen = false,
    onClose,
    setUnreadCount,
}){
    const [notifications, setNotifications] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState(0);


    useEffect(()=>{
        if (isOpen){
            loadNotifications();
        }
    },[isOpen])

    const loadNotifications = () => {
    setNotifications(notificationsData.notifications);
    setUnreadCounts(notificationsData.unread_count);

    if (setUnreadCount) {
            setUnreadCount(notificationsData.unread_count);
        }
};

   const markAsRead = (id) => {
    setNotifications(prev => {
        const wasUnread = prev.find(n => n.id === id && !n.is_read);
        if (wasUnread) {
             const newCount = unreadCounts - 1;
                setUnreadCounts(newCount);
                
            if (setUnreadCount) {
                setUnreadCount(newCount);
            }
        }
        return prev.map(notif =>
            notif.id === id ? {...notif, is_read: true} : notif
        );
    });
};


    const readAll = () =>{
        setNotifications(prev=>
        prev.map(notif => ({...notif, is_read:true}))
        );

        setUnreadCounts(0);

        if (setUnreadCount) {
            setUnreadCount(0);
        }
    }



    if (!isOpen){
        return null
    }

    return(
        <div className="notificationsContainer">

            <div className="notificationsHeader">
                <button onClick={readAll}>
                    <img src={checkAll} alt="Прочитать всё"/>
                </button>
            </div> 
                <div className="notificationsList">
                    {notifications.map(notification =>(
                       <div key={notification.id} className="notification">
                        <div className="notificationHeader">
                            <div className={`notificationCircle ${notification.type}`}></div>
                            <h1>{notification.title}</h1>
                        </div>
                        <p>{notification.message}</p>
                        <div className="notificationFooter">
                            <p>{notification.created_at}</p>
                        </div>
                    </div> 
                    ))}
                    
                </div>
        </div>
    )
}

export default Notifications;