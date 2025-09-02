import { useState, useCallback } from 'react';

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

export interface UseGeolocationReturn {
  location: GeolocationData | null;
  loading: boolean;
  error: GeolocationError | null;
  getCurrentLocation: () => Promise<GeolocationData>;
  clearError: () => void;
}

/**
 * Custom hook for getting current geolocation
 * Does not depend on UV service or mock data
 */
export const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GeolocationError | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getCurrentLocation = useCallback((): Promise<GeolocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const errorMsg = 'Geolocation is not supported by this browser';
        const geoError: GeolocationError = {
          code: 0,
          message: errorMsg
        };
        setError(geoError);
        reject(geoError);
        return;
      }

      setLoading(true);
      setError(null);

      // Try high accuracy first
      const tryHighAccuracy = () => {
        console.log('🎯 Attempting high accuracy geolocation...');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            const locationData: GeolocationData = {
              latitude,
              longitude,
              accuracy,
              timestamp: Date.now()
            };
            
            console.log(`✅ High accuracy location obtained (accuracy: ${accuracy}m):`, locationData);
            setLocation(locationData);
            setLoading(false);
            resolve(locationData);
          },
          (err) => {
            console.warn('⚠️ High accuracy geolocation failed:', err);
            // Fallback to regular accuracy
            tryRegularAccuracy();
          },
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0 // Always get fresh location
          }
        );
      };

      // Fallback to regular accuracy
      const tryRegularAccuracy = () => {
        console.log('📍 Attempting regular accuracy geolocation...');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            const locationData: GeolocationData = {
              latitude,
              longitude,
              accuracy,
              timestamp: Date.now()
            };
            
            console.log(`✅ Regular accuracy location obtained (accuracy: ${accuracy}m):`, locationData);
            setLocation(locationData);
            setLoading(false);
            resolve(locationData);
          },
          (err) => {
            console.error('❌ All geolocation attempts failed:', err);
            const geoError: GeolocationError = {
              code: err.code,
              message: err.message
            };
            setError(geoError);
            setLoading(false);
            reject(geoError);
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 60000 // Accept 1-minute old data for regular accuracy
          }
        );
      };

      // Start with high accuracy attempt
      tryHighAccuracy();
    });
  }, []);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    clearError
  };
};

export default useGeolocation;