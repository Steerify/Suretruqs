import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Mail, Phone, MapPin, Send, ArrowLeft, MessageSquare, CheckCircle2, Globe } from 'lucide-react';
import { Footer } from '../layout/Footer';
import gsap from 'gsap';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export const ContactView: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [formStatus, setFormStatus] = useState<'IDLE' | 'SENDING' | 'SENT'>('IDLE');
  const [scrolled, setScrolled] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const ctx = gsap.context(() => {
      gsap.from(".fade-up", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
      });
    }, containerRef);
    
    return () => {
        ctx.revert();
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('SENDING');
    
    try {
      await api.post('/support/contact', formData);
      setFormStatus('SENT');
      toast.success('Message sent successfully!');
    } catch (error: any) {
      setFormStatus('IDLE');
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 selection:bg-brand-orange/20" ref={containerRef}>
      
      {/* Navigation - Premium Glass */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg py-4 border-b border-white/20' : 'bg-transparent py-7'}`}>
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex justify-between items-center">
            <div className="font-bold text-2xl flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="bg-brand-orange p-2 rounded-2xl shadow-lg shadow-orange-500/20 group-hover:rotate-12 transition-transform duration-300">
                <Send size={22} strokeWidth={3} className="text-white transform -rotate-45" />
              </div>
              <span className="tracking-tighter font-black text-slate-900">SureTruqs<span className="text-brand-orange">.</span></span>
            </div>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 group text-sm font-bold tracking-tight px-6 py-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
               <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back Home
            </button>
        </div>
      </nav>

      <main className="pt-40 pb-24 px-6 md:px-12 max-w-[1920px] mx-auto">
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 mb-32 items-center">
            {/* Left Content - High Impact */}
            <div className="fade-up">
               <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em]">
                  <MessageSquare size={12} /> Institutional Support
               </div>
               <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-none uppercase">
                  Let's Bridge <br/> The <span className="text-brand-orange text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400">Distance.</span>
               </h1>
               <p className="text-slate-500 text-xl leading-relaxed mb-16 max-w-lg font-medium">
                  Whether you're looking for enterprise-scale logistics or have a quick query, our command center is always online.
               </p>

               <div className="space-y-12">
                  {[
                    { icon: Mail, label: 'Technical Support', val: 'steerifygroup@gmail.com', color: 'text-brand-primary' },
                    { icon: Phone, label: 'Direct Line', val: '+234 (0) 700 SURE-TRQS', color: 'text-brand-orange' },
                    { icon: Globe, label: 'Lagos Headquarters', val: 'Victoria Island, Lagos, NG.', color: 'text-slate-600' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-8 group">
                        <div className="w-16 h-16 bg-white rounded-3xl border border-slate-100 shadow-xl flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                            <item.icon size={28} />
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{item.label}</h3>
                            <p className={`text-xl font-black ${item.color} uppercase tracking-tight`}>{item.val}</p>
                        </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Right Content - Premium Form */}
            <div className="fade-up relative">
               <div className="absolute -inset-4 bg-slate-50 rounded-[3.5rem] -z-10 transform scale-105 opacity-50"></div>
               <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary to-brand-orange"></div>
                  
                  {formStatus === 'SENT' ? (
                     <div className="h-[500px] flex flex-col items-center justify-center text-center animate-[scaleIn_0.5s_ease-out]">
                        <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center text-green-500 mb-8 border border-green-100 shadow-inner">
                           <CheckCircle2 size={48} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Protocol Initiated!</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mb-10 font-medium font-lg leading-relaxed">Your message has been received by our control center. We'll be in touch within 2 hours.</p>
                        <button onClick={() => { setFormStatus('IDLE'); setFormData({ firstName:'', lastName:'', email:'', message:''}); }} className="text-sm font-black text-brand-primary uppercase tracking-widest hover:underline">New Message</button>
                     </div>
                  ) : (
                     <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="mb-10 text-center md:text-left">
                           <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Send a Message</h3>
                           <p className="text-slate-400 font-medium">Standard response time: 27 minutes</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">First Name</label>
                              <input 
                                required 
                                type="text" 
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/20 outline-none transition-all font-bold text-slate-900" 
                                placeholder="John" 
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Last Name</label>
                              <input 
                                required 
                                type="text" 
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/20 outline-none transition-all font-bold text-slate-900" 
                                placeholder="Doe" 
                              />
                           </div>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Email</label>
                           <input 
                            required 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/20 outline-none transition-all font-bold text-slate-900" 
                            placeholder="john@company.com" 
                           />
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Message Protocol</label>
                           <textarea 
                            required 
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5} 
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/20 outline-none transition-all font-bold text-slate-900 resize-none" 
                            placeholder="Describe your logistical needs..."
                           ></textarea>
                        </div>

                        <button 
                           type="submit" 
                           className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                           disabled={formStatus === 'SENDING'}
                        >
                           {formStatus === 'SENDING' ? 'Processing...' : <><Send size={16} /> Disintegrate Barriers</>}
                        </button>
                     </form>
                  )}
               </div>
            </div>
         </div>

         {/* Command Center - Map Visualization */}
         <div className="fade-up relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="bg-slate-900 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl border border-white/10 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></div>
                    SureTruqs Command Center
                </div>
             </div>
             
             <div className="rounded-[4rem] overflow-hidden h-[500px] relative shadow-2xl border border-slate-100 group bg-slate-100">
                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-20 mix-blend-multiply grayscale"></div>
                
                {/* Visual Radar Circles */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-[600px] h-[600px] border border-slate-200 rounded-full animate-pulse opacity-50"></div>
                    <div className="w-[400px] h-[400px] border border-slate-200 rounded-full animate-pulse opacity-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 delay-300"></div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <div className="relative">
                      <div className="w-6 h-6 bg-slate-900 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 shadow-2xl border-[3px] border-white"></div>
                      <div className="w-20 h-20 bg-brand-primary/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
                   </div>
                </div>

                <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-center gap-8 bg-white/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/50">
                    <div className="text-center md:text-left">
                        <h4 className="font-black text-2xl text-slate-900 uppercase tracking-tighter">Lagos Command Center</h4>
                        <p className="text-slate-600 font-bold opacity-80">Serving West African territories with 24/7 coverage.</p>
                    </div>
                    <button className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-slate-50 transition-all border border-slate-100">
                        Institutional Directions
                    </button>
                </div>
             </div>
         </div>
      </main>

      <Footer />
    </div>
  );
};
