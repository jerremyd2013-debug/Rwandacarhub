import React, { useState } from 'react';
import { 
  Megaphone, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Clock, 
  AlertTriangle, 
  Sliders, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Plus, 
  Edit3, 
  ExternalLink, 
  Filter, 
  Search, 
  Eye, 
  MousePointer, 
  Flame,
  Layers,
  Sparkles,
  ShieldCheck,
  Building2,
  X
} from 'lucide-react';
import { PartnerAd, AdStatus } from '../types';

interface AdminAdvertsManagerProps {
  partnerAds: PartnerAd[];
  onApproveAd: (adId: string) => void;
  onRejectAd: (adId: string) => void;
  onDiminishAd: (adId: string) => void;
  onRemoveAd: (adId: string) => void;
  onUpdateWeight: (adId: string, weight: number) => void;
  onUpdateExpiry: (adId: string, expiryDate: string) => void;
  onSaveAd: (ad: PartnerAd) => void;
  onOpenAdInquiry?: () => void;
}

export const AdminAdvertsManager: React.FC<AdminAdvertsManagerProps> = ({
  partnerAds,
  onApproveAd,
  onRejectAd,
  onDiminishAd,
  onRemoveAd,
  onUpdateWeight,
  onUpdateExpiry,
  onSaveAd,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingAd, setEditingAd] = useState<PartnerAd | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New advert state
  const [newAdForm, setNewAdForm] = useState<Partial<PartnerAd>>({
    name: '',
    shortName: '',
    badge: 'Official Sponsor',
    category: 'Dealership',
    tagline: '',
    headline: '',
    offerHighlight: '',
    description: '',
    websiteUrl: 'https://',
    phone: '+250 788 000 000',
    whatsapp: '250788000000',
    address: 'Kigali, Rwanda',
    ctaText: 'Learn More',
    accentColor: '#DC2626',
    bgGradient: 'from-red-950/80 via-neutral-900 to-neutral-950',
    isHotPromo: false,
    status: 'approved',
    displayWeight: 3,
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    logo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200&auto=format&fit=crop&q=80',
    impressionsCount: 0,
    clicksCount: 0,
  });

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const pendingCount = partnerAds.filter((a) => a.status === 'pending').length;
  const approvedCount = partnerAds.filter((a) => a.status === 'approved').length;
  const diminishedCount = partnerAds.filter((a) => a.status === 'diminished').length;
  const expiredCount = partnerAds.filter((a) => {
    if (a.status === 'expired') return true;
    if (a.expiryDate && a.expiryDate < todayStr) return true;
    return false;
  }).length;

  const filteredAds = partnerAds.filter((ad) => {
    const isExpiredDate = ad.expiryDate ? ad.expiryDate < todayStr : false;
    const effectiveStatus = isExpiredDate && ad.status !== 'rejected' ? 'expired' : ad.status;

    if (filterStatus !== 'all') {
      if (filterStatus === 'expired') {
        if (effectiveStatus !== 'expired') return false;
      } else if (ad.status !== filterStatus) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${ad.name} ${ad.shortName} ${ad.headline} ${ad.category} ${ad.offerHighlight}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdForm.name || !newAdForm.headline) return;

    const newAd: PartnerAd = {
      id: `ad-${Date.now()}`,
      name: newAdForm.name,
      shortName: newAdForm.shortName || newAdForm.name,
      logo: newAdForm.logo || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200&auto=format&fit=crop&q=80',
      badge: newAdForm.badge || 'Sponsored Partner',
      category: (newAdForm.category as any) || 'Dealership',
      tagline: newAdForm.tagline || '',
      headline: newAdForm.headline,
      offerHighlight: newAdForm.offerHighlight || 'Exclusive Rwandan Deal',
      description: newAdForm.description || '',
      websiteUrl: newAdForm.websiteUrl || 'https://',
      phone: newAdForm.phone || '+250 788 000 000',
      whatsapp: newAdForm.whatsapp || '250788000000',
      address: newAdForm.address || 'Kigali, Rwanda',
      ctaText: newAdForm.ctaText || 'View Offer',
      accentColor: newAdForm.accentColor || '#DC2626',
      bgGradient: newAdForm.bgGradient || 'from-red-950/80 via-neutral-900 to-neutral-950',
      isHotPromo: !!newAdForm.isHotPromo,
      status: (newAdForm.status as AdStatus) || 'approved',
      displayWeight: Number(newAdForm.displayWeight) || 2,
      expiryDate: newAdForm.expiryDate,
      startDate: newAdForm.startDate,
      impressionsCount: 0,
      clicksCount: 0,
    };

    onSaveAd(newAd);
    setIsCreateModalOpen(false);
    setNewAdForm({
      name: '',
      shortName: '',
      badge: 'Official Sponsor',
      category: 'Dealership',
      tagline: '',
      headline: '',
      offerHighlight: '',
      description: '',
      websiteUrl: 'https://',
      phone: '+250 788 000 000',
      whatsapp: '250788000000',
      address: 'Kigali, Rwanda',
      ctaText: 'Learn More',
      accentColor: '#DC2626',
      bgGradient: 'from-red-950/80 via-neutral-900 to-neutral-950',
      isHotPromo: false,
      status: 'approved',
      displayWeight: 3,
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      logo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200&auto=format&fit=crop&q=80',
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAd) return;
    onSaveAd(editingAd);
    setEditingAd(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in" id="admin-adverts-management-module">
      {/* HEADER SECTION */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
              Admin Advert & Partner Space Controller
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-300">
              Header Space & Marquee Ticker
            </span>
          </div>
          <h3 className="text-xl font-bold text-white font-['Outfit',sans-serif] mt-1">
            Sponsored Advert Moderation, Weights & Expirations
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Control the sliding header advert space and moving partner ticker. 
            Approve partner campaigns, diminish low-priority ads, set frequency weights (which appears more times), or remove expired sponsors.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-950/60 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Advert</span>
        </button>
      </div>

      {/* STATS METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-neutral-400 font-medium">Approved / Active</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{approvedCount}</div>
          <p className="text-[11px] text-emerald-400 mt-0.5 font-medium">Currently visible on site</p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-neutral-400 font-medium">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300">{pendingCount}</div>
          <p className="text-[11px] text-amber-400 mt-0.5 font-medium">Awaiting admin approval</p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-neutral-400 font-medium">Diminished</span>
            <TrendingDown className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-300">{diminishedCount}</div>
          <p className="text-[11px] text-orange-400 mt-0.5 font-medium">Reduced frequency (rare)</p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-neutral-400 font-medium">Expired</span>
            <AlertTriangle className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-300">{expiredCount}</div>
          <p className="text-[11px] text-neutral-400 mt-0.5 font-medium">Past expiry date / hidden</p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-neutral-800 text-white border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Adverts ({partnerAds.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filterStatus === 'pending'
                ? 'bg-amber-950 text-amber-200 border border-amber-800'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Pending</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-black">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterStatus === 'approved'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setFilterStatus('diminished')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterStatus === 'diminished'
                ? 'bg-orange-950 text-orange-300 border border-orange-800'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Diminished ({diminishedCount})
          </button>
          <button
            onClick={() => setFilterStatus('expired')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterStatus === 'expired'
                ? 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Expired ({expiredCount})
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search sponsor, deal, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
          />
        </div>
      </div>

      {/* ADVERTS TABLE / CARDS */}
      <div className="space-y-3">
        {filteredAds.length === 0 ? (
          <div className="p-12 text-center bg-neutral-900 rounded-2xl border border-neutral-800 space-y-2">
            <Megaphone className="w-10 h-10 text-neutral-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No adverts match current filter.</h4>
            <p className="text-xs text-neutral-400">
              Try switching the status filter tab or clearing the search query.
            </p>
          </div>
        ) : (
          filteredAds.map((ad) => {
            const isDateExpired = ad.expiryDate ? ad.expiryDate < todayStr : false;
            const currentEffectiveStatus = isDateExpired && ad.status !== 'rejected' ? 'expired' : ad.status;

            return (
              <div
                key={ad.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  currentEffectiveStatus === 'pending'
                    ? 'bg-neutral-900/90 border-amber-800/80 shadow-lg shadow-amber-950/20'
                    : currentEffectiveStatus === 'diminished'
                    ? 'bg-neutral-900/60 border-orange-900/60 opacity-90'
                    : currentEffectiveStatus === 'expired'
                    ? 'bg-neutral-950 border-neutral-800/60 opacity-60'
                    : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 shadow-md'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left info column */}
                  <div className="flex items-start gap-3.5">
                    {/* Partner Logo */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-700/80 shrink-0 flex items-center justify-center">
                      <img
                        src={ad.logo}
                        alt={ad.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-bold text-white font-['Outfit',sans-serif] truncate">
                          {ad.name}
                        </h4>
                        
                        {/* Status badge */}
                        {currentEffectiveStatus === 'approved' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Approved
                          </span>
                        )}
                        {currentEffectiveStatus === 'pending' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3" />
                            Pending Admin Review
                          </span>
                        )}
                        {currentEffectiveStatus === 'diminished' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-950 text-orange-300 border border-orange-800 flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            Diminished (Low Frequency)
                          </span>
                        )}
                        {currentEffectiveStatus === 'expired' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-neutral-800 text-neutral-400 border border-neutral-700 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                            Expired ({ad.expiryDate})
                          </span>
                        )}
                        {currentEffectiveStatus === 'rejected' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-950 text-red-400 border border-red-800 flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-950 border border-neutral-800 text-neutral-300">
                          {ad.category}
                        </span>

                        {ad.isHotPromo && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5 text-amber-400" />
                            Hot Promo
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-neutral-200 font-semibold line-clamp-1">
                        {ad.headline}
                      </p>

                      <p className="text-[11px] text-amber-400/90 font-medium line-clamp-1">
                        Offer: {ad.offerHighlight}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400 pt-0.5">
                        <span>Expiry: <strong className={isDateExpired ? 'text-red-400' : 'text-neutral-200'}>{ad.expiryDate || 'No date'}</strong></span>
                        <span>•</span>
                        <span>Phone: <span className="text-neutral-300">{ad.phone}</span></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-neutral-500" />
                          <span>{ad.impressionsCount || 0} views</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MousePointer className="w-3 h-3 text-neutral-500" />
                          <span>{ad.clicksCount || 0} clicks</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Frequency & Weight Selector ("Select which will appear more time than others") */}
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 bg-neutral-950/80 p-2.5 rounded-xl border border-neutral-800">
                    <div className="space-y-0.5 min-w-[130px]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-400 font-medium">Appearance Frequency:</span>
                        <span className="font-bold text-white">
                          {ad.displayWeight === 5 ? '5x (VIP Top)' : ad.displayWeight === 3 ? '3x (High)' : ad.displayWeight === 2 ? '2x (Normal)' : '1x (Rare)'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 pt-1">
                        {[
                          { val: 1, label: '1x Diminished', desc: 'Rare' },
                          { val: 2, label: '2x Normal', desc: 'Normal' },
                          { val: 3, label: '3x High', desc: 'Frequent' },
                          { val: 5, label: '5x VIP', desc: 'Maximum' }
                        ].map((w) => (
                          <button
                            key={w.val}
                            onClick={() => onUpdateWeight(ad.id, w.val)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              ad.displayWeight === w.val
                                ? 'bg-red-700 text-white shadow-sm'
                                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                            }`}
                            title={`Set frequency to ${w.label} - appears ${w.val}x more often than 1x ads`}
                          >
                            {w.val}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Expiry Date quick selector */}
                    <div className="space-y-0.5 min-w-[120px]">
                      <span className="block text-[11px] text-neutral-400 font-medium">Campaign Expiry:</span>
                      <input
                        type="date"
                        value={ad.expiryDate || ''}
                        onChange={(e) => onUpdateExpiry(ad.id, e.target.value)}
                        className="w-full px-2 py-1 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
                        title="Change advert expiration date"
                      />
                    </div>
                  </div>

                  {/* Right: Moderation Action Buttons */}
                  <div className="flex items-center gap-1.5 self-end lg:self-center shrink-0">
                    {/* Approve button */}
                    {ad.status !== 'approved' && (
                      <button
                        onClick={() => onApproveAd(ad.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 hover:text-white text-xs font-bold border border-emerald-800/80 flex items-center gap-1 transition-all"
                        title="Approve advert for display on RwandaCarHub"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Approve</span>
                      </button>
                    )}

                    {/* Diminish button ("Diminish them" - reduces frequency and tags as diminished) */}
                    {ad.status !== 'diminished' && ad.status !== 'expired' && ad.status !== 'rejected' && (
                      <button
                        onClick={() => onDiminishAd(ad.id)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-orange-950 text-neutral-300 hover:text-orange-300 text-xs font-semibold border border-neutral-700 hover:border-orange-800 flex items-center gap-1 transition-all"
                        title="Diminish ad: drops appearance weight to 1x and lowers priority"
                      >
                        <TrendingDown className="w-3.5 h-3.5 text-orange-400" />
                        <span>Diminish</span>
                      </button>
                    )}

                    {/* Edit button */}
                    <button
                      onClick={() => setEditingAd(ad)}
                      className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold border border-neutral-700 transition-colors"
                      title="Edit advert content & branding"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Remove/Delete advert */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove the advert for "${ad.name}"?`)) {
                          onRemoveAd(ad.id);
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-red-950 text-neutral-400 hover:text-red-400 text-xs border border-neutral-800 hover:border-red-800 transition-colors"
                      title="Delete / Remove advert"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE NEW ADVERT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative my-8">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                Admin Campaign Creation
              </span>
              <h3 className="text-xl font-bold text-white font-['Outfit',sans-serif]">
                Add Partner or Client Advert
              </h3>
              <p className="text-xs text-neutral-400">
                Deploy an approved partner banner into the sliding header space and live ticker.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Company / Sponsor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Bank of Kigali, CFAO Toyota"
                    value={newAdForm.name}
                    onChange={(e) => setNewAdForm({ ...newAdForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Short Name (Ticker pill)</label>
                  <input
                    type="text"
                    placeholder="e.g., BK Finance, Sanlam"
                    value={newAdForm.shortName}
                    onChange={(e) => setNewAdForm({ ...newAdForm, shortName: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Main Advert Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 0% Loan Arrangement Fees for RwandaCarHub Verified Buyers"
                  value={newAdForm.headline}
                  onChange={(e) => setNewAdForm({ ...newAdForm, headline: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Offer Highlight (Yellow Tag)</label>
                <input
                  type="text"
                  placeholder="e.g., Up to 80% Vehicle Financing with 48h Pre-Approval"
                  value={newAdForm.offerHighlight}
                  onChange={(e) => setNewAdForm({ ...newAdForm, offerHighlight: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                  <select
                    value={newAdForm.category}
                    onChange={(e) => setNewAdForm({ ...newAdForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600"
                  >
                    <option value="Auto Finance">Auto Finance</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Dealership">Dealership</option>
                    <option value="Inspection">Inspection</option>
                    <option value="Fuel & Care">Fuel & Care</option>
                    <option value="Fleet & Logistics">Fleet & Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Initial Status</label>
                  <select
                    value={newAdForm.status}
                    onChange={(e) => setNewAdForm({ ...newAdForm, status: e.target.value as AdStatus })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600"
                  >
                    <option value="approved">Approved (Live)</option>
                    <option value="pending">Pending Approval</option>
                    <option value="diminished">Diminished (Low)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Appearance Weight</label>
                  <select
                    value={newAdForm.displayWeight}
                    onChange={(e) => setNewAdForm({ ...newAdForm, displayWeight: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600"
                  >
                    <option value={1}>1x (Rare / Diminished)</option>
                    <option value={2}>2x (Normal)</option>
                    <option value={3}>3x (High Priority)</option>
                    <option value={5}>5x (VIP Top Frequency)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Campaign Expiry Date</label>
                  <input
                    type="date"
                    value={newAdForm.expiryDate}
                    onChange={(e) => setNewAdForm({ ...newAdForm, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Logo URL / Image Link</label>
                  <input
                    type="url"
                    value={newAdForm.logo}
                    onChange={(e) => setNewAdForm({ ...newAdForm, logo: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newAdForm.phone}
                    onChange={(e) => setNewAdForm({ ...newAdForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={newAdForm.whatsapp}
                    onChange={(e) => setNewAdForm({ ...newAdForm, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={newAdForm.websiteUrl}
                    onChange={(e) => setNewAdForm({ ...newAdForm, websiteUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-bold shadow-lg"
                >
                  Publish Advert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ADVERT MODAL */}
      {editingAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative my-8">
            <button
              onClick={() => setEditingAd(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                Edit Partner Advert
              </span>
              <h3 className="text-xl font-bold text-white font-['Outfit',sans-serif]">
                Update {editingAd.name}
              </h3>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Headline</label>
                  <input
                    type="text"
                    required
                    value={editingAd.headline}
                    onChange={(e) => setEditingAd({ ...editingAd, headline: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Offer Highlight</label>
                  <input
                    type="text"
                    value={editingAd.offerHighlight}
                    onChange={(e) => setEditingAd({ ...editingAd, offerHighlight: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Status</label>
                  <select
                    value={editingAd.status}
                    onChange={(e) => setEditingAd({ ...editingAd, status: e.target.value as AdStatus })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending Approval</option>
                    <option value="diminished">Diminished</option>
                    <option value="expired">Expired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Display Weight</label>
                  <select
                    value={editingAd.displayWeight}
                    onChange={(e) => setEditingAd({ ...editingAd, displayWeight: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600"
                  >
                    <option value={1}>1x (Rare / Diminished)</option>
                    <option value={2}>2x (Normal)</option>
                    <option value={3}>3x (High)</option>
                    <option value={5}>5x (VIP Top Frequency)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Campaign Expiry</label>
                  <input
                    type="date"
                    value={editingAd.expiryDate || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingAd.description}
                  onChange={(e) => setEditingAd({ ...editingAd, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingAd(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-bold shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
