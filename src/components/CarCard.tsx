import React, { useState } from 'react';
import { 
  Heart, 
  Layers, 
  MapPin, 
  Fuel, 
  Gauge, 
  Phone, 
  ShieldCheck, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Eye,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { Vehicle, VehicleStatus } from '../types';
import { formatPrice } from '../utils/formatters';

interface CarCardProps {
  vehicle: Vehicle;
  currency: 'RWF' | 'USD';
  isFavorite: boolean;
  onToggleFavorite: (vehicleId: string) => void;
  isCompared: boolean;
  onToggleCompare: (vehicleId: string) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onQuickMessage?: (vehicle: Vehicle) => void;
  isAdmin?: boolean;
  onUpdateStatus?: (vehicleId: string, status: VehicleStatus) => void;
}

export const CarCard: React.FC<CarCardProps> = ({
  vehicle,
  currency,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
  onSelectVehicle,
  onQuickMessage,
  isAdmin = false,
  onUpdateStatus
}) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const status: VehicleStatus = vehicle.status || 'available';

  // Price formatting
  const formattedPrimary = formatPrice(vehicle.priceRwf, vehicle.priceUsd, currency);
  const formattedSecondary = currency === 'RWF' 
    ? formatPrice(vehicle.priceRwf, vehicle.priceUsd, 'USD') 
    : formatPrice(vehicle.priceRwf, vehicle.priceUsd, 'RWF');

  const periodLabel = vehicle.rentalPeriod 
    ? ` / ${vehicle.rentalPeriod}` 
    : '';

  return (
    <div 
      id={`car-card-${vehicle.id}`}
      className={`group relative bg-[#0f172a] rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-xl ${
        status === 'sold'
          ? 'border-slate-800/80 opacity-90 hover:border-slate-700'
          : 'border-slate-800 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-950/30'
      }`}
    >
      {/* CARD IMAGE CONTAINER */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#090d16] cursor-pointer" onClick={() => onSelectVehicle(vehicle)}>
        {/* Skeleton placeholder while image is loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center">
            <span className="text-xs text-slate-500 font-medium">Loading car photo...</span>
          </div>
        )}

        <img
          src={vehicle.images[imageIndex] || vehicle.images[0]}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            setImageLoaded(true);
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&auto=format&fit=crop&q=80';
          }}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${status === 'sold' ? 'grayscale-[25%]' : ''}`}
          loading="lazy"
        />

        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-black/40 pointer-events-none" />

        {/* SOLD OVERLAY WATERMARK STAMP */}
        {status === 'sold' && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none z-10">
            <div className="px-3.5 py-1 rounded-xl bg-slate-900/95 text-white font-black text-xs sm:text-sm tracking-wider uppercase border border-slate-600 shadow-2xl rotate-[-7deg] flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-slate-400" />
              <span>SOLD · YAGURISHIJWE</span>
            </div>
          </div>
        )}

        {/* TOP BADGES: PURPOSE & AVAILABILITY STATUS */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-20 pointer-events-none">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md bg-slate-900/90 text-white border border-slate-700/80 backdrop-blur-md">
            {vehicle.purpose === 'buy' ? 'For Sale' : vehicle.purpose === 'rent' ? 'For Rent' : 'For Lease'}
          </span>

          {/* Availability Status Badge */}
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1 backdrop-blur-md ${
            status === 'sold'
              ? 'bg-slate-900/90 text-slate-300 border border-slate-700'
              : status === 'rented'
              ? 'bg-blue-950/90 text-blue-300 border border-blue-800'
              : status === 'leased'
              ? 'bg-blue-950/90 text-blue-300 border border-blue-800'
              : 'bg-blue-600/90 text-white border border-blue-400/50'
          }`}>
            {status === 'sold' ? (
              <>
                <XCircle className="w-3 h-3 text-slate-400" />
                <span>Sold</span>
              </>
            ) : status === 'rented' ? (
              <>
                <Clock className="w-3 h-3 text-blue-400" />
                <span>Rented</span>
              </>
            ) : status === 'leased' ? (
              <>
                <Layers className="w-3 h-3 text-blue-400" />
                <span>Leased</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3 h-3" />
                <span>Available</span>
              </>
            )}
          </span>
        </div>

        {/* TOP RIGHT ACTION: FAVORITE */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            id={`favorite-btn-${vehicle.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(vehicle.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md active:scale-95 ${
              isFavorite 
                ? 'bg-blue-600 text-white ring-2 ring-blue-400' 
                : 'bg-black/60 hover:bg-slate-800 text-slate-300 hover:text-blue-400 border border-white/20'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            aria-label="Save to favorites"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* PHOTO SWIPE CONTROLS */}
        {vehicle.images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setImageIndex((prev) => (prev > 0 ? prev - 1 : vehicle.images.length - 1));
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Previous photo"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setImageIndex((prev) => (prev < vehicle.images.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Next photo"
              aria-label="Next photo"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {/* WATERMARK */}
        <div className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none select-none">
          <div className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-medium text-slate-300/90">
            www.rwandacarhub.com
          </div>
        </div>
      </div>

      {/* CARD CONTENT */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 
            onClick={() => onSelectVehicle(vehicle)}
            className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1 cursor-pointer font-['Outfit',sans-serif]"
            title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          >
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>

          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 truncate">
            <span>{vehicle.mileageKm.toLocaleString()} km</span>
            <span>·</span>
            <span>{vehicle.transmission}</span>
            <span>·</span>
            <span>{vehicle.fuelType}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
            <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
            <span className="truncate">{vehicle.location}</span>
          </div>
        </div>

        {/* PRICE & ACTION BUTTONS */}
        <div className="pt-2 border-t border-slate-800 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div className="text-lg font-black text-white tracking-tight font-['Outfit',sans-serif]">
              {formattedPrimary}
              <span className="text-xs font-normal text-slate-400">{periodLabel}</span>
            </div>

            {/* STATUS INDICATOR */}
            {status === 'sold' ? (
              <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                <XCircle className="w-3 h-3 text-slate-500" />
                Sold
              </span>
            ) : status === 'rented' ? (
              <span className="text-[11px] text-blue-300 font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-400" />
                Rented
              </span>
            ) : status === 'leased' ? (
              <span className="text-[11px] text-blue-300 font-bold flex items-center gap-1">
                <Layers className="w-3 h-3 text-blue-400" />
                Leased
              </span>
            ) : (
              <span className="text-[11px] text-blue-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`view-details-${vehicle.id}`}
              onClick={() => onSelectVehicle(vehicle)}
              className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-slate-200 border border-slate-800 hover:border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{status === 'sold' ? 'View (Sold)' : 'View Car'}</span>
            </button>

            <a
              id={`whatsapp-${vehicle.id}`}
              href={`https://wa.me/${vehicle.seller.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                status === 'sold'
                  ? `Hello, I saw that the ${vehicle.year} ${vehicle.make} ${vehicle.model} on RwandaCarHub is marked SOLD. Do you have any similar vehicles available?`
                  : `Hello, I am interested in your ${vehicle.year} ${vehicle.make} ${vehicle.model} (${status}) listed on RwandaCarHub (www.rwandacarhub.com)`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-blue-950"
              title="Chat with Seller on WhatsApp"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* ADMIN QUICK STATUS CONTROLLER */}
          {isAdmin && onUpdateStatus && (
            <div 
              className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between gap-1.5 text-[11px] bg-slate-900/80 p-2 rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-slate-400 font-semibold flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3 h-3 text-blue-400 shrink-0" />
                Admin:
              </span>
              <select
                id={`admin-status-select-${vehicle.id}`}
                value={status}
                onChange={(e) => onUpdateStatus(vehicle.id, e.target.value as VehicleStatus)}
                className="px-2 py-1 rounded-lg text-[11px] font-bold border border-slate-700 bg-slate-800 text-slate-200 cursor-pointer focus:outline-none focus:border-blue-500 transition-colors"
                title="Change vehicle status as Administrator"
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
                <option value="leased">Leased</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
