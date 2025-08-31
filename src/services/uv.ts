import { ApiService } from '../utils/api';
import { UVIndexResponse, UVIndexRequest } from '../models/uv';

/**
 * UV Index service for handling UV-related API calls
 */
export class UVService {
  private static instance: UVService;
  private apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  static getInstance(): UVService {
    if (!UVService.instance) {
      UVService.instance = new UVService();
    }
    return UVService.instance;
  }

  /**
   * Fetch UV index data for given coordinates
   */
  async getUVIndex(params: UVIndexRequest): Promise<UVIndexResponse> {
    try {
      console.log('🌞 Fetching UV index for coordinates:', params);
      
      const response = await this.apiService.get<UVIndexResponse>(
        `/api/uv-index?lat=${params.lat}&lon=${params.lon}`
      );

      console.log('✅ UV index data received:', response);
      
      // Validate response has required uv_value field
      if (response && typeof response.uv_value === 'number' && !isNaN(response.uv_value)) {
        return response;
      } else {
        throw new Error('Invalid UV index data received from API');
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch UV index:', error);
      
      // Return mock data as fallback for development
      console.log('⚠️ Using mock UV data as fallback');
      const mockUVValue = parseFloat((Math.random() * 12).toFixed(1));
      return {
        uv_value: mockUVValue,
        message: mockUVValue <= 2 ? "🟢 UV thấp, an toàn để ra ngoài." :
                 mockUVValue <= 5 ? "🟡 UV trung bình, cần bảo vệ da khi ra ngoài." :
                 mockUVValue <= 7 ? "🟠 UV cao! Giảm thời gian ngoài trời giữa trưa." :
                 mockUVValue <= 10 ? "🔴 UV rất cao! Tránh ra ngoài, bảo vệ tối đa." :
                 "🟣 UV cực kỳ nguy hiểm! Tránh ra ngoài và mặc kín toàn thân.",
        level_uv: mockUVValue <= 2 ? "Thấp" :
                  mockUVValue <= 5 ? "Trung bình" :
                  mockUVValue <= 7 ? "Cao" :
                  mockUVValue <= 10 ? "Rất cao" :
                  "Nguy hiểm"
      };
    }
  }

  /**
   * Get current geolocation and fetch UV index
   */
  async getUVIndexForCurrentLocation(): Promise<{uvData: UVIndexResponse, location: {lat: number, lon: number}}> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const uvData = await this.getUVIndex({ lat: latitude, lon: longitude });
            resolve({
              uvData,
              location: { lat: latitude, lon: longitude }
            });
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          
          // Fallback to default coordinates (Ho Chi Minh City)
          const defaultCoords = { lat: 10.7769, lon: 106.7009 };
          console.log('Using default coordinates:', defaultCoords);
          
          this.getUVIndex(defaultCoords)
            .then(uvData => resolve({
              uvData,
              location: defaultCoords
            }))
            .catch(reject);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }
}