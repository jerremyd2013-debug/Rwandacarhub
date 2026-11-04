import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Search, 
  Filter, 
  Car, 
  Megaphone, 
  ShieldCheck, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Calendar, 
  Activity, 
  Layers,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Eye,
  Trash2,
  FileText
} from 'lucide-react';
import { ActivityLog, ActivityType } from '../types';

interface AdminActivityLogProps {
  logs: ActivityLog[];
  onNavigateTab?: (tab: 'inventory' | 'adverts' | 'approvals' | 'listings') => void;
  onClearLogs?: () => void;
}

export const AdminActivityLog: React.FC<AdminActivityLogProps> = ({
  logs,
  onNavigateTab,
  onClearLogs
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'vehicles' | 'adverts' | 'accounts'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Filtered logs calculation
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Category filter
      if (selectedCategory !== 'all' && log.category !== selectedCategory) {
        return false;
      }
      // Type filter
      if (selectedType !== 'all' && log.type !== selectedType) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = log.title.toLowerCase().includes(query);
        const matchesDesc = log.description.toLowerCase().includes(query);
        const matchesActor = log.actor.name.toLowerCase().includes(query) || (log.actor.email || '').toLowerCase().includes(query);
        const matchesEntity = (log.metadata?.entityName || '').toLowerCase().includes(query);
        const matchesTag = (log.metadata?.tag || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesActor && !matchesEntity && !matchesTag) {
          return false;
        }
      }
      return true;
    });
  }, [logs, selectedCategory, selectedType, searchQuery]);

  // Aggregate Metrics
  const vehicleActivitiesCount = useMemo(() => logs.filter((l) => l.category === 'vehicles').length, [logs]);
  const advertActivitiesCount = useMemo(() => logs.filter((l) => l.category === 'adverts').length, [logs]);
  const accountActivitiesCount = useMemo(() => logs.filter((l) => l.category === 'accounts').length, [logs]);

  // Helper for icon rendering based on action type
  const renderActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'vehicle_added':
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-sm">
            <Car className="w-5 h-5 text-blue-400" />
          </div>
        );
      case 'vehicle_status':
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-sm">
            <RefreshCw className="w-5 h-5 text-amber-400" />
          </div>
        );
      case 'vehicle_deleted':
        return (
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0 shadow-sm">
            <Trash2 className="w-5 h-5 text-rose-400" />
          </div>
        );
      case 'ad_status':
      case 'ad_added':
        return (
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0 shadow-sm">
            <Megaphone className="w-5 h-5 text-purple-400" />
          </div>
        );
      case 'ad_removed':
        return (
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0 shadow-sm">
            <XCircle className="w-5 h-5 text-rose-400" />
          </div>
        );
      case 'account_approval':
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
        );
      case 'account_registered':
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-sm">
            <UserCheck className="w-5 h-5 text-blue-400" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-slate-300" />
          </div>
        );
    }
  };

  // Helper for status badge colors
  const getBadgeClass = (state?: string) => {
    const s = (state || '').toLowerCase();
    if (s.includes('available') || s.includes('approved') || s.includes('active')) {
      return 'bg-emerald-950/60 text-emerald-400 border-emerald-700/60';
    }
    if (s.includes('sold')) {
      return 'bg-slate-800 text-slate-300 border-slate-700';
    }
    if (s.includes('rent') || s.includes('lease') || s.includes('vip')) {
      return 'bg-blue-950/60 text-blue-300 border-blue-700/60';
    }
    if (s.includes('pending') || s.includes('review') || s.includes('diminished')) {
      return 'bg-amber-950/60 text-amber-300 border-amber-700/60';
    }
    if (s.includes('reject') || s.includes('deleted') || s.includes('removed')) {
      return 'bg-rose-950/60 text-rose-300 border-rose-800/60';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="space-y-6">
      {/* HEADER & CONTROLS */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Administrator Audit Center
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Audit Active
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif] mt-1">
              Marketplace Activity & Audit Log
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
              Real-time audit trail capturing all changes made to vehicle inventory status, partner advertisements, and user account approvals across RwandaCarHub.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onNavigateTab && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateTab('inventory')}
                  className="px-3 py-1.5 rounded-xl bg-[#0a0f1d] hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Car className="w-3.5 h-3.5 text-blue-400" />
                  <span>Go to Vehicles</span>
                </button>
                <button
                  onClick={() => onNavigateTab('adverts')}
                  className="px-3 py-1.5 rounded-xl bg-[#0a0f1d] hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Megaphone className="w-3.5 h-3.5 text-purple-400" />
                  <span>Go to Adverts</span>
                </button>
                <button
                  onClick={() => onNavigateTab('approvals')}
                  className="px-3 py-1.5 rounded-xl bg-[#0a0f1d] hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Go to Approvals</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div 
            onClick={() => { setSelectedCategory('all'); setSelectedType('all'); }}
            className={`p-3 sm:p-4 rounded-xl border cursor-pointer transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#0a0f1d] border-blue-500 shadow-md ring-1 ring-blue-500/30'
                : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Total Logged</span>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1.5">{logs.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Marketplace actions</div>
          </div>

          <div 
            onClick={() => setSelectedCategory('vehicles')}
            className={`p-3 sm:p-4 rounded-xl border cursor-pointer transition-all ${
              selectedCategory === 'vehicles'
                ? 'bg-[#0a0f1d] border-blue-500 shadow-md ring-1 ring-blue-500/30'
                : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold text-blue-300">Vehicle Changes</span>
              <Car className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-blue-400 mt-1.5">{vehicleActivitiesCount}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Status, posts, deletions</div>
          </div>

          <div 
            onClick={() => setSelectedCategory('adverts')}
            className={`p-3 sm:p-4 rounded-xl border cursor-pointer transition-all ${
              selectedCategory === 'adverts'
                ? 'bg-[#0a0f1d] border-purple-500 shadow-md ring-1 ring-purple-500/30'
                : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold text-purple-300">Advert & Partners</span>
              <Megaphone className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-400 mt-1.5">{advertActivitiesCount}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Approvals, boosts, weights</div>
          </div>

          <div 
            onClick={() => setSelectedCategory('accounts')}
            className={`p-3 sm:p-4 rounded-xl border cursor-pointer transition-all ${
              selectedCategory === 'accounts'
                ? 'bg-[#0a0f1d] border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold text-emerald-300">Account Approvals</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1.5">{accountActivitiesCount}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Verified dealers & users</div>
          </div>
        </div>

        {/* SEARCH AND FILTER BAR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by action, vehicle name, partner ad, user, or tag..."
              className="w-full pl-10 pr-4 py-2 bg-[#0a0f1d] rounded-xl text-xs text-white border border-slate-800 focus:outline-none focus:border-blue-500 placeholder-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#0a0f1d] p-1 rounded-xl border border-slate-800 text-xs font-semibold overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({logs.length})
            </button>
            <button
              onClick={() => setSelectedCategory('vehicles')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === 'vehicles'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Vehicles ({vehicleActivitiesCount})
            </button>
            <button
              onClick={() => setSelectedCategory('adverts')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === 'adverts'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Adverts ({advertActivitiesCount})
            </button>
            <button
              onClick={() => setSelectedCategory('accounts')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === 'accounts'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Accounts ({accountActivitiesCount})
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVITY TIMELINE CARDS */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center bg-[#0f172a] rounded-2xl border border-slate-800 space-y-3">
            <Activity className="w-10 h-10 text-slate-500 mx-auto" />
            <h4 className="text-base font-bold text-white">No activity logs found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No audit logs matched your current search criteria. Try clearing your filters or search query.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedType('all');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const hasStateTransition = Boolean(log.metadata?.previousState && log.metadata?.newState);

            return (
              <div
                key={log.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-slate-800/90 hover:border-slate-700 transition-all shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* ICON & MAIN INFO */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {renderActivityIcon(log.type)}

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm sm:text-base tracking-tight font-['Outfit',sans-serif]">
                        {log.title}
                      </span>

                      {/* Tag pill */}
                      {log.metadata?.tag && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0a0f1d] text-slate-300 border border-slate-800">
                          {log.metadata.tag}
                        </span>
                      )}

                      {/* Category Pill */}
                      <span className="px-2 py-0.2 rounded text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        • {log.category}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed break-words">
                      {log.description}
                    </p>

                    {/* METADATA: ACTOR + TIME + TRANSITIONS */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs text-slate-400 pt-1">
                      {/* Actor */}
                      <div className="flex items-center gap-1 font-medium text-slate-300">
                        <span className="text-slate-500 font-normal">By:</span>
                        <span className="text-white font-semibold">{log.actor.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {log.actor.role}
                        </span>
                      </div>

                      <span className="text-slate-700 hidden xs:inline">•</span>

                      {/* Timestamp */}
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{log.timestamp}</span>
                      </div>

                      {/* State transition pills (e.g. available -> sold) */}
                      {hasStateTransition && (
                        <>
                          <span className="text-slate-700 hidden sm:inline">•</span>
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                            <span className="text-slate-500 font-normal">Transition:</span>
                            <span className={`px-2 py-0.5 rounded-full border ${getBadgeClass(log.metadata?.previousState)}`}>
                              {log.metadata?.previousState}
                            </span>
                            <ArrowRight className="w-3 h-3 text-slate-500" />
                            <span className={`px-2 py-0.5 rounded-full border ${getBadgeClass(log.metadata?.newState)}`}>
                              {log.metadata?.newState}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* CONTEXTUAL ACTION SHORTCUT */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {log.category === 'vehicles' && onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('inventory')}
                      className="px-3 py-1.5 rounded-xl bg-[#0a0f1d] hover:bg-slate-800 text-blue-400 hover:text-blue-300 text-xs font-semibold border border-slate-800 transition-colors flex items-center gap-1"
                    >
                      <span>View Inventory</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  {log.category === 'adverts' && onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('adverts')}
                      className="px-3 py-1.5 rounded-xl bg-[#0a0f1d] hover:bg-slate-800 text-purple-400 hover:text-purple-300 text-xs font-semibold border border-slate-800 transition-colors flex items-center gap-1"
                    >
                      <span>View Adverts</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  {log.category === 'accounts' && onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('approvals')}
                      className="px-3 py-1.5 rounded-xl bg-[#0a0f1d] hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 text-xs font-semibold border border-slate-800 transition-colors flex items-center gap-1"
                    >
                      <span>View Accounts</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
