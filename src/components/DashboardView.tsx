import React, { useState } from 'react';
import { 
  Heart, 
  Car, 
  MessageSquare, 
  Search, 
  Calendar, 
  User, 
  Bell, 
  ShieldCheck, 
  PlusCircle, 
  Trash2, 
  Eye, 
  Send,
  MapPin,
  CheckCircle,
  Clock,
  Lock,
  ExternalLink,
  Users,
  AlertCircle,
  XCircle,
  Building2,
  Phone,
  Mail,
  Layers,
  CheckCircle2,
  Megaphone
} from 'lucide-react';
import { Vehicle, ContactMessage, Booking, UserAccount, VehicleStatus, PartnerAd } from '../types';
import { formatPrice } from '../utils/formatters';
import { AdminAdvertsManager } from './AdminAdvertsManager';

interface DashboardViewProps {
  favoriteVehicles: Vehicle[];
  userListings: Vehicle[];
  messages: ContactMessage[];
  bookings: Booking[];
  currency: 'RWF' | 'USD';
  currentUser: UserAccount | null;
  accounts: UserAccount[];
  allVehicles?: Vehicle[];
  partnerAds?: PartnerAd[];
  onApproveAd?: (adId: string) => void;
  onRejectAd?: (adId: string) => void;
  onDiminishAd?: (adId: string) => void;
  onRemoveAd?: (adId: string) => void;
  onUpdateAdWeight?: (adId: string, weight: number) => void;
  onUpdateAdExpiry?: (adId: string, expiryDate: string) => void;
  onSaveAd?: (ad: PartnerAd) => void;
  onUpdateVehicleStatus?: (vehicleId: string, status: VehicleStatus) => void;
  onToggleFavorite: (id: string) => void;
  onSelectVehicle: (v: Vehicle) => void;
  onOpenPostCar: () => void;
  onDeleteListing: (id: string) => void;
  onSendReply: (text: string) => void;
  onApproveAccount: (userId: string) => void;
  onRejectAccount: (userId: string) => void;
  onOpenAuthModal: () => void;
  onSimulateLogin?: (acc: UserAccount) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  favoriteVehicles,
  userListings,
  messages,
  bookings,
  currency,
  currentUser,
  accounts,
  allVehicles = [],
  partnerAds = [],
  onApproveAd,
  onRejectAd,
  onDiminishAd,
  onRemoveAd,
  onUpdateAdWeight,
  onUpdateAdExpiry,
  onSaveAd,
  onUpdateVehicleStatus,
  onToggleFavorite,
  onSelectVehicle,
  onOpenPostCar,
  onDeleteListing,
  onSendReply,
  onApproveAccount,
  onRejectAccount,
  onOpenAuthModal,
  onSimulateLogin
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const isApproved = currentUser?.status === 'approved';

  // Default to 'inventory' or 'adverts' or 'approvals' tab for admin, else 'listings'
  const [activeTab, setActiveTab] = useState<'listings' | 'inventory' | 'adverts' | 'favorites' | 'messages' | 'searches' | 'bookings' | 'profile' | 'notifications' | 'approvals'>(
    isAdmin ? 'inventory' : 'listings'
  );
  
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState<'all' | 'available' | 'sold' | 'rented' | 'leased'>('all');
  const [replyText, setReplyText] = useState('');
  const [replySentNotice, setReplySentNotice] = useState(false);
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Saved Searches state
  const [savedSearches, setSavedSearches] = useState([
    { id: 'ss-1', query: 'Toyota Land Cruiser Prado TXL', district: 'Kicukiro, Kigali', maxPrice: '85,000,000 RWF', active: true },
    { id: 'ss-2', query: 'Toyota RAV4 Hybrid AWD', district: 'Gasabo, Kigali', maxPrice: '40,000,000 RWF', active: true },
    { id: 'ss-3', query: '4x4 Safari Tour Rental', district: 'All Kigali', maxPrice: '100,000 RWF/day', active: false }
  ]);

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'Price Drop Alert', desc: 'The 2021 Toyota RAV4 Hybrid in Gasabo dropped by 1,500,000 RWF.', time: '2 hours ago', read: false },
    { id: 'notif-2', title: 'Inspection Complete', desc: 'Pre-purchase mechanical inspection report ready for Prado TX-L.', time: 'Yesterday', read: true },
    { id: 'notif-3', title: 'Welcome to RwandaCarHub', desc: 'Your account is verified. You can post, buy, or rent cars anytime.', time: '3 days ago', read: true }
  ]);

  // GATE 1: GUEST / NOT LOGGED IN
  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-red-500 shadow-xl">
          <Lock className="w-10 h-10" />
        </div>
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950 text-red-300 border border-red-800 text-xs font-bold">
            Authorized Access Only
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit',sans-serif]">
            Dashboard Restricted
          </h2>
          <p className="text-neutral-400 text-sm max-w-lg mx-auto leading-relaxed">
            The dashboard is strictly available for the <strong>Website Administrator</strong> and members who have opened accounts that have been <strong>approved by the administrator</strong>.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenAuthModal}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-600 hover:to-red-800 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-950/80 transition-all"
          >
            <User className="w-4 h-4" />
            <span>Sign In / Open Account</span>
          </button>
        </div>
      </div>
    );
  }

  // GATE 2: PENDING APPROVAL (Logged in but waiting for administrator approval)
  if (!isAdmin && !isApproved) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-950/50 border border-amber-800/80 flex items-center justify-center mx-auto text-amber-400 shadow-xl">
          <Clock className="w-10 h-10 animate-pulse" />
        </div>
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-xs font-bold">
            Account Status: Pending Admin Approval
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit',sans-serif]">
            Welcome, {currentUser.name}
          </h2>
          <p className="text-neutral-400 text-sm max-w-lg mx-auto leading-relaxed">
            Your account ({currentUser.email}) has been submitted and is currently awaiting manual verification by the <strong>website administrator</strong>. Once approved, the Dashboard will automatically appear in your main navigation bar.
          </p>
        </div>

        {/* Demo Helper Box */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 max-w-md mx-auto text-left text-xs space-y-3 shadow-lg">
          <div className="font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-red-400" />
            <span>Administrator Simulation:</span>
          </div>
          <p className="text-neutral-400 leading-relaxed">
            Want to test how the administrator approves accounts? Switch to the <strong>Website Administrator</strong> account with 1 click to view the pending approval queue and approve your registration!
          </p>
          <button
            onClick={onOpenAuthModal}
            className="w-full py-2.5 rounded-xl bg-red-900/80 hover:bg-red-800 border border-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <span>Switch to Website Admin Account</span>
          </button>
        </div>
      </div>
    );
  }

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendReply(replyText);
    setReplyText('');
    setReplySentNotice(true);
    setTimeout(() => setReplySentNotice(false), 2500);
  };

  const pendingAccounts = accounts.filter((a) => a.status === 'pending');
  const approvedAccounts = accounts.filter((a) => a.status === 'approved');
  const filteredAccounts = accounts.filter((a) => {
    if (approvalFilter === 'all') return true;
    return a.status === approvalFilter;
  });

  // Vehicle Inventory calculations for Admin Vehicle Status tab
  const filteredInventoryCars = allVehicles.filter((car) => {
    const query = inventorySearch.toLowerCase();
    const matchesSearch = !query || 
      `${car.year} ${car.make} ${car.model} ${car.plateNumber || ''} ${car.seller.name} ${car.location}`
        .toLowerCase()
        .includes(query);
    const carStatus = car.status || 'available';
    const matchesStatus = inventoryStatusFilter === 'all' || carStatus === inventoryStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const availableCarsCount = allVehicles.filter((v) => (v.status || 'available') === 'available').length;
  const soldCarsCount = allVehicles.filter((v) => v.status === 'sold').length;
  const rentedCarsCount = allVehicles.filter((v) => v.status === 'rented').length;
  const leasedCarsCount = allVehicles.filter((v) => v.status === 'leased').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* USER DASHBOARD HEADER */}
      <div className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-[#0a0f1d] border border-blue-500/40 flex items-center justify-center text-white text-2xl font-bold font-['Outfit',sans-serif] shadow-lg shadow-blue-950/50">
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
                {currentUser.name}
              </h2>
              {isAdmin ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-950 text-blue-300 border border-blue-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  Website Administrator
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  Approved Account
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentUser.email} • {currentUser.phone} • {currentUser.companyName || 'Kigali, Rwanda'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAuthModal}
            className="px-4 py-2.5 rounded-xl bg-[#0a0f1d] hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all"
          >
            Switch Account
          </button>
          <button
            onClick={onOpenPostCar}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-950/80 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Car</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs sm:text-sm font-semibold scrollbar-thin">
        {/* ADMIN SPECIAL TAB: ACCOUNT APPROVALS */}
        {isAdmin && (
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'approvals'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-[#0f172a] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Account Approvals</span>
            {pendingAccounts.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-400 text-slate-950 font-black text-[10px]">
                {pendingAccounts.length} Pending
              </span>
            )}
          </button>
        )}

        {/* ADMIN SPECIAL TAB: VEHICLE STATUS & INVENTORY CONTROLLER */}
        {isAdmin && (
          <button
            id="tab-admin-inventory"
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-[#0f172a] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Car className="w-4 h-4 text-blue-400" />
            <span>Vehicle Status & Inventory ({allVehicles.length})</span>
          </button>
        )}

        {/* ADMIN SPECIAL TAB: ADVERT & PARTNER SPACE CONTROLLER */}
        {isAdmin && (
          <button
            id="tab-admin-adverts"
            onClick={() => setActiveTab('adverts')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'adverts'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-[#0f172a] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Megaphone className="w-4 h-4 text-blue-400" />
            <span>Adverts & Partners ({partnerAds.length})</span>
            {partnerAds.some(a => a.status === 'pending') && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-400 text-slate-950 font-black text-[10px]">
                {partnerAds.filter(a => a.status === 'pending').length} New
              </span>
            )}
          </button>
        )}

        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'listings'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-[#0f172a] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>My Listings ({userListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'favorites'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-[#0f172a] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Favorites ({favoriteVehicles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'messages'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-[#0f172a] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Messages ({messages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'bookings'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-[#0f172a] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Test Drives & Bookings ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-[#0f172a] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Account Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-[#0f172a] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alerts ({notifications.filter(n => !n.read).length})</span>
        </button>
      </div>

      {/* ==================== TAB CONTENT: ADMIN ACCOUNT APPROVALS ==================== */}
      {isAdmin && activeTab === 'approvals' && (
        <div className="space-y-6 animate-in fade-in">
          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold">Total Accounts</p>
                <p className="text-2xl font-black text-white mt-1">{accounts.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-300">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold">Pending Admin Approval</p>
                <p className="text-2xl font-black text-blue-400 mt-1">{pendingAccounts.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-900/60 flex items-center justify-center text-blue-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold">Approved Accounts</p>
                <p className="text-2xl font-black text-white mt-1">{approvedAccounts.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center text-blue-400">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* ACCOUNTS LIST HEADER & FILTER */}
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <span>Admin User Account Approval Queue</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Only accounts approved by you will gain access to the dashboard and post verified cars.
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 bg-[#0a0f1d] p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setApprovalFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                      approvalFilter === filter
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter === 'all' ? 'All Accounts' : filter}
                  </button>
                ))}
              </div>
            </div>

            {/* ACCOUNTS TABLE / CARDS */}
            <div className="space-y-3">
              {filteredAccounts.map((acc) => (
                <div 
                  key={acc.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    acc.status === 'pending'
                      ? 'bg-[#0a0f1d] border-blue-500/40 shadow-sm'
                      : acc.status === 'approved'
                      ? 'bg-[#0a0f1d] border-slate-800'
                      : 'bg-[#0a0f1d]/50 border-slate-800/60 opacity-70'
                  }`}
                >
                  {/* USER INFO */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-base font-['Outfit',sans-serif] shrink-0">
                      {acc.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">{acc.name}</span>
                        {acc.role === 'admin' && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-blue-950 text-blue-300 font-bold border border-blue-800">
                            Website Admin
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                          {acc.accountType || 'individual'}
                        </span>
                        {acc.status === 'pending' && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-blue-950 text-blue-300 font-bold border border-blue-800 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-400" />
                            Pending Approval
                          </span>
                        )}
                        {acc.status === 'approved' && acc.role !== 'admin' && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-200 font-bold border border-slate-700 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-blue-400" />
                            Approved
                          </span>
                        )}
                        {acc.status === 'rejected' && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-400 font-bold border border-slate-800 flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Declined
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          {acc.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          {acc.phone}
                        </span>
                        {acc.companyName && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            {acc.companyName}
                          </span>
                        )}
                        <span className="text-slate-500 text-[11px]">
                          Joined {acc.createdAt}
                        </span>
                      </div>

                      {acc.approvalNotes && (
                        <p className="text-[11px] text-slate-400 mt-1 italic">
                          Notes: {acc.approvalNotes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* APPROVAL ACTION BUTTONS */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    {acc.role !== 'admin' && (
                      <>
                        {acc.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => onApproveAccount(acc.id)}
                              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-950 transition-all active:scale-95"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Approve Account</span>
                            </button>
                            <button
                              onClick={() => onRejectAccount(acc.id)}
                              className="px-3 py-2 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-xs border border-slate-800 transition-colors"
                            >
                              Decline
                            </button>
                          </>
                        ) : acc.status === 'approved' ? (
                          <>
                            <span className="text-xs text-blue-400 font-bold flex items-center gap-1 px-3 py-1.5 bg-blue-950/40 rounded-xl border border-blue-800/60">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Dashboard Active
                            </span>
                            <button
                              onClick={() => onRejectAccount(acc.id)}
                              className="px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-slate-400 hover:text-white text-xs border border-slate-800"
                            >
                              Revoke
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onApproveAccount(acc.id)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                          >
                            Re-Approve
                          </button>
                        )}
                      </>
                    )}

                    {/* Quick test simulation button */}
                    {onSimulateLogin && acc.id !== currentUser.id && (
                      <button
                        onClick={() => onSimulateLogin(acc)}
                        className="px-3 py-2 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-colors"
                        title="Simulate viewing RwandaCarHub as this user"
                      >
                        Test as User
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB CONTENT: ADMIN VEHICLE STATUS & INVENTORY CONTROLLER ==================== */}
      {isAdmin && activeTab === 'inventory' && (
        <div className="space-y-6 animate-in fade-in">
          {/* HEADER & OVERVIEW */}
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Admin Inventory Control
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0a0f1d] text-slate-300 border border-slate-800">
                    Live Marketplace Status
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white font-['Outfit',sans-serif] mt-1">
                  Vehicle Status & Inventory Management
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update any vehicle to <strong>Available</strong>, <strong>Sold</strong>, <strong>Rented</strong>, or <strong>Leased</strong>. Changes update in real-time on search cards, badges, and detail pages.
                </p>
              </div>

              <button
                onClick={onOpenPostCar}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-md transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Vehicle</span>
              </button>
            </div>

            {/* STATUS METRICS ROW */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div 
                onClick={() => setInventoryStatusFilter('all')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  inventoryStatusFilter === 'all'
                    ? 'bg-[#0a0f1d] border-blue-500 shadow-md'
                    : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[11px] font-semibold text-slate-400">Total Cars</span>
                <div className="text-xl font-black text-white mt-1">{allVehicles.length}</div>
              </div>

              <div 
                onClick={() => setInventoryStatusFilter('available')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  inventoryStatusFilter === 'available'
                    ? 'bg-[#0a0f1d] border-blue-500 shadow-md'
                    : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[11px] font-semibold text-blue-400">Available</span>
                <div className="text-xl font-black text-blue-400 mt-1">{availableCarsCount}</div>
              </div>

              <div 
                onClick={() => setInventoryStatusFilter('sold')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  inventoryStatusFilter === 'sold'
                    ? 'bg-[#0a0f1d] border-slate-600 shadow-md'
                    : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[11px] font-semibold text-slate-400">Sold (Yagurishijwe)</span>
                <div className="text-xl font-black text-slate-300 mt-1">{soldCarsCount}</div>
              </div>

              <div 
                onClick={() => setInventoryStatusFilter('rented')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  inventoryStatusFilter === 'rented'
                    ? 'bg-[#0a0f1d] border-blue-500 shadow-md'
                    : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[11px] font-semibold text-blue-300">Rented Out</span>
                <div className="text-xl font-black text-blue-300 mt-1">{rentedCarsCount}</div>
              </div>

              <div 
                onClick={() => setInventoryStatusFilter('leased')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  inventoryStatusFilter === 'leased'
                    ? 'bg-[#0a0f1d] border-blue-500 shadow-md'
                    : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[11px] font-semibold text-blue-300">Leased</span>
                <div className="text-xl font-black text-blue-300 mt-1">{leasedCarsCount}</div>
              </div>
            </div>

            {/* SEARCH & FILTER CONTROLS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search car, model, plate (e.g. RAD 123 B), seller..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0a0f1d] border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {(['all', 'available', 'sold', 'rented', 'leased'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setInventoryStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all ${
                      inventoryStatusFilter === st
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-[#0a0f1d] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {st === 'all' ? 'All' : st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* INVENTORY VEHICLES LIST */}
          <div className="space-y-3">
            {filteredInventoryCars.length === 0 ? (
              <div className="p-12 text-center bg-[#0f172a] rounded-2xl border border-slate-800 space-y-2">
                <Car className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-white">No vehicles found</h4>
                <p className="text-xs text-slate-400">Try changing your search keywords or status filter.</p>
              </div>
            ) : (
              filteredInventoryCars.map((car) => {
                const currentStatus: VehicleStatus = car.status || 'available';

                return (
                  <div
                    key={car.id}
                    className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={car.images[0]}
                          alt={`${car.year} ${car.make} ${car.model}`}
                          className="w-20 h-16 sm:w-24 sm:h-20 object-cover rounded-xl border border-slate-800"
                          referrerPolicy="no-referrer"
                        />
                        {currentStatus === 'sold' && (
                          <div className="absolute inset-0 bg-slate-950/80 rounded-xl flex items-center justify-center">
                            <span className="text-[10px] font-black text-white uppercase tracking-wider">SOLD</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-white">
                            {car.year} {car.make} {car.model}
                          </span>
                          {car.plateNumber && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
                              {car.plateNumber}
                            </span>
                          )}
                          <span className="text-[10px] uppercase font-bold text-slate-400 bg-[#0a0f1d] px-2 py-0.5 rounded">
                            {car.purpose}
                          </span>
                        </div>

                        <div className="text-xs font-black text-blue-400">
                          {formatPrice(car.priceRwf, car.priceUsd, currency)}
                        </div>

                        <div className="text-[11px] text-slate-400 flex items-center gap-2 flex-wrap">
                          <span>📍 {car.location}</span>
                          <span>•</span>
                          <span>Seller: {car.seller.name}</span>
                          <span>•</span>
                          <span>{car.seller.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Current Status & 1-Click Status Controls */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                      {/* Current Status Pill */}
                      <div className="shrink-0 flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">Current Status:</span>
                        {currentStatus === 'available' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            Available
                          </span>
                        )}
                        {currentStatus === 'sold' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            Sold (Yagurishijwe)
                          </span>
                        )}
                        {currentStatus === 'rented' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            Rented Out
                          </span>
                        )}
                        {currentStatus === 'leased' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            Leased
                          </span>
                        )}
                      </div>

                      {/* Status Action Buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] text-slate-500 hidden xl:inline">Set to:</span>
                        <button
                          type="button"
                          onClick={() => onUpdateVehicleStatus?.(car.id, 'available')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            currentStatus === 'available'
                              ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                              : 'bg-[#0a0f1d] text-slate-300 border border-slate-800 hover:border-slate-700'
                          }`}
                          title="Mark as Available in stock"
                        >
                          Available
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateVehicleStatus?.(car.id, 'sold')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            currentStatus === 'sold'
                              ? 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-500'
                              : 'bg-[#0a0f1d] text-slate-400 border border-slate-800 hover:border-slate-700'
                          }`}
                          title="Mark as Sold"
                        >
                          Sold
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateVehicleStatus?.(car.id, 'rented')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            currentStatus === 'rented'
                              ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                              : 'bg-[#0a0f1d] text-slate-300 border border-slate-800 hover:border-slate-700'
                          }`}
                          title="Mark as Rented"
                        >
                          Rented
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateVehicleStatus?.(car.id, 'leased')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            currentStatus === 'leased'
                              ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                              : 'bg-[#0a0f1d] text-slate-300 border border-slate-800 hover:border-slate-700'
                          }`}
                          title="Mark as Leased"
                        >
                          Leased
                        </button>

                        <button
                          onClick={() => onSelectVehicle(car)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-colors ml-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB CONTENT: ADMIN ADVERTS & PARTNERS CONTROLLER ==================== */}
      {isAdmin && activeTab === 'adverts' && (
        <AdminAdvertsManager
          partnerAds={partnerAds}
          onApproveAd={onApproveAd || (() => {})}
          onRejectAd={onRejectAd || (() => {})}
          onDiminishAd={onDiminishAd || (() => {})}
          onRemoveAd={onRemoveAd || (() => {})}
          onUpdateWeight={onUpdateAdWeight || (() => {})}
          onUpdateExpiry={onUpdateAdExpiry || (() => {})}
          onSaveAd={onSaveAd || (() => {})}
        />
      )}

      {/* ==================== TAB CONTENT: USER LISTINGS ==================== */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                  Vehicle Listings
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-blue-950 text-blue-300 font-bold border border-blue-800">
                  Free Member Plan: 2 Cars / Day Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                As an approved account holder, you can list up to 2 vehicles every day 100% free of charge.
              </p>
            </div>
            <button
              onClick={onOpenPostCar}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 self-start sm:self-auto shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          </div>

          {userListings.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#0f172a] border border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#0a0f1d] flex items-center justify-center mx-auto text-slate-500">
                <Car className="w-8 h-8 text-blue-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">No active car listings yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Ready to sell or rent your car in Kigali? Post your listing and connect with direct buyers across Rwanda.
                </p>
              </div>
              <button
                onClick={onOpenPostCar}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
              >
                Post Your Car Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userListings.map((car) => (
                <div 
                  key={car.id} 
                  className="bg-[#0f172a] rounded-2xl p-4 border border-slate-800 flex gap-4 hover:border-blue-500/60 transition-all"
                >
                  <img
                    src={car.images[0]}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    className="w-28 h-24 object-cover rounded-xl shrink-0 border border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span className="text-xs font-bold text-blue-400 uppercase">{car.purpose}</span>
                      <select
                        value={car.status || 'available'}
                        onChange={(e) => onUpdateVehicleStatus?.(car.id, e.target.value as any)}
                        className="text-[10px] font-bold bg-[#0a0f1d] border border-slate-700 rounded-lg px-2 py-0.5 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                        title="Update vehicle availability status"
                      >
                        <option value="available">Available</option>
                        <option value="sold">Sold</option>
                        <option value="rented">Rented</option>
                        <option value="leased">Leased</option>
                      </select>
                    </div>
                    <h4 className="text-sm font-bold text-white truncate">
                      {car.year} {car.make} {car.model}
                    </h4>
                    <p className="text-xs font-black text-white">
                      {formatPrice(car.priceRwf, car.priceUsd, currency)}
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => onSelectVehicle(car)}
                        className="text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        View
                      </button>
                      <button
                        onClick={() => onDeleteListing(car.id)}
                        className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB CONTENT: FAVORITES ==================== */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
            Saved Vehicles ({favoriteVehicles.length})
          </h3>
          {favoriteVehicles.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#0f172a] border border-slate-800 text-center space-y-2">
              <Heart className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400">You have no saved vehicles yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteVehicles.map((car) => (
                <div key={car.id} className="bg-[#0f172a] rounded-2xl p-4 border border-slate-800 space-y-3">
                  <img
                    src={car.images[0]}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    className="w-full h-40 object-cover rounded-xl border border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{car.year} {car.make} {car.model}</h4>
                    <p className="text-xs font-black text-blue-400 mt-0.5">
                      {formatPrice(car.priceRwf, car.priceUsd, currency)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <button
                      onClick={() => onSelectVehicle(car)}
                      className="text-xs font-bold text-white hover:text-blue-400"
                    >
                      View Car
                    </button>
                    <button
                      onClick={() => onToggleFavorite(car.id)}
                      className="text-xs text-slate-400 hover:text-white font-bold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB CONTENT: MESSAGES ==================== */}
      {activeTab === 'messages' && (
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 space-y-6">
          <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
            Direct Inquiries & Buyer Messages
          </h3>

          <div className="space-y-4 divide-y divide-slate-800">
            {messages.map((msg) => (
              <div key={msg.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{msg.senderName}</span>
                    <span className="text-xs text-slate-400">• {msg.senderPhone}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{msg.timestamp}</span>
                </div>
                {msg.vehicleName && (
                  <p className="text-xs font-semibold text-blue-400">
                    Regarding: {msg.vehicleName}
                  </p>
                )}
                <p className="text-xs text-slate-300 leading-relaxed bg-[#0a0f1d] p-3 rounded-xl border border-slate-800">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={handleReplySubmit} className="pt-4 border-t border-slate-800 space-y-3">
            <label className="block text-xs font-bold text-slate-300">
              Send Instant Response (SMS / Portal)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response to the buyer..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#0a0f1d] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            </div>
            {replySentNotice && (
              <p className="text-xs text-blue-400 font-bold">Reply sent to buyer via SMS notification!</p>
            )}
          </form>
        </div>
      )}

      {/* ==================== TAB CONTENT: BOOKINGS ==================== */}
      {activeTab === 'bookings' && (
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
            Scheduled Test Drives & Inspection Bookings
          </h3>

          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="p-4 rounded-xl bg-[#0a0f1d] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{b.customerName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {b.type}
                    </span>
                  </div>
                  <p className="text-xs text-blue-400 font-semibold mt-0.5">{b.vehicleName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Date: {b.date} at {b.time} • Phone: {b.customerPhone}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800 self-start sm:self-auto">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB CONTENT: PROFILE ==================== */}
      {activeTab === 'profile' && (
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 space-y-6">
          <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
            Account & Verification Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                readOnly
                value={currentUser.name}
                className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-800 rounded-lg text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Phone Number</label>
              <input
                type="text"
                readOnly
                value={currentUser.phone}
                className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-800 rounded-lg text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                readOnly
                value={currentUser.email}
                className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-800 rounded-lg text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Account Role & Status</label>
              <input
                type="text"
                readOnly
                value={`${currentUser.role === 'admin' ? 'Website Admin' : 'Member'} (${currentUser.status})`}
                className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-800 rounded-lg text-white font-semibold capitalize"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0a0f1d] border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-white text-xs">Verified Rwanda Marketplace Member</p>
              <p className="text-slate-400 text-[11px]">Identity authenticated by RwandaCarHub administrator.</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 font-bold text-xs border border-blue-700">
              Verified
            </span>
          </div>
        </div>
      )}

      {/* ==================== TAB CONTENT: NOTIFICATIONS ==================== */}
      {activeTab === 'notifications' && (
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
            Notifications & System Alerts
          </h3>

          <div className="divide-y divide-slate-800">
            {notifications.map((n) => (
              <div key={n.id} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-white">{n.title}</h4>
                  <p className="text-xs text-slate-300">{n.desc}</p>
                  <span className="text-[10px] text-slate-500">{n.time}</span>
                </div>
                {!n.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
