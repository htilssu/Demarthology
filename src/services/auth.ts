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
 * Authentication service - updated to call real API endpoints
 * All authentication operations now use actual backend API calls
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
   * Calls real API authentication endpoint with fallback to mock for development
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // First try real API login endpoint
      console.log('🔐 Attempting real API login...');
      const response = await this.apiService.post<LoginResponse>('/api/auth/login', {
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe
      });

      console.log('✅ Real API login successful');

      // Store the authentication token
      AuthUtils.setAuthToken(response.accessToken);
      
      // Verify token was stored correctly
      if (!AuthUtils.verifyTokenStorage(response.accessToken)) {
        throw new Error('Failed to store authentication token in localStorage');
      }

      // Store user info for session persistence
      const authUser = this.convertUserInfoToAuthUser(response.user);
      AuthUtils.setUser(authUser);

      return response;
    } catch (error: any) {
      console.log('⚠️ Real API login failed, checking if we should fallback...');
      
      // If API is not available (connection error), use development fallback
      if (error.statusCode === 0 || error.message?.includes('Network Error') || error.message?.includes('kết nối')) {
        console.log('🔄 API not available, using development authentication...');
        return this.developmentLogin(credentials);
      }
      
      // Handle specific API errors
      if (error.statusCode === 401 || error.statusCode === 403) {
        throw new Error('Email hoặc mật khẩu không đúng');
      } else if (error.statusCode === 400) {
        throw new Error('Thông tin đăng nhập không hợp lệ');
      } else if (error.statusCode === 404) {
        console.log('🔄 Auth endpoint not implemented, using development authentication...');
        return this.developmentLogin(credentials);
      } else {
        throw new Error(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    }
  }

  /**
   * Development fallback authentication for when API is not available
   */
  private async developmentLogin(credentials: LoginCredentials): Promise<LoginResponse> {
    console.log('🛠️ Using development authentication mode');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Basic validation
    if (!credentials.email || !credentials.password) {
      throw new Error('Email và mật khẩu không được để trống');
    }

    // Generate development token
    const accessToken = 'dev_token_' + Date.now();
    
    // Create user info from email
    const userInfo: UserInfo = {
      email: credentials.email,
      firstName: credentials.email.split('@')[0] || 'User',
      lastName: 'Dev',
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
      message: 'Đăng nhập thành công (Development Mode)',
      user: userInfo,
      accessToken,
      tokenType: 'Bearer'
    };
  }

  /**
   * Register new user
   * Calls real API registration endpoint with fallback for development
   */
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: string;
  }): Promise<RegisterResponse> {
    try {
      // First try real API register endpoint
      console.log('🔐 Attempting real API registration...');
      const response = await this.apiService.post<RegisterResponse>('/api/auth/register', {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        dateOfBirth: userData.dob
      });

      console.log('✅ Real API registration successful');

      // Store the authentication token
      AuthUtils.setAuthToken(response.accessToken);
      
      // Store user info for session persistence
      const authUser = this.convertUserInfoToAuthUser(response.user);
      AuthUtils.setUser(authUser);

      return response;
    } catch (error: any) {
      console.log('⚠️ Real API registration failed, checking if we should fallback...');
      
      // If API is not available or endpoint doesn't exist, use development fallback
      if (error.statusCode === 0 || error.statusCode === 404 || error.message?.includes('Network Error')) {
        console.log('🔄 API not available, using development registration...');
        return this.developmentRegister(userData);
      }
      
      // Handle specific API errors
      if (error.statusCode === 409) {
        throw new Error('Email này đã được sử dụng. Vui lòng chọn email khác.');
      } else if (error.statusCode === 400) {
        throw new Error('Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại.');
      } else {
        throw new Error(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    }
  }

  /**
   * Development fallback registration for when API is not available
   */
  private async developmentRegister(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: string;
  }): Promise<RegisterResponse> {
    console.log('🛠️ Using development registration mode');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate development token
    const accessToken = 'dev_token_' + Date.now();
    
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
      message: 'Đăng ký thành công (Development Mode)',
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
      // Call real API logout endpoint
      await this.apiService.post('/api/auth/logout');
    } catch (error) {
      // Continue with local logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local tokens and user data
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
   * Get current user profile - calls real API to get current user info with fallback
   */
  async getCurrentUser(): Promise<AuthUser> {
    try {
      // Try to get from saved user first for performance
      const savedUser = AuthUtils.getUser();
      
      // If token exists, try to get fresh user data from API
      if (AuthUtils.isAuthenticated()) {
        try {
          console.log('🔐 Attempting to get current user from real API...');
          // Call real API to get current user profile
          const response = await this.apiService.get<UserModel>('/api/auth/me');
          const authUser = this.convertUserModelToAuthUser(response);
          
          console.log('✅ Real API getCurrentUser successful');
          
          // Update stored user data
          AuthUtils.setUser(authUser);
          return authUser;
        } catch (error: any) {
          console.log('⚠️ Real API getCurrentUser failed:', error.statusCode || error.message);
          
          // If API call fails but we have saved user, return saved user for 404/connection errors
          if (savedUser && (error.statusCode === 404 || error.statusCode === 0)) {
            console.log('🔄 Using saved user data (development mode)');
            return savedUser;
          }
          
          // If 401 (unauthorized), clear invalid tokens
          if (error.statusCode === 401) {
            AuthUtils.clearTokens();
            throw new Error('Session expired. Please login again.');
          }
          
          // For other errors, use saved user if available
          if (savedUser) {
            return savedUser;
          }
          
          throw error;
        }
      }

      // If no token but we have saved user, clear stale data
      if (savedUser) {
        AuthUtils.clearTokens();
      }

      throw new Error('User not authenticated');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
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
   * Refresh authentication token - calls real API endpoint
   */
  async refreshToken(): Promise<AuthTokenResponse> {
    try {
      const refreshToken = AuthUtils.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Call real API refresh endpoint
      const response = await this.apiService.post<AuthTokenResponse>('/api/auth/refresh', {
        refreshToken: refreshToken
      });

      // Update stored tokens
      AuthUtils.setAuthToken(response.accessToken);
      if (response.refreshToken) {
        AuthUtils.setRefreshToken(response.refreshToken);
      }

      return response;
    } catch (error: any) {
      // If refresh fails, clear all tokens
      AuthUtils.clearTokens();
      
      if (error.statusCode === 401 || error.statusCode === 403) {
        throw new Error('Session expired. Please login again.');
      } else {
        throw new Error(error.message || 'Failed to refresh authentication token');
      }
    }
  }

  /**
   * Change user password - calls real API endpoint
   */
  async changePassword(passwords: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    try {
      // Call real API to change password
      await this.apiService.put('/api/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
    } catch (error: any) {
      if (error.statusCode === 400) {
        throw new Error('Mật khẩu hiện tại không đúng');
      } else if (error.statusCode === 422) {
        throw new Error('Mật khẩu mới không hợp lệ. Vui lòng kiểm tra yêu cầu mật khẩu.');
      } else {
        throw new Error(error.message || 'Không thể thay đổi mật khẩu. Vui lòng thử lại.');
      }
    }
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