import axios from 'axios';
import type { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios';
import { AuthUtils } from '../utils/auth';
import { 
  ApiConfig, 
  ApiResponse, 
  ApiError, 
  HttpMethod, 
  RequestOptions,
  PaginationParams,
  PaginatedResponse 
} from '../types/api';

/**
 * Main API Service class with Axios instance and HTTP methods
 * Handles authentication, request/response interceptors, and error handling
 */
export class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;
  private config: ApiConfig;

  private constructor(config?: Partial<ApiConfig>) {
    this.config = {
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config
    };

    this.axiosInstance = this.createAxiosInstance();
    this.setupInterceptors();
  }

  /**
   * Get singleton instance of ApiService
   */
  static getInstance(config?: Partial<ApiConfig>): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService(config);
    }
    return ApiService.instance;
  }

  /**
   * Create and configure Axios instance
   */
  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: this.config.headers,
    });
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Skip auth for specific requests (check custom header)
        if (!config.headers['skip-auth']) {
          const authHeader = AuthUtils.getAuthorizationHeader();
          if (authHeader) {
            config.headers.Authorization = authHeader;
          }
        }
        // Remove the skip-auth header so it doesn't get sent to server
        delete config.headers['skip-auth'];
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor - handle common responses and errors
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Handle and format API errors
   */
  private handleError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      statusCode: 500,
      details: error.response?.data
    };

    if (error.response) {
      // Server responded with error status
      apiError.statusCode = error.response.status;
      apiError.message = this.getErrorMessage(error.response);
    } else if (error.request) {
      // Request made but no response received
      apiError.message = 'Network error - please check your connection';
      apiError.statusCode = 0;
    } else {
      // Something else happened
      apiError.message = error.message || 'Request configuration error';
    }

    return apiError;
  }

  /**
   * Extract error message from response
   */
  private getErrorMessage(response: AxiosResponse): string {
    const data = response.data;
    
    if (typeof data === 'string') {
      return data;
    }
    
    if (data?.message) {
      return data.message;
    }
    
    if (data?.error) {
      return data.error;
    }
    
    // Default error messages by status code
    switch (response.status) {
      case 400:
        return 'Bad request - please check your input';
      case 401:
        return 'Unauthorized - please login again';
      case 403:
        return 'Access forbidden';
      case 404:
        return 'Resource not found';
      case 422:
        return 'Validation error';
      case 500:
        return 'Internal server error';
      default:
        return `Request failed with status ${response.status}`;
    }
  }

  /**
   * Generic request method
   */
  private async request<T>(
    method: HttpMethod,
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      method,
      url,
      ...options
    };

    // Handle skipAuth option
    if (options?.skipAuth) {
      config.headers = {
        ...config.headers,
        'skip-auth': 'true'
      };
    }

    if (data) {
      if (method === HttpMethod.GET) {
        config.params = data;
      } else {
        config.data = data;
      }
    }

    const response = await this.axiosInstance.request<T>(config);
    return response.data;
  }

  // HTTP Method implementations

  /**
   * GET request
   */
  async get<T>(url: string, params?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(HttpMethod.GET, url, params, options);
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(HttpMethod.POST, url, data, options);
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(HttpMethod.PUT, url, data, options);
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, params?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(HttpMethod.DELETE, url, params, options);
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(HttpMethod.PATCH, url, data, options);
  }

  /**
   * HEAD request
   */
  async head(url: string, options?: RequestOptions): Promise<void> {
    await this.request<void>(HttpMethod.HEAD, url, undefined, options);
  }

  /**
   * OPTIONS request
   */
  async options<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(HttpMethod.OPTIONS, url, undefined, options);
  }

  // Convenience methods

  /**
   * GET request with pagination
   */
  async getPaginated<T>(
    url: string, 
    params: PaginationParams = {}, 
    options?: RequestOptions
  ): Promise<PaginatedResponse<T>> {
    const paginationParams = {
      page: 1,
      limit: 10,
      ...params
    };

    return this.get<PaginatedResponse<T>>(url, paginationParams, options);
  }

  /**
   * POST request for file upload
   */
  async uploadFile<T>(
    url: string, 
    file: File, 
    fieldName: string = 'file',
    additionalData?: Record<string, any>,
    options?: RequestOptions
  ): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const uploadOptions: RequestOptions = {
      ...options,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...options?.headers
      }
    };

    return this.post<T>(url, formData, uploadOptions);
  }

  /**
   * Update API configuration
   */
  updateConfig(config: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...config };
    this.axiosInstance.defaults.baseURL = this.config.baseURL;
    this.axiosInstance.defaults.timeout = this.config.timeout;
    
    if (this.config.headers) {
      Object.assign(this.axiosInstance.defaults.headers.common, this.config.headers);
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): ApiConfig {
    return { ...this.config };
  }

  /**
   * Get Axios instance for advanced usage
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Export default instance
export const apiService = ApiService.getInstance();