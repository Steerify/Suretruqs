import React from 'react';
import toast from 'react-hot-toast';
import { Truck, Navigation, CheckCircle, MapPin, MessageSquare, Phone, XCircle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Shipment, ShipmentStatus } from '../../../types';
import { useLocationTracking } from '../../../hooks/useLocationTracking';

interface ActiveJobViewProps {
    activeJob: Shipment;
    onUpdateStatus: (id: string, status: ShipmentStatus) => void;
    setShowCustomerChat: (show: boolean) => void;
    setShowSOS: (show: boolean) => void;
    setShowFullMap: (show: boolean) => void;
}

export const ActiveJobView = ({ activeJob, onUpdateStatus, setShowCustomerChat, setShowSOS, setShowFullMap }: ActiveJobViewProps) => {
    useLocationTracking(activeJob.id, true);

    const handleStatusUpdate = () => {
        if (!activeJob) return;
    
        let nextStatus = activeJob.status;
        if (activeJob.status === ShipmentStatus.ASSIGNED) nextStatus = ShipmentStatus.PICKED_UP;
        else if (activeJob.status === ShipmentStatus.PICKED_UP) nextStatus = ShipmentStatus.IN_TRANSIT;
        else if (activeJob.status === ShipmentStatus.IN_TRANSIT) nextStatus = ShipmentStatus.DELIVERED;
    
        onUpdateStatus(activeJob.id, nextStatus);
    };

    const getStatusButtonText = () => {
        if (!activeJob) return '';
        switch(activeJob.status) {
            case ShipmentStatus.ASSIGNED: return 'Confirm Pickup';
            case ShipmentStatus.PICKED_UP: return 'Start Transit';
            case ShipmentStatus.IN_TRANSIT: return 'Confirm Delivery';
            default: return 'Completed';
        }
    };

    return (
      <div className="p-4 md:p-8 pb-24 fade-up w-full max-w-[1920px] mx-auto">
         <div className="flex items-center justify-between mb-8">
           <div>
             <h1 className="text-2xl font-bold text-slate-900">Current Job</h1>
             <p className="text-slate-500 font-medium mt-1">Tracking ID: <span className="font-mono text-slate-700">{activeJob.trackingId}</span></p>
           </div>
           <div className="px-4 py-2 bg-blue-50 text-brand-primary border border-blue-100 text-sm font-bold rounded-full uppercase tracking-wide shadow-sm">
             {activeJob.status.replace('_', ' ')}
           </div>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
                <Card noPadding className="mb-6 overflow-hidden shadow-lg border border-slate-200 rounded-3xl">
                    <div className="h-80 md:h-[400px] bg-slate-100 relative w-full">
                        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-10 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-blue-50/40"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-brand-orange/20 rounded-full animate-ping"></div>
                                <div className="bg-white p-3 rounded-full shadow-xl relative z-10">
                                    <Truck className="text-brand-orange" size={32} />
                                </div>
                            </div>
                        </div>
                        
                        {/* SOS Button Overlay */}
                        <div className="absolute top-6 right-6 z-20">
                            <button 
                                onClick={() => setShowSOS(true)}
                                className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg shadow-red-500/40 transition-transform active:scale-95 flex items-center justify-center font-bold text-xs"
                            >
                                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                                </span>
                                SOS
                            </button>
                        </div>

                        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                            <div className="bg-white/95 backdrop-blur px-6 py-4 rounded-2xl shadow-xl border border-slate-100">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Distance Remaining</p>
                                <p className="text-3xl font-bold text-slate-900 tracking-tight">Active Room</p>
                            </div>
                            <Button 
                                size="lg" 
                                variant="secondary" 
                                onClick={() => setShowFullMap(true)}
                                className="h-16 w-16 rounded-full p-0 flex items-center justify-center shadow-xl bg-white border-none text-brand-secondary hover:scale-110 transition-transform hover:bg-white"
                            >
                                <Navigation size={32} fill="currentColor" />
                            </Button>
                        </div>
                    </div>
                    <div className="p-8 md:p-10 bg-white">
                        <div className="mb-10">
                            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">Next Destination</p>
                            <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                                {activeJob.status === ShipmentStatus.ASSIGNED ? activeJob.pickup.address : activeJob.dropoff.address}
                            </h2>
                        </div>
                        <div className="space-y-12 relative pl-3">
                            <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-slate-100"></div>
                            <div className="flex items-start relative group">
                                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mr-6 z-10 shrink-0 shadow-sm transition-colors ${
                                    activeJob.status !== ShipmentStatus.ASSIGNED 
                                    ? 'bg-green-50 border-green-500 text-green-600' 
                                    : 'bg-white border-slate-200 text-slate-300'
                                }`}>
                                    <CheckCircle size={20} />
                                </div>
                                <div className={activeJob.status !== ShipmentStatus.ASSIGNED ? 'opacity-50' : ''}>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Pickup Point</p>
                                    <p className="text-xl text-slate-800 leading-snug font-bold">{activeJob.pickup.address}</p>
                                </div>
                            </div>
                            <div className="flex items-start relative">
                                <div className="w-12 h-12 rounded-full bg-white border-[4px] border-brand-secondary flex items-center justify-center mr-6 z-10 shadow-lg ring-4 ring-blue-50 shrink-0 text-brand-secondary">
                                    <MapPin size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-brand-secondary uppercase tracking-wide mb-1">Dropoff Point</p>
                                    <p className="text-xl text-slate-900 font-bold leading-snug">{activeJob.dropoff.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="space-y-8">
                <Card className="border border-slate-200 shadow-sm p-6 hover:shadow-md rounded-3xl">
                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-500 text-xl border border-slate-200">C</div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1 font-bold uppercase tracking-wide">Customer</p>
                            <p className="text-xl font-bold text-slate-900">Shoprite NG</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            className="rounded-full w-14 h-14 p-0 flex items-center justify-center border-slate-200 shadow-sm bg-white hover:bg-slate-50 text-slate-600 hover:text-brand-primary"
                            onClick={() => setShowCustomerChat(true)}
                        >
                            <MessageSquare size={24} />
                        </Button>
                        <Button variant="secondary" size="sm" className="rounded-full w-14 h-14 p-0 flex items-center justify-center border-slate-200 shadow-sm bg-white hover:bg-slate-50 text-slate-600 hover:text-green-600">
                            <Phone size={24} />
                        </Button>
                    </div>
                    </div>
                </Card>
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 text-lg">Actions</h3>
                    <div className="flex flex-col gap-4">
                        <Button variant="cta" className="w-full py-4 text-lg shadow-lg shadow-orange-500/20 rounded-xl font-bold" onClick={handleStatusUpdate}>
                            {getStatusButtonText()}
                        </Button>
                        <Button variant="danger" className="w-full shadow-sm py-4 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold" onClick={() => toast.success("Issue Reported!")}>
                            <XCircle size={20} className="mr-2" /> Report Issue
                        </Button>
                    </div>
                </div>
            </div>
         </div>
      </div>
    );
};
