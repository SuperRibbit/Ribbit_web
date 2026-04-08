export interface User {
    id?: string;
    full_name: string;
    email: string;
    password?: string;
    role: string;
    avatar_url: string;
    created_at?: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    user: User;
}