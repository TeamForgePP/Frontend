
export interface UserProfile {
    first_name: string;
    last_name: string;
    patronymic: string;
    group: string;
    roles: string[];
    email: string;
}

export interface UpdateProfileData {
    first_name: string;
    last_name: string;
    patronymic: string;
    email: string;
}

export interface ChangePasswordData {
    old_password: string;
    new_password: string;
}

export interface ApiResponse {
    success: boolean;
    message: string;
}