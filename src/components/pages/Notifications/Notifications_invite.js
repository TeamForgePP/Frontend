import React, { useEffect, useState } from "react";
import './Notifications_invite.css';
import profilImg from '../../../assets/iconoir_profile-circle.svg';
import { notificationService } from '../../services/notificationService';

function Notifications_invite({
    isOpen,
    onClose,
    invitationId
}) {
    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (isOpen && invitationId) {
            loadInvitation(invitationId);
        } else {
            setInvitation(null);
            setError(null);
        }
    }, [isOpen, invitationId]);

    const loadInvitation = async (id) => {
        setLoading(true);
        setError(null);
        
        try {
            const data = await notificationService.getInvitation(id);
            setInvitation(data);
        } catch (error) {
            console.error('Ошибка загрузки приглашения:', error);
            setError(error.response?.data?.message || 'Не удалось загрузить приглашение');
            setInvitation(null);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        if (!invitationId || actionLoading) return;
        
        setActionLoading(true);
        try {
            await notificationService.acceptInvitation(invitationId);
            alert('Приглашение принято!');
            if (onClose) onClose();
        } catch (error) {
            console.error('Ошибка принятия приглашения:', error);
            alert(error.response?.data?.message || 'Не удалось принять приглашение');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDecline = async () => {
        if (!invitationId || actionLoading) return;
        
        setActionLoading(true);
        try {
            await notificationService.declineInvitation(invitationId);
            alert('Приглашение отклонено');
            if (onClose) onClose();
        } catch (error) {
            console.error('Ошибка отклонения приглашения:', error);
            alert(error.response?.data?.message || 'Не удалось отклонить приглашение');
        } finally {
            setActionLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="overlay">
            <div className="inviteContainer">
                <div className="inviteHeader">
                    <h1>Вступление в команду</h1>
                    <button className="closeButton" onClick={onClose}>×</button>
                </div>
                
                {loading ? (
                    <div className="loadingState">
                        <div className="spinner"></div>
                        <p>Загрузка информации о приглашении...</p>
                    </div>
                ) : error ? (
                    <div className="errorState">
                        <p className="errorText">{error}</p>
                        <button className="closeBtn" onClick={onClose}>Закрыть</button>
                    </div>
                ) : invitation ? (
                    <div className="inviteContent">
                        <div className="projectInfo">
                            <h2>{invitation.project?.name || 'Без названия'}</h2>
                            <p className="projectDescription">
                                {invitation.project?.description || 'Нет описания'}
                            </p>
                            
                            <div className="statusBadge">
                                Статус: <span className={`status ${invitation.status?.toLowerCase()}`}>
                                    {getStatusText(invitation.status)}
                                </span>
                            </div>
                        </div>
                        
                        <div className="teamSection">
                            <h3>Team Leader</h3>
                            <div className="teamLeaderCard">
                                <img src={profilImg} alt="Team Leader" />
                                <div className="leaderInfo">
                                    <h4>
                                        {invitation.project?.team_leader?.first_name || ''} 
                                        {invitation.project?.team_leader?.last_name || ''}
                                    </h4>
                                    <div className="roles">
                                        {invitation.project?.team_leader?.roles?.map(role => (
                                            <span key={role} className="roleTag">{role}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="participantsSection">
                            <h3>Участники ({invitation.project?.participants?.length || 0})</h3>
                            <div className="participantsList">
                                {invitation.project?.participants?.map(participant => (
                                    <div key={participant.id} className="participantCard">
                                        <img src={profilImg} alt="Участник" />
                                        <div className="participantInfo">
                                            <p>
                                                {participant.first_name} {participant.last_name}
                                            </p>
                                            <div className="roles">
                                                {participant.roles?.map(role => (
                                                    <span key={role} className="roleTag small">{role}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {invitation.status === 'PENDING' && (
                            <div className="invitationActions">
                                <button 
                                    className="acceptButton" 
                                    onClick={handleAccept}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Обработка...' : 'Принять приглашение'}
                                </button>
                                <button 
                                    className="declineButton" 
                                    onClick={handleDecline}
                                    disabled={actionLoading}
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

// Вспомогательные функции
const getStatusText = (status) => {
    const statusMap = {
        'PENDING': 'Ожидает ответа',
        'ACCEPTED': 'Принято',
        'DECLINED': 'Отклонено',
        'EXPIRED': 'Истекло'
    };
    return statusMap[status] || status;
};

export default Notifications_invite;