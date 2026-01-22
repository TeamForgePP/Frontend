import React, { useEffect, useState } from "react";
import './Notifications_invite.css';
import profilImg from '../../../assets/iconoir_profile-circle.svg';
import { notificationService } from '../../services/notificationService';

function Notifications_invite({
    isOpen,
    onClose,
    notificationId
}) {
    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (isOpen && notificationId) {
            loadInvitation(notificationId);
        } else {
            setInvitation(null);
            setError(null);
        }
    }, [isOpen, notificationId]);

    const loadInvitation = async (id) => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('Загружаем приглашение по ID уведомления:', id);
            const data = await notificationService.getInvitationByNotificationId(id);
            console.log('Данные приглашения:', data);
            setInvitation(data);
        } catch (error) {
            console.error('Ошибка загрузки приглашения:', error);
            setError('Не удалось загрузить приглашение');
            setInvitation(null);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        if (!notificationId || actionLoading) return;
        
        setActionLoading(true);
        try {
            console.log('Принимаем приглашение через ID уведомления:', notificationId);
            await notificationService.acceptInvitation(notificationId);
            alert('Приглашение принято!');
            onClose();
        } catch (error) {
            console.error('Ошибка принятия приглашения:', error);
            alert('Не удалось принять приглашение');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDecline = async () => {
        if (!notificationId || actionLoading) return;
        
        setActionLoading(true);
        try {
            console.log('Отклоняем приглашение через ID уведомления:', notificationId);
            await notificationService.declineInvitation(notificationId);
            alert('Приглашение отклонено');
            onClose();
        } catch (error) {
            console.error('Ошибка отклонения приглашения:', error);
            alert('Не удалось отклонить приглашение');
        } finally {
            setActionLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="overlay" onClick={onClose}>
            <div className="inviteContainer" onClick={e => e.stopPropagation()}>
                <button className="popup-close" onClick={onClose}>×</button>
                
                <h1>Приглашение в команду</h1>
                
                {loading ? (
                    <div className="loading-message">
                        <p>Загрузка приглашения...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        <p className="error-text">{error}</p>
                        <button onClick={onClose} className="ok_button">Закрыть</button>
                    </div>
                ) : invitation ? (
                    <div className="inviteContent">
                        <div className="project-info">
                            <h2>Проект: {invitation.project?.name || 'Без названия'}</h2>
                            <p className="project-description">{invitation.project?.description || 'Нет описания'}</p>
                        </div>
                        
                        {invitation.project?.team_leader && (
                            <div className="team-section">
                                <h3>Team Leader</h3>
                                <div className="projectComandContainer">
                                    <div className="participant-card">
                                    <img src={profilImg} alt="Team Leader" />
                                    <div className="leader-info">
                                        <strong>{invitation.project.team_leader.first_name} {invitation.project.team_leader.last_name}</strong>
                                        {invitation.project.team_leader.roles?.length > 0 && (
                                            <div className="roles">
                                                {invitation.project.team_leader.roles.map(role => (
                                                    <span key={role} className="role-tag">{role}</span>
                                                ))}
                                                
                                            </div>
                                        )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {invitation.project?.participants && invitation.project.participants.length > 0 && (
                            <div className="participants-section">
                                <h3>Участники ({invitation.project.participants.length})</h3>
                                <div className="projectComandContainer">
                                    {invitation.project.participants.map(participant => (
                                        <div key={participant.id} className="participant-card">
                                            <img src={profilImg} alt="Участник" />
                                            <div className="participant-info">
                                                <p>{participant.first_name} {participant.last_name}</p>
                                                {participant.roles?.length > 0 && (
                                                    <div className="roles">
                                                        {participant.roles.map(role => (
                                                            <span key={role} className="role-tag small">{role}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {invitation.status === 'posted' && (
                            <div className="buttonContainer">
                                <button 
                                    onClick={handleAccept}
                                    disabled={actionLoading}
                                    className="ok_button"
                                >
                                    {actionLoading ? 'Обработка...' : 'Принять'}
                                </button>
                                <button 
                                    onClick={handleDecline}
                                    disabled={actionLoading}
                                    className="bad_button"
                                >
                                    {actionLoading ? 'Обработка...' : 'Отклонить'}
                                </button>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default Notifications_invite;