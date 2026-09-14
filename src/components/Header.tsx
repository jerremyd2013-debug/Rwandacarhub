import React, { useState, useRef, useEffect } from 'react';
import { 
  Car, 
  ChevronDown, 
  ShoppingBag, 
  Tag, 
  Key, 
  FileText, 
  User, 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  Menu, 
  X, 
  LogIn,
  Layers,
  Sparkles,
  MapPin,
  Phone,
  MessageSquare
} from 'lucide-react';
import { VehiclePurpose, UserAccount } from '../types';

interface HeaderProps {
  currentTab: string;
  onNavigate?: (tab: string, filterPurpose?: VehiclePurpose) => void;
  onSelectTab?: (tab: string, filterPurpose?: VehiclePurpose) => void;
  currency: 'RWF' | 'USD';
  onToggleCurrency: () => void;
  currentUser: UserAccount | null;
  onOpenAuthModal: () => void;
  pendingApprovalsCount?: number;
  // Optional backwards compatibility props
  favoritesCount?: number;
  compareCount?: number;
  onOpenCompare?: () => void;
  onOpenPostCar?: () => void;
  onOpenSearch?: () => void;
  onOpenCodeGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onSelectTab,
  currency,
  onToggleCurrency,
  currentUser,
  onOpenAuthModal,
  pendingApprovalsCount = 0
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [carsDropdownOpen, setCarsDropdownOpen] = useState(false);
  const [mobileBarCarsOpen, setMobileBarCarsOpen] = useState(false);
  const [mobileCarsExpanded, setMobileCarsExpanded] = useState(true);
  
  const carsMenuRef = useRef<HTMLDivElement>(null);
  const mobileBarRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (carsMenuRef.current && !carsMenuRef.current.contains(event.target as Node)) {
        setCarsDropdownOpen(false);
      }
      if (mobileBarRef.current && !mobileBarRef.current.contains(event.target as Node)) {
        setMobileBarCarsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isCarsActive = ['buy', 'sell', 'rent', 'lease'].includes(currentTab);

  // CRITICAL RULE:
  // "and dashboard appear for only Admin of the website and those people who have opened accounts that have been approved by the admin of the website."
  const isDashboardAllowed = Boolean(
    currentUser && (currentUser.role === 'admin' || currentUser.status === 'approved')
  );

  const handleNavClick = (tab: string, purpose?: VehiclePurpose) => {
    const navFn = onNavigate || onSelectTab;
    if (navFn) {
      navFn(tab, purpose);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a291f]/92 backdrop-blur-md border-b border-emerald-800/40 transition-all shadow-md shadow-black/30">
      {/* TOP NOTIFICATION & ROLE SIMULATION BAR */}
      <div className="bg-[#071f18]/92 border-b border-emerald-900/50 text-xs text-emerald-100/90 py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Top Header Left: Brand info & Contact Details */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap text-neutral-300 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="font-bold text-white">RwandaCarHub:</span>
              <span className="text-neutral-300">Kigali Verified Vehicle Marketplace</span>
            </div>
            <span className="text-neutral-600 hidden sm:inline">|</span>
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              <span className="flex items-center gap-1 text-white font-medium whitespace-nowrap">
                <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                KK 713 St
              </span>
              <span className="text-neutral-600 hidden md:inline">•</span>
              <a 
                href="tel:+250788225193"
                className="flex items-center gap-1 text-neutral-200 hover:text-white font-medium whitespace-nowrap transition-colors"
                title="Call RwandaCarHub (+250 788 225 193)"
              >
                <Phone className="w-3 h-3 text-red-500 shrink-0" />
                +250 788 225 193
              </a>
              <span className="text-neutral-600 hidden md:inline">•</span>
              <a 
                href="https://wa.me/250738225193"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold whitespace-nowrap transition-colors"
                title="WhatsApp RwandaCarHub (+250 738 225 193)"
              >
                <MessageSquare className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>WhatsApp: +250 738 225 193</span>
              </a>
            </div>
          </div>

          {/* Quick Role & Currency Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Currency switch */}
            <button
              id="currency-toggle-btn"
              onClick={onToggleCurrency}
              className="px-2 py-0.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs border border-neutral-700 flex items-center gap-1 transition-colors"
              title="Toggle RWF / USD"
            >
              <span>Currency:</span>
              <span className="text-red-400 font-bold">{currency}</span>
            </button>

            {/* Quick Persona Status Pill */}
            <button
              onClick={onOpenAuthModal}
              className="px-2 py-0.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 text-xs flex items-center gap-1.5 transition-all font-medium"
              title="Click to switch between Admin, Approved User, and Guest accounts"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              {currentUser ? (
                currentUser.role === 'admin' ? (
                  <span className="text-red-400 font-bold">Admin Active</span>
                ) : currentUser.status === 'approved' ? (
                  <span className="text-emerald-400 font-bold">Approved User</span>
                ) : (
                  <span className="text-amber-400 font-bold">Pending Approval</span>
                )
              ) : (
                <span className="text-neutral-400">Guest Mode</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR - RESUMED IN: HOME, CARS, DEALERS, CARS SERVICES, CONTACT, (DASHBOARD IF AUTHORIZED), AND LOGIN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* BRAND LOGO */}
          <button 
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-700 to-red-950 flex items-center justify-center border border-red-600/50 shadow-lg shadow-red-950/60 group-hover:border-red-500 transition-all">
              <Car className="w-6 h-6 text-white transform group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-['Outfit',sans-serif]">
                  RWANDA<span className="text-red-500">CAR</span>HUB
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-neutral-800 text-red-400 border border-red-900/60 tracking-wider">
                  KIGALI
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-yellow-400 font-bold tracking-wide -mt-0.5 block drop-shadow-sm">
                Rwanda's Trusted Car Market Place
              </p>
            </div>
          </button>

          {/* MAIN DESKTOP NAVIGATION BAR */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {/* 1. Home */}
            <button
              id="nav-home"
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'home' 
                  ? 'text-white bg-red-950/80 border border-red-800 text-red-300 shadow-sm' 
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
              }`}
            >
              Home
            </button>

            {/* 2. Cars (Dropdown with Subtitles: Buy Cars, Sell Cars, Rent Cars, Lease Cars) */}
            <div 
              className="relative" 
              ref={carsMenuRef}
              onMouseEnter={() => setCarsDropdownOpen(true)}
              onMouseLeave={() => setCarsDropdownOpen(false)}
            >
              <button
                id="nav-cars-trigger"
                onClick={() => setCarsDropdownOpen((prev) => !prev)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  isCarsActive 
                    ? 'text-white bg-red-950/80 border border-red-800 text-red-300 shadow-sm' 
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                }`}
                aria-expanded={carsDropdownOpen}
                aria-haspopup="true"
              >
                <Car className="w-4 h-4 text-red-500" />
                <span>Cars</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${carsDropdownOpen ? 'rotate-180 text-white' : 'text-neutral-400'}`} />
              </button>

              {/* Subtitles Dropdown */}
              {carsDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-72 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-800/80 mb-1 flex items-center justify-between">
                    <span>Cars in Rwanda</span>
                    <span className="text-red-400 font-semibold text-[10px]">Verified Kigali</span>
                  </div>

                  {/* Subtitle 1: Buy Cars */}
                  <button
                    id="nav-sub-buy"
                    onClick={() => {
                      handleNavClick('buy', 'buy');
                      setCarsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-3 group ${
                      currentTab === 'buy'
                        ? 'bg-red-950/80 border border-red-800 text-white'
                        : 'hover:bg-neutral-900 text-neutral-200 border border-transparent'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 group-hover:border-red-600/50 flex items-center justify-center shrink-0 mt-0.5">
                      <ShoppingBag className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-red-300 transition-colors flex items-center gap-1.5">
                        <span>Buy Cars</span>
                        {currentTab === 'buy' && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                        SUVs, Sedans & Hybrid vehicles for sale
                      </p>
                    </div>
                  </button>

                  {/* Subtitle 2: Sell Cars */}
                  <button
                    id="nav-sub-sell"
                    onClick={() => {
                      handleNavClick('sell');
                      setCarsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-3 group ${
                      currentTab === 'sell'
                        ? 'bg-red-950/80 border border-red-800 text-white'
                        : 'hover:bg-neutral-900 text-neutral-200 border border-transparent'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 group-hover:border-emerald-600/50 flex items-center justify-center shrink-0 mt-0.5">
                      <Tag className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                        <span>Sell Cars</span>
                        {currentTab === 'sell' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                        Post listings & choose MoMo plans
                      </p>
                    </div>
                  </button>

                  {/* Subtitle 3: Rent Cars */}
                  <button
                    id="nav-sub-rent"
                    onClick={() => {
                      handleNavClick('rent', 'rent');
                      setCarsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-3 group ${
                      currentTab === 'rent'
                        ? 'bg-red-950/80 border border-red-800 text-white'
                        : 'hover:bg-neutral-900 text-neutral-200 border border-transparent'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 group-hover:border-amber-600/50 flex items-center justify-center shrink-0 mt-0.5">
                      <Key className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                        <span>Rent Cars</span>
                        {currentTab === 'rent' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                        Self-drive & Safari 4x4 car hire in Kigali
                      </p>
                    </div>
                  </button>

                  {/* Subtitle 4: Lease Cars */}
                  <button
                    id="nav-sub-lease"
                    onClick={() => {
                      handleNavClick('lease', 'lease');
                      setCarsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-3 group ${
                      currentTab === 'lease'
                        ? 'bg-red-950/80 border border-red-800 text-white'
                        : 'hover:bg-neutral-900 text-neutral-200 border border-transparent'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 group-hover:border-blue-600/50 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
                        <span>Lease Cars</span>
                        {currentTab === 'lease' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                        Corporate & NGO long-term vehicle fleets
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Dealers */}
            <button
              id="nav-dealers"
              onClick={() => handleNavClick('dealers')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'dealers' 
                  ? 'text-white bg-red-950/80 border border-red-800 text-red-300 shadow-sm' 
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
              }`}
            >
              Dealers
            </button>

            {/* 4. Cars Services */}
            <button
              id="nav-services"
              onClick={() => handleNavClick('services')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'services' 
                  ? 'text-white bg-red-950/80 border border-red-800 text-red-300 shadow-sm' 
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
              }`}
            >
              Cars Services
            </button>

            {/* 5. Contact */}
            <button
              id="nav-contact"
              onClick={() => handleNavClick('contact')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'contact' 
                  ? 'text-white bg-red-950/80 border border-red-800 text-red-300 shadow-sm' 
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
              }`}
            >
              Contact
            </button>

            {/* 6. DASHBOARD - ONLY VISIBLE FOR ADMIN & APPROVED ACCOUNTS */}
            {isDashboardAllowed && (
              <button
                id="nav-dashboard"
                onClick={() => handleNavClick('dashboard')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  currentTab === 'dashboard' 
                    ? 'text-white bg-red-900 border border-red-600 shadow-lg shadow-red-950/80' 
                    : 'text-neutral-200 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700'
                }`}
              >
                <User className="w-4 h-4 text-red-400" />
                <span>Dashboard</span>
                {currentUser?.role === 'admin' ? (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-red-700 text-white tracking-wide">
                    ADMIN
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-700">
                    APPROVED
                  </span>
                )}
                {currentUser?.role === 'admin' && pendingApprovalsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 font-black text-[10px] flex items-center justify-center animate-pulse">
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>
            )}

            {/* 7. LOGIN BUTTON (ALWAYS CLEARLY LABELED AND ACCESSIBLE) */}
            <button
              id="nav-login-btn"
              onClick={onOpenAuthModal}
              className={`ml-1 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 ${
                currentUser
                  ? 'bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-100 shadow-md'
                  : 'bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-600 hover:to-red-700 text-white border border-red-600/70 shadow-lg shadow-red-950/80'
              }`}
              title={currentUser ? `Signed in as ${currentUser.name}. Click to switch or log out.` : 'Click to Login or Register'}
            >
              <LogIn className={`w-4 h-4 ${currentUser ? 'text-red-400' : 'text-white'}`} />
              <span>Login</span>
              {currentUser && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {currentUser.role === 'admin' ? 'Admin' : currentUser.name.split(' ')[0]}
                </span>
              )}
            </button>
          </nav>

          {/* MOBILE HAMBURGER TOGGLE BUTTON & MOBILE LOGIN BUTTON */}
          <div className="flex md:hidden items-center gap-2">
            {/* Quick Login button on mobile */}
            <button
              id="mobile-header-login-btn"
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 border border-red-600/60 text-white flex items-center gap-1.5 text-xs font-bold shadow-md active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5 text-white" />
              <span>Login</span>
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* PERSISTENT MOBILE NAVIGATION BAR STRIP (Home, Cars, Dealers, Cars Services, Contact, [Dashboard], Login) */}
      <div className="md:hidden border-t border-neutral-800/80 bg-neutral-900/95 backdrop-blur-md px-3 py-2 shadow-inner">
        <nav className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5 text-xs font-medium">
          {/* 1. Home */}
          <button
            id="mobile-strip-home"
            onClick={() => handleNavClick('home')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              currentTab === 'home'
                ? 'bg-red-900/40 text-white font-bold border border-red-700/80 shadow-sm'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Home
          </button>

          {/* 2. Cars with Dropdown */}
          <div className="relative" ref={mobileBarRef}>
            <button
              id="mobile-strip-cars"
              onClick={() => setMobileBarCarsOpen((prev) => !prev)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 ${
                isCarsActive
                  ? 'bg-red-900/40 text-white font-bold border border-red-700/80 shadow-sm'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Car className="w-3.5 h-3.5 text-red-500" />
              <span>Cars</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${mobileBarCarsOpen ? 'rotate-180 text-white' : 'text-neutral-400'}`} />
            </button>

            {mobileBarCarsOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-60 rounded-xl bg-neutral-950 border border-neutral-800 shadow-2xl p-1.5 z-50 space-y-1 animate-in fade-in duration-150">
                <button
                  onClick={() => {
                    handleNavClick('buy', 'buy');
                    setMobileBarCarsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center gap-2 ${
                    currentTab === 'buy' ? 'bg-red-950 text-white font-bold border border-red-800' : 'text-neutral-200 hover:bg-neutral-900'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-red-400" />
                  <div>
                    <div className="font-semibold">Buy Cars</div>
                    <div className="text-[10px] text-neutral-400">Cars for sale</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    handleNavClick('sell');
                    setMobileBarCarsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center gap-2 ${
                    currentTab === 'sell' ? 'bg-red-950 text-white font-bold border border-red-800' : 'text-neutral-200 hover:bg-neutral-900'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  <div>
                    <div className="font-semibold">Sell Cars</div>
                    <div className="text-[10px] text-neutral-400">Post & pricing plans</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    handleNavClick('rent', 'rent');
                    setMobileBarCarsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center gap-2 ${
                    currentTab === 'rent' ? 'bg-red-950 text-white font-bold border border-red-800' : 'text-neutral-200 hover:bg-neutral-900'
                  }`}
                >
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <div>
                    <div className="font-semibold">Rent Cars</div>
                    <div className="text-[10px] text-neutral-400">Self-drive & Safari</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    handleNavClick('lease', 'lease');
                    setMobileBarCarsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center gap-2 ${
                    currentTab === 'lease' ? 'bg-red-950 text-white font-bold border border-red-800' : 'text-neutral-200 hover:bg-neutral-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <div>
                    <div className="font-semibold">Lease Cars</div>
                    <div className="text-[10px] text-neutral-400">Corporate fleet leases</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 3. Dealers */}
          <button
            id="mobile-strip-dealers"
            onClick={() => handleNavClick('dealers')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              currentTab === 'dealers'
                ? 'bg-red-900/40 text-white font-bold border border-red-700/80 shadow-sm'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Dealers
          </button>

          {/* 4. Cars Services */}
          <button
            id="mobile-strip-services"
            onClick={() => handleNavClick('services')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              currentTab === 'services'
                ? 'bg-red-900/40 text-white font-bold border border-red-700/80 shadow-sm'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Cars Services
          </button>

          {/* 5. Contact */}
          <button
            id="mobile-strip-contact"
            onClick={() => handleNavClick('contact')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              currentTab === 'contact'
                ? 'bg-red-900/40 text-white font-bold border border-red-700/80 shadow-sm'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Contact
          </button>

          {/* 6. Dashboard (ONLY if authorized!) */}
          {isDashboardAllowed && (
            <button
              id="mobile-strip-dashboard"
              onClick={() => handleNavClick('dashboard')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 ${
                currentTab === 'dashboard'
                  ? 'bg-red-900/80 text-white font-bold border border-red-600 shadow-sm'
                  : 'text-red-400 hover:text-white hover:bg-neutral-800 border border-red-900/50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          )}

          {/* 7. Login */}
          <button
            id="mobile-strip-login"
            onClick={onOpenAuthModal}
            className="px-3 py-1.5 rounded-lg whitespace-nowrap bg-red-800 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
          >
            <LogIn className="w-3 h-3" />
            <span>Login</span>
          </button>
        </nav>
      </div>

      {/* MOBILE HAMBURGER EXPANDED MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          
          {/* USER PROFILE OR LOGIN CARD */}
          <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-700 to-red-950 border border-red-600/50 flex items-center justify-center text-white font-bold">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{currentUser.name}</span>
                    {currentUser.role === 'admin' ? (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-950 text-red-400 font-bold border border-red-800">Admin</span>
                    ) : currentUser.status === 'approved' ? (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">Approved</span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-950 text-amber-400 font-bold border border-amber-800">Pending</span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-400">{currentUser.email}</div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm font-bold text-white">RwandaCarHub Account</div>
                <div className="text-xs text-neutral-400">Sign in or open an account</div>
              </div>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuthModal();
              }}
              className="px-3 py-1.5 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-bold"
            >
              {currentUser ? 'Switch / Profile' : 'Login'}
            </button>
          </div>

          <div className="flex flex-col space-y-1">
            {/* 1. Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                currentTab === 'home' ? 'bg-red-900/40 text-white border-l-4 border-red-600' : 'text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              Home
            </button>

            {/* 2. Cars Accordion */}
            <div className="rounded-xl bg-neutral-900/50 border border-neutral-800/80 overflow-hidden">
              <button
                onClick={() => setMobileCarsExpanded((prev) => !prev)}
                className={`w-full flex items-center justify-between text-left px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  isCarsActive ? 'bg-red-900/40 text-white border-l-4 border-red-600' : 'text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-red-500" />
                  <span>Cars</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${mobileCarsExpanded ? 'rotate-180 text-white' : ''}`} />
              </button>

              {mobileCarsExpanded && (
                <div className="px-3 pb-2 pt-1 space-y-1 bg-neutral-950/70 border-t border-neutral-800/60">
                  <button
                    onClick={() => handleNavClick('buy', 'buy')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      currentTab === 'buy' ? 'bg-red-950/90 text-white font-bold border border-red-800/70' : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-3.5 h-3.5 text-red-400" />
                      <span>Buy Cars</span>
                    </span>
                    <span className="text-[10px] text-neutral-500">For Sale</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('sell')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      currentTab === 'sell' ? 'bg-red-950/90 text-white font-bold border border-red-800/70' : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Sell Cars</span>
                    </span>
                    <span className="text-[10px] text-neutral-500">List Your Car</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('rent', 'rent')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      currentTab === 'rent' ? 'bg-red-950/90 text-white font-bold border border-red-800/70' : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>Rent Cars</span>
                    </span>
                    <span className="text-[10px] text-neutral-500">Safari & 4x4</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('lease', 'lease')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      currentTab === 'lease' ? 'bg-red-950/90 text-white font-bold border border-red-800/70' : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      <span>Lease Cars</span>
                    </span>
                    <span className="text-[10px] text-neutral-500">Corporate Fleet</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Dealers */}
            <button
              onClick={() => handleNavClick('dealers')}
              className={`text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                currentTab === 'dealers' ? 'bg-red-900/40 text-white border-l-4 border-red-600' : 'text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              Dealers
            </button>

            {/* 4. Cars Services */}
            <button
              onClick={() => handleNavClick('services')}
              className={`text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                currentTab === 'services' ? 'bg-red-900/40 text-white border-l-4 border-red-600' : 'text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              Cars Services
            </button>

            {/* 5. Contact */}
            <button
              onClick={() => handleNavClick('contact')}
              className={`text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                currentTab === 'contact' ? 'bg-red-900/40 text-white border-l-4 border-red-600' : 'text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              Contact
            </button>

            {/* 6. Dashboard (ONLY IF AUTHORIZED) */}
            {isDashboardAllowed && (
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`text-left px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
                  currentTab === 'dashboard' 
                    ? 'bg-red-900 text-white border-l-4 border-red-500' 
                    : 'text-red-400 bg-red-950/30 hover:bg-red-900/40 border border-red-900/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-red-400" />
                  <span>Dashboard</span>
                </div>
                {currentUser?.role === 'admin' ? (
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-950 text-red-400 font-bold border border-red-800">Admin</span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">Approved</span>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
