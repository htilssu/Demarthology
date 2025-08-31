/**
 * UV Index API response interface
 */
export interface UVIndexResponse {
  uv_index: number;
  lat: number;
  lon: number;
  updated_at?: string;
  location_name?: string;
}

/**
 * UV Index request parameters
 */
export interface UVIndexRequest {
  lat: number;
  lon: number;
}

/**
 * Location interface for user position
 */
export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

/**
 * UV Level classification
 */
export type UVLevel = 'Thấp' | 'Trung bình' | 'Cao' | 'Rất cao' | 'Cực cao';

/**
 * UV Index helper functions interface
 */
export interface UVIndexHelpers {
  getUVLevel: (uvIndex: number) => UVLevel;
  getUVColor: (uvIndex: number) => string;
  getUVMessage: (uvIndex: number) => string;
  getUVNote: (uvIndex: number) => string;
}