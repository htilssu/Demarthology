import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map, Marker } from '@openmapvn/openmapvn-gl';

interface OpenMapVNMapProps {
  latitude: number;
  longitude: number;
  className?: string;
  onLocationChange?: (lat: number, lng: number) => void;
}

const OpenMapVNMap: React.FC<OpenMapVNMapProps> = ({ 
  latitude, 
  longitude, 
  className,
  onLocationChange 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const marker = useRef<Marker | null>(null);
  const [coordinates, setCoordinates] = useState<{ lng: number; lat: number }>({
    lng: longitude,
    lat: latitude
  });

  const onDragEnd = useCallback(() => {
    if (marker.current) {
      const lngLat = marker.current.getLngLat();
      const newCoordinates = {
        lng: parseFloat(lngLat.lng.toFixed(6)),
        lat: parseFloat(lngLat.lat.toFixed(6))
      };
      setCoordinates(newCoordinates);
      
      // Call the callback function if provided
      if (onLocationChange) {
        onLocationChange(newCoordinates.lat, newCoordinates.lng);
      }
    }
  }, [onLocationChange]);

  // Initialize map only once
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new Map({
      container: mapContainer.current,
      style: 'https://tiles.openmap.vn/styles/day-v1/style.json',
      center: [longitude, latitude],
      zoom: 14
    });

    // Create draggable marker
    marker.current = new Marker({ draggable: true })
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    marker.current.on('dragend', onDragEnd);

    // Set initial coordinates
    setCoordinates({
      lng: parseFloat(longitude.toFixed(6)),
      lat: parseFloat(latitude.toFixed(6))
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, onDragEnd]); // Include dependencies

  // Update marker position when coordinates prop changes
  useEffect(() => {
    if (marker.current && map.current) {
      marker.current.setLngLat([longitude, latitude]);
      map.current.setCenter([longitude, latitude]);
      setCoordinates({
        lng: parseFloat(longitude.toFixed(6)),
        lat: parseFloat(latitude.toFixed(6))
      });
    }
  }, [latitude, longitude]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md border">
        <div className="text-sm font-semibold text-gray-700 mb-1">Vị trí đã chọn:</div>
        <div className="text-xs text-gray-600">
          Longitude: {coordinates.lng}<br />
          Latitude: {coordinates.lat}
        </div>
        <div className="text-xs text-blue-600 mt-1 italic">
          Kéo marker để thay đổi vị trí
        </div>
      </div>
    </div>
  );
};

export default OpenMapVNMap;