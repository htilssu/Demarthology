// Export all models from a single file
export * from './User';
export * from './Product';

// Common model types and utilities
export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: any;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;