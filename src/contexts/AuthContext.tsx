import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {AuthService} from '../services';
import {AuthUser, LoginCredentials, UserProfile} from '../types';
import {AuthUtils} from '../utils';

interface AuthContextType {
    user: UserProfile | null;
    authUser: AuthUser | null; // For backward compatibility
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const authService = AuthService.getInstance();

    const isAuthenticated = !!user && AuthUtils.isAuthenticated();

    // Convert UserProfile to AuthUser for backward compatibility
    const authUser: AuthUser | null = user ? authService.convertUserProfileToAuthUser(user) : null;

    // Check for existing authentication on mount
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Get user profile from localStorage
                const userProfile = await authService.getCurrentUser();
                if (userProfile) {
                    setUser(userProfile);
                }
            } catch (error) {
                console.error('Failed to get current user:', error);
                AuthUtils.clearUserProfile();
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, [authService]);

    const login = async (credentials: LoginCredentials): Promise<void> => {
        setIsLoading(true);
        try {
            const userProfile = await authService.login(credentials);
            setUser(userProfile);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setUser(null);
            setIsLoading(false);
        }
    };

    const refreshAuth = async (): Promise<void> => {
        try {
            const userProfile = await authService.getCurrentUser();
            setUser(userProfile);
        } catch (error) {
            console.error('Failed to refresh auth:', error);
            setUser(null);
            AuthUtils.clearUserProfile();
        }
    };

    const value: AuthContextType = {
        user,
        authUser,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};