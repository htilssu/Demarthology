import { ApiService } from '../utils/api';
import { 
  CreateCheckProcessResponse,
  TrackCheckProcessResponse,
  CheckProcessHistory
} from '../models/check-process';

/**
 * Check Process service for handling before-after image comparison
 */
export class CheckProcessService {
  private static instance: CheckProcessService;
  private apiService: ApiService;
  private readonly STORAGE_KEY = 'check_process_history';

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  static getInstance(): CheckProcessService {
    if (!CheckProcessService.instance) {
      CheckProcessService.instance = new CheckProcessService();
    }
    return CheckProcessService.instance;
  }

  /**
   * Step 1: Create check process with initial image
   */
  async createCheckProcess(userId: string, image: File): Promise<CreateCheckProcessResponse> {
    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('image', image);

      const response = await this.apiService.post<CreateCheckProcessResponse>(
        '/api/create-check-process', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('✅ Create check process successful:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Create check process failed:', error);
      throw new Error(error.message || 'Tạo quá trình kiểm tra thất bại. Vui lòng thử lại.');
    }
  }

  /**
   * Step 2: Track check process with follow-up image
   */
  async trackCheckProcess(processId: string, userId: string, image: File): Promise<TrackCheckProcessResponse> {
    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('image', image);

      const response = await this.apiService.post<TrackCheckProcessResponse>(
        `/api/track-check-process/${processId}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('✅ Track check process successful:', response);
      
      // Save to history after successful tracking
      await this.saveToHistory(processId, userId, response);
      
      return response;
    } catch (error: any) {
      console.error('❌ Track check process failed:', error);
      throw new Error(error.message || 'Theo dõi quá trình kiểm tra thất bại. Vui lòng thử lại.');
    }
  }

  /**
   * Save check process result to localStorage history
   */
  private async saveToHistory(
    processId: string, 
    userId: string, 
    comparison: TrackCheckProcessResponse
  ): Promise<void> {
    try {
      const history = this.getHistory();
      
      const historyItem: CheckProcessHistory = {
        id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        processId,
        firstImage: comparison.first_image,
        latestImage: comparison.latest_image,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedHistory = [historyItem, ...history];
      
      // Keep only the last 50 items to prevent localStorage from growing too large
      const limitedHistory = updatedHistory.slice(0, 50);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedHistory));
      console.log('✅ Saved to history:', historyItem);
    } catch (error) {
      console.error('❌ Failed to save to history:', error);
      // Don't throw error here as the main functionality should still work
    }
  }

  /**
   * Get check process history from localStorage
   */
  getHistory(): CheckProcessHistory[] {
    try {
      const historyString = localStorage.getItem(this.STORAGE_KEY);
      if (!historyString) {
        return [];
      }
      
      const history = JSON.parse(historyString) as CheckProcessHistory[];
      return Array.isArray(history) ? history : [];
    } catch (error) {
      console.error('❌ Failed to load history:', error);
      return [];
    }
  }

  /**
   * Get history for a specific user
   */
  getUserHistory(userId: string): CheckProcessHistory[] {
    const allHistory = this.getHistory();
    return allHistory.filter(item => item.userId === userId);
  }

  /**
   * Clear all history
   */
  clearHistory(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('✅ History cleared');
    } catch (error) {
      console.error('❌ Failed to clear history:', error);
    }
  }

  /**
   * Remove a specific history item
   */
  removeHistoryItem(historyId: string): void {
    try {
      const history = this.getHistory();
      const updatedHistory = history.filter(item => item.id !== historyId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedHistory));
      console.log('✅ History item removed:', historyId);
    } catch (error) {
      console.error('❌ Failed to remove history item:', error);
    }
  }
}

// Export instance for easy access
export const checkProcessService = CheckProcessService.getInstance();