import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, Shipment, User, ShipmentStatus, Driver } from '../types';

// Mock Initial Data
const INITIAL_SHIPMENTS: Shipment[] = [
  { 
    id: 'SH-INITIAL-01', 
    trackingId: 'TRK-DEMO-001', 
    customerId: 'CUST-001',
    pickup: { address: 'Apapa Wharf, Terminal B', lat: 0, lng: 0 }, 
    dropoff: { address: 'Trade Fair Complex, Ojo', lat: 0, lng: 0 }, 
    status: ShipmentStatus.PENDING, 
    price: 65000, 
    date: new Date(Date.now() - 86400000).toISOString(),
    cargoType: 'Container (20ft)',
    weight: '20 Tons',
    distance: '18.5 km'
  },
  { 
    id: 'SH-INITIAL-02', 
    trackingId: 'TRK-DEMO-002', 
    customerId: 'CUST-001',
    pickup: { address: 'Ikeja City Mall', lat: 0, lng: 0 }, 
    dropoff: { address: 'Magodo Phase 2', lat: 0, lng: 0 }, 
    status: ShipmentStatus.DELIVERED, 
    price: 22000, 
    date: new Date(Date.now() - 172800000).toISOString(), 
    driverId: 'DRV-001',
    cargoType: 'Electronics',
    weight: '50kg',
    distance: '6.2 km'
  }
];

const INITIAL_DRIVERS: Driver[] = [
  { id: 'DRV-002', name: 'Musa Ibrahim', vehicleType: 'Flatbed Truck', plateNumber: 'KANO-882', rating: 4.8, isOnline: true, location: 'Apapa, Lagos', trips: 142, avatarColor: 'bg-blue-100 text-blue-600' },
  { id: 'DRV-003', name: 'Chinedu Okeke', vehicleType: 'Box Truck', plateNumber: 'LAG-551', rating: 4.9, isOnline: true, location: 'Ikeja, Lagos', trips: 89, avatarColor: 'bg-green-100 text-green-600' },
  { id: 'DRV-004', name: 'Sunday Joseph', vehicleType: 'Mini Van', plateNumber: 'ABJ-112', rating: 4.5, isOnline: false, location: 'Yaba, Lagos', trips: 34, avatarColor: 'bg-orange-100 text-orange-600' },
  { id: 'DRV-005', name: 'Emmanuel Taiwo', vehicleType: 'Box Truck', plateNumber: 'OG-221', rating: 4.7, isOnline: true, location: 'Lekki, Lagos', trips: 210, avatarColor: 'bg-purple-100 text-purple-600' },
];

interface StoreContextType {
  currentUser: User | null;
  shipments: Shipment[];
  drivers: Driver[];
  incomingJob: Shipment | null;
  
  // Actions
  login: (role: UserRole, isSignup: boolean) => void;
  logout: () => void;
  completeOnboarding: () => void;
  createShipment: (newShipmentData: Partial<Shipment>) => void;
  acceptJob: (shipmentId: string) => void;
  updateStatus: (shipmentId: string, newStatus: ShipmentStatus) => void;
  rateDriver: (shipmentId: string, rating: number, review: string) => void;
  dismissJobAlert: () => void;
  setIncomingJob: (job: Shipment | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [incomingJob, setIncomingJob] = useState<Shipment | null>(null);

  const login = (role: UserRole, isSignup: boolean) => {
    const mockUser: User = {
      id: role === UserRole.CUSTOMER ? 'CUST-001' : 'DRV-001',
      name: role === UserRole.CUSTOMER ? 'Shoprite NG' : 'John Doe',
      role: role,
      email: role === UserRole.CUSTOMER ? 'logistics@shoprite.ng' : 'john@driver.com',
      company: role === UserRole.CUSTOMER ? 'Shoprite Nigeria' : undefined,
      onboarded: !isSignup
    };
    setCurrentUser(mockUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const completeOnboarding = () => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, onboarded: true });
    }
  };

  const createShipment = (newShipmentData: Partial<Shipment>) => {
    if (!currentUser) return;

    const newShipment: Shipment = {
      id: `SH-${Date.now()}`,
      trackingId: `TRK-${Math.floor(Math.random() * 9000) + 1000}-LAG`,
      customerId: currentUser.id,
      pickup: newShipmentData.pickup || { address: 'Unknown', lat: 0, lng: 0 },
      dropoff: newShipmentData.dropoff || { address: 'Unknown', lat: 0, lng: 0 },
      status: newShipmentData.driverId ? ShipmentStatus.ASSIGNED : ShipmentStatus.PENDING,
      price: newShipmentData.price || 0,
      date: new Date().toISOString(),
      vehicleType: newShipmentData.vehicleType,
      cargoType: newShipmentData.cargoType,
      weight: newShipmentData.weight,
      driverId: newShipmentData.driverId,
      cargoImage: newShipmentData.cargoImage,
      distance: '12.5 km'
    };

    setShipments(prev => [newShipment, ...prev]);
    // Simulate notification
    setTimeout(() => {
        setIncomingJob(newShipment);
    }, 2000)
  };

  const acceptJob = (shipmentId: string) => {
    if (!currentUser || currentUser.role !== UserRole.DRIVER) return;

    setShipments(prev => prev.map(s => 
      s.id === shipmentId 
        ? { ...s, status: ShipmentStatus.ASSIGNED, driverId: currentUser.id }
        : s
    ));
    setIncomingJob(null);
  };

  const updateStatus = (shipmentId: string, newStatus: ShipmentStatus) => {
    setShipments(prev => prev.map(s => 
      s.id === shipmentId ? { ...s, status: newStatus } : s
    ));
  };

  const rateDriver = (shipmentId: string, rating: number, review: string) => {
    setShipments(prev => prev.map(s => 
      s.id === shipmentId ? { ...s, rating, review } : s
    ));
  };

  const dismissJobAlert = () => {
    setIncomingJob(null);
  };

  return (
    <StoreContext.Provider value={{
      currentUser,
      shipments,
      drivers,
      incomingJob,
      login,
      logout,
      completeOnboarding,
      createShipment,
      acceptJob,
      updateStatus,
      rateDriver,
      dismissJobAlert,
      setIncomingJob,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
