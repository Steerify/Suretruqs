
export enum UserRole {
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',
  DRIVER = 'DRIVER'
}

export enum ShipmentStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  email: string;
  phone?: string;
  company?: string;
  onboarded?: boolean;
}

export interface Driver {
  id: string;
  name: string;
  vehicleType: string;
  plateNumber: string;
  rating: number;
  isOnline: boolean;
  location: string;
  trips: number;
  avatarColor: string;
}

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface Shipment {
  id: string;
  trackingId: string;
  customerId: string; // Link to customer
  pickup: Location;
  dropoff: Location;
  status: ShipmentStatus;
  price: number;
  date: string;
  driverId?: string;
  vehicleType?: string;
  weight?: string;
  cargoType?: string;
  distance?: string;
  cargoImage?: string; // New field for cargo image
  rating?: number;
  review?: string;
}

export interface Transaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  date: string;
  description: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  reference: string;
}

export interface DriverStats {
  totalEarnings: number;
  completedJobs: number;
  rating: number;
  isOnline: boolean;
  vehiclePlate?: string;
  vehicleModel?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  shipmentId: string;
  text: string;
  timestamp: string;
  isMe: boolean; // Helper for UI
}
