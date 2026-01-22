
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/views/LandingPage';
import { AuthView } from './components/views/AuthView';
import { OnboardingView } from './components/views/OnboardingView';
import { CustomerDashboard } from './components/views/CustomerDashboard';
import { DriverDashboard } from './components/views/DriverDashboard';
import { ContactView } from './components/views/ContactView';
import { UserRole } from './types';
import { useStore } from './context/StoreContext';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: UserRole[] }) => {
  const { currentUser } = useStore();
  
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />; // Or unauthorized page
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { currentUser } = useStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={
           currentUser 
             ? (currentUser.onboarded 
                 ? <Navigate to={`/dashboard/${currentUser.role === UserRole.CUSTOMER ? 'customer' : 'driver'}`} /> 
                 : <Navigate to="/onboarding" replace />)
             : <LandingPage />
        } />
        <Route path="/contact" element={<ContactView />} />
        <Route path="/auth" element={
           currentUser 
             ? (currentUser.onboarded 
                 ? <Navigate to={`/dashboard/${currentUser.role === UserRole.CUSTOMER ? 'customer' : 'driver'}`} /> 
                 : <Navigate to="/onboarding" replace />)
             : <AuthView />
        } />
        
        <Route path="/onboarding" element={
          <ProtectedRoute>
             {currentUser?.onboarded 
               ? <Navigate to={`/dashboard/${currentUser.role === UserRole.CUSTOMER ? 'customer' : 'driver'}`} replace /> 
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
        
        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
