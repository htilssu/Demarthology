import { ApiResponse, ApiError, ApiRequestConfig } from '../types';

// Base API configuration
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Set authorization token for API requests
   */
  setAuthToken(token: string): void {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  /**
   * Remove authorization token
   */
  removeAuthToken(): void {
    delete this.defaultHeaders.Authorization;
  }

  /**
   * Set custom header
   */
  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  /**
   * Make an HTTP request
   */
  private async request<T>(
    endpoint: string,
    config: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      ...this.defaultHeaders,
      ...config.headers,
    };

    const requestOptions: RequestInit = {
      method: config.method,
      headers,
    };

    // Add body for non-GET requests
    if (config.body && config.method !== 'GET') {
      requestOptions.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, requestOptions);
      
      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          message: errorData.message || `HTTP Error: ${response.status}`,
          code: response.status,
          details: errorData,
        };
        throw error;
      }

      // Parse response
      const data = await response.json();
      return data;
    } catch (error) {
      // Handle network or other errors
      if (error instanceof Error) {
        const apiError: ApiError = {
          message: error.message,
          code: 'NETWORK_ERROR',
        };
        throw apiError;
      }
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
    return this.baseURL;
  }

  /**
   * Update API URL (useful for switching environments)
   */
  setBaseURL(url: string): void {
    this.baseURL = url;
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export the class for creating custom instances if needed
export default ApiClient;