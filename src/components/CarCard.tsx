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
      className={`group relative bg-neutral-900 rounded-2xl overflow-hidden border shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between ${
        status === 'sold'
          ? 'border-neutral-800/90 opacity-95 hover:border-red-900/60'
          : 'border-neutral-800 hover:border-red-900/80 hover:shadow-red-950/40'
      }`}
    >
      {/* CARD IMAGE CONTAINER */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950 cursor-pointer" onClick={() => onSelectVehicle(vehicle)}>
        {/* Skeleton placeholder while image is loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-neutral-800 animate-pulse flex items-center justify-center">
            <span className="text-xs text-neutral-500 font-medium">Loading car photo...</span>
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
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/40 pointer-events-none" />

        {/* SOLD OVERLAY WATERMARK STAMP */}
        {status === 'sold' && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none z-10">
            <div className="px-3.5 py-1 rounded-xl bg-red-600/95 text-white font-black text-xs sm:text-sm tracking-wider uppercase border border-white/40 shadow-2xl rotate-[-7deg] flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              <span>SOLD • YAGURISHIJWE</span>
            </div>
          </div>
        )}

        {/* TOP BADGES: PURPOSE & AVAILABILITY STATUS */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-20 pointer-events-none">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${
            vehicle.purpose === 'buy'
              ? 'bg-red-700 text-white'
              : vehicle.purpose === 'rent'
              ? 'bg-amber-600 text-white'
              : 'bg-indigo-700 text-white'
          }`}>
            {vehicle.purpose === 'buy' ? 'For Sale' : vehicle.purpose === 'rent' ? 'For Rent' : 'For Lease'}
          </span>

          {/* Availability Status Badge */}
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1 ${
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
                ? 'bg-red-600 text-white ring-2 ring-red-400' 
                : 'bg-black/60 hover:bg-neutral-800 text-neutral-300 hover:text-red-400 border border-white/20'
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
          <div className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-medium text-neutral-300/90">
            www.rwandacarhub.com
          </div>
        </div>
      </div>

      {/* CARD CONTENT: STREAMLINED & FOCUSED */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 
            onClick={() => onSelectVehicle(vehicle)}
            className="text-base font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 cursor-pointer font-['Outfit',sans-serif]"
            title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          >
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>

          <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5 truncate">
            <span>{vehicle.mileageKm.toLocaleString()} km</span>
            <span>•</span>
            <span>{vehicle.transmission}</span>
            <span>•</span>
            <span>{vehicle.fuelType}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-1">
            <MapPin className="w-3 h-3 text-red-500 shrink-0" />
            <span className="truncate">{vehicle.location}</span>
          </div>
        </div>

        {/* PRICE & SIMPLE ACTION BUTTONS */}
        <div className="pt-2 border-t border-neutral-800/80 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div className="text-lg font-black text-white tracking-tight font-['Outfit',sans-serif]">
              {formattedPrimary}
              <span className="text-xs font-normal text-neutral-400">{periodLabel}</span>
            </div>

            {/* STATUS / VERIFIED INDICATOR */}
            {status === 'sold' ? (
              <span className="text-[11px] text-red-400 font-bold flex items-center gap-1">
                <XCircle className="w-3 h-3 text-red-500" />
                Sold Out
              </span>
            ) : status === 'rented' ? (
              <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                Rented Out
              </span>
            ) : status === 'leased' ? (
              <span className="text-[11px] text-purple-400 font-bold flex items-center gap-1">
                <Layers className="w-3 h-3 text-purple-400" />
                Leased
              </span>
            ) : (
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Available • Verified
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`view-details-${vehicle.id}`}
              onClick={() => onSelectVehicle(vehicle)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                status === 'sold'
                  ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                  : 'bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-neutral-300" />
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
              className="py-2.5 px-3 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 active:bg-emerald-800 border border-emerald-700/80 text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
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
              className="mt-2 pt-2 border-t border-dashed border-neutral-800 flex items-center justify-between gap-1.5 text-[11px] bg-neutral-950/90 p-2 rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-neutral-400 font-semibold flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3 h-3 text-red-400 shrink-0" />
                Admin:
              </span>
              <select
                id={`admin-status-select-${vehicle.id}`}
                value={status}
                onChange={(e) => onUpdateStatus(vehicle.id, e.target.value as VehicleStatus)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold border cursor-pointer focus:outline-none transition-colors ${
                  status === 'sold'
                    ? 'bg-red-950 text-red-300 border-red-700'
                    : status === 'rented'
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : status === 'leased'
                    ? 'bg-purple-950 text-purple-300 border-purple-700'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                }`}
                title="Change vehicle status as Administrator"
              >
                <option value="available">🟢 Available</option>
                <option value="sold">🔴 Sold</option>
                <option value="rented">🟡 Rented</option>
                <option value="leased">🟣 Leased</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
