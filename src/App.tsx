import React, { useState, useMemo } from 'react';
import { 
  Car, 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  Zap, 
  Layers, 
  TrendingUp, 
  ArrowRight, 
  Sparkles,
  Phone,
  MessageSquare,
  CheckCircle2,
  Filter,
  Check
} from 'lucide-react';
import { Vehicle, FilterState, ContactMessage, Booking, VehiclePurpose, UserAccount, VehicleStatus, PartnerAd } from './types';
import { INITIAL_CARS, LISTING_PRICING_PLANS } from './data/cars';
import { INITIAL_ACCOUNTS } from './data/mockUsers';
import { PARTNER_ADS } from './data/partners';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CarCard } from './components/CarCard';
import { CarDetailsModal } from './components/CarDetailsModal';
import { PostCarModal } from './components/PostCarModal';
import { ComparisonDrawer } from './components/ComparisonDrawer';
import { SearchFilters } from './components/SearchFilters';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { DealersView } from './components/DealersView';
import { CarServicesView } from './components/CarServicesView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { AuthModal } from './components/AuthModal';
import { TestimonialsSection } from './components/TestimonialsSection';
import { PartnersAdBanner } from './components/PartnersAdBanner';

const HERO_VEHICLE_IMAGES = [
  {
    id: 'luxury',
    title: 'Luxury Performance',
    subtitle: 'High-speed Gran Turismo',
    url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&auto=format&fit=crop&q=85',
  },
  {
    id: 'prado',
    title: 'Land Cruiser Prado',
    subtitle: 'Rwandan 4x4 Hill Legend',
    url: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=1920&auto=format&fit=crop&q=85',
  },
  {
    id: 'suv',
    title: 'Executive Black SUV',
    subtitle: 'Premium Kigali Comfort',
    url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1920&auto=format&fit=crop&q=85',
  }
];

export default function App() {
  // Navigation & View state
  const [currentTab, setCurrentTab] = useState('home');
  const [currency, setCurrency] = useState<'RWF' | 'USD'>('RWF');
  const [heroVehicleImage, setHeroVehicleImage] = useState(HERO_VEHICLE_IMAGES[0].url);

  // Vehicles dataset state (can add new user-posted cars)
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_CARS);

  // Favorites & Comparison state
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['car-1', 'car-4']);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Modals state
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isPostCarOpen, setIsPostCarOpen] = useState(false);
  const [initialPlanIdForModal, setInitialPlanIdForModal] = useState<string | undefined>(undefined);

  // User Dashboard State
  const [userListings, setUserListings] = useState<Vehicle[]>([]);
  
  // User Accounts & Role-Based Approval State
  const [accounts, setAccounts] = useState<UserAccount[]>(INITIAL_ACCOUNTS);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null); // Starts as Guest so Login button is prominently visible
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSelectUser = (acc: UserAccount | null) => {
    setCurrentUser(acc);
    if (acc) {
      const badge = acc.role === 'admin' ? 'Website Admin' : acc.status === 'approved' ? 'Approved Member' : 'Pending Approval';
      showToast(`Switched account to: ${acc.name} (${badge})`);
    } else {
      showToast('Logged out of RwandaCarHub.');
      if (currentTab === 'dashboard') {
        setCurrentTab('home');
      }
    }
  };

  const handleRegisterAccount = (data: {
    name: string;
    email: string;
    phone: string;
    accountType: 'individual' | 'dealer' | 'rental';
    companyName?: string;
  }) => {
    const newAcc: UserAccount = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      accountType: data.accountType,
      companyName: data.companyName,
      role: 'user',
      status: 'pending', // Pending approval by the administrator!
      createdAt: 'Just now',
      approvalNotes: 'Self-registered account awaiting admin verification'
    };
    setAccounts((prev) => [newAcc, ...prev]);
    setCurrentUser(newAcc);
    showToast(`Account registered for ${newAcc.name}! Status: Pending Approval. Website admin must approve before dashboard is visible.`);
  };

  const handleApproveAccount = (userId: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === userId ? { ...acc, status: 'approved' as const, approvalNotes: 'Verified and approved by admin' } : acc
      )
    );
    setCurrentUser((prev) => (prev && prev.id === userId ? { ...prev, status: 'approved' } : prev));
    showToast('Account successfully approved! Dashboard access is now enabled.');
  };

  const handleRejectAccount = (userId: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === userId ? { ...acc, status: 'rejected' as const, approvalNotes: 'Declined by admin' } : acc
      )
    );
    setCurrentUser((prev) => (prev && prev.id === userId ? { ...prev, status: 'rejected' } : prev));
    showToast('Account registration declined.');
  };

  // Partner Advertisements & Sliding Space State (Admin manageable)
  const [partnerAds, setPartnerAds] = useState<PartnerAd[]>(PARTNER_ADS);

  const handleApproveAd = (adId: string) => {
    setPartnerAds((prev) =>
      prev.map((ad) => (ad.id === adId ? { ...ad, status: 'approved' as const } : ad))
    );
    showToast('Advert approved! It is now actively featured in the partner slider & ticker.');
  };

  const handleRejectAd = (adId: string) => {
    setPartnerAds((prev) =>
      prev.map((ad) => (ad.id === adId ? { ...ad, status: 'rejected' as const } : ad))
    );
    showToast('Advert rejected and hidden from public view.');
  };

  const handleDiminishAd = (adId: string) => {
    setPartnerAds((prev) =>
      prev.map((ad) =>
        ad.id === adId
          ? { ...ad, status: 'diminished' as const, displayWeight: 1 }
          : ad
      )
    );
    showToast('Advert diminished. Display frequency lowered to 1x (rare appearance).');
  };

  const handleRemoveAd = (adId: string) => {
    setPartnerAds((prev) => prev.filter((ad) => ad.id !== adId));
    showToast('Advert removed completely from RwandaCarHub.');
  };

  const handleUpdateAdWeight = (adId: string, weight: number) => {
    setPartnerAds((prev) =>
      prev.map((ad) =>
        ad.id === adId
          ? {
              ...ad,
              displayWeight: weight,
              // If previously diminished and weight is increased, bring back to approved
              status: ad.status === 'diminished' && weight > 1 ? 'approved' : ad.status
            }
          : ad
      )
    );
    const label = weight === 5 ? '5x (VIP Top Frequency)' : weight === 3 ? '3x (High)' : weight === 2 ? '2x (Normal)' : '1x (Rare)';
    showToast(`Advert frequency set to ${label}.`);
  };

  const handleUpdateAdExpiry = (adId: string, expiryDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    setPartnerAds((prev) =>
      prev.map((ad) => {
        if (ad.id === adId) {
          const isExpired = expiryDate < today;
          return {
            ...ad,
            expiryDate,
            status: isExpired ? 'expired' : ad.status === 'expired' ? 'approved' : ad.status
          };
        }
        return ad;
      })
    );
    showToast(`Expiry date updated to ${expiryDate}.`);
  };

  const handleSaveAd = (savedAd: PartnerAd) => {
    setPartnerAds((prev) => {
      const exists = prev.some((a) => a.id === savedAd.id);
      if (exists) {
        return prev.map((a) => (a.id === savedAd.id ? savedAd : a));
      }
      return [savedAd, ...prev];
    });
    showToast(`Advert for "${savedAd.name}" saved successfully!`);
  };

  const handleAdInquirySubmitted = (inquiry: {
    companyName: string;
    contactPerson: string;
    phone: string;
    email: string;
    adType: string;
    notes: string;
  }) => {
    // Automatically create a pending advert from the inquiry so admin can review and approve it immediately
    const pendingAd: PartnerAd = {
      id: `inquiry-ad-${Date.now()}`,
      name: inquiry.companyName,
      shortName: inquiry.companyName.split(' ')[0] || inquiry.companyName,
      logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80',
      badge: inquiry.adType,
      category: inquiry.adType.includes('Finance') ? 'Auto Finance' : inquiry.adType.includes('Insurance') ? 'Insurance' : 'Dealership',
      tagline: inquiry.companyName,
      headline: `Featured Campaign by ${inquiry.companyName} in Kigali`,
      offerHighlight: inquiry.notes || 'Exclusive Automotive Services & Deals in Rwanda',
      description: `Inquiry submitted by ${inquiry.contactPerson || inquiry.companyName}. Notes: ${inquiry.notes || 'No special requirements specified.'}`,
      websiteUrl: 'https://rwandacarhub.com',
      phone: inquiry.phone,
      whatsapp: inquiry.phone.replace(/[^0-9]/g, ''),
      address: 'Kigali, Rwanda',
      ctaText: 'Contact Partner',
      accentColor: '#DC2626',
      bgGradient: 'from-neutral-900 via-neutral-900 to-neutral-950',
      isHotPromo: false,
      status: 'pending', // Requires admin approval!
      displayWeight: 2,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      impressionsCount: 0,
      clicksCount: 0
    };
    setPartnerAds((prev) => [pendingAd, ...prev]);
    showToast(`Advertising inquiry received from ${inquiry.companyName}! Added to Admin Adverts for review.`);
  };
  const [messages, setMessages] = useState<ContactMessage[]>([
    {
      id: 'msg-1',
      vehicleId: 'car-1',
      vehicleName: '2023 Toyota Land Cruiser Prado TX-L',
      senderName: 'David Kamanzi',
      senderPhone: '+250 788 111 222',
      message: 'Hello, is this Prado TX-L still available in Kicukiro? Can I inspect it tomorrow morning at 10 AM?',
      timestamp: '2 hours ago',
      read: true
    },
    {
      id: 'msg-2',
      vehicleId: 'car-2',
      vehicleName: '2022 Mercedes-Benz C200 AMG Line',
      senderName: 'Claire Umutoni',
      senderPhone: '+250 788 333 444',
      message: 'Good afternoon, what is the best cash price in RWF for the C200? Are the RRA duty papers complete?',
      timestamp: 'Yesterday',
      read: false
    }
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'book-1',
      vehicleId: 'car-1',
      vehicleName: '2023 Toyota Land Cruiser Prado TX-L',
      customerName: 'Jean-Damascène Habimana',
      customerPhone: '+250 788 225 193',
      date: '2026-09-10',
      time: '10:30 AM',
      type: 'Test Drive',
      status: 'Confirmed'
    }
  ]);

  // Filters State
  const initialFilters: FilterState = {
    purpose: 'all',
    searchQuery: '',
    make: '',
    bodyType: '',
    minPrice: 0,
    maxPrice: 200000000,
    fuelType: '',
    transmission: '',
    condition: '',
    location: '',
    status: 'all',
    sortBy: 'featured'
  };
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Available Makes for Filter Dropdown
  const availableMakes = useMemo(() => {
    return Array.from(new Set(vehicles.map((c) => c.make))).sort();
  }, [vehicles]);

  // Favorite toggle handler
  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Compare toggle handler
  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 4) {
        showToast('You can compare up to 4 vehicles at a time in the comparison matrix.');
        return prev;
      }
      return [...prev, id];
    });
  };

  // Add new car handler (from PostCarModal)
  const handleAddCar = (newCar: Vehicle) => {
    setVehicles((prev) => [newCar, ...prev]);
    setUserListings((prev) => [newCar, ...prev]);
  };

  // Delete listing handler
  const handleDeleteListing = (id: string) => {
    setVehicles((prev) => prev.filter((c) => c.id !== id));
    setUserListings((prev) => prev.filter((c) => c.id !== id));
  };

  // Update vehicle status handler (available, sold, rented, leased)
  const handleUpdateVehicleStatus = (vehicleId: string, newStatus: VehicleStatus) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, status: newStatus } : v))
    );
    setUserListings((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, status: newStatus } : v))
    );
    setSelectedVehicle((prev) =>
      prev && prev.id === vehicleId ? { ...prev, status: newStatus } : prev
    );

    const statusLabels: Record<VehicleStatus, string> = {
      available: 'marked as Available in stock',
      sold: 'marked as Sold (Yagurishijwe)',
      rented: 'marked as Rented out',
      leased: 'marked as Leased'
    };

    showToast(`Vehicle status ${statusLabels[newStatus] || newStatus}.`);
  };

  // Booking submit handler (from CarDetailsModal)
  const handleCreateBooking = (bookingData: Omit<Booking, 'id' | 'status'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      status: 'Confirmed'
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  // Inquiry message handler
  const handleSendMessage = (msgData: Omit<ContactMessage, 'id' | 'timestamp' | 'read'>) => {
    const newMsg: ContactMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      timestamp: 'Just now',
      read: true
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  // Send reply from dashboard
  const handleSendReply = (text: string) => {
    const replyMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      senderName: 'You (RwandaCarHub Seller)',
      senderPhone: '+250 788 225 193',
      message: text,
      timestamp: 'Just now',
      read: true
    };
    setMessages((prev) => [replyMsg, ...prev]);
  };

  // Favorite vehicles objects
  const favoriteVehicles = useMemo(() => {
    return vehicles.filter((c) => favoriteIds.includes(c.id));
  }, [vehicles, favoriteIds]);

  // Compare vehicles objects
  const compareVehicles = useMemo(() => {
    return vehicles.filter((c) => compareIds.includes(c.id));
  }, [vehicles, compareIds]);

  // Tab change with purpose synchronization
  const handleTabSelect = (tab: string, purpose?: VehiclePurpose) => {
    setCurrentTab(tab);
    if (tab === 'sell') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (purpose) {
      setFilters((prev) => ({ ...prev, purpose }));
    } else if (tab === 'buy') {
      setFilters((prev) => ({ ...prev, purpose: 'buy' }));
    } else if (tab === 'rent') {
      setFilters((prev) => ({ ...prev, purpose: 'rent' }));
    } else if (tab === 'lease') {
      setFilters((prev) => ({ ...prev, purpose: 'lease' }));
    } else if (tab === 'home') {
      setFilters((prev) => ({ ...prev, purpose: 'all' }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter vehicles by dealer (from DealersView)
  const handleSelectDealerCars = (dealerId: string, dealerName: string) => {
    setCurrentTab('buy');
    setFilters({
      ...initialFilters,
      searchQuery: dealerName
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered vehicles calculation
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((car) => {
      // Purpose filter
      if (filters.purpose !== 'all' && car.purpose !== filters.purpose) {
        return false;
      }
      // Make filter
      if (filters.make && car.make.toLowerCase() !== filters.make.toLowerCase()) {
        return false;
      }
      // Body type filter
      if (filters.bodyType && car.bodyType.toLowerCase() !== filters.bodyType.toLowerCase()) {
        return false;
      }
      // Fuel type filter
      if (filters.fuelType && car.fuelType.toLowerCase() !== filters.fuelType.toLowerCase()) {
        return false;
      }
      // Transmission filter
      if (filters.transmission && car.transmission.toLowerCase() !== filters.transmission.toLowerCase()) {
        return false;
      }
      // Condition filter
      if (filters.condition && car.condition.toLowerCase() !== filters.condition.toLowerCase()) {
        return false;
      }
      // Location filter
      if (filters.location && !car.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      // Status filter
      if (filters.status && filters.status !== 'all') {
        const carStatus = car.status || 'available';
        if (carStatus !== filters.status) {
          return false;
        }
      }
      // Search query filter (search make, model, location, seller, features)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesMake = car.make.toLowerCase().includes(query);
        const matchesModel = car.model.toLowerCase().includes(query);
        const matchesLoc = car.location.toLowerCase().includes(query);
        const matchesSeller = car.seller.name.toLowerCase().includes(query) || (car.seller.dealerName || '').toLowerCase().includes(query);
        const matchesFeature = car.features.some(f => f.toLowerCase().includes(query));
        if (!matchesMake && !matchesModel && !matchesLoc && !matchesSeller && !matchesFeature) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.priceRwf - b.priceRwf;
      if (filters.sortBy === 'price-desc') return b.priceRwf - a.priceRwf;
      if (filters.sortBy === 'year-desc') return b.year - a.year;
      if (filters.sortBy === 'mileage-asc') return a.mileageKm - b.mileageKm;
      // Default: featured first
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [vehicles, filters]);

  // Featured cars for Home showcase
  const featuredCars = useMemo(() => {
    return vehicles.filter(c => c.isFeatured).slice(0, 4);
  }, [vehicles]);

  return (
    <div className="min-h-screen bg-transparent text-slate-900 flex flex-col selection:bg-sky-600 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* GLOBAL HEADER */}
      <Header
        currentTab={currentTab}
        onNavigate={handleTabSelect}
        onSelectTab={handleTabSelect}
        onOpenPostCar={() => setIsPostCarOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        currency={currency}
        onToggleCurrency={() => setCurrency((prev) => (prev === 'RWF' ? 'USD' : 'RWF'))}
        favoritesCount={favoriteIds.length}
        compareCount={compareIds.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenSearch={() => {
          handleTabSelect('buy');
          setTimeout(() => {
            const el = document.getElementById('search-filters-panel') || document.getElementById('inventory-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onOpenCodeGuide={() => handleTabSelect('about')}
      />

      {/* MAIN VIEW CONTENT CONTAINER */}
      <main className="flex-1 pb-24 md:pb-12">
        {/* ======================= HOME VIEW ======================= */}
        {currentTab === 'home' && (
          <div className="space-y-6 sm:space-y-8 pb-16">
            {/* MOVING & SLIDING ADVERTS AND PARTNER LINKS SPACE (BETWEEN NAVBAR AND HERO SECTION) */}
            <PartnersAdBanner 
              partnerAds={partnerAds} 
              onNavigateContact={() => handleTabSelect('contact')} 
              onAdInquirySubmitted={handleAdInquirySubmitted}
            />

            {/* HERO SECTION */}
            <div className="pt-1 sm:pt-2 px-3 sm:px-6 max-w-7xl mx-auto">
              {/* HERO BANNER CONTAINER WITH VEHICLE PICTURE BEHIND TRANSPARENT BACKGROUND */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-neutral-800/90 shadow-2xl shadow-black/90 bg-neutral-950/40 backdrop-blur-xs py-8 sm:py-14 lg:py-20 px-3.5 sm:px-8 lg:px-12">
                
                {/* VEHICLE PICTURE BEHIND TRANSPARENT HERO BACKGROUND */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <img
                    src={heroVehicleImage}
                    alt="RwandaCarHub Showcase Vehicle"
                    className="w-full h-full object-cover object-center scale-105 opacity-60 sm:opacity-70 transition-all duration-1000 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  {/* Multi-layered transparent dark gradients to ensure pristine text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/80 to-neutral-950/50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20" />
                  <div className="absolute inset-0 bg-red-950/15 mix-blend-color-dodge" />
                </div>

                {/* Background ambient lighting accents */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-800/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-10 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-8">
                  <div className="max-w-3xl space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/85 border border-red-800/70 text-xs font-bold text-red-300 shadow-md backdrop-blur-md">
                      <ShieldCheck className="w-4 h-4 text-red-400" />
                      <span>Certified Automotive Marketplace • Kigali, Rwanda</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-['Outfit',sans-serif] tracking-tight leading-[1.1] drop-shadow-md">
                      Buy, Sell, Rent & Lease Cars in <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-amber-500">Rwanda</span>
                    </h1>

                    <p className="pt-8 sm:pt-14 lg:pt-20 text-sm sm:text-base lg:text-lg text-neutral-200 leading-relaxed max-w-2xl drop-shadow-sm font-normal">
                      Discover verified vehicles from certified Kigali dealerships and trusted private sellers.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setIsPostCarOpen(true)}
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-950/80 transition-all hover:scale-[1.02]"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Post Your Car (From 5,000 Frw)</span>
                      </button>
                    </div>
                  </div>

                  {/* SEARCH FILTERS IN HERO */}
                  <div className="pt-2">
                    <SearchFilters
                      filters={filters}
                      onFilterChange={(newF) => setFilters((prev) => ({ ...prev, ...newF }))}
                      onResetFilters={() => setFilters(initialFilters)}
                      totalCount={filteredVehicles.length}
                      availableMakes={availableMakes}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK PURPOSE / CATEGORY SHORTCUTS */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div 
                  onClick={() => handleTabSelect('buy')}
                  className="p-4 sm:p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-sky-200 hover:border-sky-400 cursor-pointer transition-all hover:-translate-y-0.5 space-y-2 group shadow-md hover:shadow-lg"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center border border-sky-200 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <Car className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-['Outfit',sans-serif]">Buy Certified Cars</h3>
                  <p className="text-[11px] sm:text-xs text-sky-800/80 line-clamp-1 font-medium">Verified Japanese & European stock</p>
                </div>

                <div 
                  onClick={() => handleTabSelect('sell')}
                  className="p-4 sm:p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-sky-200 hover:border-emerald-400 cursor-pointer transition-all hover:-translate-y-0.5 space-y-2 group shadow-md hover:shadow-lg"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-['Outfit',sans-serif]">Sell Your Car</h3>
                  <p className="text-[11px] sm:text-xs text-sky-800/80 line-clamp-1 font-medium">Direct buyer contacts in Kigali</p>
                </div>

                <div 
                  onClick={() => handleTabSelect('rent')}
                  className="p-4 sm:p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-sky-200 hover:border-amber-400 cursor-pointer transition-all hover:-translate-y-0.5 space-y-2 group shadow-md hover:shadow-lg"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-['Outfit',sans-serif]">Rent 4x4 Vehicles</h3>
                  <p className="text-[11px] sm:text-xs text-sky-800/80 line-clamp-1 font-medium">Prado & Land Cruisers for travel</p>
                </div>

                <div 
                  onClick={() => handleTabSelect('services')}
                  className="p-4 sm:p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-sky-200 hover:border-indigo-400 cursor-pointer transition-all hover:-translate-y-0.5 space-y-2 group shadow-md hover:shadow-lg"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-['Outfit',sans-serif]">Car Valuation & Check</h3>
                  <p className="text-[11px] sm:text-xs text-sky-800/80 line-clamp-1 font-medium">Instant valuation & 150-point inspection</p>
                </div>
              </div>
            </div>

            {/* UNIFIED CLEAR VEHICLES MARKETPLACE SECTION */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-400/40 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950 font-['Outfit',sans-serif]">
                    Available Vehicles in Rwanda
                  </h2>
                  <p className="text-xs text-sky-950/80 font-medium">
                    Showing {filteredVehicles.length} verified vehicle{filteredVehicles.length > 1 ? 's' : ''} ready in Kigali
                  </p>
                </div>

                {/* Filter shortcut pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, purpose: 'all' }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filters.purpose === 'all'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-white/85 text-sky-900 hover:bg-white border border-sky-200'
                    }`}
                  >
                    All ({vehicles.length})
                  </button>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, purpose: 'buy' }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filters.purpose === 'buy'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-white/85 text-sky-900 hover:bg-white border border-sky-200'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, purpose: 'rent' }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filters.purpose === 'rent'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-white/85 text-sky-900 hover:bg-white border border-sky-200'
                    }`}
                  >
                    Rent
                  </button>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, purpose: 'lease' }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filters.purpose === 'lease'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white/85 text-sky-900 hover:bg-white border border-sky-200'
                    }`}
                  >
                    Lease
                  </button>
                </div>
              </div>

              {filteredVehicles.length === 0 ? (
                <div className="p-12 text-center bg-white/85 backdrop-blur-md rounded-2xl border border-sky-200 space-y-3 shadow-md">
                  <Car className="w-12 h-12 text-sky-600 mx-auto" />
                  <h4 className="text-base font-bold text-slate-900">No vehicles match your selected filters.</h4>
                  <p className="text-xs text-sky-800 font-medium">
                    Try clearing or widening your search criteria to find more cars.
                  </p>
                  <button
                    onClick={() => setFilters(initialFilters)}
                    className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-md"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {filteredVehicles.map((car) => (
                    <CarCard
                      key={car.id}
                      vehicle={car}
                      currency={currency}
                      isFavorite={favoriteIds.includes(car.id)}
                      isCompared={compareIds.includes(car.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onToggleCompare={handleToggleCompare}
                      onSelectVehicle={setSelectedVehicle}
                      isAdmin={currentUser?.role === 'admin'}
                      onUpdateStatus={handleUpdateVehicleStatus}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* SIMPLE & CLEAR SELLER CALLOUT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-red-950/50 rounded-2xl p-6 sm:p-8 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-1.5 text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-white font-['Outfit',sans-serif]">
                    Want to Sell or Rent Your Car in Kigali?
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
                    Post your vehicle in minutes and connect directly with verified buyers and renters. Affordable listing packages starting from 5,000 Frw.
                  </p>
                </div>

                <button
                  onClick={() => setIsPostCarOpen(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-lg transition-all shrink-0"
                >
                  Post Your Vehicle
                </button>
              </div>
            </div>

            {/* TESTIMONIALS & VERIFIED REVIEWS SECTION */}
            <TestimonialsSection
              onSelectTab={handleTabSelect}
              onOpenPostCar={() => setIsPostCarOpen(true)}
            />
          </div>
        )}

        {/* ======================= BUY / RENT / LEASE VIEWS ======================= */}
        {(currentTab === 'buy' || currentTab === 'rent' || currentTab === 'lease') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md border border-sky-200 text-xs font-bold text-sky-800 shadow-sm">
                {currentTab === 'buy' ? '🚗 For Sale in Rwanda' : currentTab === 'rent' ? '🔑 Rental & Safari Fleet' : '📄 Corporate & Long-term Lease'}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-['Outfit',sans-serif]">
                {currentTab === 'buy' && 'Buy Certified Vehicles in Kigali'}
                {currentTab === 'rent' && 'Car Hire & Safari 4x4 Rental in Rwanda'}
                {currentTab === 'lease' && 'Long-term Corporate Vehicle Leasing'}
              </h1>
              <p className="text-xs sm:text-sm text-sky-950/80 max-w-3xl font-medium">
                {currentTab === 'buy' && 'Explore verified foreign imports and clean local Rwandan cars with full RRA paperwork and mechanical inspection reports.'}
                {currentTab === 'rent' && 'Explore Rwanda with confidence. Toyota Prado, Land Cruiser 70-series, RAV4, and luxury sedans with optional driver.'}
                {currentTab === 'lease' && 'Tailored automotive leasing solutions for NGOs, embassies, corporate executives, and business fleets in Kigali.'}
              </p>
            </div>

            {/* Filter controls */}
            <SearchFilters
              filters={filters}
              onFilterChange={(newF) => setFilters((prev) => ({ ...prev, ...newF }))}
              onResetFilters={() => setFilters(initialFilters)}
              totalCount={filteredVehicles.length}
              availableMakes={availableMakes}
            />

            {/* Filtered Vehicles Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-sky-950/80 font-medium">
                <span>Showing <strong>{filteredVehicles.length}</strong> available listings</span>
                <span>Watermark Protection: <strong>www.rwandacarhub.com</strong></span>
              </div>

              {filteredVehicles.length === 0 ? (
                <div className="p-12 text-center bg-white/85 backdrop-blur-md rounded-2xl border border-sky-200 space-y-3 shadow-md">
                  <Car className="w-12 h-12 text-sky-600 mx-auto" />
                  <h4 className="text-base font-bold text-slate-900">No cars found matching this criteria.</h4>
                  <button
                    onClick={() => setFilters(initialFilters)}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {filteredVehicles.map((car) => (
                    <CarCard
                      key={car.id}
                      vehicle={car}
                      currency={currency}
                      isFavorite={favoriteIds.includes(car.id)}
                      isCompared={compareIds.includes(car.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onToggleCompare={handleToggleCompare}
                      onSelectVehicle={setSelectedVehicle}
                      isAdmin={currentUser?.role === 'admin'}
                      onUpdateStatus={handleUpdateVehicleStatus}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================= SELL VIEW ======================= */}
        {currentTab === 'sell' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
            <div className="bg-neutral-900 rounded-3xl p-8 sm:p-14 border border-neutral-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-2xl space-y-4">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  RwandaCarHub Seller Center
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit',sans-serif]">
                  Sell Your Car in Rwanda Faster than Ever
                </h1>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Join hundreds of individual car owners and verified Kigali dealerships. List your car with our official watermark protection, direct WhatsApp buyer connections, and Mobile Money (MoMo) payments.
                </p>
                <button
                  onClick={() => setIsPostCarOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Start Listing Now</span>
                </button>
              </div>

              <div className="w-full md:w-80 p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                <h4 className="text-sm font-bold text-white">Why Sellers Choose Us</h4>
                <div className="space-y-3 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Free Plan for Account Holders (2 cars/day)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                    <span>5,000 Frw/day for 5 cars (Starter)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                    <span>15,000 Frw/week for 30 cars (Pro)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                    <span>35,000 Frw/month for 50 cars (Fleet)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                    <span>Watermark www.rwandacarhub.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PRICING PACKAGES DETAIL */}
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <h3 className="text-2xl font-bold text-slate-950 font-['Outfit',sans-serif]">
                  Choose Your Listing Plan
                </h3>
                <p className="text-xs text-sky-950/80 mt-1 font-medium">
                  Simple, honest pricing with instant Mobile Money (*182#) payment integration, plus a free tier for account holders.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {LISTING_PRICING_PLANS.map((plan) => {
                  const isFree = plan.priceFrw === 0;

                  return (
                    <div
                      key={plan.id}
                      className={`relative p-6 rounded-3xl border flex flex-col justify-between space-y-6 ${
                        plan.popular
                          ? 'bg-neutral-900 border-red-600 shadow-2xl'
                          : isFree
                          ? 'bg-emerald-950/20 border-emerald-700/80 shadow-lg'
                          : 'bg-neutral-900/60 border-neutral-800'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                          Most Popular
                        </div>
                      )}
                      {isFree && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow whitespace-nowrap">
                          Account Holders (2 Cars/Day)
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif]">{plan.name}</h4>
                          <span className="text-xs px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 font-semibold">
                            Up to {plan.carLimit} Cars
                          </span>
                        </div>

                        <div>
                          <div className={`text-3xl font-black font-['Outfit',sans-serif] ${isFree ? 'text-emerald-400' : 'text-white'}`}>
                            {isFree ? '0 Frw' : `${plan.priceFrw.toLocaleString()} Frw`}
                          </div>
                          <span className={`text-xs font-bold ${isFree ? 'text-emerald-400' : 'text-red-400'}`}>
                            {plan.duration}
                          </span>
                        </div>

                        {isFree && (
                          <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-[11px] text-emerald-300">
                            {currentUser ? (
                              <span>✓ Available for your account ({currentUser.name})</span>
                            ) : (
                              <span>⚠️ Sign in or register to activate your 2 free cars/day</span>
                            )}
                          </div>
                        )}

                        <ul className="space-y-2 text-xs text-neutral-300 border-t border-neutral-800 pt-4">
                          {plan.features.map((feat, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Check className={`w-3.5 h-3.5 shrink-0 ${isFree ? 'text-emerald-400' : 'text-red-500'}`} />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => {
                          setInitialPlanIdForModal(plan.id);
                          setIsPostCarOpen(true);
                        }}
                        className={`w-full py-3 rounded-xl text-white text-xs font-bold shadow-lg transition-all ${
                          isFree
                            ? 'bg-emerald-600 hover:bg-emerald-500'
                            : 'bg-red-700 hover:bg-red-600'
                        }`}
                      >
                        {isFree ? 'List Free (2 Cars/Day)' : `Post with ${plan.name}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================= DEALERS VIEW ======================= */}
        {currentTab === 'dealers' && (
          <DealersView
            onSelectDealerCars={handleSelectDealerCars}
            onOpenPostCar={() => setIsPostCarOpen(true)}
          />
        )}

        {/* ======================= SERVICES VIEW ======================= */}
        {currentTab === 'services' && <CarServicesView />}

        {/* ======================= ABOUT VIEW ======================= */}
        {currentTab === 'about' && <AboutView onNavigate={handleTabSelect} />}

        {/* ======================= CONTACT VIEW ======================= */}
        {currentTab === 'contact' && (
          <ContactView 
            onSendMessage={(msg) => {
              handleSendMessage(msg);
              showToast('Your message has been sent to RwandaCarHub support!');
            }} 
          />
        )}

        {/* ======================= USER DASHBOARD VIEW ======================= */}
        {currentTab === 'dashboard' && (
          <DashboardView
            favoriteVehicles={favoriteVehicles}
            userListings={userListings}
            messages={messages}
            bookings={bookings}
            currency={currency}
            currentUser={currentUser}
            accounts={accounts}
            allVehicles={vehicles}
            partnerAds={partnerAds}
            onApproveAd={handleApproveAd}
            onRejectAd={handleRejectAd}
            onDiminishAd={handleDiminishAd}
            onRemoveAd={handleRemoveAd}
            onUpdateAdWeight={handleUpdateAdWeight}
            onUpdateAdExpiry={handleUpdateAdExpiry}
            onSaveAd={handleSaveAd}
            onUpdateVehicleStatus={handleUpdateVehicleStatus}
            onToggleFavorite={handleToggleFavorite}
            onSelectVehicle={setSelectedVehicle}
            onOpenPostCar={() => setIsPostCarOpen(true)}
            onDeleteListing={handleDeleteListing}
            onSendReply={handleSendReply}
            onApproveAccount={handleApproveAccount}
            onRejectAccount={handleRejectAccount}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onSimulateLogin={(acc) => handleSelectUser(acc)}
          />
        )}
      </main>

      {/* GLOBAL FOOTER */}
      <Footer 
        onNavigate={handleTabSelect}
        onSelectTab={handleTabSelect} 
        onOpenPostCar={() => setIsPostCarOpen(true)}
      />

      {/* MOBILE PERSISTENT BOTTOM NAVIGATION BAR */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={handleTabSelect}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        favoritesCount={favoriteIds.length}
        compareCount={compareIds.length}
        onOpenPostCar={() => setIsPostCarOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenSearch={() => {
          handleTabSelect('buy');
          setTimeout(() => {
            const el = document.getElementById('search-filters-panel');
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm px-4 py-3 rounded-xl bg-neutral-900 border border-red-600/80 text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
          <p className="text-xs font-medium leading-relaxed">{toastMessage}</p>
        </div>
      )}

      {/* ======================= MODALS & DRAWERS ======================= */}

      {/* USER AUTH & PERSONA SWITCHING MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        accounts={accounts}
        onSelectUser={handleSelectUser}
        onRegister={handleRegisterAccount}
      />

      {/* 1. CAR DETAILS MODAL */}
      {selectedVehicle && (
        <CarDetailsModal
          vehicle={selectedVehicle}
          currency={currency}
          isFavorite={favoriteIds.includes(selectedVehicle.id)}
          isCompared={compareIds.includes(selectedVehicle.id)}
          onClose={() => setSelectedVehicle(null)}
          onToggleFavorite={handleToggleFavorite}
          onToggleCompare={handleToggleCompare}
          onCreateBooking={handleCreateBooking}
          onSendMessage={handleSendMessage}
          currentUser={currentUser}
          onUpdateVehicleStatus={handleUpdateVehicleStatus}
        />
      )}

      {/* 2. POST CAR MODAL */}
      <PostCarModal
        isOpen={isPostCarOpen}
        onClose={() => {
          setIsPostCarOpen(false);
          setInitialPlanIdForModal(undefined);
        }}
        onAddCar={handleAddCar}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        initialPlanId={initialPlanIdForModal}
      />

      {/* 3. COMPARISON MATRIX DRAWER */}
      <ComparisonDrawer
        vehicles={compareVehicles}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onRemoveVehicle={handleToggleCompare}
        onClearAll={() => setCompareIds([])}
        currency={currency}
        onSelectVehicle={setSelectedVehicle}
      />
    </div>
  );
}
