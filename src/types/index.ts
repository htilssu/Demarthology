// Common types for the application
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationParams;
}

// API Error types
export interface ApiError {
  message: string;
  code?: string | number;
  details?: any;
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API Request configuration
export interface ApiRequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
}

// Re-export model types for convenience
export * from '../models'; 