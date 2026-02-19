import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { UserRole } from '../../types';
import { Button } from '../ui/Button';
import api from '../../utils/api';
import { Country, State, City }  from 'country-state-city';
import { CheckCircle2, Truck, User as UserIcon, Calendar, MapPin, FileText, CreditCard, ShieldCheck, Upload, ArrowRight, ArrowLeft, Package, Building, AlertCircle, Globe } from 'lucide-react';

export const OnboardingView: React.FC = () => {
  const { currentUser, completeOnboarding } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  
  // Form State for User Input
  const [formData, setFormData] = useState({
      address: currentUser?.address || '',
      country: 'NG',
      state: '',
      city: '',
      phoneCode: '234',
      phone: currentUser?.phone || '',
      nin: '',
      dob: '',
      vehicleMake: '',
      vehicleModel: '',
      plateNumber: '',
      color: '',
      companyName: currentUser?.company || '',
      vehicleCapacity: 'Medium (1-5 tons)',
      businessType: 'Retail / E-commerce',
      cargoTypes: [] as string[],
      shipmentFrequency: '1-10 per month',
      notificationsEmail: true,
      notificationsSms: true
  });

  // Redirect if no user
  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const isDriver = currentUser.role === UserRole.DRIVER;
  const totalSteps = 3;
  const requiredDocs = ['Driver\'s License', 'Vehicle Registration', 'Insurance Certificate'];
  
  const cargoOptions = ['Electronics', 'Construction', 'FMCG', 'Furniture', 'Agriculture', 'Industrial'];

  const validateStep = () => {
    if (isDriver) {
      if (step === 1) {
        if (!formData.dob) return "Please enter your date of birth.";
        if (formData.nin.length < 11) return "Please enter a valid 11-digit NIN.";
        if (formData.phone.length < 10) return "Please enter a valid phone number.";
        if (!formData.address) return "Please enter your street address.";
        if (!formData.country) return "Please select your country.";
        if (!formData.state) return "Please select your state.";
        if (!formData.city) return "Please select your city.";
      }
      if (step === 2) {
        if (!formData.vehicleMake) return "Please enter your vehicle make/model.";
        if (!formData.plateNumber) return "Please enter your vehicle plate number.";
        if (!formData.vehicleCapacity) return "Please select vehicle capacity.";
      }
      if (step === 3) {
        if (uploadedDocs.length < requiredDocs.length) return "Please upload all required documents.";
      }
    } else {
      // Customer Validation
      if (step === 1) {
        if (!formData.companyName) return "Please enter your company name.";
        if (!formData.businessType) return "Please select your industry.";
        if (!formData.address) return "Please enter your street address.";
        if (!formData.country) return "Please select your country.";
        if (!formData.state) return "Please select your state.";
        if (!formData.city) return "Please select your city.";
        if (formData.phone.length < 5) return "Please enter a valid phone number.";
      }
      if (step === 2) {
        if (formData.cargoTypes.length === 0) return "Please select at least one cargo type.";
        if (!formData.shipmentFrequency) return "Please select your shipment frequency.";
      }
    }
    return null;
  };

  const handleNext = async () => {
    const error = validateStep();
    if (error) {
      toast.error(error);
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        await completeOnboarding({
          ...formData,
          phone: formData.phone,
          company: !isDriver ? formData.companyName : undefined,
          vehicleType: isDriver ? formData.vehicleMake : undefined,
          plateNumber: isDriver ? formData.plateNumber : undefined,
          vehicleModel: isDriver ? formData.vehicleModel : undefined,
          location: { 
            address: formData.address, 
            country: Country.getCountryByCode(formData.country)?.name,
            state: State.getStateByCodeAndCountry(formData.state, formData.country)?.name,
            city: formData.city,
            lat: 0, 
            lng: 0 
          },
          documents: documents
        });
        
        navigate(`/dashboard/${isDriver ? 'driver' : 'customer'}`);
      } catch (err) {
        toast.error("Something went wrong during onboarding. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [documents, setDocuments] = useState<Record<string, string>>({});

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
        navigate('/');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, docName: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return toast.error("Invalid file type. Please upload JPG, PNG or PDF.");
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return toast.error("File is too large. Max size is 5MB.");
    }

    setUploading(docName);
    setUploadProgress(prev => ({ ...prev, [docName]: 0 }));
    
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      console.log(`[Onboarding] Uploading ${docName}...`);
      const response = await api.post('/upload/document', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(prev => ({ ...prev, [docName]: percentCompleted }));
        }
      });
      
      setDocuments(prev => ({ ...prev, [docName]: response.data.url }));
      if (!uploadedDocs.includes(docName)) {
        setUploadedDocs(prev => [...prev, docName]);
      }
      toast.success(`${docName} uploaded successfully!`);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || `Failed to upload ${docName}`;
      toast.error(errorMsg);
      console.error('[Upload Error details]:', error.response?.data || error);
    } finally {
      setUploading(null);
    }
  };

  const updateForm = (field: string, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCargo = (cargo: string) => {
    setFormData(prev => ({
      ...prev,
      cargoTypes: prev.cargoTypes.includes(cargo)
        ? prev.cargoTypes.filter(c => c !== cargo)
        : [...prev.cargoTypes, cargo]
    }));
  };

  const countries = Country.getAllCountries();
  const states = formData.country ? State.getStatesOfCountry(formData.country) : [];
  const cities = formData.state ? City.getCitiesOfState(formData.country, formData.state) : [];

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const countryCode = e.target.value;
      const countryData = Country.getCountryByCode(countryCode);
      setFormData(prev => ({ 
          ...prev, 
          country: countryCode, 
          state: '', 
          city: '',
          phoneCode: countryData?.phonecode || '234'
      }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFormData(prev => ({ ...prev, state: e.target.value, city: '' }));
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
        const isCompleted = s < step;
        return (
          <div key={s} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-4 border-white ${isActive ? 'bg-brand-primary text-white scale-110 shadow-lg shadow-blue-500/30' : 'bg-white text-slate-400 border-slate-200'}`}>
              {isCompleted ? <CheckCircle2 size={20}/> : s}
            </div>
            <span className={`text-[10px] font-bold uppercase mt-2 tracking-wide ${isActive ? 'text-brand-primary' : 'text-slate-300'}`}>
              {isDriver 
                ? (s === 1 ? 'Identity' : s === 2 ? 'Vehicle' : 'Verify') 
                : (s === 1 ? 'Business' : s === 2 ? 'Needs' : 'Finish')
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
               ? "/images/last-mile.jpg" 
               : "/images/auth-bg.jpg"
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
                    {isDriver ? 'Drive Your Way to Success.' : 'The Future of Freight.'}
                 </h2>
                 <p className="text-blue-100 text-lg font-medium leading-relaxed">
                    {isDriver 
                      ? 'Join thousands of partners earning reliably with our platform. Set your schedule, pick your routes.'
                      : 'Scale your business logistics with our reliable network of verified professional drivers.'
                    }
                 </p>
              </div>

              <div className="flex gap-2">
                 <div className={`h-1 rounded-full transition-all duration-300 ${step === 1 ? 'w-12 bg-white' : 'w-4 bg-white/30'}`}></div>
                 <div className={`h-1 rounded-full transition-all duration-300 ${step === 2 ? 'w-12 bg-white' : 'w-4 bg-white/30'}`}></div>
                 <div className={`h-1 rounded-full transition-all duration-300 ${step === 3 ? 'w-12 bg-white' : 'w-4 bg-white/30'}`}></div>
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
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome House!</h1>
                    <p className="text-slate-500">Let's get your {isDriver ? 'driver partner' : 'business'} account ready.</p>
                 </div>

                 <ProgressBar />

                 {/* DRIVER FLOW */}
                 {isDriver && (
                    <div className="min-h-[320px]">
                       {step === 1 && (
                        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <UserIcon className="text-brand-secondary" /> Personal Bio
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1.5">Date of Birth</label>
                              <div className="relative">
                                <Calendar size={18} className="absolute left-3 top-3 text-slate-400"/>
                                <input 
                                  type="date" 
                                  style={{ colorScheme: 'light' }}
                                  className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium text-slate-700 placeholder-slate-400" 
                                  value={formData.dob}
                                  onChange={(e) => updateForm('dob', e.target.value)}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1.5">NIN / ID Number</label>
                              <div className="relative">
                                <CreditCard size={18} className="absolute left-3 top-3 text-slate-400"/>
                                <input 
                                    type="text" 
                                    placeholder="12345678901" 
                                    className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium" 
                                    value={formData.nin}
                                    onChange={(e) => updateForm('nin', e.target.value)}
                                />
                              </div>
                            </div>
                            </div>
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1.5">
                                   <label className="block text-sm font-bold text-slate-700">Country</label>
                                   <div className="relative">
                                      <Globe size={18} className="absolute left-3 top-3 text-slate-400"/>
                                      <select 
                                        className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-slate-700 font-medium appearance-none"
                                        value={formData.country}
                                        onChange={handleCountryChange}
                                      >
                                          <option value="">Select Country</option>
                                          {countries.map((c) => (
                                              <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                          ))}
                                      </select>
                                   </div>
                                </div>
                                <div className="space-y-1.5">
                                   <label className="block text-sm font-bold text-slate-700">State / Region</label>
                                   <select 
                                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-slate-700 font-medium appearance-none disabled:opacity-50"
                                      value={formData.state}
                                      onChange={handleStateChange}
                                      disabled={!formData.country}
                                    >
                                        <option value="">Select State</option>
                                        {states.map((s) => (
                                            <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                   <label className="block text-sm font-bold text-slate-700">City</label>
                                   <select 
                                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-slate-700 font-medium appearance-none disabled:opacity-50"
                                      value={formData.city}
                                      onChange={(e) => updateForm('city', e.target.value)}
                                      disabled={!formData.state}
                                    >
                                        <option value="">Select City</option>
                                        {cities.map((c) => (
                                            <option key={c.name} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                               <label className="block text-sm font-bold text-slate-700 mb-1.5">Street Address</label>
                               <div className="relative">
                                 <MapPin size={18} className="absolute left-3 top-3 text-slate-400"/>
                                 <input 
                                     type="text" 
                                     placeholder="Street, Building, Flat" 
                                     className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium" 
                                     value={formData.address}
                                     onChange={(e) => updateForm('address', e.target.value)}
                                 />
                               </div>
                            </div>
                            <div className="md:col-span-2">
                               <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number</label>
                               <div className="flex gap-2">
                                 <div className="w-1/3 min-w-[100px] relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-slate-500 font-bold text-xs">+</span>
                                    </div>
                                    <select
                                        className="w-full pl-6 pr-2 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-slate-900 font-bold appearance-none"
                                        value={formData.phoneCode}
                                        onChange={(e) => updateForm('phoneCode', e.target.value)}
                                    >
                                        {countries.map(c => (
                                            <option key={c.isoCode} value={c.phonecode}>{c.isoCode} (+{c.phonecode})</option>
                                        ))}
                                    </select>
                                 </div>
                                 <div className="relative flex-1">
                                   <FileText size={18} className="absolute left-3 top-3 text-slate-400"/>
                                   <input 
                                       type="tel" 
                                       placeholder="810 000 0000" 
                                       className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium" 
                                       value={formData.phone}
                                       onChange={(e) => updateForm('phone', e.target.value)}
                                   />
                                 </div>
                               </div>
                            </div>
                          </div>

                      )}

                      {step === 2 && (
                        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Truck className="text-brand-secondary" /> Vehicle Metrics
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1.5">Vehicle Type</label>
                              <select 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-slate-700 font-medium transition-all"
                                value={formData.vehicleMake}
                                onChange={(e) => updateForm('vehicleMake', e.target.value)}
                              >
                                <option value="">Select Vehicle Type</option>
                                <option value="Mini Truck / Pickup">Mini Truck / Pickup</option>
                                <option value="Van / Bus">Van / Bus</option>
                                <option value="Box Truck (Small)">Box Truck (Small)</option>
                                <option value="Box Truck (Medium)">Box Truck (Medium)</option>
                                <option value="Box Truck (Large)">Box Truck (Large)</option>
                                <option value="Flatbed Truck">Flatbed Truck</option>
                                <option value="Container Carrier (20ft)">Container Carrier (20ft)</option>
                                <option value="Container Carrier (40ft)">Container Carrier (40ft)</option>
                                <option value="Refrigerated Truck">Refrigerated Truck</option>
                                <option value="Tanker">Tanker</option>
                                <option value="Tipper / Dump Truck">Tipper / Dump Truck</option>
                              </select>
                            </div>
                            <div>
                               <label className="block text-sm font-bold text-slate-700 mb-1.5">Plate Number</label>
                               <input 
                                  type="text" 
                                  placeholder="LAG-123-XY" 
                                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none uppercase font-mono transition-all font-medium" 
                                  value={formData.plateNumber}
                                  onChange={(e) => updateForm('plateNumber', e.target.value)}
                               />
                            </div>
                            <div className="md:col-span-2">
                               <label className="block text-sm font-bold text-slate-700 mb-1.5">Max Weight Capacity</label>
                               <div className="grid grid-cols-3 gap-3">
                                  {['Small (<1 ton)', 'Medium (1-5 tons)', 'Large (5+ tons)'].map(cap => (
                                    <button
                                      key={cap}
                                      onClick={() => updateForm('vehicleCapacity', cap)}
                                      className={`py-2 px-1 rounded-lg text-[10px] font-bold border transition-all ${formData.vehicleCapacity === cap ? 'bg-brand-primary text-white border-brand-primary shadow-md' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-brand-primary'}`}
                                    >
                                      {cap}
                                    </button>
                                  ))}
                               </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="text-brand-secondary" /> Documentation
                          </h3>
                          <div className="p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-xl flex items-start gap-3 mb-4">
                             <ShieldCheck className="text-brand-primary shrink-0 mt-0.5" size={20}/>
                             <p className="text-xs text-slate-600 font-medium">
                               To ensure safety, we require verification documents. These are handled with end-to-end encryption.
                             </p>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-3">
                             {requiredDocs.map((doc, i) => {
                                const isUploaded = uploadedDocs.includes(doc);
                                const isCurrentlyUploading = uploading === doc;
                                return (
                                <div 
                                  key={i} 
                                  className={`relative flex items-center justify-between p-4 border rounded-xl transition-all group ${isUploaded ? 'border-green-200 bg-green-50/20' : 'border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-brand-primary'}`}
                                >
                                   <input 
                                     type="file" 
                                     className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                     onChange={(e) => handleFileUpload(e, doc)}
                                     disabled={isCurrentlyUploading}
                                   />
                                   <div className="flex items-center gap-3">
                                      <div className={`p-2 rounded-lg ${isUploaded ? 'bg-green-100 text-green-600' : isCurrentlyUploading ? 'bg-blue-50 text-brand-primary animate-pulse' : 'bg-white text-slate-400 group-hover:text-brand-primary shadow-sm'}`}>
                                         {isUploaded ? <CheckCircle2 size={18}/> : <Upload size={18}/>}
                                      </div>
                                      <div>
                                         <p className={`font-bold text-xs ${isUploaded ? 'text-green-800' : 'text-slate-900'}`}>{doc}</p>
                                         <p className="text-[10px] text-slate-400">
                                            {isUploaded ? 'Successfully Verified' : isCurrentlyUploading ? `Uploading: ${uploadProgress[doc] || 0}%` : 'Click or drag to upload'}
                                         </p>
                                      </div>
                                   </div>
                                   {isUploaded && <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white"><CheckCircle2 size={12}/></div>}
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
                               <Building className="text-brand-secondary" /> Business Identity
                            </h3>
                            <div>
                               <label className="block text-sm font-bold text-slate-700 mb-1.5">Company Name</label>
                               <div className="relative">
                                 <Building size={18} className="absolute left-3 top-3 text-slate-400"/>
                                 <input 
                                    type="text" 
                                    placeholder="e.g. SureTruqs Logistics Ltd" 
                                    className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium" 
                                    value={formData.companyName}
                                    onChange={(e) => updateForm('companyName', e.target.value)}
                                 />
                               </div>
                            </div>
                            <div>
                               <label className="block text-sm font-bold text-slate-700 mb-1.5">Industry Segment</label>
                               <select 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-slate-700 transition-all font-bold"
                                    value={formData.businessType}
                                    onChange={(e) => updateForm('businessType', e.target.value)}
                                >
                                  <option>Retail / E-commerce</option>
                                  <option>Manufacturing & Industrial</option>
                                  <option>FMCG Wholesale</option>
                                  <option>Construction & Mining</option>
                                  <option>Tech & Electronics</option>
                               </select>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1.5">
                                   <label className="block text-sm font-bold text-slate-700">Country</label>
                                   <div className="relative">
                                      <Globe size={18} className="absolute left-3 top-3 text-slate-400"/>
                                      <select 
                                        className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-slate-700 font-medium appearance-none"
                                        value={formData.country}
                                        onChange={handleCountryChange}
                                      >
                                          <option value="">Select Country</option>
                                          {countries.map((c) => (
                                              <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                          ))}
                                      </select>
                                   </div>
                                </div>
                                <div className="space-y-1.5">
                                   <label className="block text-sm font-bold text-slate-700">State / Region</label>
                                   <select 
                                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-slate-700 font-medium appearance-none disabled:opacity-50"
                                      value={formData.state}
                                      onChange={handleStateChange}
                                      disabled={!formData.country}
                                    >
                                        <option value="">Select State</option>
                                        {states.map((s) => (
                                            <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                   <label className="block text-sm font-bold text-slate-700">City</label>
                                   <select 
                                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-slate-700 font-medium appearance-none disabled:opacity-50"
                                      value={formData.city}
                                      onChange={(e) => updateForm('city', e.target.value)}
                                      disabled={!formData.state}
                                    >
                                        <option value="">Select City</option>
                                        {cities.map((c) => (
                                            <option key={c.name} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                               <label className="block text-sm font-bold text-slate-700 mb-1.5">HQ Address / Primary Hub</label>
                               <div className="relative">
                                 <MapPin size={18} className="absolute left-3 top-3 text-slate-400"/>
                                 <input 
                                    type="text" 
                                    placeholder="Street Address, Building No." 
                                    className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium" 
                                    value={formData.address}
                                    onChange={(e) => updateForm('address', e.target.value)}
                                 />
                               </div>
                            </div>
                            <div>
                               <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number</label>
                               <div className="flex gap-2">
                                 <div className="w-1/3 min-w-[100px] relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-slate-500 font-bold text-xs">+</span>
                                    </div>
                                    <select
                                        className="w-full pl-6 pr-2 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-slate-900 font-bold appearance-none"
                                        value={formData.phoneCode}
                                        onChange={(e) => updateForm('phoneCode', e.target.value)}
                                    >
                                        {countries.map(c => (
                                            <option key={c.isoCode} value={c.phonecode}>{c.isoCode} (+{c.phonecode})</option>
                                        ))}
                                    </select>
                                 </div>
                                 <div className="relative flex-1">
                                    <FileText size={18} className="absolute left-3 top-3 text-slate-400"/>
                                    <input 
                                       type="tel" 
                                       placeholder="810 000 0000" 
                                       className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium" 
                                       value={formData.phone}
                                       onChange={(e) => updateForm('phone', e.target.value)}
                                    />
                                 </div>
                               </div>
                            </div>
                         </div>
                      )}
                      
                      {step === 2 && (
                         <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                               <Package className="text-brand-secondary" /> Logistics Profile
                            </h3>
                            
                            <div>
                               <label className="block text-sm font-bold text-slate-700 mb-3">Typical Cargo Types</label>
                               <div className="grid grid-cols-2 gap-2">
                                  {cargoOptions.map(cargo => (
                                    <button
                                      key={cargo}
                                      onClick={() => toggleCargo(cargo)}
                                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${formData.cargoTypes.includes(cargo) ? 'bg-brand-primary text-white border-brand-primary shadow-md' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-brand-primary'}`}
                                    >
                                      {cargo}
                                      {formData.cargoTypes.includes(cargo) && <CheckCircle2 size={14}/>}
                                    </button>
                                  ))}
                               </div>
                            </div>

                            <div>
                               <label className="block text-sm font-bold text-slate-700 mb-3">Shipment Frequency</label>
                               <div className="flex gap-2">
                                  {['Occasional', 'Regular (Weekly)', 'High Volume'].map(freq => (
                                    <button
                                      key={freq}
                                      onClick={() => updateForm('shipmentFrequency', freq)}
                                      className={`flex-1 py-2 px-1 rounded-xl text-[10px] font-bold border transition-all ${formData.shipmentFrequency === freq ? 'bg-brand-secondary text-white border-brand-secondary' : 'bg-slate-50 text-slate-500 border-slate-100'}`}
                                    >
                                      {freq}
                                    </button>
                                  ))}
                               </div>
                            </div>
                         </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                           <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                              <ShieldCheck className="text-brand-secondary" /> Final Preferences
                           </h3>
                           
                           <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-3">
                              <Package className="text-brand-orange shrink-0 mt-0.5" size={20}/>
                              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                Your shipments will be reviewed and assigned by our admin team once onboarding is complete.
                              </p>
                           </div>

                           <div className="space-y-2">
                              {[
                                { id: 'notificationsEmail', label: 'Email Order Summaries', icon: CheckCircle2 },
                                { id: 'notificationsSms', label: 'SMS Arriving Alerts', icon: CheckCircle2 }
                              ].map((pref) => (
                                <label key={pref.id} className="flex items-center p-4 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
                                   <input 
                                     type="checkbox" 
                                     className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary border-slate-200" 
                                     checked={(formData as any)[pref.id]}
                                     onChange={(e) => updateForm(pref.id, e.target.checked)}
                                   />
                                   <span className="ml-3 text-sm font-bold text-slate-700">{pref.label}</span>
                                </label>
                              ))}
                           </div>
                        </div>
                      )}
                    </div>
                 )}
              </div>
           </div>

           {/* Footer Buttons */}
           <div className="p-8 lg:px-12 border-t border-slate-100 flex justify-between bg-white sticky bottom-0 z-10 rounded-b-[2rem]">
              <Button 
                 variant="ghost" 
                 onClick={handleBack} 
                 className="font-bold text-slate-400 hover:text-slate-800"
              >
                 <ArrowLeft size={18} className="mr-2"/> Back
              </Button>
              <Button 
                 variant={step === totalSteps ? (isDriver ? 'cta' : 'primary') : 'primary'}
                 onClick={handleNext}
                 isLoading={loading}
                 className="rounded-xl px-12 shadow-xl shadow-blue-500/10 font-bold"
              >
                 {step === totalSteps ? (isDriver ? 'Complete Profile' : 'Launch Dashboard') : 'Next Step'}
                 {step !== totalSteps && <ArrowRight size={18} className="ml-2"/>}
              </Button>
           </div>
        </div>

      </div>
    </div>
  );
};
