import axios from 'axios';
import { ApiResponse, ApiError, ApiRequestConfig } from '../types';

// Base API configuration
class ApiClient {
  private axiosInstance: any; // Using any for the instance type to avoid type conflicts

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Setup response interceptor for consistent error handling
    this.axiosInstance.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message,
          code: error.response?.status || 'NETWORK_ERROR',
          details: error.response?.data,
        };
        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Set authorization token for API requests
   */
  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove authorization token
   */
  removeAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  /**
   * Set custom header
   */
  setHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  /**
   * Make an HTTP request
   */
  private async request<T>(
    endpoint: string,
    config: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const axiosConfig: any = {
      method: config.method,
      url: endpoint,
      headers: config.headers,
    };

    // Add data for non-GET requests
    if (config.body && config.method !== 'GET') {
      axiosConfig.data = config.body;
    }

    try {
      const response = await this.axiosInstance.request(axiosConfig);
      return response.data;
    } catch (error) {
      // Error is already processed by the interceptor
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body,
      headers,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body,
      headers,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body,
      headers,
    });
  }

  /**
   * Get current API URL
   */
  getBaseURL(): string {
    return this.axiosInstance.defaults.baseURL || '';
  }

  /**
   * Update API URL (useful for switching environments)
   */
  setBaseURL(url: string): void {
    this.axiosInstance.defaults.baseURL = url;
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export the class for creating custom instances if needed
export default ApiClient;