import React from 'react';
import { X, MapPin, MessageSquare, Phone, ArrowRight } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Shipment, ShipmentStatus } from '../../../types';

interface HistoryDetailsModalProps {
    shipment: Shipment;
    onClose: () => void;
    onOpenChat: () => void;
    onRate: () => void;
}

const getStatusLabel = (status: ShipmentStatus) => {
    switch (status) {
        case ShipmentStatus.PENDING: return 'Pending Request';
        case ShipmentStatus.ASSIGNED: return 'Driver Assigned';
        case ShipmentStatus.PICKED_UP: return 'Cargo Picked Up';
        case ShipmentStatus.IN_TRANSIT: return 'In Transit';
        case ShipmentStatus.DELIVERED: return 'Delivered';
        case ShipmentStatus.CANCELLED: return 'Cancelled';
        default: return (status as string).replace('_', ' ');
    }
};

export const HistoryDetailsModal = ({ shipment, onClose, onOpenChat, onRate }: HistoryDetailsModalProps) => {
    // Check if shipment is active to show chat/call buttons
    const isActive = [ShipmentStatus.ASSIGNED, ShipmentStatus.PICKED_UP, ShipmentStatus.IN_TRANSIT].includes(shipment.status);
    
    return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 p-0 animate-[scaleIn_0.2s_ease-out] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                    <h3 className="font-bold text-xl text-slate-900">Shipment Details</h3>
                    <p className="text-xs text-slate-500 font-mono mt-1">{shipment.trackingId}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={24}/></button>
            </div>
            <div className="p-6 space-y-6">
                 <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-sm font-medium text-slate-600">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        shipment.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 
                        shipment.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-brand-primary'
                    }`}>{getStatusLabel(shipment.status)}</span>
                </div>
                
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
                            <MapPin size={16}/>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Pickup</p>
                            <p className="font-bold text-slate-900">{shipment.pickup.address}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-orange-50 text-brand-orange flex items-center justify-center shrink-0">
                            <MapPin size={16}/>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Dropoff</p>
                            <p className="font-bold text-slate-900">{shipment.dropoff.address}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                         <p className="text-xs text-slate-400 font-bold uppercase mb-1">Price</p>
                         <p className="font-bold text-slate-900">₦{shipment.price.toLocaleString()}</p>
                     </div>
                     <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                         <p className="text-xs text-slate-400 font-bold uppercase mb-1">Date</p>
                         <p className="font-bold text-slate-900">{new Date(shipment.date).toLocaleDateString()}</p>
                     </div>
                </div>

                {isActive && (
                    <div className="flex gap-3 pt-2">
                        <Button className="flex-1" variant="secondary" onClick={() => { onClose(); onOpenChat(); }}>
                            <MessageSquare size={18} className="mr-2"/> Message Driver
                        </Button>
                        <Button className="flex-1" variant="secondary">
                            <Phone size={18} className="mr-2"/> Call Driver
                        </Button>
                    </div>
                )}

                {shipment.status === ShipmentStatus.DELIVERED && !shipment.rating && (
                     <Button className="w-full font-bold shadow-lg shadow-brand-primary/20" onClick={() => { onClose(); onRate(); }}>Rate Driver</Button>
                )}
            </div>
        </div>
    </div>
    );
};
