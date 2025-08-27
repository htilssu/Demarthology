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
    try {
      // Try to get from API first
      const response = await this.apiService.get<ApiResponse<AppInfo>>(
        '/app/info',
        {},
        { skipAuth: true } // Public endpoint
      );
      return response.data;
    } catch (error) {
      // Fallback to mock data if API is not available
      console.warn('API not available, using mock data:', error);
      return this.getMockAppInfo();
    }
  }

  async getStats(): Promise<AppStats> {
    try {
      // Try to get from API first
      const response = await this.apiService.get<ApiResponse<AppStats>>(
        '/app/stats',
        {},
        { skipAuth: true }
      );
      return response.data;
    } catch (error) {
      // Fallback to getting stats from app info
      console.warn('Stats API not available, calculating from app info');
      const appInfo = await this.getAppInfo();
      return appInfo.stats;
    }
  }

  /**
   * Get mock app info for development/fallback
   */
  private getMockAppInfo(): Promise<AppInfo> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: 'Demarthology App',
          version: '1.0.0',
          description: 'A dermatology application with React TypeScript and modern API architecture',
          stats: {
            components: 8,
            routes: 6,
            services: 4,
            models: 3
          }
        });
      }, 500);
    });
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
