import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { Footer } from './Footer';
import gsap from 'gsap';

interface StaticPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  heroImage?: string;
}

export const StaticPageLayout: React.FC<StaticPageLayoutProps> = ({ children, title, subtitle, heroImage }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Smooth reveal animation
    const ctx = gsap.context(() => {
        gsap.from(".reveal-header", {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
        gsap.from(".reveal-content", {
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 0.2,
            ease: "power3.out"
        });
    });

    return () => {
        window.removeEventListener('scroll', handleScroll);
        ctx.revert();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 selection:bg-brand-orange/20" ref={containerRef}>
      {/* Premium Glass Nav */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ease-out ${
          scrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] py-4 border-b border-white/20' 
          : 'bg-transparent py-7'
      }`}>
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="font-bold text-2xl flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="bg-brand-orange p-2 rounded-2xl shadow-lg shadow-orange-500/20 group-hover:rotate-12 transition-transform duration-300">
              <Truck size={22} strokeWidth={2.5} className="text-white" />
            </div>
            <span className={`tracking-tighter font-black transition-colors duration-300 ${scrolled || !heroImage ? 'text-slate-900' : 'text-white'}`}>
                SureTruqs<span className="text-brand-orange">.</span>
            </span>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className={`flex items-center gap-2 group text-sm font-bold tracking-tight px-5 py-2.5 rounded-full transition-all duration-300 border ${
                scrolled || !heroImage
                ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                : 'bg-white/10 text-white border-white/20 backdrop-blur-md hover:bg-white/20'
            }`}
          >
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back Home
          </button>
        </div>
      </nav>

      {/* High-End Immersive Hero */}
      <div className="relative h-[480px] flex items-center justify-center overflow-hidden bg-slate-900">
        {heroImage && (
          <div className="absolute inset-0">
             <img 
               src={heroImage} 
               alt={title} 
               className="w-full h-full object-cover transform scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
          </div>
        )}
        
        {/* Animated Mesh Background (CSS only) */}
        {!heroImage && (
            <div className="absolute inset-0 overflow-hidden opacity-20">
                <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-brand-primary rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-brand-orange rounded-full blur-[100px] animate-pulse delay-700"></div>
            </div>
        )}

        <div className="relative z-10 text-center px-6 mt-16 max-w-4xl reveal-header">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-[0.2em]">
             Corporate Infrastructure
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight uppercase drop-shadow-2xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed opacity-90">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Redesigned Content - "The Floating Whiteboard" */}
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 pb-32 -mt-16 relative z-20 reveal-content">
        <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12),0_30px_60px_-30px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden">
           {/* Abstract Decorative Element */}
           <div className="h-2 w-full bg-gradient-to-r from-brand-primary via-brand-orange to-brand-secondary"></div>
           
           <div className="p-8 md:p-16 lg:p-24">
             {children}
           </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
