
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { LandingPage } from './components/views/LandingPage';
import { AuthView } from './components/views/AuthView';
import { OnboardingView } from './components/views/OnboardingView';
import { CustomerDashboard } from './components/views/CustomerDashboard';
import { DriverDashboard } from './components/views/DriverDashboard';
import { AdminDashboard } from './components/views/AdminDashboard';
import { ContactView } from './components/views/ContactView';
import { AboutUsView } from './components/views/info/AboutUsView';
import { FleetView } from './components/views/info/FleetView';
import { CareersView } from './components/views/info/CareersView';
import { ServiceDetailView } from './components/views/info/ServiceDetailView';
import { SupportView } from './components/views/info/SupportView';
import { ScrollToTop } from './components/utils/ScrollToTop';
import { UserRole } from './types';
import { useStore } from './context/StoreContext';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: UserRole[] }) => {
  const { currentUser, isInitializing } = useStore();
  
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden relative">
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Outer Orbit */}
            <div className="absolute inset-0 border-[1px] border-slate-200 rounded-full animate-orbit-slow opacity-50"></div>
            <div className="absolute -top-1 left-1/2 w-2 h-2 bg-brand-primary rounded-full blur-[2px]"></div>
            
            {/* Inner Orbit */}
            <div className="absolute inset-4 border-[1px] border-slate-200 rounded-full animate-orbit opacity-80"></div>
            <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 bg-brand-secondary rounded-full"></div>

            {/* Core */}
            <div className="relative w-20 h-20 bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center overflow-hidden">
                <div className="animate-pulse-soft text-brand-primary">
                    <ShieldCheck size={40} strokeWidth={1.5} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/10 to-transparent w-full h-full animate-scan"></div>
            </div>
          </div>
          
          <div className="mt-8 text-center space-y-2">
             <h4 className="text-slate-900 font-black tracking-[0.4em] uppercase text-[10px]">Secure Gateway</h4>
             <p className="text-slate-400 font-medium text-[11px] animate-pulse">Syncing logistics protocol...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role.toUpperCase() as UserRole)) {
    console.warn(`[RouteGuard] Role mismatch: Expected ${allowedRoles}, got ${currentUser.role}`);
    return <Navigate to="/" replace />; 
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { currentUser, isInitializing } = useStore();

  const getDashboardPath = (role: string) => {
    const normalizedRole = role.toUpperCase();
    switch (normalizedRole) {
      case 'ADMIN': return '/dashboard/admin';
      case 'CUSTOMER': return '/dashboard/customer';
      case 'DRIVER': return '/dashboard/driver';
      default: return '/';
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden relative">
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Outer Orbit */}
            <div className="absolute inset-0 border-[1px] border-slate-200 rounded-full animate-orbit-slow opacity-50"></div>
            <div className="absolute -top-1 left-1/2 w-2 h-2 bg-brand-primary rounded-full blur-[2px]"></div>
            
            {/* Inner Orbit */}
            <div className="absolute inset-4 border-[1px] border-slate-200 rounded-full animate-orbit opacity-80"></div>
            <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 bg-brand-secondary rounded-full"></div>

            {/* Core */}
            <div className="relative w-20 h-20 bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center overflow-hidden">
                <div className="animate-pulse-soft text-brand-primary">
                    <ShieldCheck size={40} strokeWidth={1.5} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/10 to-transparent w-full h-full animate-scan"></div>
            </div>
          </div>
          
          <div className="mt-8 text-center space-y-2">
             <h4 className="text-slate-900 font-black tracking-[0.4em] uppercase text-[10px]">SureTruqs Dashboard</h4>
             <p className="text-slate-400 font-medium text-[11px] animate-pulse">Establishing encrypted link...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={
           currentUser 
             ? (currentUser.onboarded || currentUser.role === UserRole.ADMIN
                 ? <Navigate to={getDashboardPath(currentUser.role)} replace />
                 : <Navigate to="/onboarding" replace />)
             : <LandingPage />
        } />
        <Route path="/contact" element={<ContactView />} />
        <Route path="/auth" element={
           currentUser 
             ? (currentUser.onboarded || currentUser.role === UserRole.ADMIN
                 ? <Navigate to={getDashboardPath(currentUser.role)} replace /> 
                 : <Navigate to="/onboarding" replace />)
             : <AuthView />
        } />
        
        <Route path="/onboarding" element={
          <ProtectedRoute>
             {currentUser?.onboarded 
               ? <Navigate to={getDashboardPath(currentUser.role)} replace /> 
               : <OnboardingView />}
          </ProtectedRoute>
        } />

        <Route path="/dashboard/customer" element={
          <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
            <CustomerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/driver" element={
          <ProtectedRoute allowedRoles={[UserRole.DRIVER]}>
             <DriverDashboard />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/admin" element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
             <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Info Pages */}
        <Route path="/about" element={<AboutUsView />} />
        <Route path="/fleet" element={<FleetView />} />
        <Route path="/careers" element={<CareersView />} />
        <Route path="/services/:slug" element={<ServiceDetailView />} />
        <Route path="/support/:type" element={<SupportView />} />
        
        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
