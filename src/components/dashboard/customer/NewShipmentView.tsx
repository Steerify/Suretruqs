import React, { useState } from 'react';
import { ArrowDownLeft, MapPin, X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Shipment, Driver } from '../../../types';

export const NewShipmentView = ({ onBack, onCreate, selectedDriver, onRemoveDriver }: { onBack: () => void, onCreate: (data: Partial<Shipment>) => void, selectedDriver: Driver | null, onRemoveDriver: () => void }) => {
    const [formData, setFormData] = useState({
        pickup: '',
        dropoff: '',
        vehicleType: 'Box Truck',
        cargoType: 'General Goods',
        weight: '100kg'
    });
    const [creating, setCreating] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        // Simulate creating shipment
        setTimeout(() => {
            onCreate({
                pickup: { address: formData.pickup, lat: 0, lng: 0 },
                dropoff: { address: formData.dropoff, lat: 0, lng: 0 },
                vehicleType: formData.vehicleType,
                cargoType: formData.cargoType,
                weight: formData.weight,
                price: selectedDriver ? 50000 : 0, 
                driverId: selectedDriver?.id
            });
            setCreating(false);
        }, 1500);
    };

    return (
        <div className="fade-in max-w-2xl mx-auto pb-12">
            <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm mb-6 transition-colors">
                <ArrowDownLeft className="mr-2 rotate-45" size={18}/> Back to Dashboard
            </button>
            
            <Card className="border border-slate-200 shadow-lg">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900">Create New Shipment</h2>
                    <p className="text-slate-500 mt-1">Fill in the details to book a truck instantly.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Pickup Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-slate-400" size={18}/>
                                <input required type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-900 font-medium" placeholder="e.g. 123 Main St, Ikeja" value={formData.pickup} onChange={e => setFormData({...formData, pickup: e.target.value})} />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Dropoff Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-slate-400" size={18}/>
                                <input required type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-900 font-medium" placeholder="e.g. 456 Market Rd, Aba" value={formData.dropoff} onChange={e => setFormData({...formData, dropoff: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Vehicle Type</label>
                             <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-900 font-medium" value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})}>
                                <option>Box Truck</option>
                                <option>Flatbed Truck</option>
                                <option>Mini Van</option>
                                <option>Motorbike</option>
                             </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Cargo Weight</label>
                            <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-900 font-medium" placeholder="e.g. 500kg" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Cargo Type</label>
                            <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-900 font-medium" placeholder="e.g. Electronics, Furniture" value={formData.cargoType} onChange={e => setFormData({...formData, cargoType: e.target.value})} />
                        </div>
                    </div>

                    {selectedDriver && (
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between animate-[fadeIn_0.3s_ease-out]">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${selectedDriver.avatarColor}`}>
                                    {selectedDriver.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-brand-primary text-sm">Selected Driver</p>
                                    <p className="text-xs text-slate-600 font-medium">{selectedDriver.name} • {selectedDriver.vehicleType}</p>
                                </div>
                            </div>
                            <button type="button" onClick={onRemoveDriver} className="p-2 hover:bg-blue-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X size={18}/></button>
                        </div>
                    )}

                    <div className="pt-4">
                      <Button type="submit" variant="cta" className="w-full py-4 text-base font-bold shadow-lg shadow-orange-500/20" isLoading={creating}>
                          {selectedDriver ? `Book ${selectedDriver.name}` : 'Post Shipment Request'}
                      </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
