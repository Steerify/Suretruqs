import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Shipment, Driver, ShipmentStatus } from '../../../types';
import { MapPin, User, Package, Clock, MessageCircle, CheckCircle, AlertCircle, ChevronRight, UserPlus, Truck, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminDriverRequestsProps {
  shipments: Shipment[];
  drivers: Driver[];
  onAssignDriver: (shipmentId: string, driverId: string, adminId: string, notes?: string) => void;
  onMessageDriver: (shipmentId: string, driverId: string) => void;
  onMessageCustomer: (shipmentId: string) => void;
}

// Sub-component for Mobile Card moved outside
const RequestCard: React.FC<{ shipment: Shipment, onClick: (s: Shipment) => void, onChat: (id: string) => void }> = ({ shipment, onClick, onChat }) => (
    <Card className="p-5 border border-slate-100 shadow-sm mb-4">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${shipment.status === ShipmentStatus.PENDING_REVIEW ? 'bg-orange-50 text-brand-orange' : 'bg-blue-50 text-brand-primary'}`}>
                    <Package size={20} />
                </div>
                <div>
                    <h3 className="font-black text-slate-900">#{shipment.trackingId}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{shipment.cargoType}</p>
                </div>
            </div>
            {shipment.status === ShipmentStatus.PENDING_REVIEW && (
                <button 
                    onClick={() => onClick(shipment)}
                    className="px-4 py-2 bg-brand-orange text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-lg shadow-orange-500/20"
                >
                    Assign
                </button>
            )}
        </div>
        <div className="space-y-3 pl-2 border-l-2 border-slate-100 ml-5 my-4">
             <div className="relative pl-4">
                <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-brand-primary ring-2 ring-white" />
                <p className="text-xs font-medium text-slate-600 line-clamp-1">{shipment.pickup.address}</p>
             </div>
             <div className="relative pl-4">
                <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-brand-orange ring-2 ring-white" />
                <p className="text-xs font-medium text-slate-600 line-clamp-1">{shipment.dropoff.address}</p>
             </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">{shipment.instructions?.priority || 'NORMAL'}</span>
            <Button variant="ghost" className="h-8 text-[10px] font-bold" onClick={() => onChat(shipment.id)}>
                <MessageCircle size={14} className="mr-1.5"/> Chat
            </Button>
        </div>
    </Card>
);

export const AdminDriverRequests: React.FC<AdminDriverRequestsProps> = ({
  shipments,
  drivers,
  onAssignDriver,
  onMessageDriver,
  onMessageCustomer
}) => {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'pending' | 'assigned'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const pendingRequests = (shipments || []).filter(s => s.status === ShipmentStatus.PENDING_REVIEW);
  const assignedRequests = (shipments || []).filter(s => s.status === ShipmentStatus.ASSIGNED);

  const displayedShipments = (filterStatus === 'pending' ? pendingRequests : assignedRequests).filter(s => 
    s.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.pickup.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const availableDrivers = (drivers || []).filter(d => d.availabilityStatus === 'ONLINE');

  const handleAssign = () => {
    if (!selectedShipment || !selectedDriver) return;
    onAssignDriver(selectedShipment.id, selectedDriver, (selectedShipment as any).adminId || 'ADMIN', adminNotes);
    setSelectedShipment(null);
    setAdminNotes('');
    setSelectedDriver('');
    toast.success("Driver assigned successfully!");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Job Dispatch</h2>
            <p className="text-slate-500 font-medium">Allocate drivers and manage route assignments</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search requests..." 
                    className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none text-sm font-medium w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="bg-white p-1.5 rounded-xl flex gap-1 border border-slate-100 shadow-sm overflow-x-auto">
                <button 
                    onClick={() => setFilterStatus('pending')}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${filterStatus === 'pending' ? 'bg-brand-orange text-white shadow-md shadow-orange-500/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                >
                    Pending ({pendingRequests.length})
                </button>
                <button 
                    onClick={() => setFilterStatus('assigned')}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${filterStatus === 'assigned' ? 'bg-brand-primary text-white shadow-md shadow-blue-500/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                >
                    Assigned ({assignedRequests.length})
                </button>
            </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
                <tr className="bg-slate-50 text-slate-500 font-black uppercase tracking-widest text-[10px] border-b border-slate-100">
                    <th className="px-8 py-5">Request ID</th>
                    <th className="px-8 py-5">Route Info</th>
                    <th className="px-8 py-5">Cargo & Priority</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {displayedShipments.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="p-12 text-center text-slate-400">
                            <p className="font-bold">No {filterStatus} requests found</p>
                        </td>
                    </tr>
                ) : (
                    displayedShipments.map(shipment => (
                        <tr key={shipment.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${shipment.status === ShipmentStatus.PENDING_REVIEW ? 'bg-orange-50 text-brand-orange' : 'bg-blue-50 text-brand-primary'}`}>
                                        <Package size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">#{shipment.trackingId}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(shipment.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <div className="space-y-1 max-w-[250px]">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 truncate">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" /> {shipment.pickup.address}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 truncate">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" /> {shipment.dropoff.address}
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <div>
                                    <p className="font-black text-slate-900 uppercase tracking-wider">{shipment.instructions?.priority || 'NORMAL'}</p>
                                    <p className="text-[10px] text-slate-500 font-medium capitalize">{shipment.cargoType} • {shipment.weight || 'n/a'}</p>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                    shipment.status === ShipmentStatus.PENDING_REVIEW 
                                    ? 'bg-orange-50 text-brand-orange border-orange-100' 
                                    : 'bg-blue-50 text-brand-primary border-blue-100'
                                }`}>
                                    {shipment.status === ShipmentStatus.PENDING_REVIEW && <Clock size={10} className="animate-pulse"/>}
                                    {shipment.status.replace('_', ' ')}
                                </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => onMessageCustomer(shipment.id)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-brand-primary transition-colors" title="Message Customer">
                                        <MessageCircle size={16} />
                                    </button>
                                    {shipment.status === ShipmentStatus.PENDING_REVIEW && (
                                        <Button 
                                            size="sm"
                                            onClick={() => setSelectedShipment(shipment)}
                                            className="bg-brand-primary hover:bg-blue-700 text-white border-none rounded-lg text-[10px] font-black uppercase tracking-wider px-4 h-9 shadow-lg shadow-blue-500/20"
                                        >
                                            Assign Driver
                                        </Button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
          </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
         {displayedShipments.length === 0 ? (
             <div className="p-12 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-[2rem]">
                 <p className="font-bold">No requests found</p>
             </div>
         ) : (
            displayedShipments.map(s => <RequestCard key={s.id} shipment={s} onClick={setSelectedShipment} onChat={onMessageCustomer} />)
         )}
      </div>

      {/* Assignment Modal/Overlay */}
      {selectedShipment && (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedShipment(null)} />
            <div className="relative w-full max-w-md h-full bg-white shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-slate-900">Assign Driver</h3>
                        <p className="text-sm text-slate-500 font-medium">Order #{selectedShipment.trackingId}</p>
                    </div>
                    <button onClick={() => setSelectedShipment(null)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6">
                    {/* Map Context (Simulated) */}
                    <div className="h-40 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center relative overflow-hidden group">
                        <MapPin className="text-slate-300 group-hover:text-brand-primary transition-colors" size={32} />
                        <p className="absolute bottom-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Route Visualization</p>
                    </div>

                    <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                             <Truck size={14} className="text-brand-primary"/> Available Drivers ({availableDrivers.length})
                        </h4>
                        <div className="space-y-2">
                            {availableDrivers.length > 0 ? availableDrivers.map(d => (
                                <button
                                    key={d.id}
                                    onClick={() => setSelectedDriver(d.id)}
                                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                                        selectedDriver === d.id 
                                        ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-blue-500/20' 
                                        : 'bg-white border-slate-100 text-slate-700 hover:border-brand-primary/30'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${selectedDriver === d.id ? 'bg-white/20' : 'bg-slate-100'}`}>
                                            {(() => {
                                                const parts = (d.name || '').split(' ');
                                                if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
                                                return (d.name || '?').charAt(0).toUpperCase();
                                            })()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{d.name}</p>
                                            <p className={`text-[10px] ${selectedDriver === d.id ? 'text-blue-100' : 'text-slate-400'}`}>{d.vehicleType} • ⭐ {d.rating}</p>
                                        </div>
                                    </div>
                                    {selectedDriver === d.id && <CheckCircle size={18} />}
                                </button>
                            )) : (
                                <div className="p-6 text-center border-2 border-dashed border-slate-100 rounded-xl">
                                    <p className="text-xs text-slate-400 font-bold">No drivers online in this area.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                         <label className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2 block">Instructions</label>
                         <textarea 
                             className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none transition-all"
                             placeholder="Add note for driver..."
                             value={adminNotes}
                             onChange={(e) => setAdminNotes(e.target.value)}
                         />
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-auto">
                    <Button 
                        disabled={!selectedDriver} 
                        className="w-full py-4 text-xs font-black uppercase tracking-widest bg-brand-primary hover:bg-blue-700 text-white border-none rounded-xl disabled:opacity-50"
                        onClick={handleAssign}
                    >
                        Confirm Assignment
                    </Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
