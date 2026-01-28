import React, { useEffect, useState } from 'react';
import MapboxGL from '../../common/MapboxGL';
import { useStore } from '../../../context/StoreContext';
import { useMap } from '../../../context/MapContext';
import mapboxgl from 'mapbox-gl';

const AdminLiveTracking: React.FC = () => {
  const { drivers, shipmentLocations } = useStore();
  const { mapRef } = useMap();
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !drivers.length) return;

    // Convert drivers to GeoJSON
    const geojson: any = {
      type: 'FeatureCollection',
      features: drivers.map(d => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            shipmentLocations[d.id]?.lng || d.currentLocation?.lng || 3.3792,
            shipmentLocations[d.id]?.lat || d.currentLocation?.lat || 6.5244
          ]
        },
        properties: {
          id: d.id,
          name: d.name,
          status: d.status
        }
      }))
    };

    if (map.getSource('drivers')) {
      (map.getSource('drivers') as mapboxgl.GeoJSONSource).setData(geojson);
    } else {
      map.addSource('drivers', {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      // Cluster circle layer
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'drivers',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#3b82f6',
          'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
        }
      });

      // Cluster count text
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'drivers',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        paint: {
          'text-color': '#ffffff'
        }
      });

      // Individual driver points
      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'drivers',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#10b981',
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      });
    }
  }, [drivers, shipmentLocations, mapRef]);

  return (
    <div className="relative w-full h-full">
      <MapboxGL 
        options={{ zoom: 5 }} 
        className="h-[calc(100vh-200px)]"
      />
      
      {/* Driver List Overlay (Minimal Mapbox calls, load map only when needed) */}
      <div className="absolute top-4 left-4 w-64 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-4 max-h-[calc(100%-8rem)] overflow-y-auto">
        <h3 className="text-sm font-black text-slate-800 mb-4 px-2 tracking-tight">LIVE FLEET ({drivers.length})</h3>
        <div className="space-y-2">
          {drivers.map(driver => (
            <button
              key={driver.id}
              onClick={() => {
                setSelectedDriver(driver);
                mapRef.current?.flyTo({
                  center: [
                    shipmentLocations[driver.id]?.lng || 3.3792,
                    shipmentLocations[driver.id]?.lat || 6.5244
                  ],
                  zoom: 15
                });
              }}
              className={`w-full text-left p-3 rounded-xl transition-all ${
                selectedDriver?.id === driver.id 
                  ? 'bg-brand-primary text-white shadow-lg' 
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <p className="text-xs font-bold truncate">{driver.name}</p>
              <p className="text-[10px] opacity-70 uppercase tracking-widest">{driver.vehicleType}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminLiveTracking;
