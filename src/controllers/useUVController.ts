import { useState, useEffect, useCallback } from 'react';
import { UVService } from '../services/uv';
import { UVIndexResponse, Location, UVLevel } from '../models/uv';

/**
 * UV Controller hook for managing UV index state and operations
 */
export const useUVController = () => {
  const [uvData, setUVData] = useState<UVIndexResponse | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const uvService = UVService.getInstance();

  /**
   * Helper functions for UV level classification
   */
  const getUVLevel = (uvValue: number): UVLevel => {
    if (uvValue <= 2) return "Thấp";
    if (uvValue <= 5) return "Trung bình";
    if (uvValue <= 7) return "Cao";
    if (uvValue <= 10) return "Rất cao";
    return "Cực cao";
  };

  const getUVColor = (uvValue: number): string => {
    if (uvValue <= 2) return "from-green-400 to-green-500";
    if (uvValue <= 5) return "from-yellow-400 to-yellow-500";
    if (uvValue <= 7) return "from-orange-400 to-orange-500";
    if (uvValue <= 10) return "from-red-500 to-red-600";
    return "from-purple-500 to-purple-600";
  };

  const getUVMessage = (uvValue: number): string => {
    if (uvValue <= 2) return "UV thấp, an toàn để ra ngoài.";
    if (uvValue <= 5) return "UV trung bình, cần bảo vệ da khi ra ngoài.";
    if (uvValue <= 7) return "UV cao! Giảm thời gian ngoài trời giữa trưa.";
    if (uvValue <= 10) return "UV rất cao! Tránh ra ngoài, bảo vệ tối đa.";
    return "UV cực cao! Nguy hiểm, tránh ra ngoài hoàn toàn.";
  };

  const getUVNote = (uvValue: number): string => {
    if (uvValue <= 2)
      return "🌿 Thoải mái ra ngoài, nhưng vẫn nên bôi kem chống nắng.";
    if (uvValue <= 5)
      return "🧴 Nên bôi kem chống nắng và đội mũ khi ra ngoài.";
    if (uvValue <= 7)
      return "🕶️ Hạn chế ra ngoài giữa trưa, mặc đồ dài, bôi kem chống nắng.";
    if (uvValue <= 10)
      return "⚠️ Tránh ra ngoài, bảo vệ tối đa: kính, mũ, áo chống nắng.";
    return "🚫 Nguy hiểm! Tránh ra ngoài hoàn toàn, bảo vệ tối đa!";
  };

  /**
   * Fetch UV data for current location using geolocation
   */
  const fetchUVForCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await uvService.getUVIndexForCurrentLocation();
      setUVData(response.uvData);
      
      // Update location state and accuracy
      setLocation({
        latitude: response.location.latitude,
        longitude: response.location.longitude
      });
      
      // Store accuracy if available
      if (response.location.accuracy) {
        setLocationAccuracy(response.location.accuracy);
      }
      
    } catch (err: any) {
      console.error('Error fetching UV for current location:', err);
      setError(err.message || 'Failed to fetch UV data');
    } finally {
      setLoading(false);
    }
  }, [uvService]);

  /**
   * Get fresh location coordinates with improved accuracy
   */
  const refreshLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Refreshing location...');
      const locationData = await uvService.getCurrentLocation();
      
      // Update location state
      setLocation({
        latitude: locationData.latitude,
        longitude: locationData.longitude
      });
      
      // Store accuracy if available
      if (locationData.accuracy) {
        setLocationAccuracy(locationData.accuracy);
        console.log(`📍 Location updated with ${locationData.accuracy}m accuracy`);
      }
      
      // Fetch UV data for the new location
      const uvResponse = await uvService.getUVIndex({ 
        lat: locationData.latitude, 
        lon: locationData.longitude 
      });
      setUVData(uvResponse);
      
    } catch (err: any) {
      console.error('Error refreshing location:', err);
      setError(err.message || 'Failed to refresh location');
    } finally {
      setLoading(false);
    }
  }, [uvService]);

  /**
   * Fetch UV data for specific coordinates
   */
  const fetchUVForLocation = useCallback(async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const uvResponse = await uvService.getUVIndex({ lat, lon });
      setUVData(uvResponse);
      
      // Update location state
      setLocation({
        latitude: lat,
        longitude: lon
      });
      
    } catch (err: any) {
      console.error('Error fetching UV for location:', err);
      setError(err.message || 'Failed to fetch UV data');
    } finally {
      setLoading(false);
    }
  }, [uvService]);

  /**
   * Update location from map interaction
   */
  const updateLocation = useCallback((lat: number, lon: number) => {
    setLocation({
      latitude: lat,
      longitude: lon
    });
    
    // Automatically fetch UV data for new location
    fetchUVForLocation(lat, lon);
  }, [fetchUVForLocation]);

  /**
   * Refresh UV data for current location
   */
  const refreshUVData = useCallback(() => {
    // Clear existing data to show loading state during refresh
    setUVData(null);
    setError(null);
    
    if (location) {
      fetchUVForLocation(location.latitude, location.longitude);
    } else {
      fetchUVForCurrentLocation();
    }
  }, [location, fetchUVForCurrentLocation, fetchUVForLocation]);

  /**
   * Initialize UV data on component mount
   */
  useEffect(() => {
    fetchUVForCurrentLocation();
  }, [fetchUVForCurrentLocation]);

  return {
    // State
    uvData,
    location,
    locationAccuracy,
    loading,
    error,
    
    // Actions
    fetchUVForCurrentLocation,
    fetchUVForLocation,
    updateLocation,
    refreshUVData,
    refreshLocation,
    
    // Helper functions
    getUVLevel,
    getUVColor,
    getUVMessage,
    getUVNote
  };
};