import { useState, useEffect, useCallback } from 'react';
import { UVService } from '../services/uv';
import { UVIndexResponse, Location, UVLevel } from '../models/uv';

/**
 * UV Controller hook for managing UV index state and operations
 */
export const useUVController = () => {
  const [uvData, setUVData] = useState<UVIndexResponse | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const uvService = UVService.getInstance();

  /**
   * Helper functions for UV level classification
   */
  const getUVLevel = (uvIndex: number): UVLevel => {
    if (uvIndex <= 2) return "Thấp";
    if (uvIndex <= 5) return "Trung bình";
    if (uvIndex <= 7) return "Cao";
    if (uvIndex <= 10) return "Rất cao";
    return "Cực cao";
  };

  const getUVColor = (uvIndex: number): string => {
    if (uvIndex <= 2) return "from-green-400 to-green-500";
    if (uvIndex <= 5) return "from-yellow-400 to-yellow-500";
    if (uvIndex <= 7) return "from-orange-400 to-orange-500";
    if (uvIndex <= 10) return "from-red-500 to-red-600";
    return "from-purple-500 to-purple-600";
  };

  const getUVMessage = (uvIndex: number): string => {
    if (uvIndex <= 2) return "UV thấp, an toàn để ra ngoài.";
    if (uvIndex <= 5) return "UV trung bình, cần bảo vệ da khi ra ngoài.";
    if (uvIndex <= 7) return "UV cao! Giảm thời gian ngoài trời giữa trưa.";
    if (uvIndex <= 10) return "UV rất cao! Tránh ra ngoài, bảo vệ tối đa.";
    return "UV cực cao! Nguy hiểm, tránh ra ngoài hoàn toàn.";
  };

  const getUVNote = (uvIndex: number): string => {
    if (uvIndex <= 2)
      return "🌿 Thoải mái ra ngoài, nhưng vẫn nên bôi kem chống nắng.";
    if (uvIndex <= 5)
      return "🧴 Nên bôi kem chống nắng và đội mũ khi ra ngoài.";
    if (uvIndex <= 7)
      return "🕶️ Hạn chế ra ngoài giữa trưa, mặc đồ dài, bôi kem chống nắng.";
    if (uvIndex <= 10)
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
      
      const uvResponse = await uvService.getUVIndexForCurrentLocation();
      setUVData(uvResponse);
      
      // Update location state
      setLocation({
        latitude: uvResponse.lat,
        longitude: uvResponse.lon
      });
      
    } catch (err: any) {
      console.error('Error fetching UV for current location:', err);
      setError(err.message || 'Failed to fetch UV data');
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
    loading,
    error,
    
    // Actions
    fetchUVForCurrentLocation,
    fetchUVForLocation,
    updateLocation,
    refreshUVData,
    
    // Helper functions
    getUVLevel,
    getUVColor,
    getUVMessage,
    getUVNote
  };
};