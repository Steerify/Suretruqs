import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Mail, Phone, MapPin, Send, ArrowLeft, MessageSquare, Building, Twitter, Linkedin, Facebook, Instagram, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';

export const ContactView: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [formStatus, setFormStatus] = useState<'IDLE' | 'SENDING' | 'SENT'>('IDLE');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-up", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('SENDING');
    // Simulate API call
    setTimeout(() => {
      setFormStatus('SENT');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900" ref={containerRef}>
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="font-bold text-2xl flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-brand-orange p-1.5 rounded-xl shadow-lg shadow-orange-500/20">
                <Send size={20} strokeWidth={3} className="text-white transform -rotate-45 translate-x-0.5 translate-y-0.5" />
              </div>
              <span className="tracking-tight text-slate-900">SureTruqs<span className="text-brand-orange">.</span></span>
            </div>
            
            <Button variant="ghost" onClick={() => navigate('/')} className="font-bold text-slate-500 hover:text-brand-primary">
               <ArrowLeft size={18} className="mr-2"/> Back to Home
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
            {/* Left Content - Info */}
            <div className="fade-up">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-brand-primary text-xs font-bold uppercase tracking-wider mb-6">
                  <MessageSquare size={12} /> Contact Support
               </div>
               <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                  Let's Start a <br/> <span className="text-brand-orange">Conversation.</span>
               </h1>
               <p className="text-slate-500 text-lg leading-relaxed mb-12 max-w-lg">
                  Have questions about our logistics network? Need a custom quote for corporate haulage? Our team is ready to help you optimize your supply chain.
               </p>

               <div className="space-y-8">
                  <div className="flex items-start gap-6 group">
                     <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform duration-300">
                        <Mail size={24} />
                     </div>
                     <div>
                        <h3 className="font-bold text-slate-900 text-lg">Email Us</h3>
                        <p className="text-slate-500 mb-1">For general inquiries and support</p>
                        <a href="mailto:hello@suretruqs.com" className="text-brand-primary font-bold hover:underline text-lg">hello@suretruqs.com</a>
                     </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                     <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform duration-300">
                        <Phone size={24} />
                     </div>
                     <div>
                        <h3 className="font-bold text-slate-900 text-lg">Call Us</h3>
                        <p className="text-slate-500 mb-1">Mon-Fri from 8am to 6pm</p>
                        <a href="tel:+2348000000000" className="text-brand-primary font-bold hover:underline text-lg">+234 800 000 0000</a>
                     </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                     <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform duration-300">
                        <MapPin size={24} />
                     </div>
                     <div>
                        <h3 className="font-bold text-slate-900 text-lg">Visit HQ</h3>
                        <p className="text-slate-500 mb-1 max-w-xs">12 Alausa Secretariat Road, Ikeja, Lagos State, Nigeria.</p>
                        <a href="#" className="text-brand-primary font-bold hover:underline text-sm flex items-center gap-1">Get Directions <ArrowLeft className="rotate-180" size={14}/></a>
                     </div>
                  </div>
               </div>

               <div className="mt-16 pt-12 border-t border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-4">Follow us</h4>
                  <div className="flex gap-4">
                     {[Twitter, Linkedin, Facebook, Instagram].map((Icon, i) => (
                        <a key={i} href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand-primary hover:border-brand-primary transition-colors">
                           <Icon size={18} />
                        </a>
                     ))}
                  </div>
               </div>
            </div>

            {/* Right Content - Form */}
            <div className="fade-up relative">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 -translate-x-10 translate-y-10"></div>

               <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200 border border-slate-100">
                  {formStatus === 'SENT' ? (
                     <div className="h-[500px] flex flex-col items-center justify-center text-center animate-[fadeIn_0.5s_ease-out]">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6">
                           <CheckCircle2 size={48} />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mb-8">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                        <Button onClick={() => setFormStatus('IDLE')} variant="secondary">Send Another Message</Button>
                     </div>
                  ) : (
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="mb-8">
                           <h3 className="text-2xl font-bold text-slate-900">Send a Message</h3>
                           <p className="text-slate-500">We typically reply in under 2 hours.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700">First Name</label>
                              <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium text-slate-900" placeholder="e.g. John" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700">Last Name</label>
                              <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium text-slate-900" placeholder="e.g. Doe" />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700">Email Address</label>
                           <input required type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium text-slate-900" placeholder="john@company.com" />
                        </div>

                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700">Subject</label>
                           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium text-slate-900">
                              <option>General Inquiry</option>
                              <option>Corporate Partnership</option>
                              <option>Driver Application Support</option>
                              <option>Report an Issue</option>
                           </select>
                        </div>

                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700">Message</label>
                           <textarea required rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium text-slate-900 resize-none" placeholder="How can we help you?"></textarea>
                        </div>

                        <Button 
                           type="submit" 
                           className="w-full py-4 rounded-xl text-base shadow-xl shadow-brand-primary/20 font-bold"
                           isLoading={formStatus === 'SENDING'}
                        >
                           Send Message
                        </Button>
                     </form>
                  )}
               </div>
            </div>
         </div>

         {/* Map Section */}
         <div className="fade-up rounded-[2.5rem] overflow-hidden h-[400px] relative shadow-lg border border-slate-200 group">
            <div className="absolute inset-0 bg-slate-200">
                {/* Simplified Map Representation */}
                <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-30 mix-blend-multiply grayscale"></div>
                
                {/* Location Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <div className="relative">
                      <div className="w-4 h-4 bg-brand-orange rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 shadow-lg border-2 border-white"></div>
                      <div className="w-12 h-12 bg-brand-orange/30 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
                      
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow-xl whitespace-nowrap border border-slate-100">
                         <p className="text-xs font-bold text-slate-900 flex items-center gap-1"><Building size={12}/> Lagos HQ</p>
                      </div>
                   </div>
                </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/50 to-transparent flex justify-between items-end">
               <div className="text-white">
                  <h4 className="font-bold text-xl">Lagos, Nigeria</h4>
                  <p className="text-sm opacity-90">12 Alausa Secretariat Road, Ikeja</p>
               </div>
               <Button variant="secondary" className="bg-white border-none shadow-lg text-slate-900 font-bold">Open in Maps</Button>
            </div>
         </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
           <p>&copy; 2024 SureTruqs. All rights reserved.</p>
           <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-brand-orange transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-orange transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-brand-orange transition-colors">Cookie Policy</a>
           </div>
        </div>
      </footer>
    </div>
  );
};
