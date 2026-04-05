export interface User {
    id?: string;
    full_name: string;
    email: string;
    password?: string;
    role: string;
    avatar_url: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    userId: string;
    userName: string;
}