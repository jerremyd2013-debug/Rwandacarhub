import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Car, 
  ExternalLink, 
  Plus, 
  Check, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { Dealer, Vehicle } from '../types';
import { DEALERS } from '../data/dealers';

interface DealersViewProps {
  onSelectDealerCars: (dealerId: string, dealerName: string) => void;
  onOpenPostCar: () => void;
}

export const DealersView: React.FC<DealersViewProps> = ({
  onSelectDealerCars,
  onOpenPostCar
}) => {
  const [dealersList, setDealersList] = useState<Dealer[]>(DEALERS);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regName, setRegName] = useState('');
  const [regDistrict, setRegDistrict] = useState('Kicukiro, Kigali');
  const [regPhone, setRegPhone] = useState('+250 788 225 193');
  const [regSuccess, setRegSuccess] = useState(false);

  const handleRegisterDealership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName) return;

    const newDealer: Dealer = {
      id: `dealer-${Date.now()}`,
      name: regName,
      logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1562141961-b5d1855d7f30?w=1200&auto=format&fit=crop&q=80',
      address: `${regDistrict}, Near Main Arterial`,
      district: regDistrict,
      phone: regPhone,
      whatsapp: regPhone,
      email: 'dealer@rwandacarhub.com',
      isVerified: true,
      rating: 5.0,
      reviewCount: 1,
      carsCount: 5,
      establishedYear: 2026,
      description: 'Newly registered Kigali automotive showroom offering certified Japanese & European imports with full documentation.',
      specialties: ['SUVs & Sedans', 'Direct Clearance', 'Financing Assistance']
    };

    setDealersList([newDealer, ...dealersList]);
    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setShowRegisterModal(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* HEADER HERO */}
      <div className="bg-white/85 backdrop-blur-md rounded-2xl p-6 sm:p-10 border border-sky-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 border border-sky-200 text-xs font-semibold text-sky-800">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>Certified Dealership Directory</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 font-['Outfit',sans-serif]">
            Verified Car Dealers in Kigali
          </h2>
          <p className="text-sm text-sky-950/80 leading-relaxed font-medium">
            Connect directly with reputable automotive showrooms in Kicukiro, Gasabo, and Nyarugenge. Every dealer is RDB-registered and thoroughly audited by RwandaCarHub.
          </p>
        </div>

        <button
          onClick={() => setShowRegisterModal(true)}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-red-950/80 whitespace-nowrap"
        >
          <Building2 className="w-4 h-4" />
          <span>Register Dealership Profile</span>
        </button>
      </div>

      {/* DEALERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dealersList.map((dealer) => (
          <div 
            key={dealer.id}
            className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-red-900/60 transition-all shadow-xl flex flex-col justify-between"
          >
            {/* Cover photo banner */}
            <div className="relative h-40 w-full overflow-hidden bg-neutral-950">
              <img 
                src={dealer.coverImage} 
                alt={`${dealer.name} showroom in Kigali`} 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1562141961-b5d1855d7f30?w=1200&auto=format&fit=crop&q=80';
                }}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/50" />
              <div className="absolute bottom-3 left-4 flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-950 border-2 border-neutral-700 shadow-lg">
                  <img 
                    src={dealer.logo} 
                    alt={`${dealer.name} logo`} 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&auto=format&fit=crop&q=80';
                    }}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">
                      {dealer.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-300">
                    <span className="text-amber-400 font-bold">★ {dealer.rating}</span>
                    <span>({dealer.reviewCount} reviews)</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content info */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {dealer.description}
                </p>

                <div className="space-y-1.5 text-xs text-neutral-400 border-t border-neutral-800/80 pt-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{dealer.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-500 shrink-0" />
                    <span>Established {dealer.establishedYear} • {dealer.carsCount} Available Cars</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {dealer.specialties.map((spec, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-950 text-neutral-300 border border-neutral-800">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-800">
                <button
                  onClick={() => onSelectDealerCars(dealer.id, dealer.name)}
                  className="py-2.5 px-3 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>View Cars</span>
                </button>

                <a
                  href={`tel:${dealer.phone}`}
                  className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-neutral-700"
                >
                  <Phone className="w-3.5 h-3.5 text-red-400" />
                  <span>Call</span>
                </a>

                <a
                  href={`https://wa.me/${dealer.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(dealer.name)},%20I%20saw%20your%20dealership%20on%20RwandaCarHub%20(www.rwandacarhub.com)`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* REGISTER DEALER PROFILE MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
              Register Your Kigali Dealership Profile
            </h3>
            <p className="text-xs text-neutral-400">
              Join Rwanda’s leading automotive marketplace with the 30-car (15,000 Frw/week) or 50-car (35,000 Frw/month) showroom pack.
            </p>

            {regSuccess ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-xl text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-white">Dealership Profile Created!</p>
                <p className="text-xs text-neutral-300">Your profile is now verified and live in the directory.</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterDealership} className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Dealership Name *</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Kigali Prestige Auto Ltd"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">District / Showroom Location</label>
                  <select
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-white"
                  >
                    <option value="Kicukiro (Sonatubes), Kigali">Kicukiro (Sonatubes), Kigali</option>
                    <option value="Gasabo (Remera), Kigali">Gasabo (Remera), Kigali</option>
                    <option value="Gasabo (Nyarutarama), Kigali">Gasabo (Nyarutarama), Kigali</option>
                    <option value="Gasabo (Gisozi), Kigali">Gasabo (Gisozi), Kigali</option>
                    <option value="Nyarugenge (Downtown), Kigali">Nyarugenge (Downtown), Kigali</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Business Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-red-700 text-white font-bold hover:bg-red-600"
                  >
                    Create Profile
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
