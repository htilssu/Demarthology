import { ApiService } from '../utils/api';
import { 
  LoginCredentials, 
  AuthTokenResponse, 
  LoginResponse,
  RegisterResponse,
  AuthUser,
  UserInfo,
  UserModel
} from '../types/api';
import { AuthUtils } from '../utils/auth';

/**
 * Authentication service - updated to work with actual API endpoints
 * Since the API doesn't have auth endpoints in OpenAPI spec, this simulates auth locally
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
   * Since API doesn't have auth endpoints, simulate local authentication
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate authentication logic
    if (credentials.email && credentials.password) {
      // Generate mock token
      const accessToken = 'mock_token_' + Date.now();
      
      // Create user info
      const userInfo: UserInfo = {
        email: credentials.email,
        firstName: credentials.email.split('@')[0],
        lastName: 'User',
        role: 'user'
      };

      // Store token
      AuthUtils.setAuthToken(accessToken);
      
      // Verify token was stored correctly
      if (!AuthUtils.verifyTokenStorage(accessToken)) {
        throw new Error('Failed to store authentication token in localStorage');
      }

      return {
        success: true,
        message: 'Đăng nhập thành công',
        user: userInfo,
        accessToken,
        tokenType: 'Bearer'
      };
    } else {
      throw new Error('Email hoặc mật khẩu không đúng');
    }
  }

  /**
   * Register new user
   * Simulate registration since API doesn't have auth endpoints
   */
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: string;
  }): Promise<RegisterResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock token
    const accessToken = 'mock_token_' + Date.now();
    
    // Create user info
    const userInfo: UserInfo = {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: 'user'
    };

    // Store token
    AuthUtils.setAuthToken(accessToken);
    
    return {
      success: true,
      message: 'Đăng ký thành công',
      user: userInfo,
      accessToken,
      tokenType: 'Bearer'
    };
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // In a real app, you would call API logout endpoint
      // await this.apiService.post('/auth/logout');
      
      // For now, just simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      // Continue with local logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      AuthUtils.clearTokens();
    }
  }

  /**
   * Convert UserInfo to AuthUser for backward compatibility
   */
  private convertUserInfoToAuthUser(userInfo: UserInfo): AuthUser {
    return {
      id: 'user-' + Date.now(),
      email: userInfo.email,
      name: `${userInfo.firstName} ${userInfo.lastName}`,
      role: userInfo.role || 'user',
      permissions: ['read', 'write'],
      avatarUrl: '/avatar.webp'
    };
  }

  /**
   * Convert UserModel to AuthUser for backward compatibility
   */
  private convertUserModelToAuthUser(userModel: UserModel): AuthUser {
    return {
      id: userModel.id,
      email: userModel.email,
      name: `${userModel.firstName} ${userModel.lastName}`,
      role: userModel.role || 'user',
      permissions: ['read', 'write'],
      avatarUrl: userModel.avatar || '/avatar.webp'
    };
  }

  /**
   * Get current user profile - uses actual API endpoint from OpenAPI spec
   */
  async getCurrentUser(): Promise<AuthUser> {
    try {
      // Try to get from saved user first
      const savedUser = AuthUtils.getUser();
      if (savedUser) {
        return savedUser;
      }

      // If no saved user, try to get from API
      // Note: The API requires user_id but we don't know it without being logged in
      // This is a limitation of the current API design
      // For now, return a default user if token exists
      if (AuthUtils.isAuthenticated()) {
        const defaultUser: AuthUser = {
          id: 'user-' + Date.now(),
          email: 'user@demarthology.com',
          name: 'Current User',
          role: 'user',
          permissions: ['read', 'write'],
          avatarUrl: '/avatar.webp'
        };
        return defaultUser;
      }

      throw new Error('User not authenticated');
    } catch (error) {
      throw new Error('Failed to get current user');
    }
  }

  /**
   * Get user by ID - uses actual API endpoint from OpenAPI spec
   */
  async getUserById(userId: string): Promise<AuthUser> {
    const userModel = await this.apiService.get<UserModel>(`/api/users/${userId}`);
    return this.convertUserModelToAuthUser(userModel);
  }

  /**
   * Update user profile - uses actual API endpoint from OpenAPI spec
   */
  async updateProfile(userId: string, profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    avatar?: File;
  }): Promise<AuthUser> {
    // If avatar is included, use multipart/form-data
    if (profileData.avatar) {
      const formData = new FormData();
      if (profileData.firstName) formData.append('firstName', profileData.firstName);
      if (profileData.lastName) formData.append('lastName', profileData.lastName);
      if (profileData.email) formData.append('email', profileData.email);
      if (profileData.role) formData.append('role', profileData.role);
      formData.append('avatar', profileData.avatar);

      const userModel = await this.apiService.put<UserModel>(
        `/api/users/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return this.convertUserModelToAuthUser(userModel);
    } else {
      // Use JSON for non-file updates
      const userModel = await this.apiService.put<UserModel>(
        `/api/users/${userId}`,
        profileData
      );
      return this.convertUserModelToAuthUser(userModel);
    }
  }

  /**
   * Refresh authentication token - simulate since no API endpoint
   */
  async refreshToken(): Promise<AuthTokenResponse> {
    const refreshToken = AuthUtils.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTokens: AuthTokenResponse = {
      accessToken: 'refreshed_token_' + Date.now(),
      refreshToken: 'refresh_token_' + Date.now(),
      expiresIn: 3600,
      tokenType: 'Bearer'
    };

    // Update stored tokens
    AuthUtils.setAuthToken(newTokens.accessToken);
    AuthUtils.setRefreshToken(newTokens.refreshToken);

    return newTokens;
  }

  /**
   * Change user password - simulate since no API endpoint
   */
  async changePassword(passwords: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would validate current password
    // and update it in the backend
    console.log('Password change simulated');
  }
}

/**
 * User management service - uses actual API endpoints from OpenAPI spec
 */
export class UserService {
  private static instance: UserService;
  private apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Get all users - uses actual API endpoint from OpenAPI spec
   */
  async getUsers(): Promise<UserModel[]> {
    return this.apiService.get<UserModel[]>('/api/users');
  }

  /**
   * Get user by ID - uses actual API endpoint from OpenAPI spec
   */
  async getUserById(id: string): Promise<UserModel> {
    return this.apiService.get<UserModel>(`/api/users/${id}`);
  }

  /**
   * Update user - uses actual API endpoint from OpenAPI spec
   */
  async updateUser(id: string, userData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    avatar?: File;
  }): Promise<UserModel> {
    // If avatar is included, use multipart/form-data
    if (userData.avatar) {
      const formData = new FormData();
      if (userData.firstName) formData.append('firstName', userData.firstName);
      if (userData.lastName) formData.append('lastName', userData.lastName);
      if (userData.email) formData.append('email', userData.email);
      if (userData.role) formData.append('role', userData.role);
      formData.append('avatar', userData.avatar);

      return this.apiService.put<UserModel>(`/api/users/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {
      return this.apiService.put<UserModel>(`/api/users/${id}`, userData);
    }
  }

  /**
   * Upload user avatar - convenience method
   */
  async uploadAvatar(userId: string, avatarFile: File): Promise<UserModel> {
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    return this.apiService.put<UserModel>(`/api/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
}

// Export instances for easy access
export const authService = AuthService.getInstance();
export const userService = UserService.getInstance();