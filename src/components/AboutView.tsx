import React from 'react';
import { 
  ShieldCheck, 
  Car, 
  MapPin, 
  TrendingUp, 
  Lock, 
  Users, 
  Sparkles,
  Phone,
  CheckCircle2,
  Star,
  ArrowRight
} from 'lucide-react';

interface AboutViewProps {
  onNavigate?: (tab: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const handleTestimonialsClick = () => {
    if (onNavigate) {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById('testimonials-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* HERO SECTION */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-red-950/40 rounded-3xl p-8 sm:p-14 border border-neutral-800 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-xs font-semibold text-red-300">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>Automotive Innovation in Kigali</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit',sans-serif] leading-tight">
            Building Rwanda’s Most Trusted Digital Car Marketplace
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            RwandaCarHub was founded with a single mission: to modernize vehicle buying, selling, leasing, and renting across Kigali and Rwanda through unprecedented transparency, verified inspections, and anti-fraud protections.
          </p>
        </div>

        {/* Decorative background accent */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-red-700/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* THREE CORE PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-900/40 text-red-400 flex items-center justify-center border border-red-800/50">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
            Watermark & Fraud Shield
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Every vehicle image posted on our platform automatically features the official <strong>www.rwandacarhub.com</strong> watermark. This protects verified sellers from unauthorized re-posts and shields buyers from scams.
          </p>
        </div>

        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-900/40 text-red-400 flex items-center justify-center border border-red-800/50">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
            Verified Dealerships
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            We vet automotive showrooms across Kicukiro, Gasabo, and Nyarugenge. Every dealer undergoes RDB registration checks and physical premises audits.
          </p>
        </div>

        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-900/40 text-red-400 flex items-center justify-center border border-red-800/50">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
            Transparent Pricing
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Both dual-currency pricing (RWF & USD) and accessible seller listing packages (5 cars for 5,000 Frw/day, 30 cars for 15,000 Frw/week, 50 cars for 35,000 Frw/month) allow anyone in Rwanda to sell fast.
          </p>
        </div>
      </div>

      {/* KIGALI OPERATIONS & VISION */}
      <div className="bg-neutral-900 rounded-3xl p-8 sm:p-12 border border-neutral-800 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white font-['Outfit',sans-serif]">
              Our Roots in Kigali, Our Vision for East Africa
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Based at KK 713 St in Kicukiro, Kigali, RwandaCarHub is proudly Rwandan. As Rwanda pioneers clean mobility with 0% EV import taxes and digitized governance, we are advancing the automotive ecosystem with digitized mechanical inspections, instant loan calculators, and verified seller directories.
            </p>
            <div className="space-y-2 pt-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Supporting electric vehicle transition (BYD, EV buses & taxis in Kigali)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Partnering with certified Kigali mechanics and auto diagnostic centers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Direct WhatsApp and phone connectivity without middleman friction</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
            <h4 className="text-base font-bold text-white font-['Outfit',sans-serif]">
              Key Marketplace Statistics
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-2xl sm:text-3xl font-black text-red-500 font-['Outfit',sans-serif]">2,500+</div>
                <div className="text-xs text-neutral-400">Cars Listed in Kigali</div>
              </div>
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-2xl sm:text-3xl font-black text-red-500 font-['Outfit',sans-serif]">45+</div>
                <div className="text-xs text-neutral-400">Verified Dealerships</div>
              </div>
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-2xl sm:text-3xl font-black text-red-500 font-['Outfit',sans-serif]">99.8%</div>
                <div className="text-xs text-neutral-400">RRA Title Verified</div>
              </div>
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-2xl sm:text-3xl font-black text-red-500 font-['Outfit',sans-serif]">24/7</div>
                <div className="text-xs text-neutral-400">WhatsApp Buyer Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOMER TESTIMONIALS CALLOUT */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-red-950/40 rounded-3xl p-6 sm:p-10 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
            <span className="text-xs font-bold text-white ml-2">4.9 / 5.0 Rating</span>
          </div>
          <h3 className="text-xl font-bold text-white font-['Outfit',sans-serif]">
            Real Experiences from Drivers & Dealers in Rwanda
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
            See how hundreds of Rwandan car owners, safari tour operators, and corporate fleet managers buy, sell, and lease vehicles with total peace of mind.
          </p>
        </div>

        <button
          onClick={handleTestimonialsClick}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-950/80 transition-all shrink-0 whitespace-nowrap"
        >
          <span>Read Verified Reviews</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
