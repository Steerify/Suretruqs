import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useStore } from '../context/StoreContext';

const SOCKET_URL = (import.meta as any).env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useLocationTracking = (shipmentId: string | null, isDriver: boolean) => {
  const socketRef = useRef<Socket | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const { currentUser } = useStore();

  useEffect(() => {
    if (!isDriver || !shipmentId || !currentUser) return;

    socketRef.current = io(SOCKET_URL);

    const startTracking = () => {
      if (!navigator.geolocation) {
        console.error('Geolocation not supported');
        return;
      }

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          socketRef.current?.emit('update_location', {
            shipmentId,
            lat: latitude,
            lng: longitude,
            driverId: currentUser.id || (currentUser as any)._id,
          });
        },
        (error) => {
          console.error('Geolocation Error:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      );
    };

    startTracking();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      socketRef.current?.disconnect();
    };
  }, [shipmentId, isDriver, currentUser]);
};
