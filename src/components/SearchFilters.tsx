import React, { useState, useMemo } from 'react';
import { 
  Search, 
  RotateCcw, 
  SlidersHorizontal, 
  MapPin, 
  Fuel, 
  Car, 
  ShieldAlert,
  ChevronDown,
  X,
  Check,
  Sparkles
} from 'lucide-react';
import { FilterState, VehiclePurpose } from '../types';

interface SearchFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalCount: number;
  availableMakes: string[];
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  availableMakes
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Calculate number of active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.make) count++;
    if (filters.bodyType) count++;
    if (filters.location) count++;
    if (filters.fuelType) count++;
    if (filters.transmission) count++;
    if (filters.condition) count++;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.purpose !== 'all') count++;
    return count;
  }, [filters]);

  // Top popular makes in Rwanda for quick scroll pills
  const popularMakes = useMemo(() => {
    const defaultPopular = ['Toyota', 'Mercedes-Benz', 'Land Rover', 'Hyundai', 'Nissan', 'BMW', 'BYD'];
    const list = ['All Makes', ...defaultPopular.filter(m => availableMakes.includes(m))];
    availableMakes.forEach(m => {
      if (!list.includes(m)) list.push(m);
    });
    return list;
  }, [availableMakes]);

  return (
    <div id="search-filters-panel" className="bg-neutral-900/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-neutral-800 p-3.5 sm:p-6 shadow-2xl space-y-3 sm:space-y-4">
      {/* 1. PURPOSE CATEGORY TABS & SORT ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 sm:pb-3 border-b border-neutral-800/80">
        {/* Purpose Pills with Horizontal Scroll on Mobile */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-950 rounded-xl border border-neutral-800/90 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => onFilterChange({ purpose: 'all' })}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              filters.purpose === 'all'
                ? 'bg-red-800 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Cars ({totalCount})
          </button>
          <button
            onClick={() => onFilterChange({ purpose: 'buy' })}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              filters.purpose === 'buy'
                ? 'bg-red-800 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => onFilterChange({ purpose: 'rent' })}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              filters.purpose === 'rent'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Rent 4x4
          </button>
          <button
            onClick={() => onFilterChange({ purpose: 'lease' })}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              filters.purpose === 'lease'
                ? 'bg-indigo-700 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Lease
          </button>
        </div>

        {/* Sort selector & Count display */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
          <span className="text-neutral-400 font-medium sm:hidden">
            <strong>{totalCount}</strong> found
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 hidden sm:inline">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-red-500 cursor-pointer"
              aria-label="Sort vehicles"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="year-desc">Year: Newest First</option>
              <option value="mileage-asc">Mileage: Lowest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY SEARCH INPUT & ADVANCED TOGGLE */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search make, model, or Kigali area (e.g. Prado, RAV4, Hybrid)..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-9 py-2.5 sm:py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-600 transition-colors shadow-inner"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Drawer Toggle Button */}
        <button
          id="toggle-advanced-filters-btn"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className={`px-4 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            showAdvanced || activeFiltersCount > (filters.purpose !== 'all' ? 1 : 0)
              ? 'bg-red-950/60 border-red-700 text-white shadow-md'
              : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-red-400" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-extrabold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180 text-white' : 'text-neutral-400'}`} />
        </button>
      </div>

      {/* 3. QUICK MAKE / BRAND HORIZONTAL PILLS (Super easy on mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
        <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap hidden sm:inline pl-1">
          Brands:
        </span>
        {popularMakes.map((m) => {
          const isAll = m === 'All Makes';
          const isSelected = isAll ? !filters.make : filters.make.toLowerCase() === m.toLowerCase();
          return (
            <button
              key={m}
              onClick={() => onFilterChange({ make: isAll ? '' : m })}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? 'bg-red-700 text-white font-bold shadow-md shadow-red-950/50 scale-[1.02]'
                  : 'bg-neutral-950/90 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800/90'
              }`}
            >
              {m}
            </button>
          );
        })}
      </div>

      {/* 4. EXPANDABLE ADVANCED FILTERS PANEL */}
      {showAdvanced && (
        <div className="pt-3 border-t border-neutral-800/80 space-y-4 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* PRIMARY DROPDOWNS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Make */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Make / Brand</label>
              <select
                value={filters.make}
                onChange={(e) => onFilterChange({ make: e.target.value })}
                className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-red-600"
              >
                <option value="">All Makes</option>
                {availableMakes.map((mk) => (
                  <option key={mk} value={mk}>{mk}</option>
                ))}
              </select>
            </div>

            {/* Body Type */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Body Type</label>
              <select
                value={filters.bodyType}
                onChange={(e) => onFilterChange({ bodyType: e.target.value })}
                className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-red-600"
              >
                <option value="">All Body Types</option>
                <option value="SUV">SUV & 4x4</option>
                <option value="Sedan">Sedan</option>
                <option value="Pickup Truck">Pickup Truck</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Van / Bus">Van & Bus</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Kigali Location</label>
              <select
                value={filters.location}
                onChange={(e) => onFilterChange({ location: e.target.value })}
                className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-red-600"
              >
                <option value="">All Kigali Locations</option>
                <option value="Kicukiro">Kicukiro</option>
                <option value="Gasabo">Gasabo</option>
                <option value="Nyarugenge">Nyarugenge</option>
                <option value="Remera">Remera</option>
                <option value="Gisozi">Gisozi</option>
                <option value="Kimihurura">Kimihurura</option>
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Vehicle Condition</label>
              <select
                value={filters.condition}
                onChange={(e) => onFilterChange({ condition: e.target.value })}
                className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-red-600"
              >
                <option value="">Any Condition</option>
                <option value="Foreign Used">Foreign Used (Clean Import)</option>
                <option value="Local Used">Local Used (Rwanda Plate)</option>
                <option value="Brand New">Brand New</option>
              </select>
            </div>

            {/* Availability Status */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Availability Status</label>
              <select
                id="filter-availability-status"
                value={filters.status || 'all'}
                onChange={(e) => onFilterChange({ status: e.target.value as any })}
                className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-red-600"
              >
                <option value="all">All Statuses (Available, Sold...)</option>
                <option value="available">🟢 Available in Stock</option>
                <option value="sold">🔴 Sold (Yagurishijwe)</option>
                <option value="rented">🟡 Rented Out</option>
                <option value="leased">🟣 Leased</option>
              </select>
            </div>
          </div>

          {/* SECONDARY SPECIFICATION PILLS (Fuel & Transmission) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Fuel Type */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-neutral-400" /> Fuel Type:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {['', 'Petrol', 'Diesel', 'Hybrid', 'Electric'].map((fuel) => (
                  <button
                    key={fuel}
                    type="button"
                    onClick={() => onFilterChange({ fuelType: fuel })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filters.fuelType === fuel
                        ? 'bg-red-800 text-white font-bold shadow'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {fuel || 'Any Fuel'}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-neutral-400" /> Transmission:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {['', 'Automatic', 'Manual'].map((trans) => (
                  <button
                    key={trans}
                    type="button"
                    onClick={() => onFilterChange({ transmission: trans })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filters.transmission === trans
                        ? 'bg-red-800 text-white font-bold shadow'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {trans || 'Any Transmission'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. ACTIVE FILTER TAGS & RESET ROW */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800/60 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-neutral-400 text-[11px]">Active:</span>

            {filters.purpose !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-200 border border-neutral-700">
                {filters.purpose === 'buy' ? 'Buy' : filters.purpose === 'rent' ? 'Rent' : 'Lease'}
                <button onClick={() => onFilterChange({ purpose: 'all' })} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.make && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800">
                {filters.make}
                <button onClick={() => onFilterChange({ make: '' })} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.bodyType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-200 border border-neutral-700">
                {filters.bodyType}
                <button onClick={() => onFilterChange({ bodyType: '' })} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.location && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-200 border border-neutral-700">
                📍 {filters.location}
                <button onClick={() => onFilterChange({ location: '' })} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.condition && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-200 border border-neutral-700">
                {filters.condition}
                <button onClick={() => onFilterChange({ condition: '' })} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.status && filters.status !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-200 border border-neutral-700 capitalize">
                Status: {filters.status}
                <button onClick={() => onFilterChange({ status: 'all' })} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.fuelType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-200 border border-neutral-700">
                ⛽ {filters.fuelType}
                <button onClick={() => onFilterChange({ fuelType: '' })} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.transmission && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-200 border border-neutral-700">
                ⚙️ {filters.transmission}
                <button onClick={() => onFilterChange({ transmission: '' })} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <button
            onClick={onResetFilters}
            className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 ml-auto transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}
    </div>
  );
};
