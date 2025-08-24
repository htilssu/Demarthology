// Example usage of the API client
import { apiClient } from '../utils/api';
import { User, ApiResponse } from '../types';

/**
 * User service - example of how to use the API client
 */
export class UserService {
  /**
   * Get all users
   */
  static async getUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>('/users');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<User> {
    try {
      const response = await apiClient.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new user
   */
  static async createUser(userData: Omit<User, 'id'>): Promise<User> {
    try {
      const response = await apiClient.post<User>('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  static async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(id: string): Promise<void> {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error);
      throw error;
    }
  }
}

/**
 * Example of how to use the API client with authentication
 */
export const authenticateAndFetchUser = async (token: string, userId: string): Promise<User> => {
  // Set auth token
  apiClient.setAuthToken(token);
  
  try {
    const user = await UserService.getUserById(userId);
    return user;
  } catch (error) {
    // Clear token on error
    apiClient.removeAuthToken();
    throw error;
  }
};

/**
 * Example of configuring API client for different environments
 */
export const configureApiForEnvironment = (environment: 'development' | 'staging' | 'production') => {
  const urls = {
    development: 'http://localhost:3001/api',
    staging: 'https://api-staging.example.com/api',
    production: 'https://api.example.com/api',
  };
  
  const url = urls[environment] || urls.development;
  apiClient.setBaseURL(url);
};