import React from 'react';
import { X, Layers, Trash2, ArrowRight } from 'lucide-react';
import { Vehicle } from '../types';
import { formatPrice } from '../utils/formatters';

interface ComparisonDrawerProps {
  vehicles: Vehicle[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveVehicle: (id: string) => void;
  onClearAll: () => void;
  currency: 'RWF' | 'USD';
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  vehicles,
  isOpen,
  onClose,
  onRemoveVehicle,
  onClearAll,
  currency,
  onSelectVehicle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* TOP BAR */}
        <div className="px-6 py-4 bg-[#0a0f1d] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/40">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit',sans-serif]">
                Vehicle Comparison Matrix
              </h3>
              <p className="text-xs text-slate-400">
                Comparing {vehicles.length} vehicle{vehicles.length > 1 ? 's' : ''} side-by-side
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {vehicles.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-slate-400 hover:text-blue-400 flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-800"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#0a0f1d] hover:bg-slate-800 text-slate-300 transition-colors border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* COMPARISON TABLE */}
        <div className="overflow-x-auto overflow-y-auto p-4 sm:p-6">
          {vehicles.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Layers className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No vehicles selected for comparison.</p>
              <p className="text-xs text-slate-500">Click the compare icon (stacked layers) on any vehicle card to add it here.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <th className="p-3 bg-[#0a0f1d] text-xs font-bold text-slate-400 uppercase w-48 sticky left-0 z-10 border-b border-slate-800">
                    Vehicle
                  </th>
                  {vehicles.map((car) => (
                    <th key={car.id} className="p-3 bg-[#0a0f1d]/80 border-b border-slate-800 min-w-[240px]">
                      <div className="space-y-2">
                        <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-[#0a0f1d] border border-slate-800">
                          <img src={car.images[0]} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => onRemoveVehicle(car.id)}
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white hover:bg-blue-600 transition-colors"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-[8px] text-white/80 font-mono">
                            www.rwandacarhub.com
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-white truncate font-['Outfit',sans-serif]">
                            {car.year} {car.make} {car.model}
                          </h4>
                          <span className="text-xs font-extrabold text-blue-400">
                            {formatPrice(car.priceRwf, car.priceUsd, currency)}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onSelectVehicle(car);
                          }}
                          className="w-full py-1.5 px-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow"
                        >
                          <span>Full Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
                <tr>
                  <td className="p-3 bg-[#0a0f1d]/90 font-semibold text-slate-400 sticky left-0 z-10">
                    Purpose / Market
                  </td>
                  {vehicles.map((car) => (
                    <td key={car.id} className="p-3 capitalize font-bold text-white">
                      {car.purpose === 'buy' ? 'For Sale' : car.purpose === 'rent' ? 'For Rent' : 'For Lease'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-[#0a0f1d]/90 font-semibold text-slate-400 sticky left-0 z-10">
                    Price (USD Approx)
                  </td>
                  {vehicles.map((car) => (
                    <td key={car.id} className="p-3 text-slate-200">
                      ${car.priceUsd.toLocaleString()} USD
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-[#0a0f1d]/90 font-semibold text-slate-400 sticky left-0 z-10">
                    Condition
                  </td>
                  {vehicles.map((car) => (
                    <td key={car.id} className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-semibold">
                        {car.condition}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-[#0a0f1d]/90 font-semibold text-slate-400 sticky left-0 z-10">
                    Mileage
                  </td>
                  {vehicles.map((car) => (
                    <td key={car.id} className="p-3 font-semibold text-white">
                      {car.mileageKm.toLocaleString()} km
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-[#0a0f1d]/90 font-semibold text-slate-400 sticky left-0 z-10">
                    Transmission
                  </td>
                  {vehicles.map((car) => (
                    <td key={car.id} className="p-3">
                      {car.transmission}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-[#0a0f1d]/90 font-semibold text-slate-400 sticky left-0 z-10">
                    Fuel Type
                  </td>
                  {vehicles.map((car) => (
                    <td key={car.id} className="p-3">
                      {car.fuelType}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-[#0a0f1d]/90 font-semibold text-slate-400 sticky left-0 z-10">
                    Engine / Specs
                  </td>
                  {vehicles.map((car) => (
                    <td key={car.id} className="p-3">
                      {car.engineSize || 'Standard'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-[#0a0f1d]/90 font-semibold text-slate-400 sticky left-0 z-10">
                    Body Style
                  </td>
                  {vehicles.map((car) => (
                    <td key={car.id} className="p-3">
                      {car.bodyType}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-[#0a0f1d]/90 font-semibold text-slate-400 sticky left-0 z-10">
                    Kigali Location
                  </td>
                  {vehicles.map((car) => (
                    <td key={car.id} className="p-3">
                      {car.location}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-[#0a0f1d]/90 font-semibold text-slate-400 sticky left-0 z-10">
                    Verified Seller
                  </td>
                  {vehicles.map((car) => (
                    <td key={car.id} className="p-3">
                      <span className="text-blue-400 font-semibold">✓ {car.seller.dealerName || car.seller.name}</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
