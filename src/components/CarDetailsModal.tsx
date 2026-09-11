import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Gauge, 
  Fuel, 
  Check, 
  Sparkles,
  Calculator,
  Send,
  Building2,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  XCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Vehicle, Booking, VehicleStatus, UserAccount } from '../types';
import { formatPrice } from '../utils/formatters';

interface CarDetailsModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  currency: 'RWF' | 'USD';
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isCompared: boolean;
  onToggleCompare: (id: string) => void;
  onAddBooking?: (booking: Booking) => void;
  onCreateBooking?: (booking: Booking) => void;
  onSendMessage: (msg: { vehicleId: string; vehicleName: string; name: string; email: string; phone: string; message: string }) => void;
  currentUser?: UserAccount | null;
  onUpdateVehicleStatus?: (vehicleId: string, status: VehicleStatus) => void;
}

export const CarDetailsModal: React.FC<CarDetailsModalProps> = ({
  vehicle,
  onClose,
  currency,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
  onAddBooking,
  onCreateBooking,
  onSendMessage,
  currentUser,
  onUpdateVehicleStatus
}) => {
  if (!vehicle) return null;

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'booking' | 'financing' | 'message'>('details');

  // Booking Form state
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [bookingType, setBookingType] = useState<'Test Drive' | 'Inspection' | 'Rental Booking' | 'Lease Inquiry'>(
    vehicle.purpose === 'rent' ? 'Rental Booking' : vehicle.purpose === 'lease' ? 'Lease Inquiry' : 'Test Drive'
  );
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Message Form state
  const [msgName, setMsgName] = useState('');
  const [msgEmail, setMsgEmail] = useState('');
  const [msgPhone, setMsgPhone] = useState('');
  const [msgText, setMsgText] = useState(`Hello, I am interested in this ${vehicle.year} ${vehicle.make} ${vehicle.model} listed on RwandaCarHub. Is it still available for viewing in Kigali?`);
  const [msgSent, setMsgSent] = useState(false);

  // Financing Calculator state
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTermMonths, setLoanTermMonths] = useState(36);
  const interestRateAnnual = 0.16; // Standard commercial vehicle loan rate in Rwanda ~16%

  const principal = vehicle.priceRwf * (1 - downPaymentPercent / 100);
  const monthlyRate = interestRateAnnual / 12;
  const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / 
    (Math.pow(1 + monthlyRate, loanTermMonths) - 1);

  const formattedPrimary = formatPrice(vehicle.priceRwf, vehicle.priceUsd, currency);
  const formattedSecondary = currency === 'RWF' 
    ? formatPrice(vehicle.priceRwf, vehicle.priceUsd, 'USD') 
    : formatPrice(vehicle.priceRwf, vehicle.priceUsd, 'RWF');

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone || !bookingDate) {
      setFormError('Please provide your name, phone number, and preferred date.');
      return;
    }
    setFormError(null);

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      customerName: bookingName,
      customerPhone: bookingPhone,
      customerEmail: bookingEmail || 'customer@rwandacarhub.com',
      date: bookingDate,
      time: bookingTime,
      type: bookingType,
      status: 'Pending',
      notes: `Location: ${vehicle.location}`
    };

    if (onAddBooking) {
      onAddBooking(newBooking);
    } else if (onCreateBooking) {
      onCreateBooking(newBooking);
    }
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setActiveTab('details');
    }, 2500);
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgName || !msgPhone || !msgText) {
      setFormError('Please fill out your name, contact phone, and message.');
      return;
    }
    setFormError(null);

    onSendMessage({
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      name: msgName,
      email: msgEmail,
      phone: msgPhone,
      message: msgText
    });

    setMsgSent(true);
    setTimeout(() => {
      setMsgSent(false);
      setActiveTab('details');
    }, 2200);
  };

  const status: VehicleStatus = vehicle.status || 'available';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* HEADER BAR */}
        <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-800 text-white">
              {vehicle.purpose === 'buy' ? 'For Sale' : vehicle.purpose === 'rent' ? 'For Rent' : 'For Lease'}
            </span>

            {/* Availability Status Badge */}
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm ${
              status === 'sold'
                ? 'bg-red-600 text-white ring-1 ring-red-400'
                : status === 'rented'
                ? 'bg-amber-500 text-neutral-950 ring-1 ring-amber-300 font-extrabold'
                : status === 'leased'
                ? 'bg-purple-600 text-white ring-1 ring-purple-400'
                : 'bg-emerald-600 text-white ring-1 ring-emerald-400/50'
            }`}>
              {status === 'sold' ? (
                <>
                  <XCircle className="w-3 h-3" />
                  <span>Sold</span>
                </>
              ) : status === 'rented' ? (
                <>
                  <Clock className="w-3 h-3" />
                  <span>Rented</span>
                </>
              ) : status === 'leased' ? (
                <>
                  <Layers className="w-3 h-3" />
                  <span>Leased</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>Available</span>
                </>
              )}
            </span>

            <span className="text-xs text-neutral-400 font-medium hidden sm:inline">
              Ref ID: {vehicle.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleCompare(vehicle.id)}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isCompared
                  ? 'bg-amber-500 text-neutral-950 border-amber-400'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">{isCompared ? 'Compared' : 'Compare'}</span>
            </button>

            <button
              onClick={() => onToggleFavorite(vehicle.id)}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isFavorite
                  ? 'bg-red-700 text-white border-red-600'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-white' : 'text-red-400'}`} />
              <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition-colors"
              aria-label="Close vehicle modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* 1. PUBLIC VEHICLE STATUS BANNER */}
          {status === 'sold' && (
            <div className="p-4 bg-red-950/80 border border-red-700 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 font-bold">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    This vehicle has been SOLD (Yagurishijwe)
                  </h4>
                  <p className="text-xs text-red-200 mt-0.5">
                    This vehicle is no longer available on the market. Displayed for historical market transparency and price valuation in Rwanda.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-wider shrink-0">
                Sold Out
              </span>
            </div>
          )}

          {status === 'rented' && (
            <div className="p-4 bg-amber-950/80 border border-amber-600/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center shrink-0 font-bold">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Currently Rented Out (Active Rental Contract)
                  </h4>
                  <p className="text-xs text-amber-200 mt-0.5">
                    This vehicle is currently on road with a rental client. You may contact the host on WhatsApp to check upcoming availability dates.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500 text-neutral-950 font-black text-xs uppercase tracking-wider shrink-0">
                Rented
              </span>
            </div>
          )}

          {status === 'leased' && (
            <div className="p-4 bg-purple-950/80 border border-purple-600/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 font-bold">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Currently Leased (Active Commercial Lease)
                  </h4>
                  <p className="text-xs text-purple-200 mt-0.5">
                    Occupied under an active institutional/corporate lease agreement in Rwanda. Contact fleet management for future terms or fleet bookings.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-600 text-white font-black text-xs uppercase tracking-wider shrink-0">
                Leased
              </span>
            </div>
          )}

          {status === 'available' && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-white font-bold">Available Now: Verified in Kigali</span>
                <span className="text-emerald-400 hidden sm:inline">• Ready for immediate inspection, purchase, or booking</span>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-emerald-900/80 text-emerald-300 font-bold border border-emerald-700 text-[11px] shrink-0">
                In Stock
              </span>
            </div>
          )}

          {/* 2. ADMIN STATUS CONTROL PANEL (VISIBLE TO ADMINISTRATOR) */}
          {currentUser?.role === 'admin' && onUpdateVehicleStatus && (
            <div className="p-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-2 border-red-600/70 rounded-xl space-y-3 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <span>Administrator Vehicle Status Manager</span>
                      <span className="px-2 py-0.5 rounded bg-red-800 text-white text-[10px] font-black uppercase tracking-wider">
                        Admin Only
                      </span>
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Switch this vehicle's public status to inform visitors and users across the platform immediately.
                    </p>
                  </div>
                </div>
                <div className="text-xs text-neutral-300 font-medium bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-700">
                  Current Status: <strong className="uppercase text-white">{status}</strong>
                </div>
              </div>

              {/* Status Switcher Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <button
                  type="button"
                  id={`admin-set-available-${vehicle.id}`}
                  onClick={() => onUpdateVehicleStatus(vehicle.id, 'available')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    status === 'available'
                      ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg'
                      : 'bg-neutral-900 text-neutral-300 hover:text-white border-neutral-700 hover:bg-neutral-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Available</span>
                </button>

                <button
                  type="button"
                  id={`admin-set-sold-${vehicle.id}`}
                  onClick={() => onUpdateVehicleStatus(vehicle.id, 'sold')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    status === 'sold'
                      ? 'bg-red-600 text-white border-red-400 ring-2 ring-red-400/40 shadow-lg'
                      : 'bg-neutral-900 text-neutral-300 hover:text-white border-neutral-700 hover:bg-neutral-800'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Mark as Sold</span>
                </button>

                <button
                  type="button"
                  id={`admin-set-rented-${vehicle.id}`}
                  onClick={() => onUpdateVehicleStatus(vehicle.id, 'rented')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    status === 'rented'
                      ? 'bg-amber-500 text-neutral-950 border-amber-300 ring-2 ring-amber-400/40 shadow-lg font-black'
                      : 'bg-neutral-900 text-neutral-300 hover:text-white border-neutral-700 hover:bg-neutral-800'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Mark as Rented</span>
                </button>

                <button
                  type="button"
                  id={`admin-set-leased-${vehicle.id}`}
                  onClick={() => onUpdateVehicleStatus(vehicle.id, 'leased')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    status === 'leased'
                      ? 'bg-purple-600 text-white border-purple-400 ring-2 ring-purple-400/40 shadow-lg'
                      : 'bg-neutral-900 text-neutral-300 hover:text-white border-neutral-700 hover:bg-neutral-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Mark as Leased</span>
                </button>
              </div>
            </div>
          )}

          {/* PHOTO GALLERY SECTION WITH WATERMARK */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800">
              <img
                src={vehicle.images[activePhotoIdx] || vehicle.images[0]}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&auto=format&fit=crop&q=80';
                }}
                className="w-full h-full object-cover object-center"
              />

              {/* WATERMARK on vehicle image */}
              <div className="absolute bottom-3 right-3 z-10 select-none">
                <div className="px-3 py-1 rounded bg-black/70 backdrop-blur-md border border-white/20 text-xs font-bold text-white/90 tracking-wider shadow-lg">
                  www.rwandacarhub.com
                </div>
              </div>

              {/* Photo counter */}
              <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs text-white font-medium">
                Photo {activePhotoIdx + 1} of {vehicle.images.length}
              </div>

              {/* Photo Previous/Next Touch Arrows */}
              {vehicle.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : vehicle.images.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg active:scale-95 transition-all"
                    title="Previous photo"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActivePhotoIdx((prev) => (prev < vehicle.images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg active:scale-95 transition-all"
                    title="Next photo"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails row */}
            {vehicle.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {vehicle.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-20 sm:w-24 h-14 sm:h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activePhotoIdx === idx 
                        ? 'border-red-600 scale-105 shadow-md' 
                        : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt="" 
                      referrerPolicy="no-referrer" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* MAIN TITLE, PRICING & SELLER BAR */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 bg-neutral-950 rounded-xl border border-neutral-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {vehicle.condition}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium text-red-400 bg-red-950/60 border border-red-900/60">
                  {vehicle.bodyType}
                </span>
                {vehicle.plateNumber && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80">
                    Plate: {vehicle.plateNumber}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit',sans-serif]">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h2>
              <p className="text-sm text-neutral-400 flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>{vehicle.location}</span>
              </p>
            </div>

            <div className="lg:text-right w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-800">
              <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif]">
                {formattedPrimary}
                {vehicle.rentalPeriod && <span className="text-sm font-normal text-neutral-400"> / {vehicle.rentalPeriod}</span>}
              </div>
              <p className="text-sm text-neutral-400 font-semibold">
                approx. {formattedSecondary}
              </p>
            </div>
          </div>

          {/* QUICK INTERACTION TABS */}
          <div className="flex border-b border-neutral-800 gap-2 overflow-x-auto text-sm font-medium">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'details'
                  ? 'border-red-600 text-white font-bold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Vehicle Overview & Specs
            </button>
            <button
              onClick={() => setActiveTab('booking')}
              className={`pb-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'booking'
                  ? 'border-red-600 text-white font-bold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Calendar className="w-4 h-4 text-red-500" />
              <span>Book Test Drive / Inspection</span>
            </button>
            {vehicle.purpose === 'buy' && (
              <button
                onClick={() => setActiveTab('financing')}
                className={`pb-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'financing'
                    ? 'border-red-600 text-white font-bold'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Calculator className="w-4 h-4 text-red-500" />
                <span>Rwanda Bank Financing Estimator</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('message')}
              className={`pb-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'message'
                  ? 'border-red-600 text-white font-bold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Send className="w-4 h-4 text-red-500" />
              <span>Message Seller</span>
            </button>
          </div>

          {/* TAB CONTENT: DETAILS */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* SPECS & FEATURES (2 COLS) */}
              <div className="lg:col-span-2 space-y-6">
                {/* 6-Grid Core Specs */}
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                      <span className="text-xs text-neutral-400">Mileage</span>
                      <p className="text-sm font-bold text-white">{vehicle.mileageKm.toLocaleString()} km</p>
                    </div>
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                      <span className="text-xs text-neutral-400">Transmission</span>
                      <p className="text-sm font-bold text-white">{vehicle.transmission}</p>
                    </div>
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                      <span className="text-xs text-neutral-400">Fuel Type</span>
                      <p className="text-sm font-bold text-white">{vehicle.fuelType}</p>
                    </div>
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                      <span className="text-xs text-neutral-400">Engine / Capacity</span>
                      <p className="text-sm font-bold text-white">{vehicle.engineSize || 'Standard Factory'}</p>
                    </div>
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                      <span className="text-xs text-neutral-400">Exterior Color</span>
                      <p className="text-sm font-bold text-white">{vehicle.color}</p>
                    </div>
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                      <span className="text-xs text-neutral-400">VIN / Chassis</span>
                      <p className="text-xs font-mono font-bold text-neutral-300 truncate">
                        {vehicle.vin || 'Verified upon visit'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                    Vehicle Description
                  </h4>
                  <p className="text-sm text-neutral-300 leading-relaxed bg-neutral-950/80 p-4 rounded-xl border border-neutral-800">
                    {vehicle.description}
                  </p>
                </div>

                {/* Features Checklist */}
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                    Features & Equipment
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {vehicle.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs text-neutral-200">
                        <Check className="w-4 h-4 text-red-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rwanda Verification & Title Assurance */}
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 flex items-start gap-3">
                  <FileCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-neutral-300 space-y-1">
                    <p className="font-bold text-emerald-400 text-sm">RwandaCarHub Verification Guarantee</p>
                    <p>
                      This vehicle has been checked against RRA tax database records and physical chassis clearance. Title transfer assistance is provided at certified notary offices in Kigali.
                    </p>
                  </div>
                </div>
              </div>

              {/* SELLER / DEALER PROFILE CARD (1 COL) */}
              <div className="space-y-4">
                <div className="p-5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-red-950 border border-red-700/60 flex items-center justify-center text-red-400 font-bold text-lg">
                      {vehicle.seller.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white font-['Outfit',sans-serif]">
                          {vehicle.seller.dealerName || vehicle.seller.name}
                        </h4>
                      </div>
                      {vehicle.seller.isVerified && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified Seller in Kigali
                        </span>
                      )}
                      <p className="text-xs text-neutral-400">
                        ★ {vehicle.seller.rating} ({vehicle.seller.reviewCount} verified transactions)
                      </p>
                    </div>
                  </div>

                  {/* DIRECT CONTACT BUTTONS */}
                  <div className="space-y-2 pt-2 border-t border-neutral-800">
                    <a
                      id="details-call-seller"
                      href={`tel:${vehicle.seller.phone}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-red-800 hover:bg-red-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call: {vehicle.seller.phone}</span>
                    </a>

                    <a
                      id="details-whatsapp-seller"
                      href={`https://wa.me/${vehicle.seller.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        status === 'sold'
                          ? `Hello, I saw that the ${vehicle.year} ${vehicle.make} ${vehicle.model} (Ref: ${vehicle.id}) on RwandaCarHub is marked SOLD. Do you have any similar cars coming in?`
                          : `Hello, I am interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} (${status}) (Ref: ${vehicle.id}) on RwandaCarHub`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>

                    <button
                      id="details-open-message-tab"
                      onClick={() => setActiveTab('message')}
                      className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <Send className="w-4 h-4 text-red-500" />
                      <span>Send In-App Message</span>
                    </button>
                  </div>

                  {/* Safety Advice */}
                  <div className="text-[11px] text-neutral-400 bg-neutral-900 p-3 rounded-lg border border-neutral-800 space-y-1">
                    <p className="font-bold text-neutral-300">Safety Tip for Buyers:</p>
                    <p>
                      Meet the seller at a public showroom or Kigali inspection center. Never pay upfront before inspecting registration papers.
                    </p>
                  </div>
                </div>

                {/* Quick booking CTA banner */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-red-950/60 to-neutral-950 border border-red-900/50 text-center space-y-2">
                  <p className="text-xs font-bold text-white">
                    Need a test drive in Kigali?
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Schedule a free 30-minute test drive or certified mechanic inspection at your convenience.
                  </p>
                  <button
                    onClick={() => setActiveTab('booking')}
                    className="w-full py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition-colors"
                  >
                    Schedule Test Drive
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: BOOKING FORM */}
          {activeTab === 'booking' && (
            <div className="max-w-2xl mx-auto p-6 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                  Schedule a Test Drive or Inspection
                </h3>
                <p className="text-xs text-neutral-400">
                  Select your preferred appointment details for {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.location}).
                </p>
              </div>

              {status === 'sold' && (
                <div className="p-3.5 bg-red-950/70 border border-red-700/80 rounded-xl text-xs text-red-200 flex items-center gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span><strong>Notice:</strong> This vehicle has been marked as <strong>SOLD</strong>. Physical test drives for this specific unit are closed, but you may submit an inquiry for incoming shipments.</span>
                </div>
              )}

              {status === 'rented' && (
                <div className="p-3.5 bg-amber-950/70 border border-amber-700/80 rounded-xl text-xs text-amber-200 flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>Notice:</strong> This vehicle is currently <strong>RENTED OUT</strong>. You can book in advance for its upcoming return date.</span>
                </div>
              )}

              {bookingSuccess ? (
                <div className="p-6 text-center space-y-3 bg-emerald-950/40 border border-emerald-800 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Booking Request Submitted!</h4>
                  <p className="text-xs text-neutral-300">
                    The dealer will confirm your appointment via phone/SMS shortly. You can also view this booking under your Dashboard.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {formError && (
                    <div className="p-3 bg-red-950/60 border border-red-700/80 rounded-lg text-xs text-red-300">
                      {formError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder="e.g. Jean-Luc Mugisha"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Phone Number (Rwanda) *</label>
                      <input
                        type="tel"
                        required
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        placeholder="+250 788 000 000"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Appointment Type</label>
                      <select
                        value={bookingType}
                        onChange={(e) => setBookingType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="Test Drive">Test Drive</option>
                        <option value="Inspection">Mechanical Inspection</option>
                        <option value="Rental Booking">Rental Booking</option>
                        <option value="Lease Inquiry">Corporate Lease Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Preferred Date *</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Time Slot</label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      placeholder="youremail@example.com"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('details')}
                      className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-bold transition-colors shadow"
                    >
                      Confirm Appointment
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB CONTENT: FINANCING ESTIMATOR */}
          {activeTab === 'financing' && (
            <div className="max-w-2xl mx-auto p-6 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif] flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-red-500" />
                  <span>Rwanda Auto Loan & Financing Estimator</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Estimate your monthly installments with partner financial institutions (Bank of Kigali, Equity Bank, I&M Bank).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-neutral-300 mb-1">
                      <span>Down Payment ({downPaymentPercent}%)</span>
                      <span className="text-white font-bold">
                        {Math.round(vehicle.priceRwf * (downPaymentPercent / 100)).toLocaleString()} RWF
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={60}
                      step={5}
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full accent-red-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-neutral-300 mb-1">
                      <span>Loan Duration ({loanTermMonths} Months / {loanTermMonths / 12} Years)</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[12, 24, 36, 48].map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setLoanTermMonths(term)}
                          className={`py-2 rounded-lg text-xs font-bold transition-colors border ${
                            loanTermMonths === term 
                              ? 'bg-red-800 text-white border-red-600' 
                              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                          }`}
                        >
                          {term}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Result Box */}
                <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between space-y-3">
                  <span className="text-xs text-neutral-400 font-medium">Estimated Monthly Payment</span>
                  <div className="text-2xl font-black text-white font-['Outfit',sans-serif]">
                    {Math.round(monthlyPayment).toLocaleString()} RWF
                    <span className="text-xs font-normal text-neutral-400 block mt-0.5">
                      approx. ${(Math.round(monthlyPayment / 1380)).toLocaleString()} USD / month
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-400 border-t border-neutral-800 pt-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Vehicle Price:</span>
                      <span className="text-white">{vehicle.priceRwf.toLocaleString()} RWF</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loan Principal:</span>
                      <span className="text-white">{Math.round(principal).toLocaleString()} RWF</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Indicative APR:</span>
                      <span className="text-emerald-400 font-bold">16.0% (Rwanda Standard)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: SEND MESSAGE */}
          {activeTab === 'message' && (
            <div className="max-w-2xl mx-auto p-6 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                  Send Inquiry to {vehicle.seller.dealerName || vehicle.seller.name}
                </h3>
                <p className="text-xs text-neutral-400">
                  Your inquiry will be delivered directly to the seller's inbox and verified WhatsApp.
                </p>
              </div>

              {msgSent ? (
                <div className="p-6 text-center space-y-3 bg-emerald-950/40 border border-emerald-800 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Inquiry Sent Successfully!</h4>
                  <p className="text-xs text-neutral-300">
                    The seller has received your message and will respond promptly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleMessageSubmit} className="space-y-3">
                  {formError && (
                    <div className="p-3 bg-red-950/60 border border-red-700/80 rounded-lg text-xs text-red-300">
                      {formError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={msgName}
                        onChange={(e) => setMsgName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Your Phone (Rwanda or Intl) *</label>
                      <input
                        type="tel"
                        required
                        value={msgPhone}
                        onChange={(e) => setMsgPhone(e.target.value)}
                        placeholder="+250 788 123 456"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Your Email</label>
                    <input
                      type="email"
                      value={msgEmail}
                      onChange={(e) => setMsgEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={msgText}
                      onChange={(e) => setMsgText(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('details')}
                      className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-bold transition-colors shadow flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* PERSISTENT MOBILE BOTTOM ACTION BAR */}
        <div className="sm:hidden px-4 py-3 bg-neutral-950/95 border-t border-neutral-800 flex items-center gap-2 shrink-0 z-20">
          <a
            href={`https://wa.me/${vehicle.seller.whatsapp.replace(/[^0-9]/g, '')}?text=Hello,%20I%20am%20interested%20in%20your%20${encodeURIComponent(vehicle.year + ' ' + vehicle.make + ' ' + vehicle.model)}%20listed%20on%20RwandaCarHub%20(www.rwandacarhub.com)`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow active:scale-95 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          <a
            href={`tel:${vehicle.seller.phone}`}
            className="py-3 px-4 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow active:scale-95 transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>Call</span>
          </a>

          <button
            onClick={() => setActiveTab('booking')}
            className={`py-3 px-3 rounded-xl border text-xs font-bold flex items-center justify-center transition-all ${
              activeTab === 'booking'
                ? 'bg-neutral-800 border-red-500 text-red-400'
                : 'bg-neutral-900 border-neutral-700 text-neutral-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
