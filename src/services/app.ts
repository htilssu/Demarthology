import { AppInfo, AppStats } from '../models/app';
import { ApiService } from '../utils/api';
import { ApiResponse } from '../types/api';

export class AppService {
  private static instance: AppService;
  private apiService: ApiService;
  
  private constructor() {
    this.apiService = ApiService.getInstance();
  }
  
  static getInstance(): AppService {
    if (!AppService.instance) {
      AppService.instance = new AppService();
    }
    return AppService.instance;
  }

  async getAppInfo(): Promise<AppInfo> {
    const response = await this.apiService.get<ApiResponse<AppInfo>>(
      '/app/info',
      {},
      { skipAuth: true } // Public endpoint
    );
    return response.data;
  }

  async getStats(): Promise<AppStats> {
    const response = await this.apiService.get<ApiResponse<AppStats>>(
      '/app/stats',
      {},
      { skipAuth: true }
    );
    return response.data;
  }

  /**
   * Update app configuration via API
   */
  async updateAppConfig(config: Partial<AppInfo>): Promise<AppInfo> {
    const response = await this.apiService.put<ApiResponse<AppInfo>>('/app/config', config);
    return response.data;
  }

  /**
   * Get app health status
   */
  async getHealthStatus(): Promise<{ status: string; timestamp: string; version: string }> {
    const response = await this.apiService.get<ApiResponse<{
      status: string;
      timestamp: string;
      version: string;
    }>>('/app/health', {}, { skipAuth: true });
    return response.data;
  }
}
