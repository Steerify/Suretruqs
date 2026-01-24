
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { UserRole } from './types';
import { useStore } from './context/StoreContext';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: UserRole[] }) => {
  const { currentUser, isInitializing } = useStore();
  
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />; // Or unauthorized page
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { currentUser, isInitializing } = useStore();

  const getDashboardPath = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return '/dashboard/admin';
      case UserRole.CUSTOMER: return '/dashboard/customer';
      case UserRole.DRIVER: return '/dashboard/driver';
      default: return '/';
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={
           currentUser 
             ? (currentUser.onboarded 
                 ? <Navigate to={getDashboardPath(currentUser.role)} replace />
                 : <Navigate to="/onboarding" replace />)
             : <LandingPage />
        } />
        <Route path="/contact" element={<ContactView />} />
        <Route path="/auth" element={
           currentUser 
             ? (currentUser.onboarded 
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
