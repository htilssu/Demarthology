import { ApiService } from '../utils/api';
import { 
  LoginCredentials, 
  LoginResponse,
  RegisterResponse,
  AuthUser,
  UserProfile
} from '../types/api';
import { AuthUtils } from '../utils/auth';

/**
 * Authentication service - simplified to work with user profile storage
 * No tokens used, just stores user profile data in localStorage
 */
export class AuthService {
  private static instance: AuthService;
  private apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Login user with credentials
   * Stores user profile directly in localStorage
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // Call real API login endpoint
      console.log('🔐 Calling real API login...');
      const userProfile = await this.apiService.post<LoginResponse>('/api/login', {
        email: credentials.email,
        password: credentials.password
      });

      console.log('✅ Real API login successful');

      // Store the user profile directly in localStorage
      AuthUtils.setUserProfile(userProfile);

      return userProfile;
    } catch (error: any) {
      console.log('⚠️ Real API login failed, using development fallback...');
      
      // Development fallback when API is not available
      if (error.statusCode === 0 || error.statusCode === 404 || error.message?.includes('Network Error')) {
        console.log('🔄 Using development authentication...');
        return this.developmentLogin(credentials);
      }
      
      // Handle specific API errors - use server error message from 'detail' field
      throw new Error(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  }

  /**
   * Development fallback authentication
   */
  private async developmentLogin(credentials: LoginCredentials): Promise<LoginResponse> {
    console.log('🛠️ Using development authentication mode');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Basic validation
    if (!credentials.email || !credentials.password) {
      throw new Error('Email và mật khẩu không được để trống');
    }

    // Create mock user profile matching the API format
    const userProfile: LoginResponse = {
      dateOfBirth: "1990-01-01",
      email: credentials.email,
      name: credentials.email.split('@')[0] || 'User',
      password: credentials.password,
      phone: "0123456789",
      urlImage: "https://example.com/default_avatar.jpg"
    };

    // Store in localStorage
    AuthUtils.setUserProfile(userProfile);

    return userProfile;
  }

  /**
   * Register new user
   * Stores user profile directly in localStorage
   */
  async register(userData: {
    email: string;
    phone: string;
    password: string;
    dateOfBirth: string;
  }): Promise<RegisterResponse> {
    try {
      // Call real API register endpoint
      console.log('🔐 Calling real API registration...');
      const userProfile = await this.apiService.post<RegisterResponse>('/api/register', {
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        dateOfBirth: userData.dateOfBirth
      });

      console.log('✅ Real API registration successful');

      // Store the user profile directly in localStorage
      AuthUtils.setUserProfile(userProfile);

      return userProfile;
    } catch (error: any) {
      console.log('⚠️ Real API registration failed, using development fallback...');
      
      // Development fallback when API is not available
      if (error.statusCode === 0 || error.statusCode === 404 || error.message?.includes('Network Error')) {
        console.log('🔄 Using development registration...');
        return this.developmentRegister(userData);
      }
      
      // Handle specific API errors - use server error message from 'detail' field
      throw new Error(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  }

  /**
   * Development fallback registration
   */
  private async developmentRegister(userData: {
    email: string;
    phone: string;
    password: string;
    dateOfBirth: string;
  }): Promise<RegisterResponse> {
    console.log('🛠️ Using development registration mode');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create user profile matching the API format
    const userProfile: RegisterResponse = {
      dateOfBirth: userData.dateOfBirth,
      email: userData.email,
      name: userData.email.split('@')[0] || 'User', // Generate name from email
      password: userData.password,
      phone: userData.phone,
      urlImage: "https://example.com/default_avatar.jpg"
    };

    // Store in localStorage
    AuthUtils.setUserProfile(userProfile);
    
    return userProfile;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call real API logout endpoint
      await this.apiService.post('/api/logout');
    } catch (error) {
      // Continue with local logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local user data
      AuthUtils.clearUserProfile();
    }
  }

  /**
   * Get current user profile from localStorage
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    return AuthUtils.getUserProfile();
  }

  /**
   * Convert UserProfile to AuthUser for backward compatibility
   */
  convertUserProfileToAuthUser(userProfile: UserProfile): AuthUser {
    return {
      id: 'user-' + userProfile.email.replace('@', '_').replace('.', '_'),
      email: userProfile.email,
      name: userProfile.name,
      role: 'user',
      permissions: ['read', 'write'],
      avatarUrl: userProfile.urlImage
    };
  }

  /**
   * Get current user as AuthUser (for backward compatibility)
   */
  async getCurrentAuthUser(): Promise<AuthUser | null> {
    const userProfile = await this.getCurrentUser();
    if (!userProfile) {
      return null;
    }
    return this.convertUserProfileToAuthUser(userProfile);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return AuthUtils.isAuthenticated();
  }
}

// Export instance for easy access
export const authService = AuthService.getInstance();