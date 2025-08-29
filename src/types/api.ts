import type { AxiosRequestConfig } from 'axios';

/**
 * API Configuration interface
 */
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers?: Record<string, string>;
}

/**
 * API Response wrapper interface
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  statusCode: number;
}

/**
 * API Error interface
 */
export interface ApiError {
  message: string;
  statusCode: number;
  details?: any;
}

/**
 * HTTP Methods enum
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS'
}

/**
 * Request options interface
 */
export interface RequestOptions extends Omit<AxiosRequestConfig, 'method' | 'url'> {
  skipAuth?: boolean;
  retries?: number;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Auth token response interface (legacy)
 */
export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

/**
 * Login request interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Login response interface (new API spec)
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  user: UserInfo;
  accessToken: string;
  tokenType: string;
}

/**
 * User information interface (new API spec)
 */
export interface UserInfo {
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
}

/**
 * Register request interface (new API spec)
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;
}

/**
 * Register response interface (new API spec)
 */
export interface RegisterResponse {
  success: boolean;
  message: string;
  user: UserInfo;
  accessToken: string;
  tokenType: string;
}

/**
 * User authentication data interface (legacy, for backward compatibility)
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  avatarUrl?: string;
}