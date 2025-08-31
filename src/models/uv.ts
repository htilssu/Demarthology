/**
 * UV Index API response interface (matches actual backend format)
 */
export interface UVIndexResponse {
  message: string;
  uv_value: number;
  level_uv: string;
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