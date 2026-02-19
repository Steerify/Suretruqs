import React from 'react';
import { StaticPageLayout } from '../../layout/StaticPageLayout';
import { Briefcase, MapPin, Zap, Heart, Star, Coffee, Monitor, ShieldPlus } from 'lucide-react';
import { Button } from '../../ui/Button';

export const CareersView: React.FC = () => {
  return (
    <StaticPageLayout 
      title="Scale With Us" 
      subtitle="Building the primary operating system for African commerce. Join our mission-driven team."
      heroImage="/images/careers-hero.jpg"
    >
      <div className="space-y-24">
        {/* Culture Intro */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-sm font-black text-brand-orange uppercase tracking-[0.3em] mb-6">Join the Team</h2>
          <h3 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-8 uppercase tracking-tighter">
             Move Fast. Build <span className="text-brand-primary">Smarter.</span>
          </h3>
          <p className="text-slate-600 text-xl font-medium leading-relaxed">
            We are a group of engineers, logistics experts, and creative problem solvers working to modernize freight across the continent. Join us in solving one of the most exciting challenges in African tech.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
                { icon: Monitor, title: "Remote-First", text: "Work from anywhere. We value deep output over desk time." },
                { icon: Heart, title: "Wellness", text: "Comprehensive health coverage for you and your family." },
                { icon: Star, title: "Equity", text: "We want every employee to have skin in the game. Real ownership." },
                { icon: ShieldPlus, title: "Growth", text: "Quarterly learning stipends to fuel your personal evolution." }
            ].map((v, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary mb-6 shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-all">
                        <v.icon size={22}/>
                    </div>
                    <h4 className="font-black text-slate-900 uppercase tracking-tight mb-3">{v.title}</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{v.text}</p>
                </div>
            ))}
        </div>

        {/* Open Roles - Updated to show no jobs */}
        <div className="relative">
          <div className="flex justify-between items-end mb-12">
             <div>
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Open Positions</h3>
                <p className="text-slate-500 font-medium">Be part of the founding teams in these departments.</p>
             </div>
             <div className="hidden md:block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-full border border-slate-200">0 Roles Available</span>
             </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-16 text-center shadow-sm">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Briefcase size={40} />
             </div>
             <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">No positions currently available</h4>
             <p className="text-slate-500 max-w-md mx-auto font-medium">
                We're currently operating at full capacity, but we're always interested in meeting exceptional talent. Check back later or send an open application.
             </p>
          </div>
        </div>

        {/* Footer Talent Pool */}
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange opacity-5 blur-[100px]"></div>
            <div className="relative z-10">
                <h4 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">Don't see your role?</h4>
                <p className="text-slate-400 max-w-xl mx-auto font-medium mb-10 leading-relaxed">We're always looking for brilliant minds. If you believe you can add massive value to SureTruqs, send us an open application.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <a 
                      href="mailto:steerifygroup@gmail.com"
                      className="inline-block bg-white text-slate-900 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-colors shadow-2xl shadow-white/5"
                    >
                        General Application
                    </a>
                </div>
            </div>
        </div>
      </div>
    </StaticPageLayout>
  );
};
