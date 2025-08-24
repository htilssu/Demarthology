// User Service - Controller layer for user-related API operations
import { apiClient } from '../utils/api';
import { 
  User, 
  UserModel, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UserListParams, 
  ListResponse 
} from '../models';

export class UserService {
  private static instance: UserService;
  private readonly baseEndpoint = '/users';

  // Singleton pattern
  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Get all users with optional filtering and pagination
   */
  async getUsers(params: UserListParams = {}): Promise<ListResponse<User>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.role) queryParams.append('role', params.role);
      if (params.search) queryParams.append('search', params.search);
      if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

      const queryString = queryParams.toString();
      const endpoint = queryString ? `${this.baseEndpoint}?${queryString}` : this.baseEndpoint;
      
      const response = await apiClient.get<ListResponse<User>>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }

  /**
   * Get a single user by ID
   */
  async getUserById(id: string): Promise<UserModel> {
    try {
      const response = await apiClient.get<User>(`${this.baseEndpoint}/${id}`);
      return new UserModel(response.data);
    } catch (error) {
      console.error(`Failed to fetch user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserRequest): Promise<UserModel> {
    try {
      // Validate request data
      const validationErrors = UserModel.validateCreateRequest(userData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      const response = await apiClient.post<User>(this.baseEndpoint, userData);
      return new UserModel(response.data);
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  /**
   * Update an existing user
   */
  async updateUser(id: string, updates: UpdateUserRequest): Promise<UserModel> {
    try {
      // Validate email and username if they're being updated
      if (updates.email && !UserModel.validateEmail(updates.email)) {
        throw new Error('Invalid email address');
      }
      if (updates.username && !UserModel.validateUsername(updates.username)) {
        throw new Error('Invalid username format');
      }

      const response = await apiClient.put<User>(`${this.baseEndpoint}/${id}`, updates);
      return new UserModel(response.data);
    } catch (error) {
      console.error(`Failed to update user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      console.error(`Failed to delete user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deactivate a user (soft delete)
   */
  async deactivateUser(id: string): Promise<UserModel> {
    try {
      const response = await apiClient.patch<User>(`${this.baseEndpoint}/${id}/deactivate`);
      return new UserModel(response.data);
    } catch (error) {
      console.error(`Failed to deactivate user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Activate a user
   */
  async activateUser(id: string): Promise<UserModel> {
    try {
      const response = await apiClient.patch<User>(`${this.baseEndpoint}/${id}/activate`);
      return new UserModel(response.data);
    } catch (error) {
      console.error(`Failed to activate user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search users by username or email
   */
  async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    try {
      const response = await apiClient.get<ListResponse<User>>(
        `${this.baseEndpoint}/search?q=${encodeURIComponent(query)}&limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to search users:', error);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<UserModel> {
    try {
      const response = await apiClient.get<User>('/auth/profile');
      return new UserModel(response.data);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      throw error;
    }
  }

  /**
   * Update current user profile
   */
  async updateCurrentUser(updates: UpdateUserRequest): Promise<UserModel> {
    try {
      const response = await apiClient.put<User>('/auth/profile', updates);
      return new UserModel(response.data);
    } catch (error) {
      console.error('Failed to update current user:', error);
      throw error;
    }
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(id: string, file: File): Promise<UserModel> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post<User>(
        `${this.baseEndpoint}/${id}/avatar`,
        formData,
        { 'Content-Type': 'multipart/form-data' }
      );
      return new UserModel(response.data);
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const userService = UserService.getInstance();