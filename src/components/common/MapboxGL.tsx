import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMap } from '../../context/MapContext';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxGLProps {
  onLoad?: (map: mapboxgl.Map) => void;
  className?: string;
  options?: Partial<mapboxgl.MapboxOptions>;
}

const MapboxGL: React.FC<MapboxGLProps> = ({ onLoad, className, options }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { initializeMap, mapRef } = useMap();

  useEffect(() => {
    if (containerRef.current && !mapRef.current) {
      const map = initializeMap(containerRef.current, options || {});
      
      map.on('load', () => {
        onLoad?.(map);
        
        // Add default navigation controls
        const nav = new mapboxgl.NavigationControl({ showCompass: true });
        map.addControl(nav, 'bottom-right');
      });
    }

    return () => {
      // In a singleton pattern, we typically don't remove the map
      // but we might want to clear layers or markers if needed
    };
  }, [initializeMap, mapRef, onLoad, options]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 ${className}`} 
      style={{ position: 'relative' }}
    />
  );
};

export default React.memo(MapboxGL);
