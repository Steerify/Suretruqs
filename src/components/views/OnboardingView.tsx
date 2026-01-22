import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { UserRole } from '../../types';
import { Button } from '../ui/Button';
import { CheckCircle2, Truck, User as UserIcon, Calendar, MapPin, FileText, CreditCard, ShieldCheck, Upload, ArrowRight, ArrowLeft, Package, Building, AlertCircle } from 'lucide-react';

export const OnboardingView: React.FC = () => {
  const { currentUser, completeOnboarding } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  
  // Form State for User Input (Mocking real form handling)
  const [formData, setFormData] = useState({
      address: '',
      phone: '',
      nin: '',
      vehicleMake: '',
      vehicleModel: '',
      plateNumber: '',
      color: '',
      businessType: 'Retail / E-commerce',
      notificationsEmail: true,
      notificationsSms: true
  });

  // Redirect if no user
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const isDriver = currentUser.role === UserRole.DRIVER;
  const totalSteps = isDriver ? 3 : 2;
  const requiredDocs = ['Driver\'s License', 'Vehicle Registration', 'Insurance Certificate'];

  const handleNext = async () => {
    if (isDriver && step === 3) {
      if (uploadedDocs.length < requiredDocs.length) {
        alert("Please upload all required documents to proceed.");
        return;
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        await completeOnboarding({
          ...formData,
          phone: formData.phone,
          company: !isDriver ? formData.businessType : undefined,
          vehicleType: isDriver ? formData.vehicleMake : undefined,
          plateNumber: isDriver ? formData.plateNumber : undefined,
          vehicleModel: isDriver ? formData.vehicleModel : undefined,
          location: { address: formData.address, lat: 0, lng: 0 }
        });
        
        navigate(`/dashboard/${isDriver ? 'driver' : 'customer'}`);
      } catch (err) {
        alert("Something went wrong during onboarding. Please try again.");
      } finally {
        setLoading(true); // Keep loading true during transition
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
        navigate('/'); // Go back to home if on first step
    }
  };

  const handleSimulateUpload = (docName: string) => {
    if (uploadedDocs.includes(docName)) {
      setUploadedDocs(prev => prev.filter(d => d !== docName));
    } else {
      setUploadedDocs(prev => [...prev, docName]);
    }
  };

  const updateForm = (field: string, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const ProgressBar = () => (
    <div className="flex justify-between mb-10 relative px-2">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded-full"></div>
      <div 
        className="absolute top-1/2 left-0 h-1 bg-brand-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
        style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
      ></div>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const s = i + 1;
        const isActive = s <= step;
        return (
          <div key={s} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-4 border-white ${isActive ? 'bg-brand-primary text-white scale-110 shadow-lg shadow-blue-500/30' : 'bg-white text-slate-400 border-slate-200'}`}>
              {s < step ? <CheckCircle2 size={20}/> : s}
            </div>
            <span className={`text-[10px] font-bold uppercase mt-2 tracking-wide ${isActive ? 'text-brand-primary' : 'text-slate-300'}`}>
              {isDriver 
                ? (s === 1 ? 'Identity' : s === 2 ? 'Vehicle' : 'Docs') 
                : (s === 1 ? 'Profile' : 'Prefs')
              }
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8">
      <div className="bg-white w-full max-w-6xl rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row min-h-[650px] animate-[fadeIn_0.5s_ease-out]">
        
        {/* Left Side - Image Panel */}
        <div className="relative w-full lg:w-5/12 hidden lg:block group overflow-hidden">
           <img 
             src={isDriver 
               ? "https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&w=1000&q=80" 
               : "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80"
             } 
             alt="Onboarding" 
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 to-brand-primary/40 mix-blend-multiply"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/80"></div>
           
           <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white">
              <div className="flex items-center gap-2">
                 <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                    <Truck size={24} />
                 </div>
                 <span className="font-bold text-xl tracking-tight">SureTruqs.</span>
              </div>
              
              <div className="space-y-4">
                 <h2 className="text-4xl font-black leading-tight">
                    {isDriver ? 'Drive Your Way to Success.' : 'Streamline Your Logistics.'}
                 </h2>
                 <p className="text-blue-100 text-lg font-medium leading-relaxed">
                    {isDriver 
                      ? 'Join thousands of partners earning reliably with our platform. Set your schedule, pick your routes.'
                      : 'Connect with verified drivers instantly. Track every mile, ensure every delivery.'
                    }
                 </p>
              </div>

              <div className="flex gap-2">
                 <div className="h-1 w-12 bg-white rounded-full"></div>
                 <div className="h-1 w-4 bg-white/30 rounded-full"></div>
                 <div className="h-1 w-4 bg-white/30 rounded-full"></div>
              </div>
           </div>
        </div>

        {/* Right Side - Form Panel */}
        <div className="flex-1 flex flex-col relative">
           {/* Mobile Header */}
           <div className="lg:hidden p-6 pb-0 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Complete Setup</h2>
                <p className="text-slate-500 text-sm">Step {step} of {totalSteps}</p>
              </div>
              <button onClick={() => navigate('/')} className="text-slate-400 hover:text-slate-600"><AlertCircle/></button>
           </div>

           <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
              <div className="max-w-lg mx-auto">
                 <div className="mb-8 hidden lg:block">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome, {currentUser.name.split(' ')[0]}!</h1>
                    <p className="text-slate-500">Please complete your profile to start {isDriver ? 'driving' : 'shipping'}.</p>
                 </div>

                 <ProgressBar />

                 {/* DRIVER FLOW */}
                 {isDriver && (
                    <div className="min-h-[320px]">
                       {step === 1 && (
                        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <UserIcon className="text-brand-secondary" /> Personal Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1.5">Date of Birth</label>
                              <div className="relative">
                                <Calendar size={18} className="absolute left-3 top-3 text-slate-400"/>
                                <input type="date" className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1.5">NIN / ID Number</label>
                              <div className="relative">
                                <CreditCard size={18} className="absolute left-3 top-3 text-slate-400"/>
                                <input 
                                    type="text" 
                                    placeholder="12345678901" 
                                    className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" 
                                    value={formData.nin}
                                    onChange={(e) => updateForm('nin', e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="md:col-span-2">
                               <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number</label>
                               <div className="relative">
                                 <FileText size={18} className="absolute left-3 top-3 text-slate-400"/>
                                 <input 
                                     type="tel" 
                                     placeholder="+234 800 000 0000" 
                                     className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" 
                                     value={formData.phone}
                                     onChange={(e) => updateForm('phone', e.target.value)}
                                 />
                               </div>
                            </div>
                            <div className="md:col-span-2">
                               <label className="block text-sm font-bold text-slate-700 mb-1.5">Home Address</label>
                               <div className="relative">
                                 <MapPin size={18} className="absolute left-3 top-3 text-slate-400"/>
                                 <input 
                                     type="text" 
                                     placeholder="Full residential address" 
                                     className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" 
                                     value={formData.address}
                                     onChange={(e) => updateForm('address', e.target.value)}
                                 />
                               </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Truck className="text-brand-secondary" /> Vehicle Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1.5">Vehicle Make</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Toyota" 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" 
                                value={formData.vehicleMake}
                                onChange={(e) => updateForm('vehicleMake', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1.5">Vehicle Model</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Dyna" 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" 
                                value={formData.vehicleModel}
                                onChange={(e) => updateForm('vehicleModel', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1.5">License Plate</label>
                              <div className="relative">
                                 <div className="absolute left-3 top-3 bg-slate-200 text-xs font-bold px-1.5 rounded text-slate-600">NG</div>
                                 <input 
                                    type="text" 
                                    placeholder="LAG-123-XY" 
                                    className="w-full pl-12 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none uppercase font-mono transition-all" 
                                    value={formData.plateNumber}
                                    onChange={(e) => updateForm('plateNumber', e.target.value)}
                                 />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1.5">Vehicle Color</label>
                              <input 
                                type="text" 
                                placeholder="e.g. White" 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" 
                                value={formData.color}
                                onChange={(e) => updateForm('color', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="text-brand-secondary" /> Documents
                          </h3>
                          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 mb-6">
                             <ShieldCheck className="text-brand-secondary shrink-0 mt-0.5" size={20}/>
                             <p className="text-sm text-slate-600">
                               <span className="font-bold text-slate-900">Required: </span>
                               Please upload clear photos or PDFs of the following documents. Encryption ensures your data is safe.
                             </p>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4">
                             {requiredDocs.map((doc, i) => {
                                const isUploaded = uploadedDocs.includes(doc);
                                return (
                                <div 
                                  key={i} 
                                  onClick={() => handleSimulateUpload(doc)}
                                  className={`flex items-center justify-between p-4 border rounded-xl transition-all cursor-pointer group bg-white ${isUploaded ? 'border-green-200 bg-green-50/30' : 'border-dashed border-slate-300 hover:bg-slate-50'}`}
                                >
                                   <div className="flex items-center gap-3">
                                      <div className={`p-2 rounded-lg transition-colors ${isUploaded ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400 group-hover:text-brand-primary'}`}>
                                         {isUploaded ? <CheckCircle2 size={20}/> : <FileText size={20}/>}
                                      </div>
                                      <div>
                                         <p className={`font-bold text-sm ${isUploaded ? 'text-green-800' : 'text-slate-900'}`}>{doc}</p>
                                         <p className="text-xs text-slate-400">{isUploaded ? 'Upload complete' : 'Tap to upload (PDF, JPG)'}</p>
                                      </div>
                                   </div>
                                   <div className={`text-xs font-bold flex items-center px-3 py-1.5 rounded-full transition-colors ${isUploaded ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-brand-secondary group-hover:bg-blue-100'}`}>
                                      {isUploaded ? (
                                        <>Uploaded</>
                                      ) : (
                                        <><Upload size={14} className="mr-1.5"/> Upload</>
                                      )}
                                   </div>
                                </div>
                             )})}
                          </div>
                        </div>
                      )}
                    </div>
                 )}

                 {/* CUSTOMER FLOW */}
                 {!isDriver && (
                    <div className="min-h-[320px]">
                       {step === 1 && (
                         <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                               <Building className="text-brand-secondary" /> Complete Profile
                            </h3>
                            <div>
                               <label className="block text-sm font-bold text-slate-700 mb-1.5">Business Industry (Optional)</label>
                               <select 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-slate-700 transition-all font-medium"
                                    value={formData.businessType}
                                    onChange={(e) => updateForm('businessType', e.target.value)}
                                >
                                  <option>Retail / E-commerce</option>
                                  <option>Manufacturing</option>
                                  <option>Agriculture</option>
                                  <option>Construction</option>
                                  <option>Other</option>
                               </select>
                            </div>
                            <div>
                               <label className="block text-sm font-bold text-slate-700 mb-1.5">Default Pickup Address</label>
                               <div className="relative">
                                 <MapPin size={18} className="absolute left-3 top-3 text-slate-400"/>
                                 <input 
                                    type="text" 
                                    placeholder="123 Warehouse Rd, Lagos" 
                                    className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" 
                                    value={formData.address}
                                    onChange={(e) => updateForm('address', e.target.value)}
                                 />
                               </div>
                            </div>
                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number</label>
                                <div className="relative">
                                  <FileText size={18} className="absolute left-3 top-3 text-slate-400"/>
                                  <input 
                                     type="tel" 
                                     placeholder="+234 810 222 3333" 
                                     className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" 
                                     value={formData.phone}
                                     onChange={(e) => updateForm('phone', e.target.value)}
                                  />
                                </div>
                             </div>
                         </div>
                      )}
                      
                      {step === 2 && (
                         <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                               <Package className="text-brand-secondary" /> Preferences
                            </h3>
                            <div className="space-y-3">
                               <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-brand-primary transition-colors bg-slate-50 hover:bg-white group">
                                  <input 
                                    type="checkbox" 
                                    className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary border-gray-300" 
                                    checked={formData.notificationsEmail}
                                    onChange={(e) => updateForm('notificationsEmail', e.target.checked)}
                                  />
                                  <span className="ml-3 text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Receive email notifications for shipment updates</span>
                               </label>
                               <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-brand-primary transition-colors bg-slate-50 hover:bg-white group">
                                  <input 
                                    type="checkbox" 
                                    className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary border-gray-300" 
                                    checked={formData.notificationsSms}
                                    onChange={(e) => updateForm('notificationsSms', e.target.checked)}
                                  />
                                  <span className="ml-3 text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Enable SMS alerts for drivers</span>
                               </label>
                            </div>
                         </div>
                      )}
                    </div>
                 )}
              </div>
           </div>

           {/* Footer Buttons */}
           <div className="p-8 lg:px-12 border-t border-slate-100 flex justify-between bg-white sticky bottom-0 z-10">
              <Button 
                 variant="ghost" 
                 onClick={handleBack} 
                 className="font-bold text-slate-500 hover:text-slate-800"
              >
                 <ArrowLeft size={18} className="mr-2"/> Back
              </Button>
              <Button 
                 variant={step === totalSteps ? 'cta' : 'primary'}
                 onClick={handleNext}
                 isLoading={loading}
                 disabled={isDriver && step === 3 && uploadedDocs.length < requiredDocs.length}
                 className="rounded-xl px-10 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 {step === totalSteps ? (isDriver ? 'Submit for Review' : 'Get Started') : 'Next Step'}
                 {step !== totalSteps && <ArrowRight size={18} className="ml-2"/>}
              </Button>
           </div>
        </div>

      </div>
    </div>
  );
};
