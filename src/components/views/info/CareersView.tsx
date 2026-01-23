import React from 'react';
import { StaticPageLayout } from '../../layout/StaticPageLayout';
import { Briefcase, MapPin, Zap, Heart } from 'lucide-react';
import { Button } from '../../ui/Button';

export const CareersView: React.FC = () => {
  return (
    <StaticPageLayout 
      title="Join the Team" 
      subtitle="Building the backbone of African logistics."
      heroImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80"
    >
      <div className="space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">Move Fast, Build Smarter</h2>
          <p className="text-slate-600 text-lg">
            We are a group of engineers, logistics experts, and problem solvers working to modernize freight across the continent. Join us in solving one of the most exciting challenges in African tech.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
             <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Why SureTruqs?</h3>
             {[
               { icon: Zap, title: "High Impact", text: "Work on solutions that directly impact businesses and livelihoods." },
               { icon: Heart, title: "Ownership", text: "We trust our people to lead and innovate from day one." }
             ].map((v, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-orange-50 text-brand-orange rounded-xl flex items-center justify-center shrink-0">
                    <v.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{v.title}</h4>
                    <p className="text-slate-500 text-sm">{v.text}</p>
                  </div>
                </div>
             ))}
          </div>
          <div className="bg-brand-dark p-8 rounded-[2.5rem] text-white">
             <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Perks & Benefits</h3>
             <ul className="space-y-4 text-slate-300 font-medium">
               <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-brand-orange rounded-full"></div> Competitive Equity & Pay</li>
               <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-brand-orange rounded-full"></div> Remote-First Culture</li>
               <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-brand-orange rounded-full"></div> Professional Development</li>
               <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-brand-orange rounded-full"></div> Health & Wellness Coverage</li>
             </ul>
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tight">Open Roles</h3>
          <div className="space-y-4">
            {[
              { role: "Senior Frontend Engineer", dept: "Engineering", type: "Remote", icon: Briefcase },
              { role: "Operations Lead (Lagos)", dept: "Logistics", type: "On-site", icon: MapPin },
              { role: "Product Designer", dept: "Design", type: "Remote", icon: Briefcase }
            ].map((j, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:border-brand-orange hover:shadow-xl transition-all group">
                <div className="mb-4 sm:mb-0">
                  <h4 className="font-bold text-xl text-slate-900 group-hover:text-brand-orange transition-colors">{j.role}</h4>
                  <div className="flex items-center gap-4 mt-1 text-slate-400 text-sm font-medium">
                    <span className="flex items-center gap-1"><j.icon size={14}/> {j.dept}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span>{j.type}</span>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="rounded-xl group-hover:bg-brand-orange group-hover:text-white group-hover:border-brand-orange">Apply Now</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
};
