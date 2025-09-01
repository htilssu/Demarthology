import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Map } from '@openmapvn/openmapvn-gl';
import FallbackMap from './FallbackMap';

interface OpenMapVNMapProps {
  latitude: number;
  longitude: number;
  className?: string;
  onMapClick?: (lat: number, lon: number) => void;
}

const OpenMapVNMap: React.FC<OpenMapVNMapProps> = ({ latitude, longitude, className, onMapClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const [mapError, setMapError] = useState(false);

  // Initialize map only once
  useEffect(() => {
    if (map.current || !mapContainer.current || mapError) return;

    // Set a timeout to switch to fallback if map doesn't load
    const timeoutId = setTimeout(() => {
      if (!map.current || map.current.isStyleLoaded() === false) {
        console.warn('Map loading timeout, switching to fallback');
        setMapError(true);
      }
    }, 5000); // 5 second timeout

    try {
      map.current = new Map({
        container: mapContainer.current,
        style: 'https://tiles.openmap.vn/styles/general/style.json',
        center: [longitude, latitude],
        zoom: 14
      });

      // Add error handling for map loading
      map.current.on('error', (e) => {
        console.warn('Map loading error, switching to fallback:', e);
        clearTimeout(timeoutId);
        setMapError(true);
      });

      // Add marker at the current location
      map.current.on('load', () => {
        clearTimeout(timeoutId); // Clear timeout on successful load
        
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

          // Add click event listener to the map
          if (onMapClick) {
            map.current.on('click', (e) => {
              const { lng, lat } = e.lngLat;
              onMapClick(lat, lng);
            });
            
            // Add cursor pointer on hover
            map.current.on('mouseenter', () => {
              if (map.current) {
                map.current.getCanvas().style.cursor = 'pointer';
              }
            });
            
            map.current.on('mouseleave', () => {
              if (map.current) {
                map.current.getCanvas().style.cursor = '';
              }
            });
          }
        }
      });

      return () => {
        clearTimeout(timeoutId);
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.warn('Failed to initialize map, switching to fallback:', error);
      clearTimeout(timeoutId);
      setMapError(true);
    }
  }, [mapError]); // Empty dependency array - initialize only once

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
    <>
      {mapError ? (
        <FallbackMap
          latitude={latitude}
          longitude={longitude}
          className={className}
          onMapClick={onMapClick}
        />
      ) : (
        <div 
          ref={mapContainer} 
          className={className}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </>
  );
};

export default OpenMapVNMap;