export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface UserPayload {
     id: string;
     email: string;
}

export interface AuthResponse {
    token: string;
}

export interface ProtectedResponse {
    message: string;
}