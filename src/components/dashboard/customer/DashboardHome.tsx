import React from 'react';
import { Plus, Truck, MapPin, MessageSquare, Phone, Star, Package, Wallet, CheckCircle2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Shipment, ShipmentStatus, Driver, User } from '../../../types';

interface DashboardHomeProps {
    user: User;
    shipments: Shipment[];
    drivers: Driver[];
    activeShipment?: Shipment;
    setView: (view: any) => void;
    setShowDriverChat: (show: boolean) => void;
    handleSelectDriver: (driver: Driver) => void;
    setSelectedHistoryItem: (shipment: Shipment) => void;
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

export const DashboardHome = ({ user, shipments, drivers, activeShipment, setView, setShowDriverChat, handleSelectDriver, setSelectedHistoryItem }: DashboardHomeProps) => (
      <div className="fade-in space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
                  <p className="text-slate-500 font-medium">Welcome back, {user.name.split(' ')[0]}.</p>
              </div>
              <Button onClick={() => setView('new-shipment')} className="font-bold shadow-lg shadow-brand-primary/20"><Plus size={18} className="mr-2"/> New Shipment</Button>
          </div>
          
          {/* Active Live Delivery Card */}
          {activeShipment && (
              <div className="bg-white border border-brand-primary/10 rounded-3xl p-6 shadow-xl shadow-brand-primary/5 relative overflow-hidden group hover:border-brand-primary/30 transition-all">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
                  
                  <div className="flex items-center justify-between mb-6 relative z-10">
                      <div className="flex items-center gap-3">
                          <div className="relative">
                              <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute -top-1 -right-1"></div>
                              <div className="p-2 bg-brand-primary text-white rounded-xl shadow-lg shadow-brand-primary/30">
                                  <Truck size={20} />
                              </div>
                          </div>
                          <div>
                              <h3 className="font-bold text-slate-900 text-lg">Live Delivery</h3>
                              <p className="text-xs text-slate-500 font-medium">{activeShipment.trackingId}</p>
                          </div>
                      </div>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                          {getStatusLabel(activeShipment.status)}
                      </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                      <div className="space-y-6">
                          <div className="flex gap-4 relative">
                              <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-slate-100 -z-10"></div>
                              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 z-10">
                                  <div className="w-2.5 h-2.5 bg-slate-400 rounded-full"></div>
                              </div>
                              <div>
                                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Pickup</p>
                                  <p className="font-bold text-slate-900">{activeShipment.pickup.address}</p>
                              </div>
                          </div>
                          <div className="flex gap-4">
                              <div className="w-8 h-8 rounded-full bg-brand-light border border-brand-secondary flex items-center justify-center shrink-0 z-10">
                                  <MapPin size={16} className="text-brand-secondary"/>
                              </div>
                              <div>
                                  <p className="text-xs text-brand-secondary font-bold uppercase tracking-wide mb-1">Dropoff</p>
                                  <p className="font-bold text-slate-900">{activeShipment.dropoff.address}</p>
                              </div>
                          </div>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                          <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-blue-100 text-brand-primary`}>
                                      D
                                  </div>
                                  <div>
                                      <p className="font-bold text-slate-900 text-sm">Assigned Driver</p>
                                      <div className="flex items-center gap-1">
                                          <Star size={10} className="text-yellow-500 fill-current"/>
                                          <span className="text-xs text-slate-600 font-bold">4.8</span>
                                      </div>
                                  </div>
                              </div>
                              <div className="flex gap-2">
                                  <button onClick={() => setShowDriverChat(true)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-brand-primary hover:border-brand-primary transition-all shadow-sm">
                                      <MessageSquare size={18}/>
                                  </button>
                                  <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-green-600 hover:border-green-600 transition-all shadow-sm">
                                      <Phone size={18}/>
                                  </button>
                              </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white p-3 rounded-xl border border-slate-100">
                                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Vehicle</p>
                                  <p className="text-xs font-bold text-slate-900">Box Truck • 5 Tons</p>
                              </div>
                              <div className="bg-white p-3 rounded-xl border border-slate-100">
                                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Est. Arrival</p>
                                  <p className="text-xs font-bold text-slate-900">25 mins</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Card className="p-6 bg-brand-primary text-white relative overflow-hidden border-none shadow-xl shadow-brand-primary/30">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-10 translate-x-10 blur-2xl"></div>
                 <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-white/20 rounded-lg"><Package size={16}/></div>
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Active Shipments</p>
                    </div>
                    <h3 className="text-4xl font-black">{shipments.filter(s => [ShipmentStatus.PENDING, ShipmentStatus.ASSIGNED, ShipmentStatus.IN_TRANSIT].includes(s.status)).length}</h3>
                 </div>
             </Card>
             <Card className="p-6">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-blue-50 text-brand-primary rounded-lg"><Wallet size={16}/></div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Spent</p>
                 </div>
                 <h3 className="text-4xl font-black text-slate-900">₦2.4M</h3>
             </Card>
              <Card className="p-6">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-green-50 text-green-600 rounded-lg"><CheckCircle2 size={16}/></div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Completed</p>
                 </div>
                 <h3 className="text-4xl font-black text-slate-900">{shipments.filter(s => s.status === ShipmentStatus.DELIVERED).length}</h3>
             </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-lg text-slate-900">Recent Activity</h3>
                      <button onClick={() => setView('history')} className="text-brand-primary text-sm font-bold hover:underline">View All</button>
                  </div>
                  <div className="space-y-4">
                      {shipments.length > 0 ? shipments.slice(0, 3).map(s => (
                          <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all cursor-pointer" onClick={() => setSelectedHistoryItem(s)}>
                              <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center shadow-sm">
                                      <Package size={20} className="text-slate-400"/>
                                  </div>
                                  <div>
                                      <p className="font-bold text-slate-900 text-sm">{s.trackingId}</p>
                                      <p className="text-xs text-slate-500 font-medium">{getStatusLabel(s.status)}</p>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <span className="font-bold text-slate-900 text-sm block">₦{s.price.toLocaleString()}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">{new Date(s.date).toLocaleDateString()}</span>
                              </div>
                          </div>
                      )) : (
                          <div className="text-center py-8 text-slate-400">
                              <p className="text-sm">No recent activity</p>
                          </div>
                      )}
                  </div>
              </Card>
              <Card className="border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-lg text-slate-900">Active Drivers</h3>
                      <button onClick={() => setView('find-drivers')} className="text-brand-primary text-sm font-bold hover:underline">Find Drivers</button>
                  </div>
                  <div className="space-y-4">
                       {drivers.filter(d => d.isOnline).slice(0, 3).map(d => (
                           <div key={d.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                               <div className="flex items-center gap-4">
                                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${d.avatarColor}`}>
                                       {d.name.charAt(0)}
                                   </div>
                                   <div>
                                       <p className="font-bold text-slate-900 text-sm">{d.name}</p>
                                       <div className="flex items-center gap-1.5 mt-0.5">
                                           <span className="text-xs text-slate-500 font-medium">{d.vehicleType}</span>
                                           <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                           <span className="text-xs font-bold text-slate-700 flex items-center"><Star size={10} className="text-yellow-400 mr-0.5 fill-current"/> {d.rating}</span>
                                       </div>
                                   </div>
                               </div>
                               <Button size="sm" variant="secondary" onClick={() => handleSelectDriver(d)}>Book</Button>
                           </div>
                       ))}
                       {drivers.filter(d => d.isOnline).length === 0 && (
                           <div className="text-center py-8 text-slate-400">
                               <p className="text-sm">No drivers online nearby</p>
                           </div>
                       )}
                  </div>
              </Card>
          </div>
      </div>
  );
