import React, { useState } from 'react';
import { 
  Home, 
  Car, 
  Building2, 
  Wrench, 
  Phone, 
  User, 
  LogIn, 
  ShieldCheck, 
  ShoppingBag, 
  Tag, 
  Key, 
  FileText, 
  ChevronRight, 
  X,
  Menu,
  Heart
} from 'lucide-react';
import { VehiclePurpose, UserAccount } from '../types';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string, purpose?: VehiclePurpose | 'all') => void;
  currentUser: UserAccount | null;
  onOpenAuthModal: () => void;
  favoritesCount?: number;
  compareCount?: number;
  onOpenPostCar?: () => void;
  onOpenCompare?: () => void;
  onOpenSearch?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenAuthModal,
  favoritesCount = 0,
  onOpenPostCar
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [carsSheetOpen, setCarsSheetOpen] = useState(false);

  const isCarsActive = ['buy', 'sell', 'rent', 'lease'].includes(currentTab);

  // DASHBOARD ONLY FOR ADMIN OR APPROVED ACCOUNTS
  const isDashboardAllowed = Boolean(
    currentUser && (currentUser.role === 'admin' || currentUser.status === 'approved')
  );

  return (
    <>
      {/* CARS SUBTITLES BOTTOM SHEET (Buy, Sell, Rent, Lease) */}
      {carsSheetOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 flex flex-col justify-end"
          onClick={() => setCarsSheetOpen(false)}
        >
          <div 
            className="bg-neutral-950 border-t border-neutral-800 rounded-t-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-neutral-800 rounded-full mx-auto" />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">Cars in Rwanda</h3>
                <p className="text-[11px] text-neutral-400">Select what you want to do</p>
              </div>
              <button 
                onClick={() => setCarsSheetOpen(false)}
                className="p-1.5 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Buy Cars */}
              <button
                onClick={() => {
                  onSelectTab('buy', 'buy');
                  setCarsSheetOpen(false);
                }}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  currentTab === 'buy'
                    ? 'bg-red-950/60 border-red-600 text-white'
                    : 'bg-neutral-900/90 border-neutral-800/90 text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-900/40 text-red-400 flex items-center justify-center border border-red-800/40 shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>Buy Cars</span>
                      {currentTab === 'buy' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                    </div>
                    <div className="text-xs text-neutral-400">Toyota, Mercedes, Hyundai & more for sale</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>

              {/* Sell Cars */}
              <button
                onClick={() => {
                  onSelectTab('sell');
                  setCarsSheetOpen(false);
                }}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  currentTab === 'sell'
                    ? 'bg-red-950/60 border-red-600 text-white'
                    : 'bg-neutral-900/90 border-neutral-800/90 text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900/40 text-emerald-400 flex items-center justify-center border border-emerald-800/40 shrink-0">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>Sell Cars</span>
                      {currentTab === 'sell' && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                    </div>
                    <div className="text-xs text-neutral-400">Post your vehicle & choose MoMo plan</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>

              {/* Rent Cars */}
              <button
                onClick={() => {
                  onSelectTab('rent', 'rent');
                  setCarsSheetOpen(false);
                }}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  currentTab === 'rent'
                    ? 'bg-red-950/60 border-red-600 text-white'
                    : 'bg-neutral-900/90 border-neutral-800/90 text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-900/40 text-amber-400 flex items-center justify-center border border-amber-800/40 shrink-0">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>Rent Cars</span>
                      {currentTab === 'rent' && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                    </div>
                    <div className="text-xs text-neutral-400">Prado 4x4, RAV4 & Kigali city rentals</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>

              {/* Lease Cars */}
              <button
                onClick={() => {
                  onSelectTab('lease', 'lease');
                  setCarsSheetOpen(false);
                }}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  currentTab === 'lease'
                    ? 'bg-red-950/60 border-red-600 text-white'
                    : 'bg-neutral-900/90 border-neutral-800/90 text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900/40 text-blue-400 flex items-center justify-center border border-blue-800/40 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>Lease Cars</span>
                      {currentTab === 'lease' && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                    </div>
                    <div className="text-xs text-neutral-400">Corporate & NGO long-term fleets</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MORE QUICK MENU SHEET */}
      {menuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 flex flex-col justify-end"
          onClick={() => setMenuOpen(false)}
        >
          <div 
            className="bg-neutral-950 border-t border-neutral-800 rounded-t-3xl p-5 space-y-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-neutral-800 rounded-full mx-auto" />
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">Menu & Account</h3>
              <button 
                onClick={() => setMenuOpen(false)}
                className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800"
              >
                Close
              </button>
            </div>

            {/* User Profile / Login quick trigger */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              {currentUser ? (
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
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
              ) : (
                <div>
                  <div className="text-sm font-bold text-white">RwandaCarHub Account</div>
                  <div className="text-xs text-neutral-400">Sign in or open account</div>
                </div>
              )}

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="px-3 py-1.5 rounded-xl bg-red-800 text-white text-xs font-bold"
              >
                {currentUser ? 'Manage' : 'Login'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  onSelectTab('dealers');
                  setMenuOpen(false);
                }}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                  currentTab === 'dealers' ? 'bg-red-950/60 border-red-700 text-white' : 'bg-neutral-900/90 border-neutral-800 text-neutral-200'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-800 text-red-400 flex items-center justify-center border border-neutral-700">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Dealers</div>
                  <div className="text-[10px] text-neutral-400">Showrooms in Kigali</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onSelectTab('services');
                  setMenuOpen(false);
                }}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                  currentTab === 'services' ? 'bg-red-950/60 border-red-700 text-white' : 'bg-neutral-900/90 border-neutral-800 text-neutral-200'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-800 text-red-400 flex items-center justify-center border border-neutral-700">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Cars Services</div>
                  <div className="text-[10px] text-neutral-400">Inspections & Repairs</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onSelectTab('contact');
                  setMenuOpen(false);
                }}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                  currentTab === 'contact' ? 'bg-red-950/60 border-red-700 text-white' : 'bg-neutral-900/90 border-neutral-800 text-neutral-200'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-800 text-red-400 flex items-center justify-center border border-neutral-700">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Contact</div>
                  <div className="text-[10px] text-neutral-400">Direct Office & Hotline</div>
                </div>
              </button>

              {/* Dashboard in menu ONLY IF authorized */}
              {isDashboardAllowed && (
                <button
                  onClick={() => {
                    onSelectTab('dashboard');
                    setMenuOpen(false);
                  }}
                  className={`p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                    currentTab === 'dashboard' ? 'bg-red-900 border-red-600 text-white' : 'bg-red-950/40 border-red-900 text-red-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-red-900/60 text-white flex items-center justify-center border border-red-700">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Dashboard</div>
                    <div className="text-[10px] text-neutral-300">
                      {currentUser?.role === 'admin' ? 'Admin Approvals' : 'My Listings'}
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <nav 
        id="mobile-bottom-nav" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800/90 px-2 py-1.5 shadow-[0_-8px_24px_rgba(0,0,0,0.8)]"
        aria-label="Mobile Bottom Navigation"
      >
        <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
          {/* 1. Home */}
          <button
            id="mobile-nav-bottom-home"
            onClick={() => {
              setMenuOpen(false);
              setCarsSheetOpen(false);
              onSelectTab('home');
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[56px] ${
              currentTab === 'home'
                ? 'text-red-500 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Home className={`w-5 h-5 ${currentTab === 'home' ? 'text-red-500 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
          </button>

          {/* 2. Cars (Opens Subtitles Sheet: Buy, Sell, Rent, Lease) */}
          <button
            id="mobile-nav-bottom-cars"
            onClick={() => {
              setMenuOpen(false);
              setCarsSheetOpen((prev) => !prev);
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[56px] ${
              isCarsActive || carsSheetOpen
                ? 'text-red-500 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Car className={`w-5 h-5 ${isCarsActive || carsSheetOpen ? 'text-red-500 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">Cars</span>
          </button>

          {/* 3. Dealers */}
          <button
            id="mobile-nav-bottom-dealers"
            onClick={() => {
              setMenuOpen(false);
              setCarsSheetOpen(false);
              onSelectTab('dealers');
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[56px] ${
              currentTab === 'dealers'
                ? 'text-red-500 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Building2 className={`w-5 h-5 ${currentTab === 'dealers' ? 'text-red-500 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">Dealers</span>
          </button>

          {/* 4. Cars Services */}
          <button
            id="mobile-nav-bottom-services"
            onClick={() => {
              setMenuOpen(false);
              setCarsSheetOpen(false);
              onSelectTab('services');
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[56px] ${
              currentTab === 'services'
                ? 'text-red-500 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Wrench className={`w-5 h-5 ${currentTab === 'services' ? 'text-red-500 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">Services</span>
          </button>

          {/* 5. Dashboard (ONLY if allowed: Admin or Approved Member) */}
          {isDashboardAllowed && (
            <button
              id="mobile-nav-bottom-dashboard"
              onClick={() => {
                setMenuOpen(false);
                setCarsSheetOpen(false);
                onSelectTab('dashboard');
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[52px] ${
                currentTab === 'dashboard'
                  ? 'text-red-500 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <User className={`w-5 h-5 ${currentTab === 'dashboard' ? 'text-red-500 stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">Dashboard</span>
            </button>
          )}

          {/* 6. Login Button (ALWAYS VISIBLE) */}
          <button
            id="mobile-nav-bottom-login"
            onClick={() => {
              setCarsSheetOpen(false);
              setMenuOpen(false);
              onOpenAuthModal();
            }}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[52px] text-red-400 hover:text-white active:scale-95"
          >
            <LogIn className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight font-bold">Login</span>
          </button>

          {/* 6. Menu */}
          <button
            id="mobile-nav-bottom-more"
            onClick={() => {
              setCarsSheetOpen(false);
              setMenuOpen((prev) => !prev);
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[56px] ${
              menuOpen
                ? 'text-red-400 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
};
