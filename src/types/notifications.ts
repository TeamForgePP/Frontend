// types/notification.ts
export interface Notification {
    id: string;
    type: 'new_invite' | 'message' | 'update' | 'reminder' | 'deadline' | 'newTask';
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
    invitation_id: string | null;
}

export interface NotificationsResponse {
    notifications: Notification[];
    unread_count: number;
}

export interface Invitation {
    invitation_id: string;
    notification_id: string;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
    project: {
        id: string;
        name: string;
        description: string;
        team_leader: TeamMember;
        participants: TeamMember[];
    };
}

export interface TeamMember {
    id: string;
    first_name: string;
    last_name: string;
    roles: string[];
}

export interface BasicResponse {
    success: boolean;
    message: string;
}