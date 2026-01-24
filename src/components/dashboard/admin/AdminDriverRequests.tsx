import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Shipment, Driver, ShipmentStatus } from '../../../types';
import { MapPin, User, Package, Clock, MessageCircle, CheckCircle, AlertCircle, ChevronRight, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminDriverRequestsProps {
  shipments: Shipment[];
  drivers: Driver[];
  onAssignDriver: (shipmentId: string, driverId: string, adminId: string, notes?: string) => void;
  onMessageDriver: (shipmentId: string, driverId: string) => void;
  onMessageCustomer: (shipmentId: string) => void;
}

export const AdminDriverRequests: React.FC<AdminDriverRequestsProps> = ({
  shipments,
  drivers,
  onAssignDriver,
  onMessageDriver,
  onMessageCustomer
}) => {
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'pending' | 'assigned'>('pending');

  const pendingRequests = shipments.filter(s => s.status === ShipmentStatus.PENDING);
  const assignedRequests = shipments.filter(s => s.status === ShipmentStatus.ASSIGNED);

  const displayedShipments = filterStatus === 'pending' ? pendingRequests : assignedRequests;
  const availableDrivers = drivers.filter(d => d.isOnline);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Job Dispatch Center</h2>
            <p className="text-slate-500 font-medium">Allocate drivers and manage route assignments</p>
        </div>
        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1">
            <button 
                onClick={() => setFilterStatus('pending')}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterStatus === 'pending' ? 'bg-white shadow-lg text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
                Pending ({pendingRequests.length})
            </button>
            <button 
                onClick={() => setFilterStatus('assigned')}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterStatus === 'assigned' ? 'bg-white shadow-lg text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
                Assigned ({assignedRequests.length})
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {displayedShipments.length === 0 ? (
          <div className="py-32 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100 italic text-slate-400">
             <Package size={64} className="mx-auto mb-4 opacity-5" />
             <p className="font-bold">No {filterStatus} dispatch requests found.</p>
          </div>
        ) : (
          displayedShipments.map(shipment => (
            <Card key={shipment.id} className="p-0 overflow-hidden border-none shadow-xl shadow-slate-200/50 group">
                <div className="p-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black ${shipment.status === ShipmentStatus.PENDING ? 'bg-orange-50 text-brand-orange' : 'bg-blue-50 text-brand-primary'}`}>
                                <Package size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">#{shipment.trackingId}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{shipment.cargoType} • {shipment.weight}kg</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" className="rounded-xl border-slate-100 text-slate-500 hover:bg-slate-50 font-bold px-6" onClick={() => onMessageCustomer(shipment.id)}>
                                <MessageCircle size={16} className="mr-2" /> Message Customer
                            </Button>
                            {shipment.status === ShipmentStatus.PENDING && (
                                <Button 
                                    className="rounded-xl bg-brand-secondary text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 h-auto shadow-lg shadow-blue-500/20 border-none"
                                    onClick={() => setSelectedShipment(selectedShipment === shipment.id ? null : shipment.id)}
                                >
                                    {selectedShipment === shipment.id ? 'Close Panel' : 'Assign Driver'}
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route Details</p>
                            <div className="space-y-3 relative">
                                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-brand-primary/10 border-l border-dashed border-brand-primary/30" />
                                <div className="flex items-start gap-3 relative">
                                    <div className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-50 mt-1 shrink-0" />
                                    <p className="text-xs font-bold text-slate-700 leading-relaxed">{shipment.pickup.address}</p>
                                </div>
                                <div className="flex items-start gap-3 relative">
                                    <div className="w-4 h-4 rounded-full bg-red-500 ring-4 ring-red-50 mt-1 shrink-0" />
                                    <p className="text-xs font-bold text-slate-700 leading-relaxed">{shipment.dropoff.address}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing & Vehicle</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white rounded-2xl border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">Quote</p>
                                    <p className="text-sm font-black text-slate-900">₦{shipment.price.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-white rounded-2xl border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">Vehicle</p>
                                    <p className="text-sm font-black text-slate-900 capitalize">{shipment.vehicleType}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Feed</p>
                            <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 text-brand-orange flex items-center justify-center animate-pulse">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-900 capitalize">{shipment.status.replace('_', ' ')}</p>
                                    <p className="text-[10px] text-slate-400 font-bold">Waiting for Administrative choice</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {selectedShipment === shipment.id && (
                        <div className="mt-8 pt-8 border-t border-slate-100 animate-in slide-in-from-top-4 duration-500">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                        <UserPlus size={18} className="text-brand-primary" />
                                        Drivers in Vicinity
                                    </h4>
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                        {availableDrivers.length > 0 ? availableDrivers.map(d => (
                                            <button 
                                                key={d.id}
                                                onClick={() => setSelectedDriver(d.id)}
                                                className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
                                                    selectedDriver === d.id ? 'bg-brand-secondary border-brand-secondary text-white shadow-lg' : 'bg-white border-slate-100 text-slate-700 hover:border-slate-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${selectedDriver === d.id ? 'bg-white/20' : 'bg-slate-100'}`}>
                                                        {d.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black">{d.name}</p>
                                                        <p className={`text-[10px] font-bold ${selectedDriver === d.id ? 'text-white/70' : 'text-slate-400'}`}>{d.vehicleType} • {d.plateNumber}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black">⭐ {d.rating}</span>
                                                    {selectedDriver === d.id && <CheckCircle size={16} />}
                                                </div>
                                            </button>
                                        )) : (
                                            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                                <p className="text-xs font-bold text-slate-400">No online drivers available.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Assignment Note</label>
                                        <textarea 
                                            rows={4}
                                            value={adminNotes}
                                            onChange={(e) => setAdminNotes(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none"
                                            placeholder="Add instructions for the driver..."
                                        />
                                    </div>
                                    <Button 
                                        disabled={!selectedDriver}
                                        onClick={() => {
                                            onAssignDriver(shipment.id, selectedDriver, (shipment as any).adminId || 'ADMIN', adminNotes);
                                            setSelectedShipment(null);
                                            toast.success("Driver assigned successfully!");
                                        }}
                                        className="w-full py-4 rounded-2xl bg-brand-secondary text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 border-none"
                                    >
                                        Execute Dispatch Protocol
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
