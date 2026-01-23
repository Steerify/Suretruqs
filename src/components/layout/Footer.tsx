import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Instagram, Twitter, Linkedin, Facebook, ArrowRight, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Button } from '../ui/Button';

export const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="relative bg-white pt-24 pb-12 overflow-hidden text-slate-900 selection:bg-brand-orange/30 border-t border-slate-100">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] translate-y-1/2"></div>
            </div>

            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Upper Footer: CTA */}
                <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-8 md:p-16 mb-24 flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-slate-900">Ready to streamline your <span className="text-brand-orange">logistics?</span></h2>
                        <p className="text-slate-500 text-lg max-w-xl font-medium">Join thousands of businesses across Africa who trust SureTruqs for their daily haulage needs.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                        <Button variant="cta" onClick={() => navigate('/auth')} className="rounded-full px-10 py-5 text-base shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:-translate-y-1 transition-all">
                            Get Started Now
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/contact')} className="rounded-full px-10 py-5 border-slate-200 text-slate-600 hover:bg-white shadow-sm">
                            Talk to Sales
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="font-bold text-3xl flex items-center gap-2 mb-8 group cursor-default">
                            <div className="bg-brand-orange p-2 rounded-2xl shadow-lg shadow-orange-500/20 group-hover:rotate-12 transition-transform duration-500">
                                <Truck size={28} strokeWidth={3} className="text-white" />
                            </div>
                            <span className="tracking-tighter text-slate-900">SureTruqs<span className="text-brand-orange">.</span></span>
                        </div>
                        <p className="text-slate-500 leading-relaxed mb-8 max-w-xs text-base font-medium">
                            The intelligent haulage network powering the future of commerce in Africa. Fast, secure, and transparent.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-primary transition-all duration-300 border border-slate-100 shadow-sm hover:shadow-lg">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Groups */}
                    <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-12">
                        <div>
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-8">Platform</h4>
                            <ul className="space-y-4">
                                {[
                                    { label: 'Our Fleet', path: '/fleet' },
                                    { label: 'About Us', path: '/about' },
                                    { label: 'Solutions', path: '/' },
                                    { label: 'Careers', path: '/careers' },
                                ].map((item, i) => (
                                    <li key={i}>
                                        <Link to={item.path} className="text-sm font-bold text-slate-500 hover:text-brand-orange transition-all flex items-center group">
                                            <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100"><ArrowRight size={12} className="mr-2"/></span>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-8">Services</h4>
                            <ul className="space-y-4">
                                {[
                                    { label: 'Inter-State', path: '/services/haulage' },
                                    { label: 'Last-Mile', path: '/services/last-mile' },
                                    { label: 'Corporate', path: '/services/corporate' },
                                    { label: 'Warehousing', path: '#' },
                                ].map((item, i) => (
                                    <li key={i}>
                                        <Link to={item.path} className="text-sm font-bold text-slate-500 hover:text-brand-orange transition-all flex items-center group">
                                            <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100"><ArrowRight size={12} className="mr-2"/></span>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-8">Support</h4>
                            <ul className="space-y-4">
                                {[
                                    { label: 'Help Center', path: '/support/help' },
                                    { label: 'Driver Hub', path: '/support/driver-support' },
                                    { label: 'Contact', path: '/contact' },
                                    { label: 'Status', path: '#' },
                                ].map((item, i) => (
                                    <li key={i}>
                                        <Link to={item.path} className="text-sm font-bold text-slate-500 hover:text-brand-orange transition-all flex items-center group">
                                            <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100"><ArrowRight size={12} className="mr-2"/></span>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact Info (Lively) */}
                    <div className="lg:col-span-1">
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-8">Base</h4>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-slate-50 rounded-lg text-brand-orange border border-slate-100"><MapPin size={16}/></div>
                                <p className="text-xs font-bold text-slate-600">Lagos HQ<br/><span className="text-slate-400 font-medium">Victoria Island, Lagos.</span></p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-slate-50 rounded-lg text-brand-primary border border-slate-100"><Phone size={16}/></div>
                                <p className="text-xs font-bold text-slate-600">+234 (0) 700 SURE</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-slate-50 rounded-lg text-green-500 border border-slate-100"><Globe size={16}/></div>
                                <p className="text-xs font-bold text-slate-600">Regional Coverage<br/><span className="text-slate-400 font-medium tracking-widest text-[9px]">WEST AFRICA</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lower Footer */}
                <div className="border-t border-slate-100 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
                        <p className="text-[13px] font-medium text-slate-400">&copy; 2026 SureTruqs. All rights reserved.</p>
                        <div className="flex gap-8">
                            <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">Privacy Policy</a>
                            <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">Terms of Service</a>
                            <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">Security</a>
                        </div>
                    </div>
                    
                    <div className="animate-pulse flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Systems Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
