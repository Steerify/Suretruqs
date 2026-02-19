import React from 'react';
import { StaticPageLayout } from '../../layout/StaticPageLayout';
import { Truck, Package, ShieldCheck, Gauge, Settings, Fuel } from 'lucide-react';

export const FleetView: React.FC = () => {
  return (
    <StaticPageLayout 
      title="Our Fleet" 
      subtitle="A distributed network of high-performance vehicles, engineered for reliability and safety."
      heroImage="/images/our-fleet.png"
    >
      <div className="space-y-24">
        <div className="max-w-4xl">
          <h2 className="text-sm font-black text-brand-orange uppercase tracking-[0.3em] mb-6">Standardized Excellence</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-8 uppercase tracking-tighter">
             Premium Assets for <span className="text-brand-primary">Any Scale.</span>
          </h3>
          <p className="text-slate-600 text-lg leading-relaxed font-medium">
            We operate a distributed fleet model, partnering with verified owners across the continent. Every vehicle in our ecosystem undergoes a rigorous 42-point inspection and meets our strict maintenance protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { 
              type: 'Light Vans / Delivery', 
              cap: '1 - 3 Tons', 
              specs: { wheels: '4 Wheels', drive: '4x2', fuel: 'Diesel/Petrol' },
              bestFor: 'Last-mile delivery, e-commerce fulfillment, and local furniture moves.',
              img: '/images/light-van.png'
            },
            { 
              type: 'Medium Rigid Trucks', 
              cap: '5 - 15 Tons', 
              specs: { wheels: '6-10 Wheels', drive: '4x2 / 6x2', fuel: 'Diesel' },
              bestFor: 'Regional distribution, construction materials, and cold-chain logistics.',
              img: '/images/medium-rigid.png'
            },
            { 
              type: 'Heavy Duty Trailers', 
              cap: '30+ Tons',
              specs: { wheels: '12-22 Wheels', drive: '6x4', fuel: 'High-Sulfur Diesel' },
              bestFor: 'Inter-state haulage, industrial machinery, and bulk FMCG distribution.',
              img: '/images/Heavy-duty-trucks.png'
            }
          ].map((v, i) => (
            <div key={i} className="group flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="h-64 overflow-hidden relative">
                 <img src={v.img} alt={v.type} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                 <div className="absolute top-6 right-6">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg border border-white/20">
                        {v.cap} Capacity
                    </span>
                 </div>
              </div>
              <div className="p-10 flex-1 flex flex-col">
                <h3 className="font-black text-2xl text-slate-900 mb-4 uppercase tracking-tight">{v.type}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">{v.bestFor}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-y border-slate-50">
                    <div className="text-center">
                        <Gauge size={18} className="mx-auto text-brand-primary mb-2 opacity-60" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{v.specs.wheels}</p>
                    </div>
                    <div className="text-center border-x border-slate-100">
                        <Settings size={18} className="mx-auto text-brand-primary mb-2 opacity-60" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{v.specs.drive}</p>
                    </div>
                    <div className="text-center">
                        <Fuel size={18} className="mx-auto text-brand-primary mb-2 opacity-60" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{v.specs.fuel}</p>
                    </div>
                </div>

                <div className="space-y-4 mt-auto">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center"><ShieldCheck size={12} className="text-green-500"/></div>
                    Verified Maintenance
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center"><Package size={12} className="text-blue-500"/></div>
                    Real-time Telematics
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fleet Management Quote */}
        <div className="bg-slate-50 rounded-[3rem] p-12 md:p-16 border border-slate-100 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-2/3">
                <h4 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Need a custom fleet solution?</h4>
                <p className="text-slate-500 font-medium leading-relaxed">For large-scale industrial projects or monthly corporate retainerships, we provide dedicated fleet management services with tailored routing and priority dispatching.</p>
            </div>
            <div className="md:w-1/3 w-full">
                <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-slate-800 transition-colors">
                    Request Consultation
                </button>
            </div>
        </div>
      </div>
    </StaticPageLayout>
  );
};
