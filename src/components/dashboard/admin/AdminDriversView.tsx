import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Driver, Shipment, ShipmentStatus } from '../../../types';
import { Truck, Star, Phone, MessageSquare, MapPin, Search, Filter, Circle, Clock, MoreHorizontal } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import toast from 'react-hot-toast';

export const AdminDriversView = ({ 
    drivers, 
    shipments,
    onMessageDriver 
}: { 
    drivers: Driver[], 
    shipments: Shipment[],
    onMessageDriver?: (driverId: string, name: string) => void 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Online' | 'Offline' | 'Busy'>('All');

    const getDriverStatus = (driver: Driver) => {
        const activeShipment = shipments.find(s => s.driverId === driver.id && [ShipmentStatus.ASSIGNED, ShipmentStatus.PICKED_UP, ShipmentStatus.IN_TRANSIT].includes(s.status));
        if (activeShipment) return 'Busy';
        return driver.isOnline ? 'Online' : 'Offline';
    };

    const filteredDrivers = drivers.filter(driver => {
        const status = getDriverStatus(driver);
        const matchesStatus = statusFilter === 'All' || status === statusFilter;
        const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              driver.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-6 admin-tab-content">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">Fleet Management</h2>
                   <p className="text-slate-500 font-medium mt-1">Monitor driver availability and status in real-time.</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search drivers..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                    </div>
                    <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1">
                        {['All', 'Online', 'Busy', 'Offline'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setStatusFilter(filter as any)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                    statusFilter === filter 
                                    ? 'bg-brand-primary text-white shadow-md' 
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDrivers.map(driver => {
                    const status = getDriverStatus(driver);
                    const activeShipment = shipments.find(s => s.driverId === driver.id && [ShipmentStatus.ASSIGNED, ShipmentStatus.PICKED_UP, ShipmentStatus.IN_TRANSIT].includes(s.status));

                    return (
                        <Card key={driver.id} className="p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[4rem] -z-0 transition-colors group-hover:bg-blue-50/50"></div>
                            
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg overflow-hidden shrink-0 ${
                                            status === 'Online' ? 'bg-green-500 shadow-green-500/20' : 
                                            status === 'Busy' ? 'bg-brand-orange shadow-orange-500/20' : 
                                            'bg-slate-400'
                                        }`}>
                                            {(() => {
                                                const parts = (driver.name || '').split(' ');
                                                if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
                                                return (driver.name || '?').charAt(0).toUpperCase();
                                            })()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-slate-900 text-lg truncate w-full">{driver.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                    status === 'Online' ? 'bg-green-50 text-green-600' : 
                                                    status === 'Busy' ? 'bg-orange-50 text-brand-orange' : 
                                                    'bg-slate-100 text-slate-500'
                                                }`}>
                                                    <Circle size={6} fill="currentColor" stroke="none" />
                                                    {status}
                                                </span>
                                                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                                    {driver.rating.toFixed(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-slate-300 hover:text-slate-600 transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm">
                                                <Truck size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Vehicle</p>
                                                <p className="text-xs font-bold text-slate-700">{driver.vehicleType} • {driver.plateNumber}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {activeShipment ? (
                                        <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100/50">
                                            <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                <Clock size={12} /> Currently Active
                                            </p>
                                            <div className="flex items-center justify-between">
                                                 <div>
                                                     <p className="text-xs font-bold text-slate-900">Shipment #{activeShipment.trackingId}</p>
                                                     <p className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">{activeShipment.dropoff.address}</p>
                                                 </div>
                                                 <Button variant="ghost" className="h-8 text-[10px] px-3 bg-white shadow-sm font-bold text-slate-600 hover:text-brand-primary">View</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/50 flex items-center justify-center h-[74px]">
                                            <p className="text-xs font-bold text-slate-400">No active job</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <Button 
                                        variant="secondary" 
                                        className="flex-1 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 border-none items-center justify-center flex"
                                        onClick={() => toast.error("Call feature not yet available")}
                                    >
                                        <Phone size={16} className="mr-2" /> Call
                                    </Button>
                                    <Button 
                                        className="flex-1 rounded-xl font-bold shadow-lg shadow-brand-primary/20 items-center justify-center flex"
                                        onClick={() => onMessageDriver && onMessageDriver(driver.id, driver.name)}
                                    >
                                        <MessageSquare size={16} className="mr-2" /> Chat
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    );
                })}

                {filteredDrivers.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400">
                        <Truck size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="text-sm font-bold">No drivers found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
