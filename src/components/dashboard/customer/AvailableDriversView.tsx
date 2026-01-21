import React, { useState } from 'react';
import { Search, Star, Truck } from 'lucide-react';
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

    return (
      <div className="fade-in space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Find Drivers</h2>
                  <p className="text-slate-500 font-medium">Available drivers in your area.</p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:flex-none">
                      <Search className="absolute left-3 top-3 text-slate-400" size={16}/>
                      <input type="text" placeholder="Search drivers..." className="w-full md:w-64 pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-sm font-medium bg-white text-slate-900" value={driverSearch} onChange={e => setDriverSearch(e.target.value)}/>
                  </div>
                  <select className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-brand-primary outline-none bg-white" value={driverFilter} onChange={e => setDriverFilter(e.target.value)}>
                      <option value="All">All Types</option>
                      <option value="Box Truck">Box Truck</option>
                      <option value="Flatbed">Flatbed</option>
                      <option value="Mini Van">Mini Van</option>
                  </select>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {drivers.filter(d => d.isOnline).length > 0 ? (
                  drivers.filter(d => d.isOnline).map(driver => (
                  <Card key={driver.id} className="p-6 hover:shadow-xl hover:border-brand-primary/30 transition-all cursor-default group border border-slate-200">
                      <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm ${driver.avatarColor}`}>
                                  {driver.name.charAt(0)}
                              </div>
                              <div>
                                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-primary transition-colors">{driver.name}</h3>
                                  <p className="text-sm text-slate-500 font-medium">{driver.vehicleType}</p>
                                  <div className="flex items-center gap-1 mt-1 bg-yellow-50 w-fit px-1.5 py-0.5 rounded text-yellow-700 text-xs font-bold border border-yellow-100">
                                      <Star size={12} className="text-yellow-500" fill="currentColor"/>
                                      <span>{driver.rating}</span>
                                  </div>
                              </div>
                          </div>
                          <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.1)]"></div>
                      </div>
                      
                      <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">Location</span>
                              <span className="font-bold text-slate-900">{driver.location}</span>
                          </div>
                           <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">Completed Trips</span>
                              <span className="font-bold text-slate-900">{driver.trips}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">Plate Number</span>
                              <span className="font-mono font-bold text-slate-600 text-xs bg-white px-2 py-0.5 rounded border border-slate-200">{driver.plateNumber}</span>
                          </div>
                      </div>
                      
                      <Button className="w-full py-3 shadow-lg shadow-blue-500/10 font-bold" onClick={() => handleSelectDriver(driver)}>Select Driver</Button>
                  </Card>
              ))) : (
                  <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                          <Truck size={32} />
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">No Drivers Found</h3>
                      <p className="text-slate-500">Try adjusting your filters or check back later.</p>
                  </div>
              )}
          </div>
      </div>
  );
};
