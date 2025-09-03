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
    name: string;
  }): Promise<RegisterResponse> {
    try {
      // Call real API register endpoint with FormData
      console.log('🔐 Calling real API registration...');
      
      // Create FormData for the registration request
      const formData = new FormData();
      formData.append('email', userData.email);
      formData.append('phone', userData.phone);
      formData.append('password', userData.password);
      formData.append('dateOfBirth', userData.dateOfBirth);
      formData.append('name', userData.name);

      const userProfile = await this.apiService.post<RegisterResponse>('/api/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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
    name: string;
  }): Promise<RegisterResponse> {
    console.log('🛠️ Using development registration mode');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create user profile matching the API format
    const userProfile: RegisterResponse = {
      dateOfBirth: userData.dateOfBirth,
      email: userData.email,
      name: userData.name,
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

  /**
   * Send forgot password request
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Call real API forgot password endpoint
      console.log('🔐 Calling real API forgot password...');
      const response = await this.apiService.get<{ message: string; success: boolean }>(`/api/forgot-password?email=${encodeURIComponent(email)}`);
      
      console.log('✅ Real API forgot password successful');
      return {
        success: true,
        message: response.message || 'Email đặt lại mật khẩu đã được gửi!'
      };
    } catch (error: any) {
      console.log('⚠️ Real API forgot password failed, using development fallback...');
      
      // Development fallback when API is not available
      if (error.statusCode === 0 || error.statusCode === 404 || error.message?.includes('Network Error')) {
        console.log('🔄 Using development forgot password...');
        return this.developmentForgotPassword(email);
      }
      
      // Handle specific API errors
      throw new Error(error.message || 'Gửi email đặt lại mật khẩu thất bại. Vui lòng thử lại.');
    }
  }

  /**
   * Development fallback forgot password
   */
  private async developmentForgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    console.log('🛠️ Using development forgot password mode');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Email không hợp lệ');
    }

    return {
      success: true,
      message: `Email đặt lại mật khẩu đã được gửi đến ${email}. Vui lòng kiểm tra hộp thư của bạn.`
    };
  }
}

// Export instance for easy access
export const authService = AuthService.getInstance();