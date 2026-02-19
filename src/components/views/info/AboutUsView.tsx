import React from 'react';
import { StaticPageLayout } from '../../layout/StaticPageLayout';
import { Target, Users, Globe, Award, TrendingUp, ShieldCheck, Map } from 'lucide-react';

export const AboutUsView: React.FC = () => {
  return (
    <StaticPageLayout 
      title="Our Story" 
      subtitle="Pioneering the next generation of African logistics through transparency, technology, and trust."
      heroImage="/images/our-story.png"
    >
      <div className="space-y-24">
        {/* Intro Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
                <h2 className="text-sm font-black text-brand-orange uppercase tracking-[0.3em] mb-6">Mission & Purpose</h2>
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-8 uppercase tracking-tighter">
                    Connecting <span className="text-brand-primary">Commerce</span> Across the Continent.
                </h3>
                <p className="text-slate-500 text-lg leading-relaxed mb-6 font-medium">
                    SureTruqs was founded with a singular vision: to eliminate the logistical barriers that hinder business growth in Africa. We've built an intelligent ecosystem that bridges the gap between cargo owners and a network of verified professional haulers.
                </p>
                <div className="flex flex-col sm:flex-row gap-8 mt-12 pt-8 border-t border-slate-100">
                    <div>
                        <p className="text-3xl font-black text-slate-900 mb-1 leading-none uppercase tracking-tighter">100%</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Fleet</p>
                    </div>
                    <div>
                        <p className="text-3xl font-black text-slate-900 mb-1 leading-none uppercase tracking-tighter">24/7</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Support</p>
                    </div>
                </div>
            </div>
            <div className="relative">
                <div className="absolute -inset-4 bg-slate-50 rounded-[3rem] -z-10 transform -rotate-1"></div>
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8">
                     <div className="flex gap-6">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-primary shrink-0 transition-transform hover:scale-110">
                            <Target size={28} />
                        </div>
                        <div>
                             <h4 className="font-black text-slate-900 uppercase tracking-tight mb-2">Our Mission</h4>
                             <p className="text-slate-500 text-sm leading-relaxed">To democratize access to reliable freight services for businesses of all sizes, ensuring every shipment is handled with precision and care.</p>
                        </div>
                     </div>
                     <div className="flex gap-6">
                        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-brand-orange shrink-0 transition-transform hover:scale-110">
                            <TrendingUp size={28} />
                        </div>
                        <div>
                             <h4 className="font-black text-slate-900 uppercase tracking-tight mb-2">Our Vision</h4>
                             <p className="text-slate-500 text-sm leading-relaxed">To become the primary infrastructure for African trade, creating a transparent and data-driven logistics landscape.</p>
                        </div>
                     </div>
                </div>
            </div>
        </div>

        {/* Stats Strip */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white grid grid-cols-2 md:grid-cols-4 gap-8">
             <div className="text-center">
                <p className="text-4xl md:text-5xl font-black text-brand-orange mb-2 tracking-tighter">36+</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">States Covered</p>
             </div>
             <div className="text-center border-l border-white/10">
                <p className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">5k+</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Trucks Managed</p>
             </div>
             <div className="text-center border-l border-white/10">
                <p className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">98%</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">On-time Delivery</p>
             </div>
             <div className="text-center border-l border-white/10">
                <p className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">15m+</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Miles Traveled</p>
             </div>
        </div>

        {/* Core Values Section */}
        <div>
            <h2 className="text-center text-sm font-black text-brand-orange uppercase tracking-[0.3em] mb-4">Values & Principles</h2>
            <h3 className="text-center text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight mb-16">What Defines <span className="text-brand-primary">Our Approach</span></h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
                { icon: ShieldCheck, title: "Reliability", desc: "Consistency in service is our baseline. We never compromise on safety or schedules." },
                { icon: Users, title: "Co-Prosperity", desc: "We grow when our drivers and customers grow. Their success is our primary KPI." },
                { icon: Map, title: "Local Expertise", desc: "Deep understanding of regional terrains and market dynamics across Nigeria." },
                { icon: Award, title: "Innovation", desc: "Constantly iterating our technology stack to solve complex logistical friction." }
            ].map((v, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 hover:border-brand-primary/20">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                        <v.icon size={24}/>
                    </div>
                    <h4 className="font-black text-slate-900 uppercase tracking-tight mb-3 text-lg">{v.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{v.desc}</p>
                </div>
            ))}
            </div>
        </div>
      </div>
    </StaticPageLayout>
  );
};
