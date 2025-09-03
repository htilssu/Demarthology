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
 * User Model from OpenAPI specification
 */
export interface UserModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
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
 * Login response interface - matches actual API response format
 */
export interface LoginResponse extends UserProfile {
  // Login response is directly the user profile object
}

/**
 * User information interface (legacy)
 */
export interface UserInfo {
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
}

/**
 * Register request interface
 */
export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  dateOfBirth: string;
  name: string;
}

/**
 * Register response interface - matches actual API response format
 */
export interface RegisterResponse extends UserProfile {
  // Register response is directly the user profile object
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

/**
 * User profile interface matching the actual API response format
 */
export interface UserProfile {
  _id: string;
  dateOfBirth: string;
  email: string;
  name: string;
  password: string;
  phone: string;
  urlImage: string;
}

/**
 * User update request body for multipart/form-data
 */
export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  avatar?: File;
}

/**
 * Forgot password request interface
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Forgot password response interface
 */
export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}