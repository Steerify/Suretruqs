import React, { useState } from 'react';
import { ArrowDownLeft, MapPin } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Shipment } from '../../../types';
import { useStore } from '../../../context/StoreContext';

export const NewShipmentView = ({ onBack, onCreate }: { onBack: () => void, onCreate: (data: Partial<Shipment>) => Promise<Shipment> }) => {
    const [formData, setFormData] = useState({
        pickup: '',
        dropoff: '',
        vehicleType: 'Tanker Truck',
        cargoType: 'General Goods',
        weight: '100kg',
        notes: '',
        fragile: false,
        priority: 'NORMAL'
    });
    const [creating, setCreating] = useState(false);
    const { savedLocations, currentUser } = useStore();

    // Removed static pricing logic

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const created = await onCreate({
                pickup: { address: formData.pickup, lat: 0, lng: 0 },
                dropoff: { address: formData.dropoff, lat: 0, lng: 0 },
                vehicleType: formData.vehicleType,
                cargoType: formData.cargoType,
                weight: formData.weight,
                instructions: {
                    customerNotes: formData.notes,
                    fragile: formData.fragile,
                    priority: formData.priority as any
                }
            });

            const adminPhone = (import.meta as any).env.VITE_ADMIN_PHONE;
            if (adminPhone) {
                const message = [
                    "🚚 New Shipment Request",
                    "",
                    `Customer: ${currentUser?.name || 'Unknown'}`,
                    `Phone: ${currentUser?.phone || 'N/A'}`,
                    `Pickup: ${formData.pickup}`,
                    `Dropoff: ${formData.dropoff}`,
                    `Details: ${formData.cargoType} | ${formData.weight}`,
                    `Tracking ID: ${created.trackingId}`
                ].join("\n");
                window.location.href = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
            }
        } catch (error) {
            console.error("Failed to create shipment", error);
        } finally {
            setCreating(false);
        }
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
                        {savedLocations.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {savedLocations.map((loc: any) => (
                              <button
                                type="button"
                                key={loc._id}
                                onClick={() => setFormData(prev => ({ ...prev, pickup: loc.address }))}
                                className="px-3 py-1.5 text-xs font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                              >
                                {loc.label}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Dropoff Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-slate-400" size={18}/>
                            <input required type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-900 font-medium" placeholder="e.g. 456 Market Rd, Aba" value={formData.dropoff} onChange={e => setFormData({...formData, dropoff: e.target.value})} />
                        </div>
                        {savedLocations.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {savedLocations.map((loc: any) => (
                              <button
                                type="button"
                                key={loc._id}
                                onClick={() => setFormData(prev => ({ ...prev, dropoff: loc.address }))}
                                className="px-3 py-1.5 text-xs font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                              >
                                {loc.label}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Vehicle Type</label>
                             <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-900 font-medium" value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})}>
                                <option>Tanker Truck</option>
                                <option>Box Truck</option>
                                <option>Flatbed Truck</option>
                                <option>Container Truck</option>
                                <option>Refrigerated Truck</option>
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
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Shipment Notes</label>
                            <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-900 font-medium" placeholder="Special handling instructions, gate codes, contact notes..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="fragile" checked={formData.fragile} onChange={e => setFormData({...formData, fragile: e.target.checked})} />
                            <label htmlFor="fragile" className="text-xs font-bold text-slate-600 uppercase tracking-wide">Fragile</label>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Priority</label>
                            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-900 font-medium" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                                <option value="LOW">Low</option>
                                <option value="NORMAL">Normal</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4">
                      <Button type="submit" variant="cta" className="w-full py-5 text-base font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 bg-brand-orange text-white rounded-2xl" isLoading={creating}>
                          Initialize Dispatch
                      </Button>
                      <p className="text-[10px] text-slate-500 text-center mt-3 font-medium uppercase tracking-wider">
                          Protocol: Secure Admin-Mediated Assignment
                      </p>
                    </div>
                </form>
            </Card>
        </div>
    );
};
