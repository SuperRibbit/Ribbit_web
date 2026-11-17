export interface User {
    user_uuid?: string;
    full_name: string;
    email: string;
    password?: string;
    role: string;
    avatar_url: string;
    created_at?: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface StoredUser {
    id?: string;
    name?: string;
    user_uuid?: string;
    full_name?: string;
    email?: string;
    role?: string;
    avatar_url?: string;
    created_at?: string;
}