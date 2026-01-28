import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useStore } from '../context/StoreContext';

export const useRealTimeTracking = (shipmentId: string, map: mapboxgl.Map | null) => {
  const { shipmentLocations } = useStore();
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastPosRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (!map || !shipmentId) return;

    const location = shipmentLocations[shipmentId];
    if (!location) return;

    const newTarget: [number, number] = [location.lng, location.lat];

    if (!markerRef.current) {
      // Create a custom premium marker
      const el = document.createElement('div');
      el.className = 'driver-marker';
      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 bg-brand-primary/20 rounded-full animate-ping"></div>
          <div class="relative w-6 h-6 bg-brand-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none" class="text-white">
              <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      `;

      markerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat(newTarget)
        .addTo(map);
      
      lastPosRef.current = newTarget;
      return;
    }

    // Interpolation Logic
    if (lastPosRef.current) {
      const startPos = lastPosRef.current;
      const startTime = performance.now();
      const DURATION = 3000; // Expected ping interval

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / DURATION, 1);

        // Simple linear interpolation
        const currentLng = startPos[0] + (newTarget[0] - startPos[0]) * progress;
        const currentLat = startPos[1] + (newTarget[1] - startPos[1]) * progress;

        markerRef.current?.setLngLat([currentLng, currentLat]);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          lastPosRef.current = newTarget;
        }
      };

      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(animate);
    }

  }, [shipmentId, shipmentLocations, map]);

  useEffect(() => {
    return () => {
      if (markerRef.current) markerRef.current.remove();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return markerRef.current;
};
