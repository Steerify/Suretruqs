import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { StaticPageLayout } from '../../layout/StaticPageLayout';
import { HelpCircle, ShieldCheck, UserCheck, MessageSquare, Search, FileText } from 'lucide-react';

const SUPPORT_DATA: Record<string, any> = {
  'help': {
    title: 'Help Center',
    subtitle: 'Everything you need to know about using SureTruqs.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=80',
    sections: [
      { title: "Getting Started", items: ["Creating an Account", "How to Book a Truck", "Understanding Pricing"] },
      { title: "Payments", items: ["Wallet Settlements", "Cancellation & Refunds", "Tax & Invoices"] },
      { title: "Security", items: ["Driver Verification", "Goods-in-Transit Insurance", "Data Privacy"] }
    ]
  },
  'driver-support': {
    title: 'Driver Support',
    subtitle: 'Resources and tools for our professional driver partners.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=2000&q=80',
    sections: [
      { title: "Onboarding", items: ["Required Documents", "Vehicle Inspection", "Background Checks"] },
      { title: "Earnings", items: ["Payout Schedule", "Referral Bonuses", "Performance Incentives"] },
      { title: "On the Road", items: ["App Usage Guide", "Offline Mode", "Emergency Protocols"] }
    ]
  },
  'insurance': {
    title: 'Insurance Policy',
    subtitle: 'Comprehensive protection for every shipment.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=2000&q=80',
    content: "At SureTruqs, the safety of your cargo is our highest priority. Every shipment booked through our platform is covered by our comprehensive Goods-in-Transit (GIT) insurance policy.",
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
      <div className="space-y-16">
        {support.content && (
          <div className="max-w-3xl">
            <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">Policy Overview</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              {support.content}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {support.sections.map((sec: any, i: number) => (
             <div key={i} className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                   <div className="w-2 h-2 bg-brand-orange rounded-full"></div> {sec.title}
                </h3>
                <ul className="space-y-4">
                   {sec.items.map((item: string, idx: number) => (
                     <li key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-orange transition-colors cursor-pointer group">
                        <FileText size={16} className="text-slate-400 group-hover:text-brand-orange transition-colors" />
                        <span className="text-sm font-bold text-slate-700">{item}</span>
                     </li>
                   ))}
                </ul>
             </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-12 bg-brand-dark rounded-[2.5rem] p-12 text-white items-center">
           <div className="md:w-1/2">
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">Still need help?</h3>
              <p className="text-slate-400 font-medium">Our support team is available 24/7 to assist with any issues or questions you might have.</p>
           </div>
           <div className="md:w-1/2 flex flex-col sm:flex-row gap-4 w-full">
              <button className="flex-1 bg-white text-brand-dark py-4 rounded-full font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
                 <MessageSquare size={16}/> Live Chat
              </button>
              <button className="flex-1 bg-white/10 border border-white/20 text-white py-4 rounded-full font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                 <HelpCircle size={16}/> Email Support
              </button>
           </div>
        </div>
      </div>
    </StaticPageLayout>
  );
};
