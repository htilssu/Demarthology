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
      
      // Validate response has required uv_index field
      if (response && typeof response.uv_index === 'number' && !isNaN(response.uv_index)) {
        return response;
      } else {
        throw new Error('Invalid UV index data received from API');
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch UV index:', error);
      
      // Return mock data as fallback for development
      console.log('⚠️ Using mock UV data as fallback');
      const mockUVIndex = parseFloat((Math.random() * 12).toFixed(1));
      return {
        uv_index: mockUVIndex, 
        lat: params.lat,
        lon: params.lon,
        updated_at: new Date().toISOString(),
        location_name: 'Development Location'
      };
    }
  }

  /**
   * Get current geolocation and fetch UV index
   */
  async getUVIndexForCurrentLocation(): Promise<UVIndexResponse> {
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
            resolve(uvData);
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
            .then(resolve)
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