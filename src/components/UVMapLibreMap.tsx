import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

interface UVMapLibreMapProps {
  latitude: number;
  longitude: number;
  className?: string;
  onLocationChange?: (lat: number, lng: number) => void;
}

const UVMapLibreMap: React.FC<UVMapLibreMapProps> = ({ 
  latitude, 
  longitude, 
  className,
  onLocationChange 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const [coordinates, setCoordinates] = useState<{ lng: number; lat: number }>({
    lng: longitude,
    lat: latitude
  });

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // initialize map only once

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json', // Demo tile style
      center: [longitude, latitude],
      zoom: 14
    });

    // Create draggable marker
    marker.current = new maplibregl.Marker({ draggable: true })
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    function onDragEnd() {
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
    }

    marker.current.on('dragend', onDragEnd);

    // Set initial coordinates
    setCoordinates({
      lng: parseFloat(longitude.toFixed(6)),
      lat: parseFloat(latitude.toFixed(6))
    });

    return () => {
      map.current?.remove();
    };
  }, []); // Initialize only once

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

export default UVMapLibreMap;