import React, { createContext, useContext, useRef, ReactNode } from 'react';
import mapboxgl from 'mapbox-gl';

interface MapContextType {
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  isInitialized: boolean;
  initializeMap: (container: HTMLElement, options: Partial<mapboxgl.MapboxOptions>) => mapboxgl.Map;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const isInitialized = !!mapRef.current;

  const initializeMap = (container: HTMLElement, options: Partial<mapboxgl.MapboxOptions>) => {
    if (mapRef.current) return mapRef.current;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    
    const map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/navigation-night-v1', // Premium dark navigation style
      center: [3.3792, 6.5244], // Default to Lagos, Nigeria
      zoom: 12,
      ...options
    });

    mapRef.current = map;
    return map;
  };

  return (
    <MapContext.Provider value={{ mapRef, isInitialized, initializeMap }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) throw new Error('useMap must be used within MapProvider');
  return context;
};
