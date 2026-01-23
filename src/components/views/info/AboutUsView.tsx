import React from 'react';
import { StaticPageLayout } from '../../layout/StaticPageLayout';
import { Target, Users, Globe, Award } from 'lucide-react';

export const AboutUsView: React.FC = () => {
  return (
    <StaticPageLayout 
      title="About SureTruqs" 
      subtitle="Transforming African logistics through technology and trust."
      heroImage="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=2000&q=80"
    >
      <div className="prose prose-slate max-w-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">Our Mission</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              SureTruqs was founded on the belief that logistics shouldn't be a bottleneck for business growth. In a rapidly evolving African economy, we're building the infrastructure that connects cargo owners with verified, reliable truck owners instantly.
            </p>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">Our Vision</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              To be the primary operating system for freight in Africa, creating a transparent, efficient, and data-driven ecosystem where every mile is optimized and every shipment is secure.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase tracking-tight">Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Target, title: "Efficiency", desc: "Reducing idle time and optimizing routes." },
            { icon: Users, title: "Trust", desc: "Rigorous verification for all our partners." },
            { icon: Globe, title: "Reliability", desc: "Nationwide coverage you can depend on." },
            { icon: Award, title: "Innovation", desc: "Pioneering smart logistics tech." }
          ].map((v, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="w-12 h-12 bg-blue-50 text-brand-primary rounded-xl flex items-center justify-center mb-4">
                <v.icon size={24} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">{v.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </StaticPageLayout>
  );
};
