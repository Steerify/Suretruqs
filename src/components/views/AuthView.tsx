import React, { useRef, useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { UserRole } from '../../types';
import gsap from 'gsap';
import { Truck, User, ArrowLeft, CheckCircle2, Mail, Lock, Phone as PhoneIcon, Building, Eye, EyeOff } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

// Extracted Component to prevent re-creation on render
const InputField = ({ 
  label, name, type = "text", placeholder, icon: Icon, required = true, value, onChange 
}: { 
  label: string, name: string, type?: string, placeholder: string, icon: any, required?: boolean, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void 
}) => (
  <div className="space-y-1.5 auth-form-anim">
    <label className="block text-sm font-bold text-slate-700">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <Icon size={18} />
      </div>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-all bg-white text-slate-900 font-medium placeholder:text-slate-400 shadow-sm"
        placeholder={placeholder}
      />
    </div>
  </div>
);

export const AuthView: React.FC = () => {
  const { login, signup } = useStore();
  const navigate = useNavigate(); 
  const onBack = () => navigate('/');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State
  const [step, setStep] = useState<'ROLE' | 'AUTH'>('ROLE');
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    companyName: '',
    vehicleType: 'Box Truck'
  });

  // Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation for Form View
      if (step === 'AUTH') {
        gsap.fromTo(".auth-form-anim", 
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
        );
      }

      // Hero image text animation (runs once)
      gsap.from(".hero-text-anim", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, [step, authMode]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('AUTH');
    setAuthMode('LOGIN'); // Default to login
  };

  const handleBack = () => {
    if (step === 'AUTH') {
      setStep('ROLE');
      setSelectedRole(null);
    } else {
      onBack();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (authMode === 'LOGIN') {
        await login(formData.email, formData.password);
      } else {
        await signup({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: selectedRole,
          phone: formData.phone
        });
      }
      // Navigation is handled by App.tsx redirects based on currentUser state
    } catch (err: any) {
      alert(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden font-sans" ref={containerRef}>
      
      {/* Mobile Background Image (Absolute) */}
      <div className="absolute inset-0 lg:hidden z-0">
         <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Logistics Background" 
            className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px]"></div>
      </div>

      {/* Left Side - Content Area */}
      <div className="w-full lg:w-1/2 flex flex-col px-6 sm:px-12 xl:px-24 z-10 relative h-screen lg:h-auto overflow-y-auto no-scrollbar bg-white lg:bg-transparent">
        {/* Back Button Header */}
        <div className="pt-8 pb-4">
          <button 
            onClick={handleBack}
            className="flex items-center text-slate-400 hover:text-brand-primary transition-colors group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 flex flex-col justify-center pb-12">
           {step === 'ROLE' ? (
             // ROLE SELECTION VIEW
             <div className="w-full max-w-md mx-auto py-8">
               <div className="mb-10 text-center animate-[fadeIn_0.5s_ease-out]">
                 <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-brand-primary mb-6 shadow-sm border border-blue-100">
                   <Truck size={28} />
                 </div>
                 <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Choose Portal</h1>
                 <p className="text-slate-500 text-lg font-medium">
                   Select your role to continue to the dashboard.
                 </p>
               </div>

               <div className="space-y-5 animate-[fadeIn_0.5s_ease-out_0.1s_both]">
                 {/* CUSTOMER BUTTON */}
                 <button 
                   onClick={() => handleRoleSelect(UserRole.CUSTOMER)}
                   className="w-full group relative p-6 rounded-2xl bg-white border-2 border-slate-100 hover:border-brand-secondary hover:bg-blue-50/50 transition-all duration-300 text-left shadow-sm hover:shadow-md"
                 >
                   <div className="flex items-center">
                      <div className="p-3 bg-blue-50 text-brand-secondary rounded-xl mr-5 group-hover:scale-110 transition-transform duration-300">
                         <User size={28} />
                      </div>
                      <div className="flex-1">
                         <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-secondary transition-colors">Customer Portal</h3>
                         <p className="text-slate-500 text-sm leading-relaxed font-medium">Book shipments & track cargo</p>
                      </div>
                      <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                         <ArrowLeft className="rotate-180 text-brand-secondary" size={20} />
                      </div>
                   </div>
                 </button>

                 {/* DRIVER BUTTON */}
                 <button 
                   onClick={() => handleRoleSelect(UserRole.DRIVER)}
                   className="w-full group relative p-6 rounded-2xl bg-white border-2 border-slate-100 hover:border-brand-orange hover:bg-orange-50/50 transition-all duration-300 text-left shadow-sm hover:shadow-md"
                 >
                   <div className="flex items-center">
                      <div className="p-3 bg-orange-50 text-brand-orange rounded-xl mr-5 group-hover:scale-110 transition-transform duration-300">
                         <Truck size={28} />
                      </div>
                      <div className="flex-1">
                         <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-orange transition-colors">Driver Partner</h3>
                         <p className="text-slate-500 text-sm leading-relaxed font-medium">Accept jobs & manage deliveries</p>
                      </div>
                      <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                         <ArrowLeft className="rotate-180 text-brand-orange" size={20} />
                      </div>
                   </div>
                 </button>
               </div>
               
               <div className="mt-12 text-center">
                  <p className="text-xs text-slate-400 font-medium">
                     By continuing, you agree to our <span className="underline cursor-pointer hover:text-brand-primary">Terms</span> and <span className="underline cursor-pointer hover:text-brand-primary">Privacy Policy</span>.
                  </p>
               </div>
             </div>
           ) : (
             // AUTH FORM VIEW
             <div className="w-full max-w-sm mx-auto py-8">
               <div className="mb-8 auth-form-anim">
                 <h2 className="text-3xl font-bold text-slate-900 mb-2">
                   {authMode === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
                 </h2>
                 <p className="text-slate-500 text-sm font-medium">
                   {authMode === 'LOGIN' 
                     ? `Sign in to your ${selectedRole === UserRole.DRIVER ? 'Driver' : 'Customer'} account` 
                     : `Join SureTruqs as a ${selectedRole === UserRole.DRIVER ? 'Driver' : 'Customer'}`}
                 </p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-5">
                 
                 {/* Signup Fields */}
                 {authMode === 'SIGNUP' && (
                   <>
                     <InputField 
                       label="Full Name" 
                       name="fullName" 
                       placeholder="e.g. John Doe" 
                       icon={User}
                       value={formData.fullName}
                       onChange={handleInputChange}
                     />
                     
                     <InputField 
                       label="Phone Number" 
                       name="phone" 
                       type="tel"
                       placeholder="+234 800 000 0000" 
                       icon={PhoneIcon}
                       value={formData.phone}
                       onChange={handleInputChange} 
                     />

                     {selectedRole === UserRole.CUSTOMER && (
                       <InputField 
                         label="Company Name (Optional)" 
                         name="companyName" 
                         placeholder="e.g. Shoprite NG" 
                         icon={Building} 
                         required={false}
                         value={formData.companyName}
                         onChange={handleInputChange}
                       />
                     )}

                     {selectedRole === UserRole.DRIVER && (
                       <div className="space-y-1.5 auth-form-anim">
                         <label className="block text-sm font-bold text-slate-700">Vehicle Type</label>
                         <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                             <Truck size={18} />
                           </div>
                           <select
                             name="vehicleType"
                             value={formData.vehicleType}
                             onChange={handleInputChange}
                             className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-slate-900 font-medium shadow-sm"
                           >
                             <option>Motorbike</option>
                             <option>Mini Van</option>
                             <option>Box Truck</option>
                             <option>Flatbed Truck</option>
                           </select>
                         </div>
                       </div>
                     )}
                   </>
                 )}

                 {/* Common Fields */}
                 <InputField 
                   label="Email Address" 
                   name="email" 
                   type="email"
                   placeholder="name@example.com" 
                   icon={Mail}
                   value={formData.email}
                   onChange={handleInputChange}
                 />

                 <div className="space-y-1.5 auth-form-anim">
                   <div className="flex justify-between">
                     <label className="block text-sm font-bold text-slate-700">Password</label>
                     {authMode === 'LOGIN' && <button type="button" className="text-xs text-brand-primary font-bold hover:underline">Forgot?</button>}
                   </div>
                   <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                       <Lock size={18} />
                     </div>
                     <input
                       type={showPassword ? "text" : "password"}
                       name="password"
                       required
                       value={formData.password}
                       onChange={handleInputChange}
                       className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-all bg-white text-slate-900 font-medium placeholder:text-slate-400 shadow-sm"
                       placeholder={authMode === 'LOGIN' ? "Enter your password" : "Create a password"}
                     />
                     <button 
                       type="button" 
                       onClick={() => setShowPassword(!showPassword)}
                       className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                     >
                       {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
                   </div>
                 </div>

                 <div className="pt-2 auth-form-anim">
                   <Button 
                     type="submit" 
                     variant={selectedRole === UserRole.DRIVER ? 'cta' : 'primary'} 
                     className="w-full py-3 font-bold text-base shadow-lg shadow-blue-500/20"
                     isLoading={isLoading}
                   >
                     {authMode === 'LOGIN' ? 'Log In' : 'Create Account'}
                   </Button>
                 </div>
               </form>

               <div className="mt-8 text-center auth-form-anim">
                 <p className="text-sm text-slate-500">
                   {authMode === 'LOGIN' ? "Don't have an account?" : "Already have an account?"}
                   <button 
                     onClick={() => setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
                     className={`ml-1 font-bold hover:underline ${selectedRole === UserRole.DRIVER ? 'text-brand-orange' : 'text-brand-primary'}`}
                   >
                     {authMode === 'LOGIN' ? 'Sign Up' : 'Log In'}
                   </button>
                 </p>
               </div>
             </div>
           )}
        </div>
      </div>

      {/* Right Side - Hero Image (Desktop Only) - Updated for Light Theme */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-50 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=80" 
          alt="Logistics Warehouse" 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        {/* Lighter Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-slate-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-16 text-white hero-text-anim z-10">
          <div className="mb-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 shadow-lg">
             <CheckCircle2 size={16} className="text-green-400" />
             <span className="text-sm font-bold">Trusted by 2,000+ Businesses</span>
          </div>
          <h2 className="text-5xl font-black leading-tight mb-6 drop-shadow-md">
            Logistics simplified <br/> for <span className="text-brand-orange">Africa's commerce.</span>
          </h2>
          <div className="grid grid-cols-2 gap-8 max-w-lg">
             <div>
                <p className="text-3xl font-bold text-white mb-1">98%</p>
                <p className="text-slate-200 text-sm font-medium">On-Time Delivery Rate</p>
             </div>
             <div>
                <p className="text-3xl font-bold text-white mb-1">15k+</p>
                <p className="text-slate-200 text-sm font-medium">Shipments Completed</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};