import React, { useState, useEffect } from "react";
import checkAll from "../../../assets/checkAll.svg";
import "./Notifications.css";
import { notificationService } from '../../services/notificationService';

function Notifications({
    isOpen = false,
    onClose,
    setUnreadCount,
    onInvitationClick,
    loading,
    setLoading
}) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (isOpen) {
            loadNotifications();
        }
    }, [isOpen]);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data.notifications || []);
            if (setUnreadCount) {
                setUnreadCount(data.unread_count || 0);
            }
        } catch (error) {
            console.error('Ошибка загрузки уведомлений:', error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = async (notification) => {
        // Помечаем как прочитанное локально
        markAsReadLocally(notification.id);
        
        // Если это приглашение, открываем модалку
        if (notification.type === "new_invite" && onInvitationClick) {
            onInvitationClick(notification.invitation_id);
        }
        
        // Закрываем список уведомлений
        if (onClose) {
            onClose();
        }
    };

    const markAsReadLocally = (id) => {
        setNotifications(prev => prev.map(notif =>
            notif.id === id ? { ...notif, is_read: true } : notif
        ));
    };

    const readAll = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
            
            if (setUnreadCount) {
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Ошибка отметки всех как прочитанных:', error);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="notificationsContainer">
            <div className="notificationsHeader">
                <button onClick={readAll} disabled={loading}>
                    <img src={checkAll} alt="Прочитать всё"/>
                </button>
            </div>
            
            {loading ? (
                <div className="loading-container">
              <div className="spinner"></div>
              <p>Загрузка уведомлений...</p>
            </div>
            ) : notifications.length === 0 ? (
                <div className="empty"><p>Нет уведомлений</p></div>
            ) : (
                <div className="notificationsList">
                    {notifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`notification ${notification.is_read ? 'read' : 'unread'}`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div className="notificationHeader">
                                <div className={`notificationCircle ${notification.type}`}></div>
                                <h3>{notification.title}</h3>
                            </div>
                            <p className="notificationMessage">{notification.message}</p>
                            <div className="notificationFooter">
                                <span className="notificationDate">
                                    {formatDate(notification.created_at)}
                                </span>
                                {notification.type === "new_invite" && !notification.is_read && (
                                    <span className="invitationBadge">Новое приглашение</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Вспомогательная функция для форматирования даты
const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
        return 'Только что';
    } else if (diffHours < 24) {
        return `${diffHours} ч. назад`;
    } else {
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
};

export default Notifications;