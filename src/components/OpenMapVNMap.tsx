import React, { useEffect, useRef, useCallback } from 'react';
import { Map } from '@openmapvn/openmapvn-gl';

interface OpenMapVNMapProps {
  latitude: number;
  longitude: number;
  className?: string;
}

const OpenMapVNMap: React.FC<OpenMapVNMapProps> = ({ latitude, longitude, className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  // Initialize map only once
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new Map({
      container: mapContainer.current,
      style: 'https://tiles.openmap.vn/styles/day-v1/style.json',
      center: [longitude, latitude],
      zoom: 14
    });

    // Add marker at the current location
    map.current.on('load', () => {
      if (map.current) {
        map.current.addSource('location-marker', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [longitude, latitude]
                },
                properties: {}
              }
            ]
          }
        });

        map.current.addLayer({
          id: 'location-marker',
          type: 'circle',
          source: 'location-marker',
          paint: {
            'circle-radius': 8,
            'circle-color': '#3b82f6',
            'circle-stroke-width': 3,
            'circle-stroke-color': '#ffffff'
          }
        });

        // Add a pulse animation
        map.current.addLayer({
          id: 'location-pulse',
          type: 'circle',
          source: 'location-marker',
          paint: {
            'circle-radius': 20,
            'circle-color': '#3b82f6',
            'circle-opacity': 0.3,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#3b82f6',
            'circle-stroke-opacity': 0.5
          }
        });
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Empty dependency array - initialize only once

  // Update map center when coordinates change
  const updateMapLocation = useCallback(() => {
    if (map.current) {
      map.current.setCenter([longitude, latitude]);
      
      // Update marker position
      const source = map.current.getSource('location-marker');
      if (source && source.type === 'geojson') {
        (source as any).setData({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [longitude, latitude]
              },
              properties: {}
            }
          ]
        });
      }
    }
  }, [latitude, longitude]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    updateMapLocation();
  }, [updateMapLocation]);

  return (
    <div 
      ref={mapContainer} 
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default OpenMapVNMap;