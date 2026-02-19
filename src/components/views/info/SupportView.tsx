import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { StaticPageLayout } from '../../layout/StaticPageLayout';
import { HelpCircle, ShieldCheck, UserCheck, MessageSquare, Search, FileText, CheckCircle2 } from 'lucide-react';

const SUPPORT_DATA: Record<string, any> = {
  'help': {
    title: 'Help Center',
    subtitle: 'Comprehensive resources to help you master the SureTruqs platform.',
    image: '/images/about-hero.jpg',
    sections: [
      { title: "Getting Started", items: ["Creating an Account", "Requesting a Shipment", "Tracking a Shipment"] },
      { title: "Operations", items: ["Admin Review Process", "Driver Assignment", "Status Updates"] },
      { title: "Security", items: ["Driver Verification", "Goods-in-Transit Insurance", "Data Privacy"] }
    ]
  },
  'driver-support': {
    title: 'Driver Support',
    subtitle: 'Tools, documentation, and resources for our professional driver partners.',
    image: '/images/delivery-truck.png',
    sections: [
      { title: "Onboarding", items: ["Required Documents", "Vehicle Inspection", "Background Checks"] },
      { title: "Assignments", items: ["Accepting Jobs", "Rejecting Jobs", "Status Updates"] },
      { title: "On the Road", items: ["App Usage Guide", "Offline Mode", "Emergency Protocols"] }
    ]
  },
  'insurance': {
    title: 'Protection Policy',
    subtitle: 'Our commitment to the safety and security of every shipment.',
    image: '/images/support-help.jpg',
    content: "At SureTruqs, the safety of your cargo is our highest priority. Every shipment booked through our platform is covered by our comprehensive Goods-in-Transit (GIT) protection framework, managed by our premium insurance partners.",
    sections: [
      { title: "Scope of Cover", items: ["Theft & Hijacking", "Accidental Damage", "Fire & Explosion"] },
      { title: "Claim Process", items: ["Reporting an Incident", "Required Evidence", "Resolution Timelines"] }
    ]
  }
};

export const SupportView: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const support = type ? SUPPORT_DATA[type] : null;

  if (!support) return <Navigate to="/" replace />;

  return (
    <StaticPageLayout 
      title={support.title} 
      subtitle={support.subtitle}
      heroImage={support.image}
    >
      <div className="space-y-24">
        {support.content && (
          <div className="max-w-4xl">
            <h2 className="text-sm font-black text-brand-orange uppercase tracking-[0.3em] mb-6">Policy Overview</h2>
            <p className="text-slate-600 text-xl leading-relaxed font-medium">
              {support.content}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {support.sections.map((sec: any, i: number) => (
             <div key={i} className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 text-brand-primary rounded-xl flex items-center justify-center shrink-0">
                        <CheckCircle2 size={20} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                        {sec.title}
                    </h3>
                </div>
                <div className="space-y-3">
                   {sec.items.map((item: string, idx: number) => (
                     <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-primary/20 hover:bg-white hover:shadow-xl transition-all cursor-pointer group">
                        <span className="text-sm font-bold text-slate-700">{item}</span>
                        <FileText size={16} className="text-slate-300 group-hover:text-brand-primary transition-colors" />
                     </div>
                   ))}
                </div>
             </div>
          ))}
        </div>

        {/* Contact Strip */}
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-16 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>
           <div className="lg:w-1/2 relative z-10">
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tight leading-tight">Can't find <br/> what you need?</h3>
              <p className="text-slate-400 font-medium">Our support engineers are available 24/7 to assist with any technical or operational queries.</p>
           </div>
           <div className="lg:w-1/2 flex flex-col sm:flex-row gap-4 w-full relative z-10">
              <button className="flex-1 bg-white text-slate-900 py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors shadow-xl">
                 <MessageSquare size={18}/> Start Live Chat
              </button>
              <button className="flex-1 bg-white/10 border border-white/20 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-white/20 transition-colors">
                 <HelpCircle size={18}/> Submit Ticket
              </button>
           </div>
        </div>
      </div>
    </StaticPageLayout>
  );
};
