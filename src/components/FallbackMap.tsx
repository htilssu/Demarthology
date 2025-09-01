import React, { useRef, useCallback } from 'react';

interface FallbackMapProps {
  latitude: number;
  longitude: number;
  className?: string;
  onMapClick?: (lat: number, lon: number) => void;
}

const FallbackMap: React.FC<FallbackMapProps> = ({ 
  latitude, 
  longitude, 
  className, 
  onMapClick 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!onMapClick || !mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert click position to approximate lat/lon
    // This is a simple approximation for demonstration
    const latOffset = (y - rect.height / 2) / rect.height * 0.02; // Small offset for demo
    const lonOffset = (x - rect.width / 2) / rect.width * 0.02;   // Small offset for demo
    
    const newLat = latitude + latOffset;
    const newLon = longitude + lonOffset;

    onMapClick(newLat, newLon);
  }, [latitude, longitude, onMapClick]);

  return (
    <div 
      ref={mapRef}
      className={`${className} bg-gradient-to-br from-blue-100 to-green-100 relative cursor-pointer border-2 border-gray-300 rounded-lg overflow-hidden`}
      onClick={handleClick}
      style={{ minHeight: '300px' }}
    >
      {/* Background pattern to simulate map */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 grid-rows-6 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-gray-400"></div>
          ))}
        </div>
      </div>
      
      {/* Current location marker */}
      <div 
        className="absolute w-6 h-6 bg-blue-500 border-4 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={{ 
          left: '50%', 
          top: '50%',
          animation: 'pulse 2s infinite'
        }}
      />
      
      {/* Pulse animation */}
      <div 
        className="absolute w-12 h-12 bg-blue-500 opacity-30 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-5"
        style={{ 
          left: '50%', 
          top: '50%',
          animation: 'ping 2s infinite'
        }}
      />
      
      {/* Instructions overlay */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-md text-sm">
        <p className="text-gray-700 font-medium">🗺️ Bản đồ tương tác</p>
        <p className="text-gray-600 text-xs">Nhấp để chọn vị trí mới</p>
      </div>
      
      {/* Coordinates display */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg text-xs">
        <div>Lat: {latitude.toFixed(4)}</div>
        <div>Lon: {longitude.toFixed(4)}</div>
      </div>
      
      {/* Map attribution */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500">
        Interactive Map
      </div>
    </div>
  );
};

export default FallbackMap;