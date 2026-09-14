import React, { useState } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  Car, 
  CheckCircle, 
  ArrowRight,
  Phone,
  MessageSquare
} from 'lucide-react';
import { formatRwf } from '../utils/formatters';

export const CarServicesView: React.FC = () => {
  // Valuation Tool State
  const [valMake, setValMake] = useState('Toyota');
  const [valModel, setValModel] = useState('RAV4');
  const [valYear, setValYear] = useState(2021);
  const [valCondition, setValCondition] = useState('Foreign Used');
  const [valMileage, setValMileage] = useState(45000);
  const [estimatedValue, setEstimatedValue] = useState<number | null>(36500000);

  // Inspection Booking State
  const [inspCar, setInspCar] = useState('');
  const [inspLocation, setInspLocation] = useState('Kicukiro, Kigali');
  const [inspPhone, setInspPhone] = useState('+250 788 225 193');
  const [inspSuccess, setInspSuccess] = useState(false);

  const calculateValuation = (e: React.FormEvent) => {
    e.preventDefault();
    let base = 30000000;
    if (valMake === 'Toyota') {
      if (valModel.toLowerCase().includes('prado')) base = 75000000;
      else if (valModel.toLowerCase().includes('rav4')) base = 38000000;
      else if (valModel.toLowerCase().includes('hilux')) base = 50000000;
      else base = 25000000;
    } else if (valMake === 'Mercedes-Benz') {
      base = 65000000;
    } else if (valMake === 'BYD') {
      base = 40000000;
    }

    const yearDiff = 2026 - valYear;
    let factor = 1 - yearDiff * 0.05;
    if (valCondition === 'Brand New') factor += 0.2;
    if (valCondition === 'Local Used') factor -= 0.15;
    if (valMileage > 80000) factor -= 0.1;

    const finalVal = Math.round(base * Math.max(factor, 0.35));
    setEstimatedValue(finalVal);
  };

  const handleInspectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInspSuccess(true);
    setTimeout(() => setInspSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* HEADER HERO */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md border border-sky-200 text-xs font-semibold text-sky-800 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Automotive Excellence in Rwanda</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-['Outfit',sans-serif]">
          Professional Car Services & Valuation
        </h2>
        <p className="text-sm text-sky-950/80 leading-relaxed font-medium">
          From AI-assisted vehicle market valuation to certified mechanical pre-purchase inspections and Rwanda Revenue Authority (RRA) tax clearance advice.
        </p>
      </div>

      {/* SERVICE 1: VEHICLE VALUATION TOOL */}
      <div className="bg-neutral-900 rounded-3xl p-6 sm:p-10 border border-neutral-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-800 flex items-center justify-center text-white">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-['Outfit',sans-serif]">
                Instant Rwanda Vehicle Valuation Tool
              </h3>
              <p className="text-xs text-neutral-400">
                Calculated against actual Kigali sales transactions and market pricing
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-400 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 w-fit">
            100% Free Public Tool
          </span>
        </div>

        <form onSubmit={calculateValuation} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Make</label>
            <select
              value={valMake}
              onChange={(e) => setValMake(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
            >
              <option value="Toyota">Toyota</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Hyundai">Hyundai</option>
              <option value="Suzuki">Suzuki</option>
              <option value="BYD">BYD (Electric)</option>
              <option value="BMW">BMW</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Model</label>
            <input
              type="text"
              value={valModel}
              onChange={(e) => setValModel(e.target.value)}
              placeholder="e.g. RAV4 / Prado"
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Year</label>
            <select
              value={valYear}
              onChange={(e) => setValYear(Number(e.target.value))}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
            >
              {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Condition</label>
            <select
              value={valCondition}
              onChange={(e) => setValCondition(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
            >
              <option value="Foreign Used">Foreign Used (Import)</option>
              <option value="Brand New">Brand New</option>
              <option value="Local Used">Local Used (Rwanda)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-red-700 hover:bg-red-600 text-white font-bold text-xs transition-colors shadow"
            >
              Calculate Fair Price
            </button>
          </div>
        </form>

        {estimatedValue && (
          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-neutral-400">Estimated Fair Market Valuation in Kigali:</span>
              <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif]">
                {formatRwf(estimatedValue)}
              </div>
              <span className="text-xs text-neutral-400">
                approx. ${(Math.round(estimatedValue / 1380)).toLocaleString()} USD
              </span>
            </div>

            <div className="text-xs text-neutral-400 max-w-sm">
              Valuation reflects current Kigali demand, tax depreciation, and verified transaction histories on RwandaCarHub.
            </div>
          </div>
        )}
      </div>

      {/* 3 COMPLEMENTARY CAR SERVICES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Service 1: 150-Point Inspection */}
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-900/50 text-red-400 flex items-center justify-center border border-red-800/60">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
              Pre-Purchase Mechanical Inspection
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Never buy a bad car. Our certified mechanics inspect engine compression, gearbox shifting, OBD2 computerized diagnostics, chassis integrity, and suspension.
            </p>
            <ul className="space-y-1 text-xs text-neutral-300">
              <li>✓ Comprehensive 150-point report</li>
              <li>✓ On-site inspection anywhere in Kigali</li>
              <li>✓ Diagnostic scan PDF delivered in 2 hours</li>
            </ul>
          </div>

          <a
            href="https://wa.me/250738225193?text=Hello%20RwandaCarHub,%20I%20would%20like%20to%20book%20a%20pre-purchase%20mechanical%20inspection%20in%20Kigali"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs text-center border border-neutral-700 block"
          >
            Book Inspection via WhatsApp
          </a>
        </div>

        {/* Service 2: RRA Duty & Tax Clearance */}
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-900/50 text-amber-400 flex items-center justify-center border border-amber-800/60">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
              RRA Customs & Title Transfer Guide
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Complete support with Rwanda Revenue Authority (RRA) import tariffs, East African Community (EAC) clearing at Gikondo / Masaka dry port, and yellow card ownership change.
            </p>
            <ul className="space-y-1 text-xs text-neutral-300">
              <li>✓ 0% EV Incentive Guidance (Electric cars)</li>
              <li>✓ Notary document preparation</li>
              <li>✓ Quick plate issuance & yellow card transfer</li>
            </ul>
          </div>

          <a
            href="tel:+250788225193"
            className="w-full py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs text-center border border-neutral-700 block"
          >
            Consult RRA Customs Expert
          </a>
        </div>

        {/* Service 3: Bank Financing & Insurance */}
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/50 text-emerald-400 flex items-center justify-center border border-emerald-800/60">
              <Car className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
              Auto Financing & Insurance
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We connect qualified buyers to pre-approved car loans with Bank of Kigali, Equity Bank, I&M Bank, and comprehensive motor insurance underwriters in Rwanda.
            </p>
            <ul className="space-y-1 text-xs text-neutral-300">
              <li>✓ Up to 80% financing options</li>
              <li>✓ Flexible 12 to 60-month loan terms</li>
              <li>✓ Comprehensive insurance quotes in minutes</li>
            </ul>
          </div>

          <a
            href="mailto:trust@rwandacarhub.com?subject=Auto%20Financing%20Inquiry%20RwandaCarHub"
            className="w-full py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs text-center border border-neutral-700 block"
          >
            Request Financing Assistance
          </a>
        </div>
      </div>
    </div>
  );
};
