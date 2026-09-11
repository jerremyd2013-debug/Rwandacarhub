import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Car, 
  Sparkles, 
  CreditCard, 
  Smartphone, 
  Upload, 
  ShieldCheck, 
  ArrowRight,
  ArrowLeft,
  UserCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Vehicle, ListingPricingPlan, UserAccount } from '../types';
import { LISTING_PRICING_PLANS } from '../data/cars';

interface PostCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCar: (newCar: Vehicle) => void;
  currentUser?: UserAccount | null;
  onOpenAuthModal?: () => void;
  initialPlanId?: string;
}

export const PostCarModal: React.FC<PostCarModalProps> = ({
  isOpen,
  onClose,
  onAddCar,
  currentUser,
  onOpenAuthModal,
  initialPlanId
}) => {
  if (!isOpen) return null;

  const defaultPlan = (initialPlanId 
    ? LISTING_PRICING_PLANS.find((p) => p.id === initialPlanId) 
    : (currentUser ? LISTING_PRICING_PLANS[0] : LISTING_PRICING_PLANS[1])) || LISTING_PRICING_PLANS[0];

  const [step, setStep] = useState<'plan' | 'details' | 'payment' | 'success'>('plan');
  const [selectedPlan, setSelectedPlan] = useState<ListingPricingPlan>(defaultPlan);

  // Form Fields
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(2022);
  const [purpose, setPurpose] = useState<'buy' | 'rent' | 'lease'>('buy');
  const [priceRwf, setPriceRwf] = useState<number>(25000000);
  const [mileageKm, setMileageKm] = useState<number>(35000);
  const [transmission, setTransmission] = useState<'Automatic' | 'Manual'>('Automatic');
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'Hybrid' | 'Electric'>('Petrol');
  const [bodyType, setBodyType] = useState<'SUV' | 'Sedan' | 'Pickup Truck' | 'Hatchback' | 'Van / Bus' | 'Luxury'>('SUV');
  const [condition, setCondition] = useState<'Brand New' | 'Foreign Used' | 'Local Used'>('Foreign Used');
  const [location, setLocation] = useState('Kigali, Kicukiro');
  const [sellerName, setSellerName] = useState(currentUser?.name || '');
  const [sellerPhone, setSellerPhone] = useState(currentUser?.phone || '+250 788 225 193');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1000&auto=format&fit=crop&q=80');

  // Payment simulation
  const [momoNumber, setMomoNumber] = useState('0788225193');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [accountGateNotice, setAccountGateNotice] = useState(false);

  const calculatedUsd = Math.round(priceRwf / 1380);

  const handleProceedToDetails = () => {
    if (selectedPlan.requiresAccount && !currentUser) {
      setAccountGateNotice(true);
      return;
    }
    setAccountGateNotice(false);
    setStep('details');
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model || !sellerName) {
      alert('Please fill out the vehicle model and your seller name.');
      return;
    }
    setStep('payment');
  };

  const handleConfirmPaymentAndPublish = () => {
    setPaymentProcessing(true);

    setTimeout(() => {
      setPaymentProcessing(false);

      const createdVehicle: Vehicle = {
        id: `user-car-${Date.now()}`,
        make,
        model,
        year,
        priceRwf: Number(priceRwf),
        priceUsd: calculatedUsd,
        purpose,
        mileageKm: Number(mileageKm),
        transmission,
        fuelType,
        bodyType,
        color: 'Clean Finish',
        location,
        condition,
        seller: {
          name: sellerName || currentUser?.name || 'Verified Kigali Seller',
          phone: sellerPhone || currentUser?.phone || '+250 788 225 193',
          whatsapp: sellerPhone || currentUser?.phone || '+250 788 225 193',
          email: currentUser?.email || 'seller@rwandacarhub.com',
          isVerified: true,
          rating: 5.0,
          reviewCount: 1,
          dealerName: currentUser?.companyName || sellerName
        },
        images: [
          imageUrl,
          'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1000&auto=format&fit=crop&q=80'
        ],
        features: [
          'Air Conditioning',
          'Power Steering',
          'Reverse Camera',
          'Alloy Wheels',
          'RRA Duty Clearance Passed'
        ],
        description: description || `Certified ${year} ${make} ${model} in great condition located in ${location}. Ready for transfer and road inspection.`,
        isFeatured: true,
        postedDate: new Date().toISOString().split('T')[0]
      };

      onAddCar(createdVehicle);
      setStep('success');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-700 flex items-center justify-center text-white">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit',sans-serif]">
                Post Your Car on RwandaCarHub
              </h3>
              <p className="text-xs text-neutral-400">
                Kigali & Rwanda-wide Marketplace Listings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP PROGRESS INDICATOR */}
        <div className="bg-neutral-950/60 px-6 py-3 border-b border-neutral-800/80 flex items-center justify-center gap-2 sm:gap-6 text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step === 'plan' ? 'text-red-400 font-bold' : 'text-neutral-400'}`}>
            <span className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px]">1</span>
            <span>Choose Plan</span>
          </div>
          <span className="text-neutral-600">→</span>
          <div className={`flex items-center gap-1.5 ${step === 'details' ? 'text-red-400 font-bold' : 'text-neutral-400'}`}>
            <span className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px]">2</span>
            <span>Car Details</span>
          </div>
          <span className="text-neutral-600">→</span>
          <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-red-400 font-bold' : 'text-neutral-400'}`}>
            <span className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px]">3</span>
            <span>{selectedPlan.priceFrw === 0 ? 'Confirmation (Free)' : 'Payment (MoMo)'}</span>
          </div>
        </div>

        {/* MODAL CONTENT */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* STEP 1: PRICING PLANS */}
          {step === 'plan' && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <h4 className="text-xl font-extrabold text-white font-['Outfit',sans-serif]">
                  Select Your Listing Package
                </h4>
                <p className="text-xs text-neutral-400">
                  Affordable rates tailored for Kigali car owners and verified dealerships. Every car listing includes the official <strong>www.rwandacarhub.com</strong> photo watermark.
                </p>
              </div>

              {/* ACCOUNT HOLDERS NOTICE BANNER */}
              {currentUser ? (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-xs text-emerald-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Signed in as <strong>{currentUser.name}</strong> ({currentUser.email}) • You are eligible for the <strong>Free Plan (2 cars/day)</strong></span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-900 text-emerald-300 text-[10px] font-bold shrink-0">
                    Account Active
                  </span>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span>Have an account? Registered members get a <strong>Free Plan (2 cars per day)</strong>!</span>
                  </div>
                  {onOpenAuthModal && (
                    <button
                      type="button"
                      onClick={onOpenAuthModal}
                      className="px-3 py-1 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-xs font-bold transition-colors"
                    >
                      Sign In / Register
                    </button>
                  )}
                </div>
              )}

              {/* LISTING PLANS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {LISTING_PRICING_PLANS.map((plan) => {
                  const isSelected = selectedPlan.id === plan.id;
                  const isFree = plan.priceFrw === 0;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => {
                        setSelectedPlan(plan);
                        setAccountGateNotice(false);
                      }}
                      className={`relative p-4 rounded-2xl cursor-pointer border-2 transition-all flex flex-col justify-between ${
                        isSelected 
                          ? isFree
                            ? 'bg-emerald-950/30 border-emerald-500 shadow-xl shadow-emerald-950/50'
                            : 'bg-red-950/40 border-red-600 shadow-xl shadow-red-950/50' 
                          : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {/* BADGES */}
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider shadow whitespace-nowrap">
                          Most Popular
                        </div>
                      )}
                      {isFree && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow whitespace-nowrap">
                          Account Free Tier
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-1">
                          <h5 className="font-bold text-white text-sm font-['Outfit',sans-serif]">
                            {plan.name}
                          </h5>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-semibold whitespace-nowrap shrink-0">
                            {plan.carLimit} Cars
                          </span>
                        </div>

                        <div>
                          <div className={`text-2xl font-black font-['Outfit',sans-serif] ${isFree ? 'text-emerald-400' : 'text-white'}`}>
                            {isFree ? '0 Frw' : `${plan.priceFrw.toLocaleString()} Frw`}
                          </div>
                          <p className={`text-xs font-semibold ${isFree ? 'text-emerald-400' : 'text-red-400'}`}>
                            {plan.duration}
                          </p>
                        </div>

                        {/* PLAN MEMBER STATUS NOTE */}
                        {isFree && (
                          <div className="pt-1">
                            {currentUser ? (
                              <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-[10px] text-emerald-300 flex items-center gap-1 font-semibold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span>Unlocked (2 cars/day quota)</span>
                              </div>
                            ) : (
                              <div className="p-1.5 rounded-lg bg-amber-950/70 border border-amber-800/80 text-[10px] text-amber-300 flex items-center justify-between gap-1 font-medium">
                                <span className="flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                                  <span>Requires Account</span>
                                </span>
                                {onOpenAuthModal && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onOpenAuthModal();
                                    }}
                                    className="underline font-bold text-amber-200 hover:text-white"
                                  >
                                    Sign In
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        <ul className="space-y-1.5 text-xs text-neutral-300 pt-2 border-t border-neutral-800">
                          {plan.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[11px]">
                              <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isFree ? 'text-emerald-400' : 'text-red-500'}`} />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? isFree ? 'bg-emerald-600 text-white' : 'bg-red-700 text-white'
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Choose Plan'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* ACCOUNT GATE NOTICE WHEN SELECTING FREE PLAN WITHOUT LOGIN */}
              {accountGateNotice && (
                <div className="p-4 rounded-xl bg-amber-950/80 border border-amber-700 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-start sm:items-center gap-2.5">
                    <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
                    <div>
                      <p className="font-bold text-white text-sm">Account Required for Free Plan</p>
                      <p className="text-amber-300/90 text-xs mt-0.5">
                        The Free Listing Plan (2 cars per day) is exclusively available to people who have accounts on RwandaCarHub. Please log in or create a free account to proceed.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {onOpenAuthModal && (
                      <button
                        type="button"
                        onClick={onOpenAuthModal}
                        className="px-3.5 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs shadow"
                      >
                        Log In / Register
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlan(LISTING_PRICING_PLANS[1]);
                        setAccountGateNotice(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-xs hover:text-white"
                    >
                      Use Starter Plan
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleProceedToDetails}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg"
                >
                  <span>Continue to Vehicle Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: VEHICLE DETAILS FORM */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-white font-['Outfit',sans-serif]">
                    Vehicle Specifications & Photos
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Listing under plan: <strong className="text-red-400">{selectedPlan.name} ({selectedPlan.priceFrw.toLocaleString()} Frw {selectedPlan.duration})</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('plan')}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Change Plan</span>
                </button>
              </div>

              {/* Purpose Tabs */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Listing Purpose *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPurpose('buy')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                      purpose === 'buy' ? 'bg-red-800 text-white border-red-600' : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                    }`}
                  >
                    🚗 For Sale
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurpose('rent')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                      purpose === 'rent' ? 'bg-amber-700 text-white border-amber-600' : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                    }`}
                  >
                    🔑 For Rent
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurpose('lease')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                      purpose === 'lease' ? 'bg-indigo-800 text-white border-indigo-600' : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                    }`}
                  >
                    📄 For Lease
                  </button>
                </div>
              </div>

              {/* Grid 1: Make, Model, Year, Body Type */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Make *</label>
                  <select
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                  >
                    <option value="Toyota">Toyota</option>
                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="BMW">BMW</option>
                    <option value="Nissan">Nissan</option>
                    <option value="Land Rover">Land Rover</option>
                    <option value="BYD">BYD (Electric)</option>
                    <option value="Mitsubishi">Mitsubishi</option>
                    <option value="Volkswagen">Volkswagen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RAV4 / Prado / Hilux"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Year *</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                  >
                    {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Body Style</label>
                  <select
                    value={bodyType}
                    onChange={(e) => setBodyType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                  >
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Pickup Truck">Pickup Truck</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Van / Bus">Van / Bus</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
              </div>

              {/* Grid 2: Price, Mileage, Fuel, Transmission */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Price in RWF * {purpose !== 'buy' ? '(per day/month)' : ''}
                  </label>
                  <input
                    type="number"
                    required
                    step={50000}
                    value={priceRwf}
                    onChange={(e) => setPriceRwf(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white font-bold"
                  />
                  <span className="text-[10px] text-neutral-400">~ ${calculatedUsd.toLocaleString()} USD</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Mileage (km) *</label>
                  <input
                    type="number"
                    required
                    value={mileageKm}
                    onChange={(e) => setMileageKm(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
              </div>

              {/* Grid 3: Condition, Kigali Location, Seller Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                  >
                    <option value="Foreign Used">Foreign Used (Import)</option>
                    <option value="Local Used">Local Used (Rwanda)</option>
                    <option value="Brand New">Brand New</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Kigali Location *</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                  >
                    <option value="Kigali, Kicukiro (Sonatubes)">Kicukiro (Sonatubes)</option>
                    <option value="Kigali, Gasabo (Remera)">Gasabo (Remera)</option>
                    <option value="Kigali, Gasabo (Nyarutarama)">Gasabo (Nyarutarama)</option>
                    <option value="Kigali, Gasabo (Gisozi)">Gasabo (Gisozi)</option>
                    <option value="Kigali, Nyarugenge (Downtown)">Nyarugenge (Downtown)</option>
                    <option value="Kigali, Kimihurura">Kimihurura</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Seller / Dealer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name or Dealership"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Contact Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              {/* Photo Preview & Watermark Notice */}
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-300">Vehicle Photo URL</label>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    ✓ Watermark "www.rwandacarhub.com" automatically attached
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=1000&auto=format&fit=crop&q=80')}
                    className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs whitespace-nowrap"
                  >
                    Sample SUV
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1000&auto=format&fit=crop&q=80')}
                    className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs whitespace-nowrap"
                  >
                    Sample Luxury
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Mention condition, service history, RRA duty clearance, features..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('plan')}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow ${
                    selectedPlan.priceFrw === 0
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-red-700 hover:bg-red-600'
                  }`}
                >
                  <span>{selectedPlan.priceFrw === 0 ? 'Review & Publish (Free 0 Frw)' : 'Proceed to Payment'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: ACTIVATION (FREE PLAN FOR ACCOUNT HOLDERS) */}
          {step === 'payment' && selectedPlan.priceFrw === 0 && (
            <div className="max-w-md mx-auto p-6 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                  Free Account Listing (0 Frw)
                </h4>
                <p className="text-xs text-neutral-400">
                  Included with your registered RwandaCarHub account: <strong>2 vehicles per day for FREE</strong>.
                </p>
              </div>

              <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-left space-y-2.5">
                <div className="flex justify-between text-xs text-neutral-300">
                  <span>Account Member:</span>
                  <span className="font-bold text-white">{currentUser?.name || sellerName}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-300">
                  <span>Selected Package:</span>
                  <span className="font-bold text-emerald-400">Free Member Listing</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-300">
                  <span>Daily Quota:</span>
                  <span className="font-semibold text-white">Up to 2 vehicles per day</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-300">
                  <span>Official Watermark:</span>
                  <span className="text-emerald-400 font-mono text-[11px]">www.rwandacarhub.com</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-emerald-400 border-t border-neutral-800 pt-2.5">
                  <span>Total Due:</span>
                  <span>0 Frw (100% Free • No MoMo Required)</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={paymentProcessing}
                  onClick={handleConfirmPaymentAndPublish}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs tracking-wide shadow-lg flex items-center justify-center gap-2"
                >
                  {paymentProcessing ? (
                    <span>Publishing to Marketplace...</span>
                  ) : (
                    <span>Publish Free Vehicle Listing (2 Cars/Day Limit)</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="w-full py-2 text-xs text-neutral-400 hover:text-neutral-200"
                >
                  Back to edit car specs
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT FOR PAID PLANS (MTN MOMO / AIRTEL MONEY RWANDA) */}
          {step === 'payment' && selectedPlan.priceFrw > 0 && (
            <div className="max-w-md mx-auto p-6 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
                <Smartphone className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                  Complete Listing Fee Payment
                </h4>
                <p className="text-xs text-neutral-400">
                  Pay with Mobile Money (MTN MoMo `*182#` or Airtel Money)
                </p>
              </div>

              <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-left space-y-2">
                <div className="flex justify-between text-xs text-neutral-300">
                  <span>Selected Plan:</span>
                  <span className="font-bold text-white">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-300">
                  <span>Listing Allowance:</span>
                  <span>Up to {selectedPlan.carLimit} vehicles</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-300">
                  <span>Duration:</span>
                  <span>{selectedPlan.duration}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-red-400 border-t border-neutral-800 pt-2">
                  <span>Total Due:</span>
                  <span>{selectedPlan.priceFrw.toLocaleString()} Frw</span>
                </div>
              </div>

              <div className="text-left space-y-1">
                <label className="block text-xs font-semibold text-neutral-300">
                  Enter MTN MoMo / Airtel Number for Push Prompt:
                </label>
                <input
                  type="tel"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  placeholder="0788 000 000"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={paymentProcessing}
                  onClick={handleConfirmPaymentAndPublish}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold text-xs tracking-wide shadow-lg flex items-center justify-center gap-2"
                >
                  {paymentProcessing ? (
                    <span>Initiating MoMo Push (*182#)...</span>
                  ) : (
                    <span>Pay {selectedPlan.priceFrw.toLocaleString()} Frw & Publish Now</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="w-full py-2 text-xs text-neutral-400 hover:text-neutral-200"
                >
                  Back to edit car specs
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'success' && (
            <div className="text-center py-10 max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xl">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-black text-white font-['Outfit',sans-serif]">
                Vehicle Successfully Listed!
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Your <strong>{year} {make} {model}</strong> is now live on RwandaCarHub. Buyers across Kigali can call, chat on WhatsApp, or book a test drive immediately.
              </p>
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400">
                Watermark applied: <code className="text-red-400 font-mono">www.rwandacarhub.com</code>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-bold transition-all shadow"
              >
                View Marketplace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
