export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    dob: string;
    location?: string;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: AuthUser;
}

export interface FormValidationErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    dob?: string;
    location?: string;
    general?: string;
}