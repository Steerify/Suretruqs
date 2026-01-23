import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ArrowLeft, Globe, Mail, Phone } from 'lucide-react';
import { Button } from '../ui/Button';

import { Footer } from './Footer';

interface StaticPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  heroImage?: string;
}

export const StaticPageLayout: React.FC<StaticPageLayoutProps> = ({ children, title, subtitle, heroImage }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Simple Global Nav */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4 border-b border-slate-100' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="font-bold text-2xl flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-brand-orange p-1.5 rounded-xl">
              <Truck size={20} strokeWidth={3} className="text-white" />
            </div>
            <span className={scrolled ? 'text-slate-900' : 'text-slate-900 md:text-white'}>SureTruqs<span className="text-brand-orange">.</span></span>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/')} className="rounded-full shadow-sm bg-white/10 backdrop-blur-md border border-white/20">
             <ArrowLeft size={16} className="mr-2" /> Back Home
          </Button>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden bg-brand-dark">
        {heroImage && (
          <img 
            src={heroImage} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent"></div>
        <div className="relative z-10 text-center px-6 mt-12">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight uppercase">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-20 -mt-20 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 md:p-16 border border-slate-100">
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
};
