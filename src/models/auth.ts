export interface LoginFormData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterFormData {
    firstName: string;
    lastName: string;
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
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    dob?: string;
    location?: string;
    rememberMe?: string;
    general?: string;
}