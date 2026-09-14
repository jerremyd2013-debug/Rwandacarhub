import React, { useState } from 'react';
import { 
  Car, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight,
  X,
  CheckCircle2
} from 'lucide-react';
import { VehiclePurpose } from '../types';

interface FooterProps {
  onNavigate?: (tab: string, purpose?: VehiclePurpose) => void;
  onSelectTab?: (tab: string, purpose?: VehiclePurpose) => void;
  onOpenPostCar?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectTab, onOpenPostCar }) => {
  const [infoModal, setInfoModal] = useState<{ title: string; content: string } | null>(null);

  const handleNav = (tab: string, purpose?: VehiclePurpose) => {
    const navFn = onNavigate || onSelectTab;
    if (navFn) {
      navFn(tab, purpose);
    }
  };

  const handlePostCarClick = () => {
    if (onOpenPostCar) {
      onOpenPostCar();
    } else {
      handleNav('sell');
    }
  };

  const handleTestimonialsClick = () => {
    handleNav('home');
    setTimeout(() => {
      const el = document.getElementById('testimonials-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  return (
    <footer className="bg-[#061c15] text-slate-300 border-t border-emerald-900/50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* TOP CALLOUT: POST CAR CTA */}
        <div className="bg-gradient-to-r from-red-950/80 via-neutral-900 to-neutral-900 rounded-2xl p-6 sm:p-8 border border-red-900/50 mb-14 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/50 border border-red-700/60 text-xs font-semibold text-red-300">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>Affordable Dealer & Private Seller Rates</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif]">
              Want to sell, rent, or lease your vehicle in Rwanda?
            </h3>
            <p className="text-sm text-neutral-400 max-w-xl">
              Reach thousands of qualified buyers in Kigali and beyond. List 5 cars for 5,000 Frw/day, 30 cars for 15,000 Frw/week, or 50 cars for 35,000 Frw/month.
            </p>
          </div>
          <button
            id="footer-cta-post-car"
            onClick={handlePostCarClick}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold text-sm tracking-wide border border-red-500/60 shadow-xl shadow-red-950/80 whitespace-nowrap flex items-center gap-2 transition-all"
          >
            <span>Post Your Car Now</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* MAIN FOOTER COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800/80">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-700 flex items-center justify-center border border-red-500/40">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white font-['Outfit',sans-serif]">
                RWANDA<span className="text-red-500">CAR</span>HUB
              </span>
            </div>

            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              RwandaCarHub is Rwanda’s premier verified automotive marketplace in Kigali. We connect car buyers, sellers, renters, and licensed dealerships with transparency, trusted pre-inspections, and transparent pricing.
            </p>

            <div className="flex items-center gap-2 text-xs text-red-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certified Listings & RRA Tax Verification</span>
            </div>

            {/* Social Media clickable icons as requested */}
            <div className="pt-2">
              <p className="text-xs uppercase font-bold text-neutral-400 tracking-wider mb-3">
                Follow Us On Social Media
              </p>
              <div className="flex items-center gap-3">
                <a 
                  href="https://youtube.com/@rwandacarhub" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-red-900/60 border border-neutral-800 hover:border-red-700 text-neutral-300 hover:text-white flex items-center justify-center transition-all"
                  aria-label="YouTube"
                  title="YouTube @rwandacarhub"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a 
                  href="https://facebook.com/rwandacarhub" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-blue-900/60 border border-neutral-800 hover:border-blue-700 text-neutral-300 hover:text-white flex items-center justify-center transition-all"
                  aria-label="Facebook"
                  title="Facebook @rwandacarhub"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a 
                  href="https://instagram.com/rwandacarhub" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-pink-900/60 border border-neutral-800 hover:border-pink-700 text-neutral-300 hover:text-white flex items-center justify-center transition-all"
                  aria-label="Instagram"
                  title="Instagram @rwandacarhub"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a 
                  href="https://x.com/rwandacarhub" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white flex items-center justify-center transition-all"
                  aria-label="X (Twitter)"
                  title="X (Twitter) @rwandacarhub"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a 
                  href="https://linkedin.com/company/rwandacarhub" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-blue-950/80 border border-neutral-800 hover:border-blue-700 text-neutral-300 hover:text-white flex items-center justify-center transition-all"
                  aria-label="LinkedIn"
                  title="LinkedIn RwandaCarHub"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a 
                  href="https://tiktok.com/@rwandacarhub" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-cyan-950/80 border border-neutral-800 hover:border-cyan-700 text-neutral-300 hover:text-white flex items-center justify-center transition-all"
                  aria-label="TikTok"
                  title="TikTok @rwandacarhub"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.48 2.73 1.25-.07 2.37-.8 2.89-1.93.36-.74.47-1.57.46-2.39V.02z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Marketplace Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Marketplace
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <button onClick={() => handleNav('buy', 'buy')} className="hover:text-white transition-colors">
                  Buy Cars (SUVs & Sedans)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('sell')} className="hover:text-white transition-colors">
                  Sell Cars & Listing Packages
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('rent', 'rent')} className="hover:text-white transition-colors">
                  Rent Cars & Safari 4x4
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('lease', 'lease')} className="hover:text-white transition-colors">
                  Lease Cars (Corporate Fleets)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('dealers')} className="hover:text-white transition-colors">
                  Verified Kigali Dealers
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-white transition-colors">
                  Car Valuation & Pre-Inspection
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Trust */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors">
                  About RwandaCarHub
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    handleNav('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <span>Clients & Partners Hub</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-950 text-emerald-400 rounded border border-emerald-900/60">
                    Active
                  </span>
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-testimonials"
                  onClick={handleTestimonialsClick} 
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <span>Customer Testimonials</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-red-950 text-red-400 rounded border border-red-900/60">
                    4.9 ★
                  </span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors">
                  Contact Customer Care
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('dashboard')} className="hover:text-white transition-colors">
                  User Dashboard & Messages
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setInfoModal({
                    title: 'Terms of Service',
                    content: 'RwandaCarHub enforces strict anti-fraud checks, verified seller identities, and genuine ownership documentation. All vehicle listings are cross-checked with RRA import records and local registration cards (Carte Jaune).'
                  })} 
                  className="hover:text-white transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setInfoModal({
                    title: 'Privacy Policy',
                    content: 'Customer and dealer phone numbers and communication logs are protected under Rwandan data privacy regulations. Dealer inquiries and financing calculations remain confidential.'
                  })} 
                  className="hover:text-white transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setInfoModal({
                    title: 'Buyer Safety Tips',
                    content: 'Always inspect vehicles in well-lit public places or certified testing centers across Kigali. Never transfer deposits to unverified individual numbers before examining Carte Jaune registration and physical engine numbers.'
                  })} 
                  className="hover:text-white transition-colors text-left"
                >
                  Buyer Safety Tips
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Explicit Kigali Contact Information */}
          <div className="lg:col-span-1 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Kigali City Office
            </h4>
            <p className="text-xs text-neutral-400">
              Your Trusted Car Marketplace in Rwanda
            </p>
            <div className="space-y-2.5 text-xs text-neutral-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Rwanda, Kigali City, KK 713 St</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <a href="tel:+250788225193" className="hover:text-white transition-colors">
                  +250 788 225 193
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 text-emerald-400 font-bold shrink-0 flex items-center justify-center text-[10px]">WA</span>
                <a href="https://wa.me/250738225193" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                  WhatsApp: +250 738 225 193
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <a href="mailto:trust@rwandacarhub.com" className="hover:text-white transition-colors">
                  trust@rwandacarhub.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-neutral-200">www.rwandacarhub.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & EXPANSION BADGE */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            © 2026 RwandaCarHub — All Rights Reserved.
          </div>
          <div className="flex items-center gap-4 text-neutral-400 flex-wrap justify-center">
            <span>Built for Rwanda with East Africa Expansion</span>
            <span>•</span>
            <span>Kigali, Rwanda</span>
            <span>•</span>
            <span className="text-red-400 font-medium">www.rwandacarhub.com</span>
          </div>
        </div>
      </div>

      {/* INFO / TERMS / PRIVACY MODAL */}
      {infoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setInfoModal(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                {infoModal.title}
              </h3>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {infoModal.content}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInfoModal(null)}
                className="px-5 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
