
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Truck, ShieldCheck, MapPin, ArrowRight, Clock, Star, ChevronDown, Package, Navigation, Globe, Plus, Minus, Check, Play, Apple, Building, LayoutDashboard, Search, Wallet, Bell, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import { Link, useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {  
  const navigate = useNavigate();
  const onGetStarted = () => navigate('/auth');
  const onContact = () => navigate('/contact');
  const containerRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animations
      gsap.from(".hero-text", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out"
      });

      // Scroll Animations for Sections
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
        gsap.from(section, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          }
        });
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-brand-orange/20" ref={containerRef}>
      
      {/* Navigation - White/Light Theme */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4 border-b border-slate-100' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="font-bold text-2xl flex items-center gap-2">
              <div className="bg-brand-orange p-1.5 rounded-xl shadow-lg shadow-orange-500/20">
                <Truck size={20} strokeWidth={3} className="text-white" />
              </div>
              <span className={`tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>SureTruqs<span className="text-brand-orange">.</span></span>
            </div>
            
            <div className={`hidden md:flex space-x-10 text-sm font-medium ${scrolled ? 'text-slate-600' : 'text-white/90'}`}>
              <button className="hover:text-brand-orange transition-colors">Home</button>
              <button onClick={() => document.getElementById('services')?.scrollIntoView({behavior:'smooth'})} className="hover:text-brand-orange transition-colors">Solutions</button>
              <button onClick={() => document.getElementById('features')?.scrollIntoView({behavior:'smooth'})} className="hover:text-brand-orange transition-colors">Features</button>
              <button onClick={() => document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})} className="hover:text-brand-orange transition-colors">Pricing</button>
              <button onClick={onContact} className="hover:text-brand-orange transition-colors">Contact</button>
            </div>
            
            <div className="flex space-x-4">
               <Button 
                variant="cta" 
                onClick={onGetStarted} 
                className="rounded-full px-8 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 transition-all transform hover:-translate-y-0.5"
               >
                 Get Started
               </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Light & Airy */}
      <div className="relative h-screen min-h-[800px] w-full overflow-hidden">
        {/* Full Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2400&q=80" 
            alt="Logistics Ship" 
            className="w-full h-full object-cover"
          />
          {/* Lighter Gradient Overlay - Teal/Blue tint instead of heavy black */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-800/20 to-transparent mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
        </div>

        <div className="relative h-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-4xl pt-20">
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tight mb-8 hero-text drop-shadow-sm">
              MOST AFFORDABLE <br/>
              WAY TO SHIP <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-400">PRODUCTS</span>
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-6 hero-text items-start max-w-2xl">
               <p className="text-slate-100 text-lg md:text-xl leading-relaxed font-light drop-shadow-sm">
                  Whether you're traveling for business, leisure, or a special occasion, our logistics network ensures your cargo arrives safely and on time.
               </p>
            </div>

            {/* Action Bar / Search Input Mock - Pill Shape */}
            <div className="mt-12 hero-text bg-white p-2.5 rounded-full max-w-xl flex shadow-2xl items-center ring-4 ring-white/10">
                <div className="flex-1 px-4 flex items-center border-r border-slate-100">
                    <MapPin className="text-slate-400 mr-2 shrink-0" size={18}/>
                    <div className="bg-slate-50 rounded-lg px-3 py-2 w-full">
                       <input type="text" placeholder="Pickup Location" className="w-full outline-none text-slate-700 font-medium placeholder:text-slate-400 bg-transparent text-sm"/>
                    </div>
                </div>
                <div className="flex-1 px-4 flex items-center">
                    <Navigation className="text-slate-400 mr-2 shrink-0" size={18}/>
                    <div className="bg-slate-50 rounded-lg px-3 py-2 w-full">
                       <input type="text" placeholder="Dropoff Point" className="w-full outline-none text-slate-700 font-medium placeholder:text-slate-400 bg-transparent text-sm"/>
                    </div>
                </div>
                <button className="bg-brand-dark text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-brand-primary transition-colors shrink-0 shadow-lg">
                    <ArrowRight size={20}/>
                </button>
            </div>

            {/* Floating Glass Widget (Bottom Right) */}
            <div className="absolute bottom-12 right-8 lg:right-32 hidden lg:block hero-text z-20">
               <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-[2rem] w-80 shadow-2xl">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h3 className="text-white font-bold text-lg">Delivery Solutions</h3>
                        <p className="text-slate-300 text-xs">Your delivery data</p>
                     </div>
                     <div className="bg-white/20 p-2 rounded-full text-white">
                        <Clock size={16}/>
                     </div>
                  </div>
                  <div className="h-40 rounded-2xl overflow-hidden relative shadow-inner">
                      <img 
                        src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80" 
                        className="w-full h-full object-cover" 
                        alt="Delivery Truck"
                      />
                      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm text-slate-900">
                         In Transit • 12:30 PM
                      </div>
                  </div>
               </div>
            </div>
         </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="py-24 bg-white relative z-10">
         <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 reveal-section">
               <div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">Our Services</h2>
                  <p className="text-slate-500 mt-4 max-w-md text-lg">Comprehensive logistics solutions tailored for speed, safety, and reliability.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { title: 'Inter-State Haulage', img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80', icon: Truck, color: 'bg-blue-100 text-blue-600', desc: 'Long-distance heavy freight.' },
                  { title: 'Last-Mile Delivery', img: 'https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&w=800&q=80', icon: Package, color: 'bg-orange-100 text-orange-600', desc: 'Fast local deliveries.' },
                  { title: 'Corporate Fleets', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', icon: Building, color: 'bg-slate-100 text-slate-600', desc: 'Dedicated business logistics.' }
               ].map((service, idx) => (
                  <div key={idx} className="group relative rounded-[2.5rem] overflow-hidden h-[450px] cursor-pointer reveal-section shadow-lg hover:shadow-2xl transition-all duration-500">
                     <img src={service.img} alt={service.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                     <div className="absolute top-8 left-8">
                        <div className={`w-12 h-12 ${service.color} rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm`}>
                            <service.icon size={24} />
                        </div>
                     </div>
                     <div className="absolute bottom-0 left-0 p-8 w-full">
                        <h3 className="text-3xl font-bold text-white mb-2">{service.title}</h3>
                        <div className="flex justify-between items-end">
                            <p className="text-slate-200 font-medium">{service.desc}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
      
       {/* Features Split Section */}
      <div id="features" className="py-24 bg-slate-50 overflow-hidden">
         <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
               
               {/* Left Content */}
               <div className="w-full lg:w-1/2 reveal-section">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-brand-primary font-bold text-xs uppercase tracking-wide mb-6">
                     Why Choose Us
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-8">
                     Logistics Simplified <br/> For <span className="text-brand-orange">Growth.</span>
                  </h2>
                  <p className="text-slate-600 text-lg mb-10 max-w-lg leading-relaxed">
                     We leverage technology to streamline your supply chain. From verified drivers to real-time tracking, we provide the tools you need to scale.
                  </p>

                  <div className="space-y-6">
                     {[
                        { title: 'Verified Drivers', text: 'All drivers undergo rigorous background checks.', icon: ShieldCheck },
                        { title: 'Real-Time Tracking', text: 'Monitor your cargo location 24/7.', icon: Navigation },
                        { title: 'Insurance Coverage', text: 'Comprehensive goods-in-transit protection.', icon: Check }
                     ].map((feat, i) => (
                        <div key={i} className="flex items-start bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-brand-orange/30 transition-colors">
                           <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-brand-primary mr-5 shrink-0">
                              <feat.icon size={24} />
                           </div>
                           <div>
                              <h4 className="text-lg font-bold text-slate-900">{feat.title}</h4>
                              <p className="text-slate-500 text-sm mt-1">{feat.text}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Right Side - Dashboard Mockup matching CustomerDashboard.tsx */}
               <div className="w-full lg:w-1/2 relative reveal-section pl-0 lg:pl-10">
                  <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 h-[600px] border-[8px] border-white bg-slate-50 select-none">
                     
                     {/* Mock Top Bar */}
                     <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-10">
                        <div className="flex items-center gap-6">
                           <div className="flex items-center gap-2">
                              <div className="bg-brand-orange text-white p-1.5 rounded-lg">
                                 <Package size={16} strokeWidth={3} />
                              </div>
                              <span className="font-bold text-slate-900 tracking-tight">SureTruqs<span className="text-brand-orange">.</span></span>
                           </div>
                           <div className="hidden md:flex bg-slate-100 rounded-full p-1 gap-1">
                              <div className="bg-white text-brand-primary px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">Dashboard</div>
                              <div className="text-slate-400 px-3 py-1 rounded-full text-[10px] font-bold">Wallet</div>
                              <div className="text-slate-400 px-3 py-1 rounded-full text-[10px] font-bold">History</div>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><Search size={14}/></div>
                           <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center font-bold text-xs border border-blue-100">JD</div>
                        </div>
                     </div>

                     {/* Mock Dashboard Content */}
                     <div className="p-6 space-y-6">
                        {/* Header */}
                        <div className="flex justify-between items-end">
                           <div>
                              <h3 className="font-bold text-slate-900 text-lg">Overview</h3>
                              <p className="text-xs text-slate-500">Welcome back, Shoprite NG</p>
                           </div>
                           <button className="bg-brand-primary text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20">
                              <Plus size={14} /> Book Shipment
                           </button>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4">
                           <div className="col-span-1 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm relative overflow-hidden">
                              <div className="relative z-10">
                                 <div className="flex items-center gap-2 mb-2">
                                     <div className="p-1 bg-blue-50 text-brand-primary rounded">
                                        <Wallet size={12} />
                                     </div>
                                     <p className="text-[10px] text-slate-500 font-bold uppercase">Wallet Balance</p>
                                 </div>
                                 <p className="text-xl font-bold mb-3 text-slate-900">₦85,000</p>
                                 <div className="bg-brand-primary text-white w-fit px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-lg shadow-blue-500/20">Top Up</div>
                              </div>
                              <div className="absolute -bottom-4 -right-4 bg-blue-50 w-16 h-16 rounded-full blur-xl"></div>
                           </div>
                           <div className="col-span-1 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                              <div className="flex items-center gap-2 mb-2 text-slate-500">
                                 <Package size={14} className="text-brand-orange"/>
                                 <span className="text-[10px] font-bold uppercase">Shipments</span>
                              </div>
                              <p className="text-2xl font-bold text-slate-900">142</p>
                           </div>
                           <div className="col-span-1 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                              <div className="flex items-center gap-2 mb-2 text-slate-500">
                                 <Truck size={14} className="text-green-600"/>
                                 <span className="text-[10px] font-bold uppercase">Drivers</span>
                              </div>
                              <p className="text-2xl font-bold text-slate-900">12</p>
                           </div>
                        </div>

                        {/* Active Shipment Mock */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                           <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                 <span className="text-sm font-bold text-slate-900">In Transit</span>
                              </div>
                              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded border border-slate-200">TRK-8821</span>
                           </div>
                           
                           {/* Timeline Visual */}
                           <div className="relative flex justify-between mb-6 px-1">
                              <div className="absolute top-1 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
                              <div className="absolute top-1 left-0 w-3/4 h-0.5 bg-brand-secondary -z-10"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-brand-secondary ring-2 ring-white"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-brand-secondary ring-2 ring-white"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-brand-secondary ring-2 ring-white"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-brand-secondary ring-4 ring-blue-50"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-slate-200"></div>
                           </div>

                           <div className="flex justify-between items-end">
                              <div>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase">Pickup</p>
                                 <p className="text-sm font-bold text-slate-900">Apapa Port</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-[10px] text-slate-400 font-bold uppercase">Dropoff</p>
                                 <p className="text-sm font-bold text-slate-900">Ibadan</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Overlay Widget (Total Savings) */}
                     <div className="absolute bottom-6 right-6 bg-[#0B1120] text-white p-5 rounded-2xl shadow-2xl max-w-[200px] animate-[float_5s_ease-in-out_infinite_1s] border border-white/10 z-20">
                        <div className="flex justify-between items-center mb-3">
                           <span className="text-xs text-slate-400 font-medium">Savings</span>
                           <ArrowRight className="text-brand-orange -rotate-45" size={16}/>
                        </div>
                        <p className="text-2xl font-bold tracking-tight mb-1">₦2.4M</p>
                        <p className="text-[10px] text-slate-500">Optimized routing</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
      
       {/* Nationwide Coverage Section (Maps) - REDESIGNED LIGHT */}
      <div className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 reveal-section">
                
                {/* Map Visualization - Light Theme */}
                <div className="w-full lg:w-3/5 relative h-[500px] lg:h-[600px] bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 group">
                    
                    {/* Map Background Image (Light) */}
                    <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-20 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-blue-50/40"></div>

                    {/* Central Hub Pulse (Orange) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-96 h-96 border border-brand-orange/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
                        <div className="w-64 h-64 border border-brand-orange/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="w-4 h-4 bg-brand-orange rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-orange-500/50 z-10"></div>
                         {/* Radar Scan Effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-t from-brand-orange/5 to-transparent rounded-full animate-spin [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
                    </div>

                    {/* Connecting Lines (Simulated Routes) - Darker/Visible lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <linearGradient id="routeGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="50%" stopColor="#ea580c" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                        <path d="M400,300 L600,150" stroke="url(#routeGradientLight)" strokeWidth="3" className="opacity-60" strokeDasharray="6,6" />
                        <path d="M400,300 L200,450" stroke="url(#routeGradientLight)" strokeWidth="3" className="opacity-60" strokeDasharray="6,6" />
                        <path d="M400,300 L150,200" stroke="url(#routeGradientLight)" strokeWidth="3" className="opacity-60" strokeDasharray="6,6" />
                    </svg>

                    {/* Floating Location Nodes - Light Theme */}
                    <div className="absolute top-1/4 right-1/4 animate-[bounce_3s_infinite]">
                         <div className="bg-white border border-slate-100 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-slate-700">Kano Hub</span>
                        </div>
                    </div>

                    <div className="absolute bottom-1/3 left-1/4 animate-[bounce_4s_infinite]">
                         <div className="bg-white border border-slate-100 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-slate-700">Lagos Port</span>
                        </div>
                    </div>

                    {/* Live Tracking Card - Light Glass */}
                    <div className="absolute bottom-8 right-8 bg-white/80 backdrop-blur-xl border border-white/50 p-5 rounded-2xl shadow-xl w-64">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                                <Truck size={14} className="text-brand-orange"/> Live Fleet
                            </h4>
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold border border-green-200">Active</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs text-slate-500 font-medium">
                                <span>Vehicles Online</span>
                                <span className="font-bold text-slate-900">1,248</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div className="bg-brand-orange w-[75%] h-full rounded-full"></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 font-medium pt-1">
                                <span>Deliveries Today</span>
                                <span className="font-bold text-slate-900">8,902</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Text Content - Light Theme */}
                <div className="w-full lg:w-2/5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-brand-orange text-xs font-bold uppercase tracking-wider mb-6">
                        <Globe size={12} /> Global Standards
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.1] text-slate-900">
                        Complete <span className="text-brand-orange">Coverage</span> <br/> Across The Nation
                    </h2>
                    <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                        Our intelligent routing network spans all 36 states. We utilize advanced geospatial data to optimize every route, ensuring your cargo moves efficiently through our verified hubs.
                    </p>

                    <div className="space-y-4">
                        {[
                            { title: 'Real-Time Visibility', desc: 'Track your cargo down to the meter.', icon: MapPin },
                            { title: 'Optimized Routing', desc: 'AI-driven route planning reduces transit time.', icon: Navigation },
                            { title: 'Secure Checkpoints', desc: 'Verified stops and secure hubs.', icon: ShieldCheck }
                        ].map((feature, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-brand-primary shrink-0">
                                    <feature.icon size={22}/>
                                </div>
                                <div>
                                    <h4 className="text-slate-900 font-bold text-lg">{feature.title}</h4>
                                    <p className="text-slate-500 text-sm mt-1">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-24 pb-12 text-slate-900">
         <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
               <div className="col-span-2 lg:col-span-2">
                  <div className="font-bold text-3xl flex items-center gap-2 mb-6">
                     <div className="bg-brand-orange p-1.5 rounded-xl">
                        <Truck size={24} strokeWidth={3} className="text-white" />
                     </div>
                     <span>SureTruqs<span className="text-brand-orange">.</span></span>
                  </div>
                  <p className="text-slate-500 max-w-sm mb-8">
                     Connecting cargo to trucks instantly. The reliable logistics partner for African businesses.
                  </p>
                  <Button onClick={onContact} variant="cta" className="rounded-full bg-brand-orange text-white hover:bg-orange-600 font-bold px-8 shadow-lg shadow-orange-100">Contact Us</Button>
               </div>
               
               <div>
                  <h4 className="font-bold mb-6 text-slate-900">Company</h4>
                  <ul className="space-y-4 text-slate-500 text-sm">
                     <li><a href="#" className="hover:text-brand-orange transition-colors">About Us</a></li>
                     <li><a href="#" className="hover:text-brand-orange transition-colors">Our Fleet</a></li>
                     <li><a href="#" className="hover:text-brand-orange transition-colors">Careers</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold mb-6 text-slate-900">Services</h4>
                  <ul className="space-y-4 text-slate-500 text-sm">
                     <li><a href="#" className="hover:text-brand-orange transition-colors">Inter-State Haulage</a></li>
                     <li><a href="#" className="hover:text-brand-orange transition-colors">Last-Mile Delivery</a></li>
                     <li><a href="#" className="hover:text-brand-orange transition-colors">Corporate Logistics</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold mb-6 text-slate-900">Support</h4>
                  <ul className="space-y-4 text-slate-500 text-sm">
                     <li><a href="#" className="hover:text-brand-orange transition-colors">Help Center</a></li>
                     <li><a href="#" className="hover:text-brand-orange transition-colors">Driver Support</a></li>
                     <li><a href="#" className="hover:text-brand-orange transition-colors">Insurance Policy</a></li>
                  </ul>
               </div>
            </div>

            <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
               <p>&copy; 2024 SureTruqs. All rights reserved.</p>
               <div className="flex gap-8 mt-4 md:mt-0">
                  <a href="#" className="hover:text-brand-orange transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-brand-orange transition-colors">Terms of Use</a>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};
