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
            setError('Не удалось загрузить приглашение');
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
            onClose();
        } catch (error) {
            console.error('Ошибка принятия приглашения:', error);
            alert('Не удалось принять приглашение');
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
            onClose();
        } catch (error) {
            console.error('Ошибка отклонения приглашения:', error);
            alert('Не удалось отклонить приглашение');
        } finally {
            setActionLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="overlay" onClick={handleClose}>
            <div className="inviteContainer" onClick={e => e.stopPropagation()}>
                <button 
                    className="popup-close" 
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#666'
                    }}
                >
                    ×
                </button>
                
                <h1>Приглашение в команду</h1>
                
                {loading ? (
                    <div style={{textAlign: 'center', padding: '20px'}}>
                        <p>Загрузка приглашения...</p>
                    </div>
                ) : error ? (
                    <div style={{textAlign: 'center', padding: '20px'}}>
                        <p style={{color: 'red'}}>{error}</p>
                        <button onClick={handleClose} className="ok_button">Закрыть</button>
                    </div>
                ) : invitation ? (
                    <div className="inviteContent">
                        <div style={{marginBottom: '20px'}}>
                            <h2 style={{marginBottom: '10px'}}>Проект: {invitation.project?.name || 'Без названия'}</h2>
                            <p style={{color: '#666'}}>{invitation.project?.description || 'Нет описания'}</p>
                        </div>
                        
                        <div style={{marginBottom: '20px'}}>
                            <h3>Team Leader</h3>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <img src={profilImg} alt="Team Leader" style={{width: '40px'}} />
                                <div>
                                    <strong>{invitation.project?.team_leader?.first_name} {invitation.project?.team_leader?.last_name}</strong>
                                    <div style={{display: 'flex', gap: '5px', marginTop: '5px'}}>
                                        {invitation.project?.team_leader?.roles?.map(role => (
                                            <span key={role} style={{
                                                background: '#f0f0f0',
                                                padding: '2px 8px',
                                                borderRadius: '10px',
                                                fontSize: '12px'
                                            }}>{role}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div style={{marginBottom: '30px'}}>
                            <h3>Участники</h3>
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                                {invitation.project?.participants?.map(participant => (
                                    <div key={participant.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        background: '#f8f8f8',
                                        padding: '8px',
                                        borderRadius: '8px'
                                    }}>
                                        <img src={profilImg} alt="Участник" style={{width: '30px'}} />
                                        <div>
                                            <div>{participant.first_name} {participant.last_name}</div>
                                            <div style={{display: 'flex', gap: '3px', fontSize: '11px'}}>
                                                {participant.roles?.map(role => (
                                                    <span key={role}>{role}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {invitation.status === 'PENDING' && (
                            <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                                <button 
                                    onClick={handleAccept}
                                    disabled={actionLoading}
                                    style={{
                                        padding: '10px 30px',
                                        background: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {actionLoading ? '...' : 'Принять'}
                                </button>
                                <button 
                                    onClick={handleDecline}
                                    disabled={actionLoading}
                                    style={{
                                        padding: '10px 30px',
                                        background: '#f44336',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {actionLoading ? '...' : 'Отклонить'}
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