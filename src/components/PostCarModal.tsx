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
  Lock,
  Camera,
  ImagePlus,
  Trash2,
  Star,
  UploadCloud,
  AlertCircle,
  Eye,
  Plus
} from 'lucide-react';
import { Vehicle, ListingPricingPlan, UserAccount } from '../types';
import { LISTING_PRICING_PLANS, ADMIN_UNLIMITED_PLAN } from '../data/cars';

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

  const isAdmin = currentUser?.role === 'admin' || Boolean(currentUser?.isUnlimitedPosts);

  const defaultPlan = isAdmin
    ? ADMIN_UNLIMITED_PLAN
    : (initialPlanId 
        ? LISTING_PRICING_PLANS.find((p) => p.id === initialPlanId) 
        : (currentUser ? LISTING_PRICING_PLANS[0] : LISTING_PRICING_PLANS[1])) || LISTING_PRICING_PLANS[0];

  const [step, setStep] = useState<'plan' | 'details' | 'payment' | 'success'>('plan');
  const [selectedPlan, setSelectedPlan] = useState<ListingPricingPlan>(defaultPlan);

  // Keep admin plan synced to unlimited VIP
  React.useEffect(() => {
    if (isAdmin) {
      setSelectedPlan(ADMIN_UNLIMITED_PLAN);
    }
  }, [isAdmin, isOpen]);

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
  
  // Real Car Photos State
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1000&auto=format&fit=crop&q=80'
  ]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlAccordion, setShowUrlAccordion] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);

  // File Upload Processor using FileReader
  const handleProcessFiles = (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setIsUploadingFiles(true);

    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      setUploadError('Please select valid picture files (JPG, PNG, WEBP, or HEIC).');
      setIsUploadingFiles(false);
      return;
    }

    const readers = validFiles.map((file) => {
      return new Promise<string>((resolve, reject) => {
        if (file.size > 15 * 1024 * 1024) {
          reject(new Error(`"${file.name}" is over 15MB. Please choose a smaller file.`));
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to read image data.'));
          }
        };
        reader.onerror = () => reject(new Error('Error reading image file.'));
        reader.readAsDataURL(file);
      });
    });

    Promise.allSettled(readers).then((results) => {
      const newImages: string[] = [];
      results.forEach((res) => {
        if (res.status === 'fulfilled' && res.value) {
          newImages.push(res.value);
        }
      });

      if (newImages.length > 0) {
        setUploadedImages((prev) => {
          // If existing is just the initial placeholder sample pair, replace it with real photos
          const isInitialPlaceholder =
            prev.length === 2 &&
            prev[0].includes('unsplash.com') &&
            prev[1].includes('unsplash.com');
          if (isInitialPlaceholder) {
            return newImages;
          }
          return [...prev, ...newImages];
        });
      }
      setIsUploadingFiles(false);
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetCoverImage = (indexToCover: number) => {
    setUploadedImages((prev) => {
      if (indexToCover === 0 || indexToCover >= prev.length) return prev;
      const target = prev[indexToCover];
      const remaining = prev.filter((_, idx) => idx !== indexToCover);
      return [target, ...remaining];
    });
  };

  const handleAddCustomUrl = () => {
    const trimmed = customUrlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image')) {
      setUploadError('Please enter a valid web image URL (starting with https://).');
      return;
    }
    setUploadError(null);
    setUploadedImages((prev) => [...prev, trimmed]);
    setCustomUrlInput('');
  };

  const handleLoadSampleSet = (preset: 'prado' | 'c200' | 'rav4' | 'hilux') => {
    setUploadError(null);
    if (preset === 'prado') {
      setUploadedImages([
        'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1000&auto=format&fit=crop&q=80'
      ]);
    } else if (preset === 'c200') {
      setUploadedImages([
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1000&auto=format&fit=crop&q=80'
      ]);
    } else if (preset === 'rav4') {
      setUploadedImages([
        'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80'
      ]);
    } else {
      setUploadedImages([
        'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1000&auto=format&fit=crop&q=80'
      ]);
    }
  };

  // Payment simulation
  const [momoNumber, setMomoNumber] = useState('0788225193');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [accountGateNotice, setAccountGateNotice] = useState(false);

  const calculatedUsd = Math.round(priceRwf / 1380);

  const handleProceedToDetails = () => {
    if (!isAdmin && selectedPlan.requiresAccount && !currentUser) {
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
    if (uploadedImages.length === 0) {
      setUploadError('Please upload at least 1 real picture of the vehicle.');
      const el = document.getElementById('real-pictures-upload-section');
      el?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setStep('payment');
  };

  const handleConfirmPaymentAndPublish = () => {
    setPaymentProcessing(true);

    setTimeout(() => {
      setPaymentProcessing(false);

      const finalImages = uploadedImages.length > 0 
        ? uploadedImages 
        : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1000&auto=format&fit=crop&q=80'];

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
        images: finalImages,
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
      <div className="relative w-full max-w-4xl bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-[#0a0f1d] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-900/30">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit',sans-serif]">
                Post Your Car on RwandaCarHub
              </h3>
              <p className="text-xs text-slate-400">
                Kigali & Rwanda-wide Marketplace Listings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#0a0f1d] hover:bg-slate-800 text-slate-300 transition-colors border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP PROGRESS INDICATOR */}
        <div className="bg-[#0a0f1d]/60 px-6 py-3 border-b border-slate-800 flex items-center justify-center gap-2 sm:gap-6 text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step === 'plan' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px]">1</span>
            <span>Choose Plan</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className={`flex items-center gap-1.5 ${step === 'details' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px]">2</span>
            <span>Car Details</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px]">3</span>
            <span>{isAdmin || selectedPlan.priceFrw === 0 ? 'Confirmation (Free)' : 'Payment (MoMo)'}</span>
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
                <p className="text-xs text-slate-400">
                  Affordable rates tailored for Kigali car owners and verified dealerships. Every car listing includes the official <strong>www.rwandacarhub.com</strong> photo watermark.
                </p>
              </div>

              {/* ACCOUNT HOLDERS OR ADMIN NOTICE BANNER */}
              {isAdmin ? (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/80 to-[#0a0f1d] border border-blue-500/80 text-xs text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl shadow-blue-950/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-white font-['Outfit',sans-serif]">Website Administrator Account Active</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-900 text-blue-200 border border-blue-700">100% FREE & UNLIMITED</span>
                      </div>
                      <p className="text-xs text-blue-200/90 mt-0.5">
                        Logged in as <strong>{currentUser?.name}</strong> • You have permanent authorization for <strong>Free and Unlimited</strong> car posts with zero daily quotas and no Mobile Money payment required.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlan(ADMIN_UNLIMITED_PLAN);
                      setStep('details');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold whitespace-nowrap shadow-md transition-all active:scale-95 shrink-0"
                  >
                    Quick Post (Admin VIP) &rarr;
                  </button>
                </div>
              ) : currentUser ? (
                <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/80 text-xs text-blue-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Signed in as <strong>{currentUser.name}</strong> ({currentUser.email}) • You are eligible for the <strong>Free Plan (2 cars/day)</strong></span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-900 text-blue-300 text-[10px] font-bold shrink-0">
                    Account Active
                  </span>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#0a0f1d] border border-slate-800 text-xs text-slate-300 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Have an account? Registered members get a <strong>Free Plan (2 cars per day)</strong>!</span>
                  </div>
                  {onOpenAuthModal && (
                    <button
                      type="button"
                      onClick={onOpenAuthModal}
                      className="px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-colors"
                    >
                      Sign In / Register
                    </button>
                  )}
                </div>
              )}

              {/* LISTING PLANS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {(isAdmin ? [ADMIN_UNLIMITED_PLAN, ...LISTING_PRICING_PLANS.filter(p => p.id !== 'plan-free')] : LISTING_PRICING_PLANS).map((plan) => {
                  const isSelected = selectedPlan.id === plan.id;
                  const isFree = isAdmin || plan.priceFrw === 0;
                  const isAdminVIP = plan.id === 'plan-admin';

                  return (
                    <div
                      key={plan.id}
                      onClick={() => {
                        setSelectedPlan(plan);
                        setAccountGateNotice(false);
                      }}
                      className={`relative p-4 rounded-2xl cursor-pointer border-2 transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-blue-950/40 border-blue-500 shadow-xl shadow-blue-950/50' 
                          : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* BADGES */}
                      {isAdminVIP && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow whitespace-nowrap">
                          Admin VIP (Unlimited)
                        </div>
                      )}
                      {!isAdminVIP && plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow whitespace-nowrap">
                          Most Popular
                        </div>
                      )}
                      {!isAdminVIP && plan.priceFrw === 0 && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow whitespace-nowrap">
                          Account Free Tier
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-1">
                          <h5 className="font-bold text-white text-sm font-['Outfit',sans-serif]">
                            {plan.name}
                          </h5>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold whitespace-nowrap shrink-0">
                            {plan.carLimit > 1000 ? 'Unlimited (∞)' : `${plan.carLimit} Cars`}
                          </span>
                        </div>

                        <div>
                          <div className={`text-2xl font-black font-['Outfit',sans-serif] ${isFree ? 'text-blue-400' : 'text-white'}`}>
                            {isFree ? '0 Frw' : `${plan.priceFrw.toLocaleString()} Frw`}
                          </div>
                          <p className="text-xs font-semibold text-blue-400">
                            {isAdmin ? 'Free for Admin (Unlimited)' : plan.duration}
                          </p>
                        </div>

                        {/* PLAN MEMBER STATUS NOTE */}
                        {isAdminVIP ? (
                          <div className="pt-1">
                            <div className="p-1.5 rounded-lg bg-blue-950/80 border border-blue-700 text-[10px] text-blue-300 flex items-center gap-1 font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              <span>Unlocked • Unlimited Posts</span>
                            </div>
                          </div>
                        ) : plan.priceFrw === 0 ? (
                          <div className="pt-1">
                            {currentUser ? (
                              <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-[10px] text-emerald-300 flex items-center gap-1 font-semibold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span>{isAdmin ? 'Unlimited for Admin' : 'Unlocked (2 cars/day quota)'}</span>
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
                        ) : null}

                        <ul className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                          {plan.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[11px]">
                              <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-400" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-start sm:items-center gap-2.5">
                    <Lock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5 sm:mt-0" />
                    <div>
                      <p className="font-bold text-white text-sm">Account Required for Free Plan</p>
                      <p className="text-slate-300 text-xs mt-0.5">
                        The Free Listing Plan is exclusively available to members with accounts on RwandaCarHub. Website administrators enjoy 100% free and unlimited posts.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {onOpenAuthModal && (
                      <button
                        type="button"
                        onClick={onOpenAuthModal}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow"
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
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:text-white"
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
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-950 transition-all active:scale-95"
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Make *</label>
                  <select
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RAV4 / Prado / Hilux"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Year *</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Body Style</label>
                  <select
                    value={bodyType}
                    onChange={(e) => setBodyType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Price in RWF * {purpose !== 'buy' ? '(per day/month)' : ''}
                  </label>
                  <input
                    type="number"
                    required
                    step={50000}
                    value={priceRwf}
                    onChange={(e) => setPriceRwf(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 rounded-lg text-xs text-white font-bold focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400">~ ${calculatedUsd.toLocaleString()} USD</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mileage (km) *</label>
                  <input
                    type="number"
                    required
                    value={mileageKm}
                    onChange={(e) => setMileageKm(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Foreign Used">Foreign Used (Import)</option>
                    <option value="Local Used">Local Used (Rwanda)</option>
                    <option value="Brand New">Brand New</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kigali Location *</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Seller / Dealer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name or Dealership"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* REAL VEHICLE PICTURES UPLOAD CENTER */}
              <div id="real-pictures-upload-section" className="p-4 sm:p-5 bg-[#0a0f1d] rounded-2xl border border-slate-800 space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <ImagePlus className="w-4 h-4 text-blue-400" />
                      <h5 className="text-sm font-bold text-white font-['Outfit',sans-serif]">
                        Real Vehicle Pictures & Gallery *
                      </h5>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                        {uploadedImages.length} {uploadedImages.length === 1 ? 'Photo' : 'Photos'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Upload clear real pictures of the actual car in Rwanda. The first picture will be your main marketplace cover photo.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-blue-400 font-semibold bg-blue-950/40 px-2.5 py-1 rounded-lg border border-blue-800/60 self-start sm:self-auto">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Watermark "www.rwandacarhub.com" automatically attached</span>
                  </div>
                </div>

                {/* Upload Error Banner */}
                {uploadError && (
                  <div className="p-3 bg-red-950/80 border border-red-700/80 rounded-xl text-xs text-red-200 flex items-center justify-between gap-2 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadError(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Hidden File Inputs */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  multiple
                  onChange={(e) => {
                    handleProcessFiles(e.target.files);
                    e.target.value = '';
                  }}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={cameraInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    handleProcessFiles(e.target.files);
                    e.target.value = '';
                  }}
                  className="hidden"
                />

                {/* Interactive Drag & Drop / Upload Space */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    handleProcessFiles(e.dataTransfer.files);
                  }}
                  className={`relative p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-3 cursor-pointer ${
                    isDragOver
                      ? 'border-blue-500 bg-blue-950/40 shadow-xl shadow-blue-950/50'
                      : 'border-slate-700 hover:border-blue-500/80 bg-[#0f172a]/60 hover:bg-[#0f172a]'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform shadow-md">
                    {isUploadingFiles ? (
                      <Sparkles className="w-6 h-6 animate-spin text-blue-400" />
                    ) : (
                      <UploadCloud className="w-6 h-6 text-blue-400" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">
                      {isUploadingFiles ? (
                        <span>Processing & Optimizing Uploaded Pictures...</span>
                      ) : (
                        <span>Drop Real Car Pictures Here or <span className="text-blue-400 underline">Browse Files</span></span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Select front, rear, side angles, driver cockpit, dashboard & engine. Supports JPG, PNG, WEBP (up to 15MB each).
                    </p>
                  </div>

                  {/* Upload Action Buttons inside dropzone */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap justify-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-950 active:scale-95 transition-all"
                    >
                      <ImagePlus className="w-3.5 h-3.5" />
                      <span>Choose Pictures From Device</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-[#0a0f1d] hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
                      title="Use smartphone camera to take a real photo now"
                    >
                      <Camera className="w-3.5 h-3.5 text-blue-400" />
                      <span>Snap Photo (Camera)</span>
                    </button>
                  </div>
                </div>

                {/* RECOMMENDED PHOTO ANGLES GUIDE */}
                <div className="p-3 bg-[#0f172a] rounded-xl border border-slate-800/80 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Recommended Shots For Faster Buyer Inquiries in Kigali:</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400">
                    <div className="p-1.5 rounded-lg bg-[#0a0f1d] border border-slate-800/80 flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-blue-400 shrink-0" />
                      <span>1. Front 3/4 Exterior</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#0a0f1d] border border-slate-800/80 flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-blue-400 shrink-0" />
                      <span>2. Rear & License Plate</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#0a0f1d] border border-slate-800/80 flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-blue-400 shrink-0" />
                      <span>3. Cockpit & Odometer</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#0a0f1d] border border-slate-800/80 flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-blue-400 shrink-0" />
                      <span>4. Clean Seats & Engine</span>
                    </div>
                  </div>
                </div>

                {/* UPLOADED PICTURES PREVIEW GRID */}
                {uploadedImages.length > 0 && (
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                      <span>Uploaded Photos ({uploadedImages.length})</span>
                      <span className="text-[11px] text-slate-400">Click "Set Cover" to change your main marketplace photo</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {uploadedImages.map((imgSrc, idx) => {
                        const isCover = idx === 0;
                        return (
                          <div
                            key={idx}
                            className={`group relative rounded-xl overflow-hidden border-2 transition-all bg-[#0f172a] flex flex-col ${
                              isCover 
                                ? 'border-blue-500 shadow-lg shadow-blue-950/60 ring-2 ring-blue-500/20' 
                                : 'border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {/* Image container */}
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/60">
                              <img
                                src={imgSrc}
                                alt={`Vehicle photo ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                              />

                              {/* Index badge */}
                              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-black text-white border border-white/20">
                                #{idx + 1}
                              </div>

                              {/* Cover photo badge */}
                              {isCover ? (
                                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  <span>Cover Photo</span>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetCoverImage(idx)}
                                  className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-900/90 hover:bg-blue-600 text-slate-200 hover:text-white text-[10px] font-bold border border-slate-700 hover:border-blue-500 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 shadow-md"
                                  title="Make this photo the main marketplace cover photo"
                                >
                                  <Star className="w-2.5 h-2.5" />
                                  <span>Set Cover</span>
                                </button>
                              )}

                              {/* Official Watermark Preview Stamp */}
                              <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[9px] font-mono text-blue-400 border border-blue-500/30 flex items-center gap-1">
                                <span>www.rwandacarhub.com</span>
                              </div>
                            </div>

                            {/* Card Footer actions */}
                            <div className="p-2 bg-[#0a0f1d] border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                              {isCover ? (
                                <span className="text-[10px] text-blue-400 font-bold">Primary Listing Cover</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetCoverImage(idx)}
                                  className="text-[10px] text-slate-400 hover:text-blue-400 font-medium transition-colors"
                                >
                                  Make Cover
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                                title="Remove this photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ACCORDION: WEB URL INPUT & ONE-CLICK REALISTIC DEMO SETS */}
                <div className="pt-1 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setShowUrlAccordion(!showUrlAccordion)}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                  >
                    <span>{showUrlAccordion ? '▾ Hide link & sample photo options' : '▸ Or paste web photo URL / Load sample pictures'}</span>
                  </button>

                  {showUrlAccordion && (
                    <div className="mt-3 p-3.5 rounded-xl bg-[#0f172a] border border-slate-800 space-y-3 animate-in fade-in">
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-300">
                          Add Photo via Web URL:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={customUrlInput}
                            onChange={(e) => setCustomUrlInput(e.target.value)}
                            placeholder="https://example.com/car-photo.jpg"
                            className="flex-1 px-3 py-1.5 bg-[#0a0f1d] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomUrl}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                          >
                            Add Photo
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
                        <span className="text-[11px] font-semibold text-slate-400">Load Kigali verified sample multi-photos (3-4 angles):</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleLoadSampleSet('prado')}
                            className="px-2.5 py-1 rounded-lg bg-[#0a0f1d] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
                          >
                            Toyota Prado TX-L (3 angles)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLoadSampleSet('c200')}
                            className="px-2.5 py-1 rounded-lg bg-[#0a0f1d] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
                          >
                            Mercedes C200 AMG (3 angles)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLoadSampleSet('rav4')}
                            className="px-2.5 py-1 rounded-lg bg-[#0a0f1d] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
                          >
                            Toyota RAV4 4x4 (3 angles)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLoadSampleSet('hilux')}
                            className="px-2.5 py-1 rounded-lg bg-[#0a0f1d] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
                          >
                            Hilux Double Cabin (2 angles)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Mention condition, service history, RRA duty clearance, features..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0a0f1d] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('plan')}
                  className="px-4 py-2.5 rounded-xl bg-[#0a0f1d] border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Back to Plan
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all ${
                    isAdmin || selectedPlan.priceFrw === 0
                      ? 'bg-blue-600 hover:bg-blue-500'
                      : 'bg-blue-600 hover:bg-blue-500'
                  }`}
                >
                  <span>
                    {isAdmin
                      ? 'Review & Publish (Admin VIP 0 Frw)'
                      : selectedPlan.priceFrw === 0
                      ? 'Review & Publish (Free 0 Frw)'
                      : 'Proceed to Payment'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3A: ADMIN VIP CONFIRMATION (100% FREE & UNLIMITED POSTS) */}
          {step === 'payment' && isAdmin && (
            <div className="max-w-md mx-auto p-6 bg-[#0a0f1d] rounded-2xl border border-blue-500/60 space-y-5 text-center shadow-2xl shadow-blue-950/50">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/50 flex items-center justify-center mx-auto shadow-lg shadow-blue-950/60">
                <ShieldCheck className="w-8 h-8 text-blue-400" />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-700 text-[11px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  Website Administrator VIP Privilege
                </div>
                <h4 className="text-xl font-black text-white font-['Outfit',sans-serif]">
                  100% Free & Unlimited Posts
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  As the verified <strong>Website Administrator</strong>, your account has permanent lifetime authorization to post as many vehicles as you want for FREE with zero daily limits and no Mobile Money payment required.
                </p>
              </div>

              <div className="p-4 bg-[#0f172a] rounded-xl border border-slate-800 text-left space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Administrator Account:</span>
                  <span className="font-bold text-white">{currentUser?.name || sellerName}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Authorized Role:</span>
                  <span className="font-bold text-blue-400">Website Super Administrator</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Listing Allowance:</span>
                  <span className="font-extrabold text-blue-300">Unlimited Vehicles (No Quota Limit)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Duration:</span>
                  <span className="font-semibold text-white">Permanent / Unlimited</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Vehicle Listing:</span>
                  <span className="font-semibold text-white truncate max-w-[180px]">{year} {make} {model}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Official Watermark:</span>
                  <span className="text-blue-400 font-mono text-[11px]">www.rwandacarhub.com</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-blue-400 border-t border-slate-800 pt-2.5">
                  <span>Total Amount Due:</span>
                  <span className="font-black">0 Frw (100% Free • Admin VIP)</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={paymentProcessing}
                  onClick={handleConfirmPaymentAndPublish}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-950 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  {paymentProcessing ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin text-white" />
                      Publishing Admin Listing to Rwanda Marketplace...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-white" />
                      Publish Vehicle Listing Now (Free & Unlimited Admin Post)
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  &larr; Back to edit car details
                </button>
              </div>
            </div>
          )}

          {/* STEP 3B: ACTIVATION (FREE PLAN FOR STANDARD REGISTERED ACCOUNT HOLDERS) */}
          {step === 'payment' && !isAdmin && selectedPlan.priceFrw === 0 && (
            <div className="max-w-md mx-auto p-6 bg-[#0a0f1d] rounded-2xl border border-slate-800 space-y-5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                  Free Account Listing (0 Frw)
                </h4>
                <p className="text-xs text-slate-400">
                  Included with your registered RwandaCarHub account: <strong>2 vehicles per day for FREE</strong>.
                </p>
              </div>

              <div className="p-4 bg-[#0f172a] rounded-xl border border-slate-800 text-left space-y-2.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Account Member:</span>
                  <span className="font-bold text-white">{currentUser?.name || sellerName}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Selected Package:</span>
                  <span className="font-bold text-blue-400">Free Member Listing</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Daily Quota:</span>
                  <span className="font-semibold text-white">Up to 2 vehicles per day</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Official Watermark:</span>
                  <span className="text-blue-400 font-mono text-[11px]">www.rwandacarhub.com</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-blue-400 border-t border-slate-800 pt-2.5">
                  <span>Total Due:</span>
                  <span>0 Frw (100% Free • No MoMo Required)</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={paymentProcessing}
                  onClick={handleConfirmPaymentAndPublish}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
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
                  className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Back to edit car specs
                </button>
              </div>
            </div>
          )}

          {/* STEP 3C: PAYMENT FOR PAID PLANS (MTN MOMO / AIRTEL MONEY RWANDA) */}
          {step === 'payment' && !isAdmin && selectedPlan.priceFrw > 0 && (
            <div className="max-w-md mx-auto p-6 bg-[#0a0f1d] rounded-2xl border border-slate-800 space-y-5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/40 flex items-center justify-center mx-auto">
                <Smartphone className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                  Complete Listing Fee Payment
                </h4>
                <p className="text-xs text-slate-400">
                  Pay with Mobile Money (MTN MoMo `*182#` or Airtel Money)
                </p>
              </div>

              <div className="p-4 bg-[#0f172a] rounded-xl border border-slate-800 text-left space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Selected Plan:</span>
                  <span className="font-bold text-white">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Listing Allowance:</span>
                  <span>Up to {selectedPlan.carLimit} vehicles</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Duration:</span>
                  <span>{selectedPlan.duration}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-blue-400 border-t border-slate-800 pt-2">
                  <span>Total Due:</span>
                  <span>{selectedPlan.priceFrw.toLocaleString()} Frw</span>
                </div>
              </div>

              <div className="text-left space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Enter MTN MoMo / Airtel Number for Push Prompt:
                </label>
                <input
                  type="tel"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  placeholder="0788 000 000"
                  className="w-full px-3 py-2 bg-[#0f172a] border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={paymentProcessing}
                  onClick={handleConfirmPaymentAndPublish}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
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
                  className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Back to edit car specs
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'success' && (
            <div className="text-center py-6 max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-950/80">
                <Check className="w-7 h-7" />
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
                {isAdmin ? 'Vehicle Published (Admin VIP Free & Unlimited)!' : 'Vehicle Successfully Listed!'}
              </h4>

              {/* Published Vehicle Photo Card with watermark preview */}
              {uploadedImages[0] && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl max-w-xs mx-auto">
                  <img
                    src={uploadedImages[0]}
                    alt={`${year} ${make} ${model}`}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/85 backdrop-blur-md text-[10px] font-mono text-blue-400 border border-blue-500/40">
                    www.rwandacarhub.com
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-blue-600/90 text-white text-[10px] font-bold">
                    {uploadedImages.length} Real Photo{uploadedImages.length > 1 ? 's' : ''} Live
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-300 leading-relaxed">
                Your <strong>{year} {make} {model}</strong> is now live on RwandaCarHub with verified seller credentials. Buyers across Kigali can call, chat on WhatsApp, or book a test drive immediately.
              </p>
              {isAdmin && (
                <div className="p-3 bg-blue-950/50 rounded-xl border border-blue-800 text-xs text-blue-200">
                  ✓ Website Administrator Privilege: You have <strong>100% Free & Unlimited</strong> vehicle posts available.
                </div>
              )}
              <div className="p-2.5 bg-[#0a0f1d] rounded-xl border border-slate-800 text-xs text-slate-400">
                Watermark applied: <code className="text-blue-400 font-mono">www.rwandacarhub.com</code>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow"
              >
                View in Marketplace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
