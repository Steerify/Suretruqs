import React, { useState } from 'react';
import { Search, Star, Truck, ArrowRight } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Driver } from '../../../types';

interface AvailableDriversViewProps {
    drivers: Driver[];
    handleSelectDriver: (driver: Driver) => void;
}

export const AvailableDriversView = ({ drivers, handleSelectDriver }: AvailableDriversViewProps) => {
    const [driverFilter, setDriverFilter] = useState('All');
    const [driverSearch, setDriverSearch] = useState('');

    const vehicleTypes = ['All', 'Box Truck', 'Flatbed', 'Mini Van', 'Trailer'];
    
    const filteredDrivers = drivers.filter(d => 
        d.isOnline && 
        (driverFilter === 'All' || d.vehicleType === driverFilter) &&
        (d.name.toLowerCase().includes(driverSearch.toLowerCase()) || d.plateNumber.toLowerCase().includes(driverSearch.toLowerCase()))
    );

    return (
      <div className="fade-in space-y-8">
          {/* Enhanced Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
              <div className="space-y-1">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Available Drivers</h2>
                  <p className="text-slate-500 font-medium text-lg">Find the perfect driver for your cargo today.</p>
              </div>
              
              <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 sm:w-80 group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18}/>
                      <input 
                        type="text" 
                        placeholder="Search by name or plate..." 
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-brand-primary outline-none text-sm font-semibold text-slate-900 transition-all shadow-sm" 
                        value={driverSearch} 
                        onChange={e => setDriverSearch(e.target.value)}
                      />
                  </div>
              </div>
          </div>

          {/* Modern Filter Pills */}
          <div className="flex flex-wrap gap-2 pb-2">
              {vehicleTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setDriverFilter(type)}
                    className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
                        driverFilter === type 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                    }`}
                  >
                      {type}
                  </button>
              ))}
          </div>

          {/* Driver Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredDrivers.length > 0 ? (
                  filteredDrivers.map(driver => (
                  <div key={driver.id} className="relative group">
                      <Card className="p-0 border border-slate-200 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500 cursor-default bg-white flex flex-col h-full">
                          {/* Card Header with Status */}
                          <div className="p-8 pb-4 flex items-start justify-between">
                              <div className="flex items-center gap-5">
                                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-black shadow-xl border-4 border-white ${driver.avatarColor} text-white relative group-hover:scale-105 transition-transform duration-500`}>
                                      {driver.name.charAt(0)}
                                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-4 border-white shadow-sm"></div>
                                  </div>
                                  <div className="space-y-1">
                                      <h3 className="font-black text-xl text-slate-900 tracking-tight group-hover:text-brand-primary transition-colors">{driver.name}</h3>
                                      <div className="flex items-center gap-2">
                                          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                                              <Truck size={14} />
                                          </div>
                                          <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">{driver.vehicleType}</span>
                                      </div>
                                  </div>
                              </div>
                              <div className="flex items-center gap-1.5 bg-yellow-400 text-white px-3 py-1.5 rounded-2xl text-xs font-black shadow-lg shadow-yellow-500/20">
                                  <Star size={14} fill="currentColor"/>
                                  <span>{driver.rating}</span>
                              </div>
                          </div>
                          
                          {/* Driver Metrics */}
                          <div className="px-8 py-6 flex-1">
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-3xl group/metric hover:bg-white hover:border-blue-100 transition-colors">
                                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Location</p>
                                      <p className="font-bold text-slate-800 text-sm truncate">{driver.location}</p>
                                  </div>
                                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-3xl group/metric hover:bg-white hover:border-blue-100 transition-colors">
                                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Success Rate</p>
                                      <p className="font-bold text-slate-800 text-sm">98%</p>
                                  </div>
                                  <div className="col-span-2 bg-slate-50 border border-slate-100 p-4 rounded-3xl flex items-center justify-between group/metric hover:bg-white hover:border-blue-100 transition-colors">
                                      <div>
                                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Plate Number</p>
                                          <p className="font-mono font-black text-slate-900 text-sm tracking-wider">{driver.plateNumber}</p>
                                      </div>
                                      <div className="text-right">
                                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Trips</p>
                                          <p className="font-bold text-slate-800 text-sm">{driver.trips} trips</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          
                          {/* CTA Section */}
                          <div className="p-6 pt-0 mt-auto">
                              <Button 
                                className="w-full py-4 rounded-[1.5rem] bg-brand-primary hover:bg-blue-700 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3" 
                                onClick={() => handleSelectDriver(driver)}
                              >
                                  Book This Driver
                                  <ArrowRight size={18} />
                              </Button>
                          </div>
                      </Card>
                  </div>
              ))) : (
                  <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center">
                      <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-6 group hover:scale-110 transition-transform duration-500">
                          <Truck size={48} className="group-hover:text-slate-300 transition-colors" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">No drivers available</h3>
                      <p className="text-slate-500 font-medium text-lg mt-2 max-w-sm">We couldn't find any drivers matching your current filters. Try searching for something else.</p>
                      <button 
                        onClick={() => {setDriverFilter('All'); setDriverSearch('')}}
                        className="mt-8 text-brand-primary font-black uppercase tracking-widest text-xs hover:underline"
                      >
                          Clear all filters
                      </button>
                  </div>
              )}
          </div>
      </div>
    );
};
