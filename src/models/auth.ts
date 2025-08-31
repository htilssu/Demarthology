export interface LoginFormData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterFormData {
    email: string;
    phone: string;
    password: string;
    dateOfBirth: string;
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
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    dateOfBirth?: string;
    rememberMe?: string;
    agreeTerms?: string;
    general?: string;
}