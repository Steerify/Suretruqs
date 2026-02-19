import React, { useRef, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../ui/Button';
import { UserRole } from '../../types';
import gsap from 'gsap';
import { Truck, User, ArrowLeft, CheckCircle2, Mail, Lock, Phone as PhoneIcon, Building, Eye, EyeOff, Shield, ShieldCheck, KeyRound } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { GoogleLogin } from '@react-oauth/google';

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
  const { login, signup, googleLogin, forgotPassword, resetPassword } = useStore();
  const navigate = useNavigate(); 
  const onBack = () => navigate('/');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP' | 'FORGOT' | 'RESET'>('LOGIN');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    companyName: '',
    vehicleType: 'Box Truck',
    otp: '',
    newPassword: ''
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".auth-form-anim", 
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [authMode]);

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
      } else if (authMode === 'SIGNUP') {
        await signup({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: selectedRole,
          phone: formData.phone
        });
      } else if (authMode === 'FORGOT') {
        await forgotPassword(formData.email);
        setAuthMode('RESET');
      } else if (authMode === 'RESET') {
        await resetPassword({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword
        });
        setAuthMode('LOGIN');
      }
    } catch (err: any) {
      toast.error(err.message || "Operation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
        // Always pass the selected identity (Driver/Customer) to help backend on initial signup
        await googleLogin(credentialResponse.credential, selectedRole);
    } catch (err: any) {
        toast.error(err.message || "Google Auth failed.");
    } finally {
        setIsLoading(false);
    }
  };

  const handeGoogleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden font-sans" ref={containerRef}>
      
      {/* Mobile Background Image (Absolute) */}
      <div className="absolute inset-0 lg:hidden z-0">
         <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[2px]"></div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col px-6 sm:px-12 xl:px-24 z-10 relative h-screen lg:h-auto overflow-y-auto no-scrollbar bg-white">
        <div className="pt-8 pb-4">
          <button 
            onClick={() => authMode === 'FORGOT' || authMode === 'RESET' ? setAuthMode('LOGIN') : onBack()}
            className="flex items-center text-slate-400 hover:text-brand-primary transition-colors group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
            <span className="font-bold">Back</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center pb-12">
           <div className="w-full max-w-sm mx-auto py-8">
             <div className="mb-8 auth-form-anim">
               <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">
                 {authMode === 'LOGIN' && 'Welcome Back'}
                 {authMode === 'SIGNUP' && 'Create Account'}
                 {authMode === 'FORGOT' && 'Reset Password'}
                 {authMode === 'RESET' && 'Enter OTP'}
               </h2>
               <p className="text-slate-500 text-sm font-medium">
                 {authMode === 'LOGIN' && 'Sign in to your SureTruqs account'}
                 {authMode === 'SIGNUP' && 'Join SureTruqs and start shipping'}
                 {authMode === 'FORGOT' && 'We will send a 6-digit code to your email'}
                 {authMode === 'RESET' && 'Check your inbox for the reset code'}
               </p>
             </div>

             <form onSubmit={handleSubmit} className="space-y-5">
               
               {authMode === 'SIGNUP' && (
                 <>
                   <div className="flex gap-4 mb-6 auth-form-anim">
                      <button
                        type="button"
                        onClick={() => setSelectedRole(UserRole.CUSTOMER)}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          selectedRole === UserRole.CUSTOMER 
                            ? 'border-brand-primary bg-blue-50 text-brand-primary' 
                            : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                        }`}
                      >
                        <User size={20} />
                        <span className="text-xs font-black uppercase tracking-widest">Customer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRole(UserRole.DRIVER)}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          selectedRole === UserRole.DRIVER 
                            ? 'border-brand-orange bg-orange-50 text-brand-orange' 
                            : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                        }`}
                      >
                        <Truck size={20} />
                        <span className="text-xs font-black uppercase tracking-widest">Driver</span>
                      </button>
                   </div>

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
                 </>
               )}

               {authMode !== 'RESET' && (
                <InputField 
                    label="Email Address" 
                    name="email" 
                    type="email"
                    placeholder="name@example.com" 
                    icon={Mail}
                    value={formData.email}
                    onChange={handleInputChange}
                />
               )}

               {authMode === 'RESET' && (
                <>
                    <InputField 
                        label="6-Digit OTP" 
                        name="otp" 
                        placeholder="123456" 
                        icon={ShieldCheck}
                        value={formData.otp}
                        onChange={handleInputChange}
                    />
                    <InputField 
                        label="New Password" 
                        name="newPassword" 
                        type="password"
                        placeholder="••••••••" 
                        icon={Lock}
                        value={formData.newPassword}
                        onChange={handleInputChange}
                    />
                </>
               )}

               {(authMode === 'LOGIN' || authMode === 'SIGNUP') && (
                <div className="space-y-1.5 auth-form-anim">
                  <div className="flex justify-between">
                    <label className="block text-sm font-bold text-slate-700">Password</label>
                    {authMode === 'LOGIN' && <button type="button" onClick={() => setAuthMode('FORGOT')} className="text-xs text-brand-primary font-black uppercase tracking-widest hover:underline">Forgot?</button>}
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
                      placeholder="••••••••"
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
               )}

               <div className="pt-2 auth-form-anim">
                 <Button 
                   type="submit" 
                   className="w-full py-4 font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-900/10 rounded-2xl"
                   isLoading={isLoading}
                 >
                   {authMode === 'LOGIN' && 'Sign In'}
                   {authMode === 'SIGNUP' && 'Create Account'}
                   {authMode === 'FORGOT' && 'Send Code'}
                   {authMode === 'RESET' && 'Update Password'}
                 </Button>
               </div>
             </form>

              <div className="relative my-8 auth-form-anim">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or continue with</span></div>
              </div>

              <div className="flex flex-col gap-4 auth-form-anim">
                <div className="flex justify-center">
                    <GoogleLogin 
                        onSuccess={handleGoogleSuccess} 
                        onError={handeGoogleError}
                        theme="outline"
                        size="large"
                        shape="pill"
                        text={authMode === 'SIGNUP' ? 'signup_with' : 'signin_with'}
                    />
                </div>
              </div>

             <div className="mt-8 text-center auth-form-anim">
               <p className="text-sm text-slate-500 font-medium">
                 {authMode === 'LOGIN' || authMode === 'FORGOT' || authMode === 'RESET' ? "Don't have an account?" : "Already have an account?"}
                 <button 
                   onClick={() => setAuthMode(authMode === 'LOGIN' || authMode === 'FORGOT' || authMode === 'RESET' ? 'SIGNUP' : 'LOGIN')}
                   className="ml-1 font-black text-brand-primary hover:underline uppercase tracking-widest text-xs"
                 >
                   {authMode === 'LOGIN' || authMode === 'FORGOT' || authMode === 'RESET' ? 'Join Now' : 'Sign In'}
                 </button>
               </p>
             </div>
           </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative bg-brand-primary overflow-hidden">
        <img 
          src="/images/auth-bg.jpg" 
          alt="Logistics Warehouse" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/40 to-brand-primary/90"></div>
        
        <div className="absolute inset-0 flex flex-col justify-center p-20 text-white z-10">
           <div className="mb-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-3xl border border-white/20">
              <Shield size={20} className="text-brand-orange" />
              <span className="text-sm font-black uppercase tracking-widest">End-to-End Security</span>
           </div>
           <h2 className="text-6xl font-black leading-tight mb-8 tracking-tighter">
             Africa's <br/>Most Reliable <br/><span className="text-brand-orange">Haulage Hub.</span>
           </h2>
           <div className="flex gap-12">
              <div className="space-y-1">
                 <p className="text-3xl font-black">2.4k+</p>
                 <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Active Drivers</p>
              </div>
              <div className="space-y-1">
                 <p className="text-3xl font-black">15min</p>
                 <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Avg. Match Time</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};