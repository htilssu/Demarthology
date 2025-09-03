import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HospitalIcon } from "lucide-react";
import useHospitalController, { Hospital as APIHospital } from "../controllers/useHospitalController";
import { ApiService } from "../utils/api";

interface Hospital {
  id: string;
  name: string;
  city: string;
  address: string;
  rating: number;
  specialties: string[];
  phone?: string;
  hours?: string;
  image?: string;
}

const HospitalCard: React.FC<{
  hospital: Hospital;
  onOpen: (h: Hospital) => void;
}> = ({ hospital, onOpen }) => {
  return (
    <motion.article
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 group"
    >
      {/* Header with image */}
      <div className="h-36 relative">
        {hospital.image ? (
          <img
            src={hospital.image}
            alt={hospital.name}
            className="h-full w-full object-contain bg-gray-50"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-tr from-sky-100 to-cyan-100">
            <HospitalIcon className="w-10 h-10 text-cyan-600" />
          </div>
        )}
        <div className="absolute top-3 right-3 text-sm bg-white/90 px-3 py-1 rounded-full shadow font-medium text-slate-700">
          ⭐ {hospital.rating.toFixed(1)}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{hospital.name}</h3>
        <p className="text-sm text-slate-500">{hospital.address}</p>

        <div className="flex items-center justify-between text-sm text-[#145566]">
          <div>🕑 {hospital.hours}</div>
          <a
            href={`tel:${hospital.phone}`}
            className="text-cyan-600 underline font-medium hover:text-cyan-800"
          >
            {hospital.phone}
          </a>
        </div>

        <button
          onClick={() => onOpen(hospital)}
          className="mt-2 w-full py-2 rounded-xl text-sm font-medium bg-[#145566] text-white shadow hover:opacity-95 transition"
        >
          Xem chi tiết
        </button>
      </div>
    </motion.article>
  );
};

// Helper function to parse and format specialties
const parseSpecialties = (specialties: string[]): string[] => {
  const allSpecialties: string[] = [];
  
  specialties.forEach(specialty => {
    // Split by comma and clean up each item
    const items = specialty.split(',').map(item => item.trim());
    items.forEach(item => {
      if (item) {
        // Remove extra parentheses content for cleaner display but keep main info
        let cleanItem = item;
        
        // Handle cases like "Ung thư biểu mô tế bào vảy (SCC)" -> keep both
        // Handle cases like "Hidradenitis suppurativa (viêm tuyến mồ hôi mủ)" -> keep both
        // But limit length for better display
        if (cleanItem.length > 50) {
          // If too long, try to shorten by keeping main part and abbreviation
          const match = cleanItem.match(/^([^(]+)(\([^)]*\))?/);
          if (match) {
            const mainPart = match[1].trim();
            const abbrev = match[2];
            if (abbrev && abbrev.length <= 10) {
              cleanItem = `${mainPart} ${abbrev}`;
            } else if (mainPart.length <= 30) {
              cleanItem = mainPart;
            } else {
              // Truncate long main part
              cleanItem = mainPart.substring(0, 27) + "...";
            }
          }
        }
        
        allSpecialties.push(cleanItem);
      }
    });
  });
  
  // Remove duplicates and return
  return Array.from(new Set(allSpecialties));
};

const HospitalView: React.FC = () => {
  const { allHospitals: hospitalsFromAPI, loading, fetchNearbyHospitals } = useHospitalController();
  
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [selectedSpec, setSelectedSpec] = useState<string>("All");
  const [selected, setSelected] = useState<Hospital | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [nearbyHospitals, setNearbyHospitals] = useState<Array<{name: string, address: string}>>([]);
  const [showNearbyModal, setShowNearbyModal] = useState(false);
  const itemsPerPage = 6;

  // Transform API data to match UI structure
  const hospitals: Hospital[] = useMemo(() => {
    if (loading || !hospitalsFromAPI.length) return [];
    
    return hospitalsFromAPI.map((h: APIHospital): Hospital => ({
      id: h.id || `hospital_${h.name}`,
      name: h.name,
      city: h.region, // Map region to city
      address: h.address,
      rating: h.rate, // Map rate to rating
      specialties: h.specialties,
      phone: h.phone,
      hours: "8:00 - 17:00", // Default hours
      image: h.img, // Map img to image
    }));
  }, [hospitalsFromAPI, loading]);

  const cities: string[] = ["All", ...Array.from(new Set(hospitals.map((h: Hospital) => h.city)))];
  
  // Parse all specialties from all hospitals to create filter options
  const allParsedSpecialties = hospitals.flatMap((h: Hospital) => parseSpecialties(h.specialties));
  const specialties: string[] = ["All", ...Array.from(new Set(allParsedSpecialties))];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return hospitals.filter((h: Hospital) => {
      if (selectedCity !== "All" && h.city !== selectedCity) return false;
      
      // Filter by parsed specialties instead of raw specialties array
      if (selectedSpec !== "All") {
        const hospitalParsedSpecialties = parseSpecialties(h.specialties);
        const hasSelectedSpecialty = hospitalParsedSpecialties.some(specialty => 
          specialty.toLowerCase().includes(selectedSpec.toLowerCase()) ||
          selectedSpec.toLowerCase().includes(specialty.toLowerCase())
        );
        if (!hasSelectedSpecialty) return false;
      }
      
      if (q) {
        const hospitalParsedSpecialties = parseSpecialties(h.specialties);
        const hay = `${h.name} ${h.address} ${h.city} ${hospitalParsedSpecialties.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a: Hospital, b: Hospital) => {
      if (sortByDistance && userLocation) {
        // For distance sorting, we'll use a rough estimation based on address
        // In a real app, you'd have lat/lng for each hospital
        const aDistance = a.address.toLowerCase().includes('hồ chí minh') || a.address.toLowerCase().includes('sài gòn') ? 
          (userLocation.lat > 11 ? 100 : 10) : 50; // Rough estimation
        const bDistance = b.address.toLowerCase().includes('hồ chí minh') || b.address.toLowerCase().includes('sài gòn') ? 
          (userLocation.lat > 11 ? 100 : 10) : 50; // Rough estimation
        return aDistance - bDistance;
      }
      // Default sort by rating
      return b.rating - a.rating;
    });
  }, [query, selectedCity, selectedSpec, sortByDistance, userLocation, hospitals]);

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHospitals = filtered.slice(startIndex, endIndex);

  // Fetch nearby hospitals and show in modal
  const fetchNearbyHospitalsModal = async (lat: number, lng: number) => {
    try {
      console.log(`Fetching nearby hospitals for location: ${lat}, ${lng}`);
      
      // Use ApiService instead of fetch
      const apiService = ApiService.getInstance();
      const data = await apiService.get<Array<{name: string, address: string}>>(
        `/api/hospital`,
        { lat, lng }
      );
      
      console.log('API Response:', data);
      
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format");
      }
      
      setNearbyHospitals(data);
      setShowNearbyModal(true);
      
    } catch (error) {
      console.error('❌ Failed to fetch nearby hospitals:', error);
      alert('Không thể tìm bệnh viện gần bạn. Vui lòng thử lại sau.');
    }
  };

  // Get user's current location and show nearby hospitals modal
  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes cache
          }
        );
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      
      setUserLocation(location);
      
      // Fetch nearby hospitals and show modal
      await fetchNearbyHospitalsModal(location.lat, location.lng);
      
      console.log('✅ User location obtained and nearby hospitals modal shown:', location);
    } catch (error) {
      console.error('❌ Error getting location:', error);
      // Fallback to default location (Ho Chi Minh City center)
      const fallbackLocation = { lat: 10.8231, lng: 106.6297 };
      setUserLocation(fallbackLocation);
      
      // Fetch nearby hospitals for fallback location
      await fetchNearbyHospitalsModal(fallbackLocation.lat, fallbackLocation.lng);
      
      alert('Không thể lấy vị trí hiện tại. Sử dụng vị trí mặc định (TP.HCM) để tìm bệnh viện gần nhất.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Calculate distance between two points using Haversine formula
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

  // Reset to page 1 when filters change
  const resetPage = () => setCurrentPage(1);
  
  React.useEffect(() => {
    resetPage();
  }, [query, selectedCity, selectedSpec, sortByDistance]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="🔍 Tìm theo tên, địa chỉ, chuyên khoa..."
              className="w-full sm:w-72 rounded-full border border-slate-200 px-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-full border border-slate-200 px-3 py-2 text-sm shadow-sm"
            >
              {cities.map((c: string) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
              className="rounded-full border border-slate-200 px-3 py-2 text-sm shadow-sm"
            >
              {specialties.map((s: string) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm bg-white text-gray-700 border border-slate-200 hover:bg-gray-50 ${isGettingLocation ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isGettingLocation ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang tìm...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Tìm gần nhất</span>
                </>
              )}
            </button>
          </div>
        </header>



        {/* Main */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 animate-pulse">
                      <div className="h-36 bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                      </div>
                    </div>
                  ))
                ) : filtered.length === 0 ? (
                <div className="col-span-full text-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-slate-600">Không tìm thấy kết quả. Thử thay đổi bộ lọc.</p>
                </div>
                ) : (
                currentHospitals.map((h: Hospital) => (
                    <HospitalCard key={h.id} hospital={h} onOpen={(x: Hospital) => setSelected(x)} />
                ))
                )}
            </div>

            {/* Pagination Info */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 gap-4">
                <div>{filtered.length} cơ sở phù hợp</div>
                <div>Hiển thị {startIndex + 1} — {Math.min(endIndex, filtered.length)} / {filtered.length}</div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm'
                    }`}
                  >
                    ← Trước
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current page
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            currentPage === page
                              ? 'bg-[#145566] text-white shadow-md'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2 py-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm'
                    }`}
                  >
                    Sau →
                  </button>
                </nav>
              </div>
            )}
            </section>
        </main>

        {/* Detail modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 flex items-center justify-center"
            >
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setSelected(null)}
              />

              {/* Modal */}
              <motion.div
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -80, opacity: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
                className="relative bg-white rounded-3xl shadow-2xl w-full md:max-w-3xl mx-4 overflow-hidden"
              >
                                 {selected.image && (
                   <img src={selected.image} className="h-48 w-full object-contain bg-gray-50" />
                 )}
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{selected.name}</h2>
                      <p className="text-sm text-slate-500 mt-1">
                        {selected.address} • {selected.city}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-slate-700">
                        <div className="text-amber-500 font-semibold">
                          ⭐ {selected.rating.toFixed(1)}
                        </div>
                        <div className="text-sm">🕑 {selected.hours}</div>
                        <a className="underline text-sm text-cyan-600" href={`tel:${selected.phone}`}>
                          📞 {selected.phone}
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="text-slate-500 hover:text-slate-800 text-lg font-bold"
                    >
                      ✕
                    </button>
                  </div>

                                     {/* Content */}
                   <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <h5 className="font-medium mb-2">Giới thiệu nhanh</h5>
                       <p className="text-sm text-slate-600 leading-relaxed">
                         Đây là phần mô tả ngắn về cơ sở — bạn có thể nạp mô tả thật từ API.
                       </p>
                       <div className="mt-4">
                         <h5 className="font-medium mb-3">Chuyên khoa</h5>
                         <div className="relative">
                           <div className="max-h-32 overflow-y-auto scrollbar-thin pr-2">
                             <div className="flex flex-wrap gap-2 pb-2">
                               {parseSpecialties(selected.specialties).map((specialty, index) => (
                                 <span
                                   key={index}
                                   className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200 shadow-sm hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 transition-all duration-200"
                                   title={specialty} // Show full text on hover
                                 >
                                   {specialty}
                                 </span>
                               ))}
                             </div>
                           </div>
                           {/* Fade indicator for scrollable content */}
                           {parseSpecialties(selected.specialties).length > 8 && (
                             <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                           )}
                         </div>
                       </div>
                     </div>
                     <div>
                       <h5 className="font-medium mb-2">Thông tin liên hệ</h5>
                       <div className="text-sm text-slate-600 space-y-2">
                         <div>📍 {selected.address}</div>
                         <div>
                           📞{" "}
                           <a href={`tel:${selected.phone}`} className="underline text-cyan-600">
                             {selected.phone}
                           </a>
                         </div>
                         <div>🕑 {selected.hours}</div>
                       </div>
                       <div className="mt-4">
                         <button className="w-full rounded-xl py-2.5 bg-[#145566] text-white font-semibold shadow-md hover:opacity-90 transition">
                           Đặt lịch khám
                         </button>
                       </div>
                     </div>
                   </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nearby Hospitals Modal */}
        <AnimatePresence>
          {showNearbyModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
            >
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowNearbyModal(false)}
              />

              {/* Modal */}
              <motion.div
                initial={{ y: -80, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -80, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
                className="relative bg-white rounded-3xl shadow-2xl w-full md:max-w-2xl mx-4 max-h-[80vh] overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Bệnh viện gần bạn</h2>
                        <p className="text-sm text-gray-600">
                          {nearbyHospitals.length} bệnh viện được tìm thấy
                          {userLocation && (
                            <span className="ml-2 text-xs bg-blue-100 px-2 py-1 rounded">
                              📍 {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowNearbyModal(false)}
                      className="text-gray-500 hover:text-gray-800 text-lg font-bold p-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Hospital List */}
                <div className="p-6 overflow-y-auto max-h-96">
                  {nearbyHospitals.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-4xl mb-4">🏥</div>
                      <p className="text-gray-600">Không tìm thấy bệnh viện nào gần vị trí của bạn</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {nearbyHospitals.map((hospital, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-base mb-2">
                                {hospital.name}
                              </h3>
                              <p className="text-sm text-gray-600 flex items-start gap-2">
                                <svg className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span>{hospital.address}</span>
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                #{index + 1}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => setShowNearbyModal(false)}
                    className="w-full py-2.5 px-4 bg-[#145566] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                  >
                    Đóng
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HospitalView;
