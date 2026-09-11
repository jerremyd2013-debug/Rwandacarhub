import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles, 
  Pause, 
  Play, 
  Building2, 
  Tag, 
  MapPin, 
  X, 
  Send, 
  CheckCircle2, 
  Megaphone,
  Layers,
  Flame,
  ArrowRight
} from 'lucide-react';
import { PartnerAd } from '../types';
import { PARTNER_ADS } from '../data/partners';

interface PartnersAdBannerProps {
  partnerAds?: PartnerAd[];
  onNavigateContact?: () => void;
  onAdInquirySubmitted?: (inquiry: {
    companyName: string;
    contactPerson: string;
    phone: string;
    email: string;
    adType: string;
    notes: string;
  }) => void;
}

export const PartnersAdBanner: React.FC<PartnersAdBannerProps> = ({ 
  partnerAds = PARTNER_ADS, 
  onNavigateContact,
  onAdInquirySubmitted
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<PartnerAd | null>(null);
  const [isAdInquiryOpen, setIsAdInquiryOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    adType: 'Sponsored Banner & Ticker',
    notes: ''
  });

  // Filter out unapproved or expired adverts
  const todayStr = new Date().toISOString().split('T')[0];
  const activeAds = partnerAds.filter((ad) => {
    // Check approval status: only 'approved' or 'diminished' can be shown
    if (ad.status !== 'approved' && ad.status !== 'diminished') return false;
    // Check expiration date
    if (ad.expiryDate && ad.expiryDate < todayStr) return false;
    return true;
  });

  // Weighted rotation sequence: Ads with higher displayWeight (e.g. 5x, 3x) appear more times in the carousel sequence
  const weightedSlides: PartnerAd[] = [];
  activeAds.forEach((ad) => {
    const weight = Math.max(1, ad.displayWeight || 2);
    for (let i = 0; i < weight; i++) {
      weightedSlides.push(ad);
    }
  });

  // Fallback to activeAds or default if weighted is empty
  const displaySlides = weightedSlides.length > 0 ? weightedSlides : activeAds.length > 0 ? activeAds : PARTNER_ADS;
  const totalSlides = displaySlides.length;
  const safeSlideIndex = totalSlides > 0 ? currentSlide % totalSlides : 0;
  const currentAd: PartnerAd = displaySlides[safeSlideIndex] || displaySlides[0] || PARTNER_ADS[0];
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play sliding interval (5.5 seconds)
  useEffect(() => {
    if (isPlaying && !isMinimized && !selectedPartner && !isAdInquiryOpen && totalSlides > 0) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 5500);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, isMinimized, selectedPartner, isAdInquiryOpen, totalSlides]);

  const handlePrev = () => {
    if (totalSlides === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    if (totalSlides === 0) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.companyName.trim() || !inquiryForm.phone.trim()) {
      return;
    }
    if (onAdInquirySubmitted) {
      onAdInquirySubmitted(inquiryForm);
    }
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setIsAdInquiryOpen(false);
      setInquiryForm({
        companyName: '',
        contactPerson: '',
        phone: '',
        email: '',
        adType: 'Sponsored Banner & Ticker',
        notes: ''
      });
    }, 2000);
  };

  // If minimized, display a clean, thin floating strip to reopen
  if (isMinimized) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-3">
        <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-semibold text-neutral-200">Our Clients & Partners Space:</span>
            <span className="hidden sm:inline text-neutral-400">Bank of Kigali, CFAO Toyota, Sanlam, AIC Inspection, I&M Bank & more</span>
          </div>
          <button
            onClick={() => setIsMinimized(false)}
            className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-bold transition-colors flex items-center gap-1.5"
          >
            <span>Show Adverts & Partner Links</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <section 
      className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-3 sm:pt-5 pb-2"
      aria-label="Clients, Partners and Sponsored Adverts"
    >
      <div className="space-y-3">
        
        {/* ================= TOP MOVING TICKER (CONTINUOUS MARQUEE) ================= */}
        <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800/90 shadow-lg overflow-hidden backdrop-blur-md">
          {/* Header Bar of the Marquee */}
          <div className="px-4 py-2 bg-neutral-950/80 border-b border-neutral-800/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-extrabold tracking-wider uppercase text-[10px] text-neutral-300 font-['Outfit',sans-serif]">
                Verified Clients & Corporate Partners
              </span>
              <span className="hidden md:inline text-neutral-500">•</span>
              <span className="hidden md:inline text-[11px] text-neutral-400">
                Click any partner to view exclusive deals & direct contacts
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsAdInquiryOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-red-950/70 hover:bg-red-900/80 border border-red-800/60 text-red-300 text-[10px] font-bold flex items-center gap-1 transition-colors"
                title="Promote your business or dealership here"
              >
                <Megaphone className="w-3 h-3 text-red-400" />
                <span>Advertise Here</span>
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="w-6 h-6 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors text-xs"
                title="Minimize advert space"
                aria-label="Minimize advert space"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Continuous Sliding Ticker Container */}
          <div className="py-2.5 overflow-hidden relative group">
            {/* Subtle fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-neutral-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-neutral-900 to-transparent z-10 pointer-events-none" />

            {/* Moving ticker track with duplicate for continuous seamless looping */}
            <div className="animate-marquee flex items-center gap-3 select-none">
              {(activeAds.length > 0 ? [...activeAds, ...activeAds] : [...PARTNER_ADS, ...PARTNER_ADS]).map((partner, idx) => (
                <button
                  key={`${partner.id}-${idx}`}
                  onClick={() => setSelectedPartner(partner)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-800/90 border border-neutral-800 hover:border-neutral-600 transition-all text-left shrink-0 group/pill cursor-pointer shadow-sm hover:scale-[1.02]"
                >
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-700/80 shrink-0 flex items-center justify-center">
                    <img
                      src={partner.logo}
                      alt={partner.shortName}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 pr-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white group-hover/pill:text-red-400 transition-colors whitespace-nowrap">
                        {partner.shortName}
                      </span>
                      {partner.isHotPromo && (
                        <span className="flex items-center text-[9px] font-extrabold text-amber-400 bg-amber-950/70 border border-amber-800/50 px-1.5 rounded">
                          <Flame className="w-2.5 h-2.5 mr-0.5 text-amber-400" />
                          Promo
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-400 truncate max-w-[170px] sm:max-w-[210px]">
                      {partner.offerHighlight}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= SLIDING FEATURED ADVERT SPOTLIGHT ================= */}
        <div className="relative rounded-2xl sm:rounded-3xl border border-neutral-800/90 bg-gradient-to-br from-neutral-900 via-neutral-900/95 to-neutral-950 p-4 sm:p-6 shadow-xl overflow-hidden">
          {/* Subtle colored accent glow from current partner */}
          <div 
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
            style={{ backgroundColor: currentAd.accentColor }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Left Info Column */}
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950/90 border border-red-800/70 text-[10px] font-black uppercase tracking-wider text-red-300">
                  <Sparkles className="w-3 h-3 text-red-400" />
                  <span>Featured Partner Advert</span>
                </span>

                <span className="px-2.5 py-0.5 rounded-full bg-neutral-950 border border-neutral-800 text-[10px] font-bold text-neutral-300">
                  {currentAd.category}
                </span>

                <span className="text-[11px] text-neutral-400 hidden sm:inline">
                  Slide {currentSlide + 1} of {totalSlides}
                </span>
              </div>

              {/* Headline & Partner */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm sm:text-base font-bold text-neutral-300">
                    {currentAd.name}
                  </h3>
                  <span className="text-neutral-500">•</span>
                  <span className="text-xs text-neutral-400 font-medium">
                    {currentAd.badge}
                  </span>
                </div>
                <h4 className="text-lg sm:text-2xl font-black text-white font-['Outfit',sans-serif] tracking-tight leading-snug">
                  {currentAd.headline}
                </h4>
              </div>

              {/* Offer Highlight Box */}
              <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-neutral-950/90 border border-neutral-800/90 text-xs sm:text-sm text-neutral-200">
                <Tag className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold text-amber-300">
                  {currentAd.offerHighlight}
                </span>
              </div>
            </div>

            {/* Right Action & Control Column */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 shrink-0">
              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedPartner(currentAd)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-950/80 transition-all hover:scale-[1.02] whitespace-nowrap"
                >
                  <span>{currentAd.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={`tel:${currentAd.phone.replace(/\s+/g, '')}`}
                  className="px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-700"
                  title={`Call ${currentAd.name}`}
                >
                  <Phone className="w-3.5 h-3.5 text-neutral-300" />
                  <span className="hidden sm:inline">Call</span>
                </a>

                <a
                  href={`https://wa.me/${currentAd.whatsapp}?text=${encodeURIComponent(
                    `Hello ${currentAd.shortName}, I saw your advert on RwandaCarHub regarding: ${currentAd.offerHighlight}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-emerald-800/60"
                  title="WhatsApp Partner"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </div>

              {/* Slider Controls (Prev, Next, Play/Pause, Indicators) */}
              <div className="flex items-center gap-2 pt-1 self-end sm:self-auto">
                {/* Dots indicator */}
                <div className="flex items-center gap-1.5 mr-2 max-w-[140px] overflow-hidden">
                  {displaySlides.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setCurrentSlide(dotIdx)}
                      className={`h-1.5 rounded-full transition-all shrink-0 ${
                        dotIdx === currentSlide 
                          ? 'w-6 bg-red-500' 
                          : 'w-1.5 bg-neutral-700 hover:bg-neutral-500'
                      }`}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>

                {/* Auto-play toggle */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-7 h-7 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 flex items-center justify-center transition-colors"
                  aria-label={isPlaying ? 'Pause auto-slide' : 'Resume auto-slide'}
                  title={isPlaying ? 'Pause slider' : 'Play slider'}
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>

                {/* Prev Slide */}
                <button
                  onClick={handlePrev}
                  className="w-7 h-7 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 flex items-center justify-center transition-colors"
                  aria-label="Previous advert slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Next Slide */}
                <button
                  onClick={handleNext}
                  className="w-7 h-7 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 flex items-center justify-center transition-colors"
                  aria-label="Next advert slide"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ================= PARTNER & ADVERT DETAIL MODAL ================= */}
      {selectedPartner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-partner-title"
        >
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl sm:rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPartner(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Partner Header */}
            <div className="flex items-start gap-4 pr-8">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-700 shrink-0">
                <img
                  src={selectedPartner.logo}
                  alt={selectedPartner.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800/60">
                    {selectedPartner.badge}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    {selectedPartner.category}
                  </span>
                </div>
                <h3 id="modal-partner-title" className="text-lg sm:text-xl font-black text-white font-['Outfit',sans-serif] mt-1">
                  {selectedPartner.name}
                </h3>
                <p className="text-xs text-neutral-400">{selectedPartner.tagline}</p>
              </div>
            </div>

            {/* Exclusive Offer Card */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                <Tag className="w-3.5 h-3.5" />
                <span>Exclusive RwandaCarHub Partner Offer</span>
              </div>
              <p className="text-sm font-bold text-white">
                {selectedPartner.offerHighlight}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {selectedPartner.description}
            </p>

            {/* Location in Kigali */}
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <MapPin className="w-4 h-4 text-red-400 shrink-0" />
              <span>{selectedPartner.address}</span>
            </div>

            {/* Action Links */}
            <div className="pt-2 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={`tel:${selectedPartner.phone.replace(/\s+/g, '')}`}
                className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-neutral-300" />
                <span>Call {selectedPartner.phone}</span>
              </a>

              <a
                href={`https://wa.me/${selectedPartner.whatsapp}?text=${encodeURIComponent(
                  `Hello ${selectedPartner.name}, I am contacting you through RwandaCarHub regarding: ${selectedPartner.offerHighlight}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Now</span>
              </a>

              <a
                href={selectedPartner.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-1 sm:col-span-2 py-2.5 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Visit Official Partner Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADVERTISING INQUIRY MODAL ================= */}
      {isAdInquiryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-ad-inquiry-title"
        >
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl sm:rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsAdInquiryOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-950 text-[10px] font-bold text-red-400 border border-red-900/50 mb-1.5">
                <Megaphone className="w-3 h-3 text-red-400" />
                <span>RwandaCarHub Advertising Network</span>
              </div>
              <h3 id="modal-ad-inquiry-title" className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                Advertise Your Business or Brand
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Reach thousands of vehicle buyers, drivers, corporate fleet managers, and car owners across Rwanda every day.
              </p>
            </div>

            {inquirySubmitted ? (
              <div className="p-5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Inquiry Received!</h4>
                <p className="text-xs text-emerald-200">
                  Our commercial team will contact you within 2 hours with our media kit and placement options.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Company / Dealership Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kigali Auto Motors Ltd"
                    value={inquiryForm.companyName}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+250 788 000 000"
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="info@company.rw"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Preferred Advertising Format
                  </label>
                  <select
                    value={inquiryForm.adType}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, adType: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-red-600"
                  >
                    <option value="Sponsored Banner & Ticker">Header Sliding Banner & Marquee Ticker</option>
                    <option value="Auto Finance Partner">Auto Loan & Bank Financing Placement</option>
                    <option value="Insurance Partner">Insurance Partner Promotion</option>
                    <option value="Verified Dealership Showcase">Dealership Inventory Spotlight</option>
                    <option value="Inspection / Service Bay">Car Maintenance / Inspection Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Notes or Special Campaign Requirements
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Briefly describe what you'd like to promote..."
                    value={inquiryForm.notes}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-red-600 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdInquiryOpen(false)}
                    className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
