import React from 'react';
import { Button } from '../../ui/Button';
import { ArrowDownLeft, MapPin } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import MapComponent from '../../common/MapComponent';

export const FullMapModal = ({ onClose, shipmentId }: { onClose: () => void, shipmentId?: string }) => {
    const { shipmentLocations, shipments } = useStore();
    const apiKey = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || '';

    // Derive tracking info
    const markers = [];
    
    if (shipmentId && shipmentLocations[shipmentId]) {
        markers.push({
            id: shipmentId,
            position: shipmentLocations[shipmentId],
            title: `Active Delivery Tracking`,
            icon: 'https://cdn-icons-png.flaticon.com/512/3448/3448636.png'
        });
    } else if (!shipmentId) {
        // Admin view - show all
        Object.entries(shipmentLocations).forEach(([id, pos]) => {
            markers.push({
                id,
                position: pos,
                title: `Shipment: ${id}`,
                icon: 'https://cdn-icons-png.flaticon.com/512/3448/3448636.png'
            });
        });
    }

    return (
        <div className="fixed inset-0 z-[100] bg-white">
            <div className="absolute top-4 left-4 z-[110]">
                <Button variant="secondary" onClick={onClose} className="bg-white shadow-xl border-none"><ArrowDownLeft className="mr-2 rotate-45"/> Close Map</Button>
            </div>
            
            <div className="w-full h-full relative">
                {apiKey ? (
                    <MapComponent apiKey={apiKey} markers={markers} />
                ) : (
                    <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-8">
                         <div className="relative mb-6">
                            <div className="absolute inset-0 bg-brand-primary/10 rounded-full blur-2xl animate-pulse"></div>
                            <MapPin size={64} className="relative text-brand-primary"/>
                         </div>
                         <h3 className="text-xl font-bold text-slate-900 mb-2">Live Tracking Center</h3>
                         <p className="text-slate-500 text-sm max-w-sm text-center font-medium">Please provide your Google Maps API Key to activate the real-time visual interface.</p>
                         
                         {markers.length > 0 ? (
                             <div className="mt-8 space-y-4 w-full max-w-md">
                                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Live Telemetry Incoming</p>
                                 <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl">
                                    {markers.map(m => (
                                        <div key={m.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">Shipment ID</p>
                                                <p className="text-[10px] text-slate-500 font-mono">{m.id}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-green-600 uppercase border border-green-100 bg-green-50 px-2 py-0.5 rounded-full inline-block">Active</p>
                                                <p className="text-[10px] text-slate-400 mt-1">{m.position.lat.toFixed(4)}, {m.position.lng.toFixed(4)}</p>
                                            </div>
                                        </div>
                                    ))}
                                 </div>
                             </div>
                         ) : (
                             <div className="mt-8 px-6 py-4 bg-blue-50 text-brand-primary rounded-2xl border border-blue-100 text-xs font-bold text-center">
                                 Waiting for driver location transmissions...
                             </div>
                         )}
                    </div>
                )}
            </div>
        </div>
    );
};
