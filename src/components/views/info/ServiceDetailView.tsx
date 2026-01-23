import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { StaticPageLayout } from '../../layout/StaticPageLayout';
import { Truck, Package, Building, ShieldCheck, Clock, MapPin } from 'lucide-react';

// Mock missing icons
const Navigation = (props: any) => <MapPin {...props} />;
const Users = (props: any) => <Building {...props} />;
const Wallet = (props: any) => <Package {...props} />;
const Zap = (props: any) => <Truck {...props} />;

const SERVICE_DATA: Record<string, any> = {
  'haulage': {
    title: 'Inter-State Haulage',
    subtitle: 'Moving large volumes across borders with precision.',
    image: 'https://images.unsplash.com/photo-1591768793355-74d04bb66ea4?auto=format&fit=crop&w=2000&q=80',
    icon: Truck,
    content: "Our inter-state haulage service is designed for heavy-duty freight movement. We bridge the gap between production hubs and distribution points across the country.",
    features: [
      { title: "Long-Range Network", desc: "Access to verified routes across all states.", icon: MapPin },
      { title: "Load Protection", desc: "Rigorous staging and securing protocols.", icon: ShieldCheck },
      { title: "Strategic Scheduling", desc: "Optimized transit times for urgent freight.", icon: Clock }
    ]
  },
  'last-mile': {
    title: 'Last-Mile Delivery',
    subtitle: 'The final, most critical link in your supply chain.',
    image: 'https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&w=2000&q=80',
    icon: Package,
    content: "Fast, secure, and reliable local deliveries. We help e-commerce and retail brands maintain their promises to customers with same-day and next-day options.",
    features: [
      { title: "Urban Expertise", desc: "Navigating city traffic with ease and speed.", icon: Navigation },
      { title: "Consumer Tracking", desc: "Real-time updates for the end recipient.", icon: Clock },
      { title: "Flexible Fleet", desc: "Motorbikes and small vans for agile delivery.", icon: Truck }
    ]
  },
  'corporate': {
    title: 'Corporate Logistics',
    subtitle: 'Enterprise-grade fleet management and logistics consulting.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80',
    icon: Building,
    content: "Tailored solutions for large organizations. We manage your entire supply chain lifecycle, providing dedicated fleets and powerful management software.",
    features: [
      { title: "Dedicated Support", desc: "A personal logistics manager for your firm.", icon: Users },
      { title: "Custom APIs", desc: "Integration with your existing ERP systems.", icon: Zap },
      { title: "Cost Optimization", desc: "Periodic analysis to reduce your burn rate.", icon: Wallet }
    ]
  }
};



export const ServiceDetailView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? SERVICE_DATA[slug] : null;

  if (!service) return <Navigate to="/" replace />;

  return (
    <StaticPageLayout 
      title={service.title} 
      subtitle={service.subtitle}
      heroImage={service.image}
    >
      <div className="space-y-16">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">Overview</h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            {service.content}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {service.features.map((f: any, i: number) => (
            <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-brand-orange transition-colors group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm text-brand-primary group-hover:bg-brand-orange group-hover:text-white transition-all">
                <f.icon size={24} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">{f.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-brand-orange/5 p-12 rounded-[2.5rem] border border-brand-orange/10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="text-center md:text-left">
              <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Ready to start?</h3>
              <p className="text-slate-600 font-medium">Get a custom quote for your {service.title} needs today.</p>
           </div>
           <button className="bg-brand-orange text-white px-10 py-4 rounded-full font-black uppercase text-sm shadow-xl shadow-orange-500/20 hover:scale-105 transition-transform">
              Book a Service
           </button>
        </div>
      </div>
    </StaticPageLayout>
  );
};
