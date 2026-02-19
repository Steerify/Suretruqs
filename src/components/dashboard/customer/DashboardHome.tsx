import React from 'react';
import { Plus, Truck, MapPin, MessageSquare, Phone, Star, Package, CheckCircle2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Shipment, ShipmentStatus, User } from '../../../types';

interface DashboardHomeProps {
    user: User;
    shipments: Shipment[];
    activeShipment?: Shipment;
    setView: (view: any) => void;
    setShowDriverChat: (show: boolean) => void;
    setSelectedHistoryItem: (shipment: Shipment) => void;
    setShowFullMap: (show: boolean) => void;
}

const getStatusLabel = (status: ShipmentStatus) => {
    switch (status) {
        case ShipmentStatus.PENDING_REVIEW: return 'Pending Review';
        case ShipmentStatus.SCHEDULED: return 'Scheduled';
        case ShipmentStatus.ASSIGNED: return 'Driver Assigned';
        case ShipmentStatus.PICKED_UP: return 'Cargo Picked Up';
        case ShipmentStatus.IN_TRANSIT: return 'In Transit';
        case ShipmentStatus.DELIVERED: return 'Delivered';
        case ShipmentStatus.ISSUE_REPORTED: return 'Issue Reported';
        case ShipmentStatus.CANCELLED: return 'Cancelled';
        default: return (status as string).replace('_', ' ');
    }
};

export const DashboardHome = ({ user, shipments, activeShipment, setView, setShowDriverChat, setSelectedHistoryItem, setShowFullMap }: DashboardHomeProps) => (
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
                          {/* Show driver info only during active delivery */}
                          {activeShipment.driverId && [ShipmentStatus.ASSIGNED, ShipmentStatus.PICKED_UP, ShipmentStatus.IN_TRANSIT].includes(activeShipment.status) ? (
                              <>
                                  <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center font-bold text-sm text-green-700 relative">
                                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                                              D
                                          </div>
                                          <div>
                                              <p className="font-bold text-slate-900 text-sm">Driver En Route</p>
                                              <div className="flex items-center gap-1">
                                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                  <span className="text-xs text-green-600 font-bold">Active</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>

                                  {/* Driver arrival notification */}
                                  {activeShipment.status === ShipmentStatus.PICKED_UP && (
                                      <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3 flex items-center gap-2">
                                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                              </svg>
                                          </div>
                                          <div>
                                              <p className="text-xs font-bold text-green-900">Driver has arrived!</p>
                                              <p className="text-[10px] text-green-700">Package picked up and in transit</p>
                                          </div>
                                      </div>
                                  )}

                                  <div className="grid grid-cols-2 gap-2 mb-3">
                                      <button 
                                          onClick={() => setShowDriverChat(true)} 
                                          className="p-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs"
                                      >
                                          <MessageSquare size={14}/>
                                          Chat Driver
                                      </button>
                                      <button 
                                          onClick={() => setShowFullMap(true)}
                                          className="p-3 bg-white border-2 border-green-500 text-green-700 rounded-xl font-bold hover:bg-green-50 transition-all flex items-center justify-center gap-2 text-xs"
                                      >
                                          <MapPin size={14}/>
                                          Track Live
                                      </button>
                                  </div>

                                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Estimated Arrival</p>
                                      <p className="text-sm font-bold text-slate-900">
                                          {activeShipment.status === ShipmentStatus.PICKED_UP ? '25 mins' : 
                                           activeShipment.status === ShipmentStatus.IN_TRANSIT ? '15 mins' : 
                                           'Arriving soon'}
                                      </p>
                                  </div>
                              </>
                          ) : (
                              <>
                                  {/* Before driver assignment or after delivery */}
                                  <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-sm text-brand-primary">
                                              AS
                                          </div>
                                          <div>
                                              <p className="font-bold text-slate-900 text-sm">Admin Support</p>
                                              <div className="flex items-center gap-1">
                                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                                  <span className="text-xs text-slate-600 font-bold">Available</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>

                                  <button 
                                      onClick={() => setShowDriverChat(true)} 
                                      className="w-full p-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm mb-3"
                                  >
                                      <MessageSquare size={16}/>
                                      Contact Support
                                  </button>

                                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                                      <p className="text-xs font-bold text-blue-900 mb-1">
                                          {activeShipment.status === ShipmentStatus.PENDING_REVIEW ? '⏳ Assigning Driver' : '✅ Delivery Status'}
                                      </p>
                                      <p className="text-[10px] text-blue-700">
                                          {activeShipment.status === ShipmentStatus.PENDING_REVIEW 
                                              ? 'Our team is finding the best driver for your delivery' 
                                              : 'Your shipment has been processed'}
                                      </p>
                                  </div>
                              </>
                          )}
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
                    <h3 className="text-4xl font-black">{shipments.filter(s => [ShipmentStatus.PENDING_REVIEW, ShipmentStatus.ASSIGNED, ShipmentStatus.PICKED_UP, ShipmentStatus.IN_TRANSIT].includes(s.status)).length}</h3>
                 </div>
             </Card>
             <Card className="p-6">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-blue-50 text-brand-primary rounded-lg"><Package size={16}/></div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pending Review</p>
                 </div>
                 <h3 className="text-4xl font-black text-slate-900">{shipments.filter(s => s.status === ShipmentStatus.PENDING_REVIEW).length}</h3>
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
                                  <span className="font-bold text-slate-900 text-sm block">{getStatusLabel(s.status)}</span>
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
                      <h3 className="font-bold text-lg text-slate-900">Quick Actions</h3>
                  </div>
                  <div className="space-y-3">
                      <button 
                          onClick={() => setView('new-shipment')} 
                          className="w-full p-4 bg-gradient-to-r from-brand-primary to-blue-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                          <Plus size={18} />
                          Create New Shipment
                      </button>
                      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mt-4">
                          <p className="text-sm font-bold text-blue-900 mb-1">📋 Need a driver?</p>
                          <p className="text-xs text-blue-700">Submit a shipment request and our admin team will assign the best driver for your delivery.</p>
                      </div>
                  </div>
              </Card>
          </div>
      </div>
  );
