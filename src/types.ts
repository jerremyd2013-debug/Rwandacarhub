export type VehiclePurpose = 'buy' | 'rent' | 'lease';
export type VehicleStatus = 'available' | 'sold' | 'rented' | 'leased';
export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
export type TransmissionType = 'Automatic' | 'Manual';
export type VehicleCondition = 'Brand New' | 'Foreign Used' | 'Local Used';
export type BodyType = 'SUV' | 'Sedan' | 'Pickup Truck' | 'Hatchback' | 'Van / Bus' | 'Luxury';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  priceRwf: number;
  priceUsd: number;
  rentalPeriod?: 'day' | 'week' | 'month'; // for rentals/leases
  purpose: VehiclePurpose;
  status?: VehicleStatus;
  mileageKm: number;
  transmission: TransmissionType;
  fuelType: FuelType;
  engineSize?: string;
  bodyType: BodyType;
  color: string;
  location: string; // e.g. "Kigali, Kicukiro"
  condition: VehicleCondition;
  dealerId?: string;
  seller: {
    name: string;
    phone: string;
    whatsapp: string;
    email: string;
    isVerified: boolean;
    rating: number;
    reviewCount: number;
    avatarUrl?: string;
    dealerName?: string;
  };
  images: string[];
  features: string[];
  description: string;
  isFeatured?: boolean;
  postedDate: string;
  vin?: string;
  plateNumber?: string;
}

export interface Dealer {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  address: string;
  district: string;
  phone: string;
  whatsapp: string;
  email: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  carsCount: number;
  establishedYear: number;
  description: string;
  specialties: string[];
}

export interface ListingPricingPlan {
  id: string;
  name: string;
  carLimit: number;
  priceFrw: number;
  duration: string;
  popular?: boolean;
  requiresAccount?: boolean;
  badge?: string;
  features: string[];
}

export interface FilterState {
  searchQuery: string;
  purpose: VehiclePurpose | 'all';
  status?: VehicleStatus | 'all';
  make: string;
  model?: string;
  minPrice: number;
  maxPrice: number;
  currency?: 'RWF' | 'USD';
  minYear?: number;
  maxYear?: number;
  bodyType: string;
  transmission: string;
  fuelType: string;
  condition: string;
  location: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'year-desc' | 'mileage-asc';
}

export interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail?: string;
  senderPhone: string;
  vehicleId?: string;
  vehicleName?: string;
  message: string;
  timestamp: string;
  unread?: boolean;
  read?: boolean;
}

export interface Booking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  time: string;
  type: 'Test Drive' | 'Inspection' | 'Rental Booking' | 'Lease Inquiry';
  status: 'Pending' | 'Confirmed' | 'Completed';
  notes?: string;
}

export type UserRole = 'admin' | 'user';
export type AccountStatus = 'approved' | 'pending' | 'rejected';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: AccountStatus;
  accountType?: 'individual' | 'dealer' | 'agency' | 'rental';
  companyName?: string;
  avatar?: string;
  createdAt: string;
  approvalNotes?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  vehicleModel?: string;
  transactionType: 'buy' | 'sell' | 'rent' | 'lease';
  verifiedBuyer?: boolean;
  avatarInitials?: string;
  avatarColor?: string;
  helpfulCount?: number;
}

export type AdStatus = 'approved' | 'pending' | 'diminished' | 'expired' | 'rejected';

export interface PartnerAd {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  badge: string;
  category: 'Auto Finance' | 'Insurance' | 'Dealership' | 'Inspection' | 'Fuel & Care' | 'Fleet & Logistics';
  tagline: string;
  headline: string;
  offerHighlight: string;
  description: string;
  websiteUrl: string;
  phone: string;
  whatsapp: string;
  address: string;
  ctaText: string;
  accentColor: string;
  bgGradient: string;
  isHotPromo?: boolean;
  status: AdStatus;
  displayWeight: number; // 1 = Low (diminished/rare), 2 = Normal, 3 = High (frequent), 5 = Maximum VIP priority
  expiryDate?: string; // YYYY-MM-DD format or timestamp
  startDate?: string;
  impressionsCount?: number;
  clicksCount?: number;
}

