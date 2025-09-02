import { useState, useEffect } from "react";
import { apiService } from "../utils/api";
import { UVService } from "../services/uv";
import type { Location } from "../models/uv";

export interface Hospital {
  id?: string;
  address: string;
  hospitalDescription: string;
  img: string;
  name: string;
  phone: string;
  rate: number;
  region: string;
  specialties: string[];
  yearEstablished: number;
}

export interface HospitalDetail extends Hospital {
  // Có thể có thêm fields khi lấy detail
}

function useHospitalController() {
  // State
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<HospitalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "name">("rating");

  // Computed values
  const regions = ["All", ...Array.from(new Set(hospitals.map(h => h.region)))];
  const specialties = ["All", ...Array.from(new Set(hospitals.flatMap(h => h.specialties)))];

  // API calls
  const fetchHospitals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching hospitals from API...");
      const data = await apiService.get<Hospital[]>('/api/legit-hospitals');
      const hospitalsData = Array.isArray(data) ? data : [];
      
      // Add id if not provided (using index as fallback)
      const hospitalsWithId = hospitalsData.map((hospital, index) => ({
        ...hospital,
        id: hospital.id || `hospital_${index}`
      }));
      
      setHospitals(hospitalsWithId);
      setFilteredHospitals(hospitalsWithId);
      console.log(`✅ Loaded ${hospitalsWithId.length} hospitals`);
    } catch (err) {
      const errorMessage = `Không thể tải danh sách bệnh viện: ${
        err instanceof Error ? err.message : "Unknown error"
      }`;
      setError(errorMessage);
      console.error("❌ Failed to fetch hospitals:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyHospitals = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching nearby hospitals for location: ${lat}, ${lng}`);
      
      // Try different parameter formats to match API expectation
      const url = `/api/hospital`;
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString()
      });
      
      console.log(`API URL: ${url}?${params.toString()}`);
      
      let data;
      try {
        // First try: using apiService.get with params as second argument
        data = await apiService.get<Array<{name: string, address: string}>>(url, { lat, lng });
      } catch (firstError) {
        console.warn('First attempt failed, trying direct URL format:', firstError);
        
        // Second try: direct query params in URL
        try {
          data = await apiService.get<Array<{name: string, address: string}>>(`${url}?${params.toString()}`);
        } catch (secondError) {
          console.warn('Second attempt failed, trying POST method:', secondError);
          
          // Third try: POST method if GET doesn't work
          data = await apiService.post<Array<{name: string, address: string}>>(url, {
            lat,
            lng
          });
        }
      }
      
      console.log('API Response:', data);
      
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format");
      }
      
      // Transform nearby hospitals to match our Hospital interface
      const nearbyHospitals: Hospital[] = data.map((hospital, index) => ({
        id: `nearby_${index}`,
        name: hospital.name,
        address: hospital.address,
        hospitalDescription: "Bệnh viện gần vị trí của bạn",
        img: "", // No image from this endpoint
        phone: "Liên hệ để biết thêm thông tin",
        rate: 4.0, // Default rating
        region: hospital.address.includes("Hồ Chí Minh") ? "Miền Nam" : "Miền Trung",
        specialties: ["Da liễu", "Khám tổng quát"], // Default specialties
        yearEstablished: 2000 // Default year
      }));
      
      setHospitals(nearbyHospitals);
      setFilteredHospitals(nearbyHospitals);
      console.log(`✅ Loaded ${nearbyHospitals.length} nearby hospitals`);
    } catch (err) {
      const errorMessage = `Không thể tìm bệnh viện gần bạn: ${
        err instanceof Error ? err.message : "Unknown error"
      }`;
      setError(errorMessage);
      console.error("❌ Failed to fetch nearby hospitals:", err);
      
      // Fallback to regular hospitals if nearby search fails
      await fetchHospitals();
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitalDetail = async (hospitalId: string) => {
    try {
      setDetailLoading(true);
      console.log(`Fetching hospital detail for ID: ${hospitalId}`);
      
      const data = await apiService.get<HospitalDetail>(`/api/legit-hospital/${hospitalId}`);
      setSelectedHospital(data);
      console.log("✅ Hospital detail loaded:", data);
    } catch (err) {
      const errorMessage = `Không thể tải thông tin chi tiết bệnh viện: ${
        err instanceof Error ? err.message : "Unknown error"
      }`;
      setError(errorMessage);
      console.error("❌ Failed to fetch hospital detail:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  // Get user location for distance calculation
  const getUserLocation = async () => {
    try {
      const uvService = UVService.getInstance();
      const location = await uvService.getCurrentLocation();
      setUserLocation(location);
      console.log("✅ User location obtained:", location);
    } catch (err) {
      console.warn("⚠️ Could not get user location:", err);
    }
  };

  // Distance calculation (simple Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filter and sort logic
  const applyFilters = () => {
    let filtered = [...hospitals];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(hospital => 
        hospital.name.toLowerCase().includes(query) ||
        hospital.address.toLowerCase().includes(query) ||
        hospital.region.toLowerCase().includes(query) ||
        hospital.hospitalDescription.toLowerCase().includes(query) ||
        hospital.specialties.some(spec => spec.toLowerCase().includes(query))
      );
    }
    
    // Apply region filter
    if (selectedRegion !== "All") {
      filtered = filtered.filter(hospital => hospital.region === selectedRegion);
    }
    
    // Apply specialty filter
    if (selectedSpecialty !== "All") {
      filtered = filtered.filter(hospital => hospital.specialties.includes(selectedSpecialty));
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rate - a.rate;
        case "name":
          return a.name.localeCompare(b.name);
        case "distance":
          if (userLocation) {
            // For distance sorting, we would need lat/lng from hospital data
            // For now, sort by name as fallback
            return a.name.localeCompare(b.name);
          }
          return b.rate - a.rate;
        default:
          return b.rate - a.rate;
      }
    });
    
    setFilteredHospitals(filtered);
  };

  // Event handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
  };

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialty(specialty);
  };

  const handleSortChange = (sort: "rating" | "distance" | "name") => {
    setSortBy(sort);
  };

  const openHospitalDetail = (hospitalId: string) => {
    fetchHospitalDetail(hospitalId);
  };

  const closeHospitalDetail = () => {
    setSelectedHospital(null);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRegion("All");
    setSelectedSpecialty("All");
    setSortBy("rating");
  };

  // Effects
  useEffect(() => {
    fetchHospitals();
    getUserLocation();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedRegion, selectedSpecialty, sortBy, hospitals]);

  return {
    // Data
    hospitals: filteredHospitals,
    allHospitals: hospitals,
    selectedHospital,
    userLocation,
    
    // Filter data
    regions,
    specialties,
    searchQuery,
    selectedRegion,
    selectedSpecialty,
    sortBy,
    
    // States
    loading,
    detailLoading,
    error,
    
    // Event handlers
    handleSearchChange,
    handleRegionChange,
    handleSpecialtyChange,
    handleSortChange,
    openHospitalDetail,
    closeHospitalDetail,
    clearFilters,
    
    // Actions
    refetch: fetchHospitals,
    fetchNearbyHospitals,
  };
}

export default useHospitalController;
