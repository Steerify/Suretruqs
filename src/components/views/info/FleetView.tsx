import React from 'react';
import { StaticPageLayout } from '../../layout/StaticPageLayout';
import { Truck, Package, ShieldCheck } from 'lucide-react';

export const FleetView: React.FC = () => {
  return (
    <StaticPageLayout 
      title="Our Fleet" 
      subtitle="Diverse, verified, and ready for any haul."
      heroImage="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=2000&q=80"
    >
      <div className="space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">Standardized Excellence</h2>
          <p className="text-slate-600 text-lg">
            We operate a distributed fleet model, partnering with verified truck owners across the continent. Every vehicle in our system meets strict safety and maintenance standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              type: 'Light Vans / Delivery', 
              cap: '1 - 3 Tons', 
              bestFor: 'Last-mile, E-commerce, Local Moves',
              img: 'https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&w=800&q=80'
            },
            { 
              type: 'Medium Rigid Trucks', 
              cap: '5 - 15 Tons', 
              bestFor: 'Regional distribution, Construction material',
              img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'
            },
            { 
              type: 'Heavy Duty Trailers', 
              cap: '30+ Tons', 
              bestFor: 'Inter-state haulage, Industrial machinery, Bulk FMCG',
              img: 'https://images.unsplash.com/photo-1591768793355-74d04bb66ea4?auto=format&fit=crop&w=800&q=80'
            }
          ].map((v, i) => (
            <div key={i} className="group bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-xl transition-all">
              <div className="h-48 overflow-hidden">
                <img src={v.img} alt={v.type} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl text-slate-900">{v.type}</h3>
                  <span className="bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase px-2 py-1 rounded-md">{v.cap}</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">Best for: {v.bestFor}</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <ShieldCheck size={14} className="text-green-500"/> Verified Maintenance
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Package size={14} className="text-blue-500"/> Secure Loading Tech
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StaticPageLayout>
  );
};
