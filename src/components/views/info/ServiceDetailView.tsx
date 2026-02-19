import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { StaticPageLayout } from '../../layout/StaticPageLayout';
import { Truck, Package, Building, ShieldCheck, Clock, MapPin, CheckCircle2 } from 'lucide-react';

// Mock missing icons
const Navigation = (props: any) => <MapPin {...props} />;
const Users = (props: any) => <Building {...props} />;
const EfficiencyIcon = (props: any) => <Package {...props} />;
const Zap = (props: any) => <Truck {...props} />;

const SERVICE_DATA: Record<string, any> = {
  'haulage': {
    title: 'Inter-State Haulage',
    subtitle: 'Strategic, high-capacity movement across all regional borders.',
    image: '/images/fleet-truck.jpg',
    tag: 'Industrial Logistics',
    icon: Truck,
    content: "Our inter-state haulage service is engineered for enterprise-grade freight movement. We bridge the gap between production hubs and national distribution points, providing a seamless bridge for your supply chain.",
    features: [
      { title: "Long-Range Network", desc: "Optimized routes across all 36 states with real-time transit data.", icon: MapPin },
      { title: "Load Protection", desc: "Military-grade staging and cargo securing protocols on all trailers.", icon: ShieldCheck },
      { title: "Strategic Timing", desc: "Synchronized dispatching to meet tighter production deadlines.", icon: Clock }
    ]
  },
  'last-mile': {
    title: 'Last-Mile Solutions',
    subtitle: 'The ultimate precision link in your consumer supply chain.',
    image: '/images/delivery-truck.png',
    tag: 'E-commerce & Retail',
    icon: Package,
    content: "Speed and reliability are the currencies of the modern consumer market. We help retail and lifestyle brands fulfill their customer promises with agile, tech-enabled local distribution.",
    features: [
      { title: "Urban Agility", desc: "Navigating complex city grids with bike and van fleets.", icon: Navigation },
      { title: "Point Transparency", desc: "Granular tracking updates for the end recipient automatically.", icon: Clock },
      { title: "Flexible Capacity", desc: "Scale your delivery fleet up or down based on seasonal demand.", icon: Truck }
    ]
  },
  'corporate': {
    title: 'Enterprise Logistics',
    subtitle: 'High-performance fleet management and consulting for major firms.',
    image: '/images/our-fleet.png',
    tag: 'Corporate Services',
    icon: Building,
    content: "Comprehensive logistics ecosystems for large organizations. We don't just move cargo; we manage your entire supply chain lifecycle with dedicated account teams.",
    features: [
      { title: "Account Sovereignty", desc: "A dedicated logistics strategist assigned to your organization.", icon: Users },
      { title: "Full ERP Integration", desc: "Powerful APIs to sync our data directly with your internal systems.", icon: Zap },
      { title: "Cost Efficiency", desc: "Deep analytical reviews to optimize your logistics burn rate.", icon: EfficiencyIcon }
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
      <div className="space-y-24">
        {/* Deep Dive Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
                <h2 className="text-sm font-black text-brand-orange uppercase tracking-[0.3em] mb-6">{service.tag}</h2>
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-8 uppercase tracking-tighter">
                   Moving <span className="text-brand-primary">Heavier.</span> <br/> Reaching <span className="text-brand-orange">Further.</span>
                </h3>
                <p className="text-slate-500 text-xl leading-relaxed font-medium">
                    {service.content}
                </p>
            </div>
            <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 flex flex-col gap-6">
                 {[
                    "Verified Professional Drivers",
                    "Real-time GPS Monitoring",
                    "Goods-in-Transit (GIT) Security",
                    "Dedicated Support Channels"
                 ].map((p, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
                            <CheckCircle2 size={20} />
                        </div>
                        <span className="font-bold text-slate-700 tracking-tight">{p}</span>
                    </div>
                 ))}
            </div>
        </div>

        {/* Specialized Feature Set */}
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {service.features.map((f: any, i: number) => (
                <div key={i} className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-bl-[4rem] group-hover:scale-110 transition-transform"></div>
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 text-brand-primary group-hover:rotate-6 transition-transform">
                    <f.icon size={28} />
                </div>
                <h4 className="font-black text-xl text-slate-900 mb-3 uppercase tracking-tight">{f.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</p>
                </div>
            ))}
            </div>
        </div>

        {/* Direct CTA */}
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
           <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-orange"></div>
           <div className="relative z-10">
              <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tight leading-tight">Ready to optimize your <span className="text-brand-orange">{service.title}?</span></h3>
              <p className="text-slate-400 font-medium max-w-2xl mx-auto mb-12 text-lg">Speak with a logistics strategist today to build a custom solution for your high-volume freight needs.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                 <button className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-slate-100 transition-colors">
                    Request a Quote
                 </button>
                 <button className="bg-white/10 border border-white/20 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/20 transition-colors">
                    Consultation
                 </button>
              </div>
           </div>
        </div>
      </div>
    </StaticPageLayout>
  );
};
