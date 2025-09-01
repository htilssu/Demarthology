import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sun, AlertCircle, CheckCircle, Clock, MapPin, RefreshCw } from "lucide-react";
import { useUVController } from "../controllers/useUVController";
import UVMapLibreMap from "../components/UVMapLibreMap";

const UVIndex: React.FC = () => {
  const {
    uvData,
    location,
    locationAccuracy,
    loading,
    error,
    fetchUVForCurrentLocation,
    refreshUVData,
    refreshLocation,
    updateLocation,
    getUVLevel,
    getUVColor,
    getUVMessage,
    getUVNote
  } = useUVController();

  const [uvTrend, setUVTrend] = useState<number[]>([]);

  // Generate mock trend data for visualization
  const getMockTrend = () => Array.from({ length: 12 }, () =>
    parseFloat((Math.random() * 12).toFixed(1))
  );

  // Handle refresh button click
  const handleRefresh = () => {
    refreshUVData();
    setUVTrend(getMockTrend()); // Refresh trend data
  };

  // Initialize trend data when UV data is loaded
  React.useEffect(() => {
    if (uvData && uvTrend.length === 0) {
      setUVTrend(getMockTrend());
    }
  }, [uvData, uvTrend.length]);

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Đang lấy dữ liệu UV...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <h3 className="text-red-800 font-semibold mb-2">Lỗi lấy dữ liệu UV</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </motion.button>
        </div>
      </div>
    );
  }

  // Show message if no data
  if (!uvData || !location) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center text-slate-600 font-medium">
        <p>Không có dữ liệu UV</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchUVForCurrentLocation}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Lấy vị trí hiện tại
        </motion.button>
      </div>
    );
  }

  const { uv_value, message, level_uv } = uvData;

  // Add defensive check for uv_value
  if (uv_value === undefined || uv_value === null || isNaN(uv_value)) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Đang xử lý dữ liệu UV...</p>
        </div>
      </div>
    );
  }

  const uvLevel = getUVLevel(uv_value);
  const uvMessage = getUVMessage(uv_value);
  const uvNote = getUVNote(uv_value);
  const { latitude, longitude } = location;

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-6">
      {/* Left Panel: UV Info */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col gap-6 p-6 bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow"
      >
        <div className="flex items-center gap-4">
          <Sun className="w-14 h-14 text-yellow-400 animate-pulse" />
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              Chỉ số UV hiện tại
            </h2>
            <p className="mt-1 text-xl text-slate-700">{message || uvMessage}</p>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className={`p-8 rounded-3xl text-white text-center text-5xl font-bold bg-gradient-to-r ${getUVColor(
            uv_value
          )} shadow-xl`}
        >
          {uv_value.toFixed(1)} - {level_uv || uvLevel}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 p-4 bg-slate-100 rounded-2xl shadow-inner"
        >
          {uv_value <= 5 ? (
            <CheckCircle className="w-8 h-8 text-green-500" />
          ) : (
            <AlertCircle className="w-8 h-8 text-red-500 animate-pulse" />
          )}
          <p className="text-slate-700 font-medium">{uvNote}</p>
        </motion.div>

        {/* Location Info */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl shadow-inner">
          <MapPin className="w-6 h-6 text-blue-600" />
          <div className="text-sm text-slate-700 flex-1">
            <p className="font-medium">Vị trí hiện tại</p>
            <p>Lat: {latitude.toFixed(4)}, Lon: {longitude.toFixed(4)}</p>
            {locationAccuracy && (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-slate-500">
                  Độ chính xác: {locationAccuracy < 1000
                    ? `${Math.round(locationAccuracy)}m`
                    : `${(locationAccuracy/1000).toFixed(1)}km`}
                </p>
                <div className={`w-2 h-2 rounded-full ${
                  locationAccuracy <= 10 ? 'bg-green-500' :
                  locationAccuracy <= 50 ? 'bg-yellow-500' :
                  locationAccuracy <= 200 ? 'bg-orange-500' :
                  'bg-red-500'
                }`} title={
                  locationAccuracy <= 10 ? 'Rất chính xác' :
                  locationAccuracy <= 50 ? 'Chính xác' :
                  locationAccuracy <= 200 ? 'Trung bình' :
                  'Kém chính xác'
                }></div>
              </div>
            )}
          </div>
        </div>

        {/* UV Trend */}
        {uvTrend.length > 0 && (
          <div className="p-4 bg-slate-50 rounded-2xl shadow-inner">
            <div className="flex items-center gap-2 mb-2 text-slate-700 font-medium">
              <Clock className="w-5 h-5" />
              <span>Xu hướng UV 12 giờ (mô phỏng)</span>
            </div>
            <div className="flex justify-between items-end h-24 gap-1">
              {uvTrend.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${(v / 12) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                  className={`flex-1 flex flex-col items-center w-6 rounded-t-xl ${
                    v <= 2
                      ? "bg-green-400"
                      : v <= 5
                      ? "bg-yellow-400"
                      : v <= 7
                      ? "bg-orange-400"
                      : v <= 10
                      ? "bg-red-500"
                      : "bg-purple-600"
                  }`}
                >
                  <span className="text-xs mt-1">{i + 1}h</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold shadow-lg transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Cập nhật UV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshLocation}
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold shadow-lg transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            Lấy vị trí chính xác
          </motion.button>
        </div>
      </motion.div>

      {/* Right Panel: Map */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 rounded-3xl overflow-hidden shadow-md border border-slate-200 h-96 lg:h-auto"
      >
        <UVMapLibreMap
          latitude={latitude}
          longitude={longitude}
          className="w-full h-full"
          onLocationChange={updateLocation}
        />
      </motion.div>
    </div>
  );
};

export default UVIndex;
