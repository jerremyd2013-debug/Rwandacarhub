import React, { useState, useMemo } from 'react';
import { Search, Sparkles, ChevronRight, Car, Compass, Globe2 } from 'lucide-react';
import { CAR_BRANDS_METADATA, CarBrandInfo } from '../data/carConstants';

interface CarBrandsShowcaseProps {
  onSelectBrand?: (brandName: string) => void;
  className?: string;
}

export const CarBrandsShowcase: React.FC<CarBrandsShowcaseProps> = ({
  onSelectBrand,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [originFilter, setOriginFilter] = useState<'All' | 'Japan' | 'Germany' | 'USA' | 'South Korea' | 'France' | 'China'>('All');

  const filteredBrands = useMemo(() => {
    return CAR_BRANDS_METADATA.filter((brand) => {
      const matchesSearch =
        brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.popularModels.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
        brand.badge.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOrigin = originFilter === 'All' || brand.country === originFilter;
      return matchesSearch && matchesOrigin;
    });
  }, [searchQuery, originFilter]);

  return (
    <section 
      id="car-brands-and-logos-section"
      className={`py-12 sm:py-16 bg-[#0a0f1d] border-t border-slate-800 text-slate-100 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/70 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Verified Automotive Manufacturers</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-['Outfit',sans-serif]">
              Car Brands and Logos
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Explore trusted global automotive brands available on RwandaCarHub. From rugged Japanese 4x4s (Mazda, Subaru, Toyota) to German luxury, American muscle (Ford, Tesla), Korean tech (Kia, Genesis), French elegance (Citroën, Peugeot), and next-generation EVs (Nio, Xpeng, Geely, BYD).
            </p>
          </div>

          {/* SEARCH & ORIGIN FILTER CONTROLS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Find brand or model (e.g. Mazda, CX-5, Tesla)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0f172a] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* REGION FILTER PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0 pl-1">
            <Globe2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Region:</span>
          </span>
          {(['All', 'Japan', 'Germany', 'USA', 'South Korea', 'France', 'China'] as const).map((region) => (
            <button
              key={region}
              onClick={() => setOriginFilter(region)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all shrink-0 ${
                originFilter === region
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-900/40'
                  : 'bg-[#0f172a] text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {region === 'All' ? 'All Origins (22+ Brands)' : region}
            </button>
          ))}
        </div>

        {/* BRANDS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {filteredBrands.map((brand) => (
            <div
              key={brand.name}
              onClick={() => onSelectBrand?.(brand.name)}
              className="group relative bg-[#0f172a] hover:bg-[#131d36] border border-slate-800 hover:border-blue-500/60 rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/40 cursor-pointer overflow-hidden"
            >
              {/* Top Origin Tag */}
              <div className="w-full flex items-center justify-between text-[10px] text-slate-400 mb-2">
                <span className="font-semibold px-2 py-0.5 rounded-full bg-[#0a0f1d] border border-slate-800">
                  {brand.country}
                </span>
                <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* LOGO EMBLEM CONTAINER */}
              <div 
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#0a0f1d] border border-slate-800/90 group-hover:border-blue-500/40 flex items-center justify-center p-2 mb-3 shadow-inner transition-colors"
                dangerouslySetInnerHTML={{ __html: brand.logoSvg }}
              />

              {/* BRAND NAME */}
              <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-blue-400 transition-colors font-['Outfit',sans-serif]">
                {brand.name}
              </h3>

              {/* BRAND BADGE */}
              <div className="text-[11px] font-semibold text-blue-300 mt-1 line-clamp-1">
                {brand.badge}
              </div>

              {/* POPULAR MODELS IN RWANDA */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 w-full text-[10px] text-slate-400 line-clamp-1">
                {brand.popularModels.slice(0, 2).join(' • ')}
              </div>

              {/* HOVER CALL TO ACTION */}
              <div className="mt-3 text-[11px] font-bold text-blue-400 group-hover:underline flex items-center gap-1 opacity-90">
                <span>View {brand.name} Cars</span>
              </div>
            </div>
          ))}
        </div>

        {filteredBrands.length === 0 && (
          <div className="p-12 text-center bg-[#0f172a] rounded-2xl border border-slate-800 space-y-3">
            <Car className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No car brands match your search</h4>
            <p className="text-xs text-slate-400">Try clearing the search box or selecting &ldquo;All Origins&rdquo;.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setOriginFilter('All');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
