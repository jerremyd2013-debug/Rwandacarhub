import React, { useState, useMemo, useEffect } from 'react';
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
import { Vehicle, FilterState, ContactMessage, Booking, VehiclePurpose, UserAccount, VehicleStatus, PartnerAd, ActivityLog, ActivityType } from './types';
import { INITIAL_CARS, LISTING_PRICING_PLANS } from './data/cars';
import { INITIAL_ACCOUNTS } from './data/mockUsers';
import { PARTNER_ADS } from './data/partners';
import { INITIAL_ACTIVITY_LOGS } from './data/mockActivityLogs';
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
import { 
  subscribeToVehicles, 
  saveVehicleToCloud, 
  updateVehicleStatusInCloud, 
  deleteVehicleFromCloud,
  subscribeToBookings,
  saveBookingToCloud,
  subscribeToMessages,
  saveMessageToCloud,
  subscribeToPartnerAds,
  savePartnerAdToCloud,
  deletePartnerAdFromCloud,
  subscribeToAccounts,
  saveAccountToCloud,
  testFirestoreConnection,
  seedInitialVehiclesIfEmpty,
  subscribeToActivityLogs,
  saveActivityLogToCloud
} from './firebase';

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

const STORAGE_KEYS = {
  VEHICLES: 'rwandacarhub_vehicles_v2',
  ACCOUNTS: 'rwandacarhub_accounts_v2',
  CURRENT_USER: 'rwandacarhub_current_user_v2',
  USER_LISTINGS: 'rwandacarhub_user_listings_v2',
  BOOKINGS: 'rwandacarhub_bookings_v2',
  MESSAGES: 'rwandacarhub_messages_v2',
  FAVORITES: 'rwandacarhub_favorites_v2',
  ADS: 'rwandacarhub_ads_v2',
  ACTIVITY_LOGS: 'rwandacarhub_activity_logs_v2'
};

export default function App() {
  // Navigation & View state
  const [currentTab, setCurrentTab] = useState('home');
  const [currency, setCurrency] = useState<'RWF' | 'USD'>('RWF');
  const [heroVehicleImage, setHeroVehicleImage] = useState(HERO_VEHICLE_IMAGES[0].url);

  // Vehicles dataset state (persisted with core showroom catalog guarantee so cars never disappear)
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with core INITIAL_CARS so verified showroom vehicles are never dropped
          const map = new Map<string, Vehicle>();
          INITIAL_CARS.forEach((c) => map.set(c.id, c));
          parsed.forEach((c: Vehicle) => {
            if (c && c.id && c.make) map.set(c.id, c);
          });
          return Array.from(map.values());
        }
      }
    } catch (e) {
      console.warn('Failed to load saved vehicles from storage', e);
    }
    return INITIAL_CARS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
    } catch (e) {
      console.warn('Failed to save vehicles to storage', e);
    }
  }, [vehicles]);

  // Favorites & Comparison state
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return ['car-1', 'car-4'];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favoriteIds));
    } catch (e) {}
  }, [favoriteIds]);

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Modals state
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isPostCarOpen, setIsPostCarOpen] = useState(false);
  const [initialPlanIdForModal, setInitialPlanIdForModal] = useState<string | undefined>(undefined);

  // User Dashboard State
  const [userListings, setUserListings] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_LISTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_LISTINGS, JSON.stringify(userListings));
    } catch (e) {}
  }, [userListings]);
  
  // User Accounts & Role-Based Approval State
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_ACCOUNTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {}
  }, [accounts]);

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return null;
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {}
  }, [currentUser]);

  // Marketplace Activity & Audit Logs State (Admin Activity Tracker)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_ACTIVITY_LOGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(activityLogs));
    } catch (e) {}
  }, [activityLogs]);

  // Helper to record an activity event both locally and in Google Cloud Firestore
  const logActivity = (
    type: ActivityType,
    category: 'vehicles' | 'adverts' | 'accounts' | 'system',
    title: string,
    description: string,
    metadata?: Record<string, any>
  ) => {
    const actorName = currentUser ? currentUser.name : 'System Administrator';
    const actorEmail = currentUser?.email || 'admin@rwandacarhub.com';
    const actorRole = currentUser?.role === 'admin' ? 'Administrator' : currentUser ? 'User' : 'System';
    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      category,
      title,
      description,
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
      actor: {
        name: actorName,
        email: actorEmail,
        role: actorRole
      },
      metadata
    };
    setActivityLogs((prev) => [newLog, ...prev]);
    saveActivityLogToCloud(newLog).catch(console.error);
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSelectUser = (acc: UserAccount | null) => {
    setCurrentUser(acc);
    if (acc) {
      const badge = acc.role === 'admin' ? 'Website Admin' : acc.status === 'approved' ? 'Approved Member' : 'Pending Approval';
      showToast(`Switched account to: ${acc.name} (${badge})`);
      if (acc.role === 'admin' || acc.status === 'approved') {
        setCurrentTab('dashboard');
      }
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
    saveAccountToCloud(newAcc).catch(console.error);
    logActivity(
      'account_registered',
      'accounts',
      `Account Registered: ${newAcc.name}`,
      `New ${newAcc.accountType} account registered (${newAcc.email}). Awaiting administrator approval.`,
      { userId: newAcc.id, userName: newAcc.name, email: newAcc.email, accountType: newAcc.accountType }
    );
    setCurrentUser(newAcc);
    showToast(`Account registered for ${newAcc.name}! Status: Pending Approval. Website admin must approve before dashboard is visible.`);
  };

  const handleApproveAccount = (userId: string) => {
    let approvedAcc: UserAccount | null = null;
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === userId) {
          approvedAcc = { ...acc, status: 'approved' as const, approvalNotes: 'Verified and approved by admin' };
          return approvedAcc;
        }
        return acc;
      })
    );
    if (approvedAcc) {
      saveAccountToCloud(approvedAcc).catch(console.error);
      logActivity(
        'account_approval',
        'accounts',
        `Account Approved: ${(approvedAcc as UserAccount).name}`,
        `Account status changed to "approved". User can now access member dashboard and post listings.`,
        { userId, userName: (approvedAcc as UserAccount).name, status: 'approved' }
      );
    }
    setCurrentUser((prev) => (prev && prev.id === userId ? { ...prev, status: 'approved' } : prev));
    showToast('Account successfully approved! Dashboard access is now enabled.');
  };

  const handleRejectAccount = (userId: string) => {
    let rejectedAcc: UserAccount | null = null;
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === userId) {
          rejectedAcc = { ...acc, status: 'rejected' as const, approvalNotes: 'Declined by admin' };
          return rejectedAcc;
        }
        return acc;
      })
    );
    if (rejectedAcc) {
      saveAccountToCloud(rejectedAcc).catch(console.error);
      logActivity(
        'account_approval',
        'accounts',
        `Account Declined: ${(rejectedAcc as UserAccount).name}`,
        `Account registration was declined by the administrator.`,
        { userId, userName: (rejectedAcc as UserAccount).name, status: 'rejected' }
      );
    }
    setCurrentUser((prev) => (prev && prev.id === userId ? { ...prev, status: 'rejected' } : prev));
    showToast('Account registration declined.');
  };

  // Partner Advertisements & Sliding Space State (Admin manageable, persisted)
  const [partnerAds, setPartnerAds] = useState<PartnerAd[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return PARTNER_ADS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(partnerAds));
    } catch (e) {}
  }, [partnerAds]);

  const handleApproveAd = (adId: string) => {
    let approvedAd: PartnerAd | null = null;
    setPartnerAds((prev) =>
      prev.map((ad) => {
        if (ad.id === adId) {
          const updated = { ...ad, status: 'approved' as const };
          approvedAd = updated;
          savePartnerAdToCloud(updated).catch(console.error);
          return updated;
        }
        return ad;
      })
    );
    if (approvedAd) {
      logActivity(
        'ad_status',
        'adverts',
        `Partner Ad Approved: ${(approvedAd as PartnerAd).name}`,
        `Advertisement approved and featured in partner slider & public banner.`,
        { adId, adName: (approvedAd as PartnerAd).name, status: 'approved' }
      );
    }
    showToast('Advert approved! It is now actively featured in the partner slider & ticker.');
  };

  const handleRejectAd = (adId: string) => {
    let rejectedAd: PartnerAd | null = null;
    setPartnerAds((prev) =>
      prev.map((ad) => {
        if (ad.id === adId) {
          const updated = { ...ad, status: 'rejected' as const };
          rejectedAd = updated;
          savePartnerAdToCloud(updated).catch(console.error);
          return updated;
        }
        return ad;
      })
    );
    if (rejectedAd) {
      logActivity(
        'ad_status',
        'adverts',
        `Partner Ad Rejected: ${(rejectedAd as PartnerAd).name}`,
        `Advertisement rejected and hidden from public display.`,
        { adId, adName: (rejectedAd as PartnerAd).name, status: 'rejected' }
      );
    }
    showToast('Advert rejected and hidden from public view.');
  };

  const handleDiminishAd = (adId: string) => {
    let diminishedAd: PartnerAd | null = null;
    setPartnerAds((prev) =>
      prev.map((ad) => {
        if (ad.id === adId) {
          const updated = { ...ad, status: 'diminished' as const, displayWeight: 1 };
          diminishedAd = updated;
          savePartnerAdToCloud(updated).catch(console.error);
          return updated;
        }
        return ad;
      })
    );
    if (diminishedAd) {
      logActivity(
        'ad_status',
        'adverts',
        `Partner Ad Diminished: ${(diminishedAd as PartnerAd).name}`,
        `Display frequency lowered to 1x (rare appearance in partner carousel).`,
        { adId, adName: (diminishedAd as PartnerAd).name, status: 'diminished', weight: 1 }
      );
    }
    showToast('Advert diminished. Display frequency lowered to 1x (rare appearance).');
  };

  const handleRemoveAd = (adId: string) => {
    const adToRemove = partnerAds.find((ad) => ad.id === adId);
    setPartnerAds((prev) => prev.filter((ad) => ad.id !== adId));
    deletePartnerAdFromCloud(adId).catch(console.error);
    logActivity(
      'ad_removed',
      'adverts',
      `Partner Ad Deleted: ${adToRemove?.name || adId}`,
      `Advertisement was permanently deleted from RwandaCarHub.`,
      { adId, adName: adToRemove?.name }
    );
    showToast('Advert removed completely from RwandaCarHub.');
  };

  const handleUpdateAdWeight = (adId: string, weight: number) => {
    let updatedAdObj: PartnerAd | null = null;
    setPartnerAds((prev) =>
      prev.map((ad) => {
        if (ad.id === adId) {
          const updated = {
            ...ad,
            displayWeight: weight,
            status: ad.status === 'diminished' && weight > 1 ? ('approved' as const) : ad.status
          };
          updatedAdObj = updated;
          savePartnerAdToCloud(updated).catch(console.error);
          return updated;
        }
        return ad;
      })
    );
    if (updatedAdObj) {
      logActivity(
        'ad_status',
        'adverts',
        `Ad Weight Updated: ${(updatedAdObj as PartnerAd).name} (${weight}x)`,
        `Display frequency set to ${weight}x.`,
        { adId, adName: (updatedAdObj as PartnerAd).name, weight }
      );
    }
    const label = weight === 5 ? '5x (VIP Top Frequency)' : weight === 3 ? '3x (High)' : weight === 2 ? '2x (Normal)' : '1x (Rare)';
    showToast(`Advert frequency set to ${label}.`);
  };

  const handleUpdateAdExpiry = (adId: string, expiryDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    let updatedAdObj: PartnerAd | null = null;
    setPartnerAds((prev) =>
      prev.map((ad) => {
        if (ad.id === adId) {
          const isExpired = expiryDate < today;
          const updated = {
            ...ad,
            expiryDate,
            status: isExpired ? ('expired' as const) : ad.status === 'expired' ? ('approved' as const) : ad.status
          };
          updatedAdObj = updated;
          savePartnerAdToCloud(updated).catch(console.error);
          return updated;
        }
        return ad;
      })
    );
    if (updatedAdObj) {
      logActivity(
        'ad_status',
        'adverts',
        `Ad Expiry Updated: ${(updatedAdObj as PartnerAd).name}`,
        `Expiration date updated to ${expiryDate}.`,
        { adId, adName: (updatedAdObj as PartnerAd).name, expiryDate }
      );
    }
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
    savePartnerAdToCloud(savedAd).catch(console.error);
    logActivity(
      'ad_status',
      'adverts',
      `Partner Ad Saved: ${savedAd.name}`,
      `Banner campaign "${savedAd.headline}" saved by admin.`,
      { adId: savedAd.id, adName: savedAd.name }
    );
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
    savePartnerAdToCloud(pendingAd).catch(console.error);
    logActivity(
      'ad_added',
      'adverts',
      `New Ad Inquiry: ${inquiry.companyName}`,
      `New advertising campaign inquiry received for "${inquiry.adType}". Status: pending approval.`,
      { adId: pendingAd.id, companyName: inquiry.companyName, adType: inquiry.adType, phone: inquiry.phone }
    );
    showToast(`Advertising inquiry received from ${inquiry.companyName}! Added to Admin Adverts for review.`);
  };
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
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
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
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
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {}
  }, [bookings]);

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

  // Cloud Firestore Real-time Listeners and Offline Resilience
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);

  useEffect(() => {
    // Test connectivity to Cloud Firestore & guarantee inventory
    testFirestoreConnection().then((connected) => {
      setIsCloudConnected(connected);
      if (connected) {
        seedInitialVehiclesIfEmpty();
        // Rescue and permanently save any user cars from localStorage to Firestore
        try {
          const savedListings = localStorage.getItem(STORAGE_KEYS.USER_LISTINGS);
          if (savedListings) {
            const parsed = JSON.parse(savedListings);
            if (Array.isArray(parsed)) {
              for (const car of parsed) {
                if (car && car.id && (car.id.startsWith('user-car-') || car.id.startsWith('veh-user'))) {
                  saveVehicleToCloud(car).catch(console.warn);
                }
              }
            }
          }
        } catch (e) {
          console.warn('Local vehicle migration error:', e);
        }
      }
    });

    // Subscribe to real-time vehicle updates from Google Cloud Firestore
    const unsubscribeVehicles = subscribeToVehicles(
      (cloudVehicles) => {
        if (cloudVehicles && cloudVehicles.length > 0) {
          setVehicles(cloudVehicles);
          setIsCloudConnected(true);
        }
      },
      (err) => {
        console.warn('Real-time vehicle sync failed, using cached inventory:', err);
        setIsCloudConnected(false);
      }
    );

    // Subscribe to real-time bookings
    const unsubscribeBookings = subscribeToBookings((cloudBookings) => {
      if (cloudBookings && cloudBookings.length > 0) {
        setBookings(cloudBookings);
      }
    });

    // Subscribe to real-time contact messages & inquiries
    const unsubscribeMessages = subscribeToMessages((cloudMessages) => {
      if (cloudMessages && cloudMessages.length > 0) {
        setMessages(cloudMessages);
      }
    });

    // Subscribe to real-time partner ads
    const unsubscribeAds = subscribeToPartnerAds((cloudAds) => {
      if (cloudAds && cloudAds.length > 0) {
        setPartnerAds(cloudAds);
      }
    });

    // Subscribe to real-time user accounts
    const unsubscribeAccounts = subscribeToAccounts((cloudAccounts) => {
      if (cloudAccounts && cloudAccounts.length > 0) {
        setAccounts(cloudAccounts);
      }
    });

    // Subscribe to real-time activity and audit logs
    const unsubscribeActivityLogs = subscribeToActivityLogs((cloudLogs) => {
      if (cloudLogs && cloudLogs.length > 0) {
        setActivityLogs(cloudLogs);
      }
    });

    return () => {
      unsubscribeVehicles();
      unsubscribeBookings();
      unsubscribeMessages();
      unsubscribeAds();
      unsubscribeAccounts();
      unsubscribeActivityLogs();
    };
  }, []);

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

  // Add new car handler (from PostCarModal) - Permanently saved to Google Cloud Firestore
  const handleAddCar = (newCar: Vehicle) => {
    // 1. Optimistic local update
    setVehicles((prev) => [newCar, ...prev]);
    setUserListings((prev) => [newCar, ...prev]);

    // 2. Permanent Cloud Firestore persistence
    saveVehicleToCloud(newCar)
      .then(() => {
        showToast(`Car post saved permanently to Google Cloud! All visitors can now view it.`);
      })
      .catch((err) => {
        console.error('Failed to sync car to cloud database:', err);
        showToast('Car saved locally. Will sync to Cloud Firestore when reconnected.');
      });

    // 3. Log activity event to Admin Activity Tracker
    const carName = `${newCar.year} ${newCar.make} ${newCar.model}`;
    logActivity(
      'vehicle_added',
      'vehicles',
      `New Listing Added: ${carName}`,
      `Vehicle "${carName}" posted for ${newCar.purpose === 'rent' ? `${newCar.priceRwf.toLocaleString()} Frw/day` : `${newCar.priceRwf.toLocaleString()} Frw`} in ${newCar.location}.`,
      {
        vehicleId: newCar.id,
        vehicleTitle: carName,
        price: newCar.priceRwf,
        purpose: newCar.purpose,
        seller: newCar.seller.name
      }
    );
  };

  // Delete listing handler - Deleted from Google Cloud Firestore
  const handleDeleteListing = (id: string) => {
    const targetCar = vehicles.find((c) => c.id === id);
    const carName = targetCar ? `${targetCar.year} ${targetCar.make} ${targetCar.model}` : id;
    setVehicles((prev) => prev.filter((c) => c.id !== id));
    setUserListings((prev) => prev.filter((c) => c.id !== id));
    deleteVehicleFromCloud(id).catch(console.error);

    // Log deletion event
    logActivity(
      'vehicle_deleted',
      'vehicles',
      `Listing Removed: ${carName}`,
      `Vehicle listing was permanently deleted from the marketplace inventory.`,
      {
        vehicleId: id,
        vehicleTitle: carName
      }
    );
    showToast('Vehicle removed from cloud database.');
  };

  // Update vehicle status handler (available, sold, rented, leased) - Synced to Firestore
  const handleUpdateVehicleStatus = (vehicleId: string, newStatus: VehicleStatus) => {
    const targetCar = vehicles.find((v) => v.id === vehicleId);
    const carName = targetCar ? `${targetCar.year} ${targetCar.make} ${targetCar.model}` : vehicleId;
    const previousStatus = targetCar?.status || 'available';

    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, status: newStatus } : v))
    );
    setUserListings((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, status: newStatus } : v))
    );
    setSelectedVehicle((prev) =>
      prev && prev.id === vehicleId ? { ...prev, status: newStatus } : prev
    );

    updateVehicleStatusInCloud(vehicleId, newStatus).catch(console.error);

    // Log status change event
    logActivity(
      'vehicle_status',
      'vehicles',
      `Vehicle Status Changed to ${newStatus.toUpperCase()}`,
      `Listing "${carName}" status updated from ${previousStatus} to ${newStatus}.`,
      {
        vehicleId,
        vehicleTitle: carName,
        previousStatus,
        newStatus
      }
    );

    const statusLabels: Record<VehicleStatus, string> = {
      available: 'marked as Available in stock',
      sold: 'marked as Sold (Yagurishijwe)',
      rented: 'marked as Rented out',
      leased: 'marked as Leased'
    };

    showToast(`Vehicle status ${statusLabels[newStatus] || newStatus}.`);
  };

  // Booking submit handler (from CarDetailsModal) - Synced to Firestore
  const handleCreateBooking = (bookingData: Omit<Booking, 'id' | 'status'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      status: 'Confirmed'
    };
    setBookings((prev) => [newBooking, ...prev]);
    saveBookingToCloud(newBooking).catch(console.error);
  };

  // Inquiry message handler - Synced to Firestore
  const handleSendMessage = (msgData: Omit<ContactMessage, 'id' | 'timestamp' | 'read'>) => {
    const newMsg: ContactMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      timestamp: 'Just now',
      read: true
    };
    setMessages((prev) => [newMsg, ...prev]);
    saveMessageToCloud(newMsg).catch(console.error);
  };

  // Send reply from dashboard - Synced to Firestore
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
    saveMessageToCloud(replyMsg).catch(console.error);
  };

  // Favorite vehicles objects
  const favoriteVehicles = useMemo(() => {
    return vehicles.filter((c) => favoriteIds.includes(c.id));
  }, [vehicles, favoriteIds]);

  // Compare vehicles objects
  const compareVehicles = useMemo(() => {
    return vehicles.filter((c) => compareIds.includes(c.id));
  }, [vehicles, compareIds]);

  // Combine locally tracked user listings with any cloud cars created by user
  const effectiveUserListings = useMemo(() => {
    const listMap = new Map<string, Vehicle>();
    for (const car of userListings) {
      if (car && car.id) listMap.set(car.id, car);
    }
    for (const car of vehicles) {
      if (!car || !car.id) continue;
      const isUserCar = car.id.startsWith('user-car-') || car.id.startsWith('veh-user');
      const matchesEmail = Boolean(
        currentUser?.email && car.seller?.email && car.seller.email.toLowerCase() === currentUser.email.toLowerCase()
      );
      const matchesPhone = Boolean(
        currentUser?.phone && car.seller?.phone && car.seller.phone === currentUser.phone
      );
      if (isUserCar || matchesEmail || matchesPhone) {
        listMap.set(car.id, car);
      }
    }
    return Array.from(listMap.values());
  }, [userListings, vehicles, currentUser]);

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

  // Filtered vehicles calculation with defensive null-safety
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((car) => {
      if (!car) return false;

      // Purpose filter
      if (filters.purpose && filters.purpose !== 'all' && car.purpose !== filters.purpose) {
        return false;
      }
      // Make filter
      if (filters.make && car.make && car.make.toLowerCase() !== filters.make.toLowerCase()) {
        return false;
      }
      // Body type filter
      if (filters.bodyType && car.bodyType && car.bodyType.toLowerCase() !== filters.bodyType.toLowerCase()) {
        return false;
      }
      // Fuel type filter
      if (filters.fuelType && car.fuelType && car.fuelType.toLowerCase() !== filters.fuelType.toLowerCase()) {
        return false;
      }
      // Transmission filter
      if (filters.transmission && car.transmission && car.transmission.toLowerCase() !== filters.transmission.toLowerCase()) {
        return false;
      }
      // Condition filter
      if (filters.condition && car.condition && car.condition.toLowerCase() !== filters.condition.toLowerCase()) {
        return false;
      }
      // Location filter
      if (filters.location && car.location && !car.location.toLowerCase().includes(filters.location.toLowerCase())) {
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
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesMake = (car.make || '').toLowerCase().includes(query);
        const matchesModel = (car.model || '').toLowerCase().includes(query);
        const matchesLoc = (car.location || '').toLowerCase().includes(query);
        const sellerName = car.seller?.name || '';
        const dealerName = car.seller?.dealerName || '';
        const matchesSeller = (sellerName + ' ' + dealerName).toLowerCase().includes(query);
        const matchesFeature = Array.isArray(car.features) && car.features.some((f) => (f || '').toLowerCase().includes(query));
        if (!matchesMake && !matchesModel && !matchesLoc && !matchesSeller && !matchesFeature) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.priceRwf || 0;
      const priceB = b.priceRwf || 0;
      const yearA = a.year || 0;
      const yearB = b.year || 0;
      const mileageA = a.mileageKm || 0;
      const mileageB = b.mileageKm || 0;

      if (filters.sortBy === 'price-asc') return priceA - priceB;
      if (filters.sortBy === 'price-desc') return priceB - priceA;
      if (filters.sortBy === 'year-desc') return yearB - yearA;
      if (filters.sortBy === 'mileage-asc') return mileageA - mileageB;
      // Default: featured first
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [vehicles, filters]);

  // Featured cars for Home showcase
  const featuredCars = useMemo(() => {
    return vehicles.filter(c => c.isFeatured).slice(0, 4);
  }, [vehicles]);

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
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
        isCloudConnected={isCloudConnected}
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
            {/* MOVING & SLIDING ADVERTS AND PARTNER LINKS SPACE */}
            <PartnersAdBanner 
              partnerAds={partnerAds} 
              onNavigateContact={() => handleTabSelect('contact')} 
              onAdInquirySubmitted={handleAdInquirySubmitted}
            />

            {/* HERO SECTION */}
            <div className="pt-1 sm:pt-2 px-3 sm:px-6 max-w-7xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] border border-slate-800/90 shadow-2xl bg-[#0d1322] py-8 sm:py-14 lg:py-18 px-4 sm:px-8 lg:px-12">
                
                {/* VEHICLE PICTURE BEHIND HERO BACKGROUND */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <img
                    src={heroVehicleImage}
                    alt="RwandaCarHub Showcase Vehicle"
                    className="w-full h-full object-cover object-center scale-105 opacity-40 sm:opacity-50 transition-all duration-1000 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1d] via-[#0a0f1d]/90 to-[#0a0f1d]/60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/60 to-transparent" />
                </div>

                {/* Subtle blue ambient glow */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-6 sm:space-y-8">
                  <div className="max-w-3xl space-y-3 sm:space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-xs font-semibold text-blue-300">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <span>Certified Automotive Marketplace · Kigali, Rwanda</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-['Outfit',sans-serif] tracking-tight leading-[1.1]">
                      Buy, Sell, Rent & Lease Cars in <span className="text-blue-500">Rwanda</span>
                    </h1>

                    <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                      Discover verified vehicles from certified Kigali dealerships and trusted private sellers. Complete with inspection reports and transparent pricing.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setIsPostCarOpen(true)}
                        className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-950 transition-all active:scale-95"
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
                  className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-blue-500/60 cursor-pointer transition-all hover:-translate-y-0.5 space-y-2 group shadow-lg"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/15 text-blue-400 flex items-center justify-center border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Car className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white font-['Outfit',sans-serif]">Buy Certified Cars</h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-1">Verified Japanese & European stock</p>
                </div>

                <div 
                  onClick={() => handleTabSelect('sell')}
                  className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-blue-500/60 cursor-pointer transition-all hover:-translate-y-0.5 space-y-2 group shadow-lg"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/15 text-blue-400 flex items-center justify-center border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white font-['Outfit',sans-serif]">Sell Your Car</h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-1">Direct buyer contacts in Kigali</p>
                </div>

                <div 
                  onClick={() => handleTabSelect('rent')}
                  className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-blue-500/60 cursor-pointer transition-all hover:-translate-y-0.5 space-y-2 group shadow-lg"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/15 text-blue-400 flex items-center justify-center border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white font-['Outfit',sans-serif]">Rent 4x4 Vehicles</h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-1">Prado & Land Cruisers for travel</p>
                </div>

                <div 
                  onClick={() => handleTabSelect('services')}
                  className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-blue-500/60 cursor-pointer transition-all hover:-translate-y-0.5 space-y-2 group shadow-lg"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/15 text-blue-400 flex items-center justify-center border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white font-['Outfit',sans-serif]">Car Valuation & Check</h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-1">Instant valuation & 150-point inspection</p>
                </div>
              </div>
            </div>

            {/* UNIFIED CLEAR VEHICLES MARKETPLACE SECTION */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
                    Available Vehicles in Rwanda
                  </h2>
                  <p className="text-xs text-slate-400">
                    Showing {filteredVehicles.length} verified vehicle{filteredVehicles.length > 1 ? 's' : ''} ready in Kigali
                  </p>
                </div>

                {/* Filter tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, purpose: 'all' }))}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      filters.purpose === 'all'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    All ({vehicles.length})
                  </button>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, purpose: 'buy' }))}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      filters.purpose === 'buy'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, purpose: 'rent' }))}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      filters.purpose === 'rent'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    Rent
                  </button>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, purpose: 'lease' }))}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      filters.purpose === 'lease'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    Lease
                  </button>
                </div>
              </div>

              {filteredVehicles.length === 0 ? (
                <div className="p-12 text-center bg-[#0f172a] rounded-2xl border border-slate-800 space-y-3 shadow-md">
                  <Car className="w-12 h-12 text-blue-500 mx-auto" />
                  <h4 className="text-base font-bold text-white">No vehicles match your selected filters.</h4>
                  <p className="text-xs text-slate-400">
                    Try clearing or widening your search criteria to find more cars.
                  </p>
                  <button
                    onClick={() => setFilters(initialFilters)}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-500 transition-colors"
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

            {/* SELLER CALLOUT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="bg-[#0f172a] rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-1.5 text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-white font-['Outfit',sans-serif]">
                    Want to Sell or Rent Your Car in Kigali?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                    Post your vehicle in minutes and connect directly with verified buyers and renters. Affordable listing packages starting from 5,000 Frw.
                  </p>
                </div>

                <button
                  onClick={() => setIsPostCarOpen(true)}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-lg shadow-blue-950 transition-all shrink-0"
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-xs font-semibold text-blue-300">
                {currentTab === 'buy' ? '🚗 For Sale in Rwanda' : currentTab === 'rent' ? '🔑 Rental & Safari Fleet' : '📄 Corporate & Long-term Lease'}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit',sans-serif]">
                {currentTab === 'buy' && 'Buy Certified Vehicles in Kigali'}
                {currentTab === 'rent' && 'Car Hire & Safari 4x4 Rental in Rwanda'}
                {currentTab === 'lease' && 'Long-term Corporate Vehicle Leasing'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-3xl font-medium">
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
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Showing <strong>{filteredVehicles.length}</strong> available listings</span>
                <span>Watermark Protection: <strong>www.rwandacarhub.com</strong></span>
              </div>

              {filteredVehicles.length === 0 ? (
                <div className="p-12 text-center bg-[#0f172a] rounded-2xl border border-slate-800 space-y-3 shadow-md">
                  <Car className="w-12 h-12 text-blue-500 mx-auto" />
                  <h4 className="text-base font-bold text-white">No cars found matching this criteria.</h4>
                  <button
                    onClick={() => setFilters(initialFilters)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors"
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
            <div className="bg-[#0f172a] rounded-3xl p-8 sm:p-14 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-2xl space-y-4">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  RwandaCarHub Seller Center
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit',sans-serif]">
                  Sell Your Car in Rwanda Faster than Ever
                </h1>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Join hundreds of individual car owners and verified Kigali dealerships. List your car with our official watermark protection, direct WhatsApp buyer connections, and Mobile Money (MoMo) payments.
                </p>
                <button
                  onClick={() => setIsPostCarOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-blue-950 transition-all active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Start Listing Now</span>
                </button>
              </div>

              <div className="w-full md:w-80 p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white">Why Sellers Choose Us</h4>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Free Plan for Account Holders (2 cars/day)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>5,000 Frw/day for 5 cars (Starter)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>15,000 Frw/week for 30 cars (Pro)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>35,000 Frw/month for 50 cars (Fleet)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Watermark www.rwandacarhub.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PRICING PACKAGES DETAIL */}
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <h3 className="text-2xl font-bold text-white font-['Outfit',sans-serif]">
                  Choose Your Listing Plan
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">
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
                          ? 'bg-[#0f172a] border-blue-500 shadow-2xl shadow-blue-950/50'
                          : isFree
                          ? 'bg-[#0f172a] border-slate-700 shadow-lg'
                          : 'bg-[#0f172a] border-slate-800'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                          Most Popular
                        </div>
                      )}
                      {isFree && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-800 text-blue-400 border border-slate-700 text-[10px] font-bold uppercase tracking-wider shadow whitespace-nowrap">
                          Account Holders (2 Cars/Day)
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif]">{plan.name}</h4>
                          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold">
                            Up to {plan.carLimit} Cars
                          </span>
                        </div>

                        <div>
                          <div className={`text-3xl font-black font-['Outfit',sans-serif] ${isFree ? 'text-blue-400' : 'text-white'}`}>
                            {isFree ? '0 Frw' : `${plan.priceFrw.toLocaleString()} Frw`}
                          </div>
                          <span className="text-xs font-bold text-slate-400">
                            {plan.duration}
                          </span>
                        </div>

                        {isFree && (
                          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                            {currentUser ? (
                              <span>✓ Available for your account ({currentUser.name})</span>
                            ) : (
                              <span>⚠️ Sign in or register to activate your 2 free cars/day</span>
                            )}
                          </div>
                        )}

                        <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4">
                          {plan.features.map((feat, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
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
                          plan.popular || isFree
                            ? 'bg-blue-600 hover:bg-blue-500'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-100'
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
            userListings={effectiveUserListings}
            messages={messages}
            bookings={bookings}
            currency={currency}
            currentUser={currentUser}
            accounts={accounts}
            allVehicles={vehicles}
            partnerAds={partnerAds}
            activityLogs={activityLogs}
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
        onLogin={handleSelectUser}
        onSelectUser={handleSelectUser}
        onLogout={() => handleSelectUser(null)}
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
