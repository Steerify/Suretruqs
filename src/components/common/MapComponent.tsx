import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 6.5244, // Default to Lagos
  lng: 3.3792
};

interface MapComponentProps {
  apiKey: string;
  markers?: Array<{
    id: string;
    position: { lat: number, lng: number };
    title?: string;
    icon?: string;
  }>;
  onMarkerClick?: (marker: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ apiKey, markers = [], onMarkerClick }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach(m => bounds.extend(m.position));
    if (markers.length > 0) {
        map.fitBounds(bounds);
    }
    setMap(map);
  }, [markers]);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  if (!isLoaded) return <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center font-bold text-slate-400">Loading Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={markers.length > 0 ? markers[0].position : center}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
          styles: [
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [{"saturation": 36}, {"color": "#333333"}, {"lightness": 40}]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [{"visibility": "on"}, {"color": "#ffffff"}, {"lightness": 16}]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#fefefe"}, {"lightness": 20}]
            }
          ]
      }}
    >
      {markers.map(marker => (
        <Marker 
          key={marker.id} 
          position={marker.position} 
          title={marker.title}
          onClick={() => {
              setSelectedMarker(marker);
              if (onMarkerClick) onMarkerClick(marker);
          }}
          icon={marker.icon ? {
              url: marker.icon,
              scaledSize: new window.google.maps.Size(40, 40)
          } : undefined}
        />
      ))}

      {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
              <div className="p-2">
                  <h4 className="font-bold text-slate-900">{selectedMarker.title}</h4>
                  <p className="text-xs text-slate-500">Live Tracking Active</p>
              </div>
          </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default React.memo(MapComponent);
