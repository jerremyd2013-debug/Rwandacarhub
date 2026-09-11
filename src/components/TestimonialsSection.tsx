import React, { useState } from 'react';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  PlusCircle, 
  CheckCircle2, 
  Car, 
  MapPin, 
  X,
  Send,
  MessageSquareQuote
} from 'lucide-react';
import { Testimonial } from '../types';
import { INITIAL_TESTIMONIALS } from '../data/testimonials';

interface TestimonialsSectionProps {
  onSelectTab?: (tab: string) => void;
  onOpenPostCar?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Modal state for submitting a new review
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    author: '',
    role: 'Car Buyer',
    location: 'Kigali, Kicukiro',
    vehicleModel: '',
    transactionType: 'buy' as 'buy' | 'sell' | 'rent' | 'lease',
    rating: 5,
    comment: ''
  });
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= testimonials.length - 1 ? 0 : prev + 1));
  };

  // Handle review form submit
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.author.trim()) {
      setValidationError('Please enter your name.');
      return;
    }
    if (!reviewForm.comment.trim() || reviewForm.comment.trim().length < 10) {
      setValidationError('Please write a short review (minimum 10 characters).');
      return;
    }

    setValidationError('');

    const parts = reviewForm.author.trim().split(' ');
    const initials = parts.length > 1 
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : reviewForm.author.slice(0, 2).toUpperCase();

    const newTestimonial: Testimonial = {
      id: `review-${Date.now()}`,
      author: reviewForm.author.trim(),
      role: reviewForm.role,
      location: reviewForm.location.trim() || 'Kigali, Rwanda',
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim(),
      date: 'Just now',
      vehicleModel: reviewForm.vehicleModel.trim() || undefined,
      transactionType: reviewForm.transactionType,
      verifiedBuyer: true,
      avatarInitials: initials,
      avatarColor: 'from-red-600 to-amber-700',
      helpfulCount: 1
    };

    setTestimonials([newTestimonial, ...testimonials]);
    setCurrentIndex(0);
    setReviewSubmitSuccess(true);

    setTimeout(() => {
      setReviewSubmitSuccess(false);
      setIsReviewModalOpen(false);
      setReviewForm({
        author: '',
        role: 'Car Buyer',
        location: 'Kigali, Kicukiro',
        vehicleModel: '',
        transactionType: 'buy',
        rating: 5,
        comment: ''
      });
    }, 1500);
  };

  // Get current 3 visible items for desktop (wrapping around cleanly)
  const getVisibleTestimonials = () => {
    const list: Testimonial[] = [];
    for (let i = 0; i < 3; i++) {
      const idx = (currentIndex + i) % testimonials.length;
      list.push(testimonials[idx]);
    }
    return list;
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <section 
      id="testimonials-section" 
      className="py-6 sm:py-8 border-t border-neutral-800/80 bg-neutral-950/40"
      aria-label="Testimonials"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        
        {/* COMPACT SECTION HEAD: TITLE 'TESTIMONIALS' + RATING + CONTROLS */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif] tracking-tight">
              Testimonials
            </h2>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300">
              <div className="flex items-center text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <span className="font-bold text-white">4.9</span>
              <span className="text-neutral-500">/5</span>
              <span className="text-neutral-400 text-[10px] hidden sm:inline">• 1,480+ Verified Reviews</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-write-review-compact"
              onClick={() => setIsReviewModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-bold border border-neutral-800 hover:border-red-600 flex items-center gap-1.5 transition-all whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5 text-red-500" />
              <span>Add Review</span>
            </button>

            {/* Prev / Next controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="w-7 h-7 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next testimonial"
                className="w-7 h-7 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* COMPACT 3-CARD CAROUSEL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {visibleTestimonials.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className={`p-4 rounded-xl bg-neutral-900/90 border border-neutral-800/90 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-2.5 shadow-sm ${
                index > 0 ? 'hidden md:flex' : 'flex'
              } ${index === 2 ? 'md:hidden lg:flex' : ''}`}
            >
              {/* Header row: stars & category */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-0.5" aria-label={`${item.rating} out of 5 stars`}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < item.rating 
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-neutral-700'
                      }`}
                    />
                  ))}
                </div>
                {item.vehicleModel ? (
                  <span className="text-[10px] font-medium text-red-300 bg-red-950/60 px-2 py-0.5 rounded border border-red-900/50 truncate max-w-[150px]">
                    {item.vehicleModel}
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                    Verified Deal
                  </span>
                )}
              </div>

              {/* Review quote snippet */}
              <p className="text-xs text-neutral-300 line-clamp-3 leading-relaxed italic">
                "{item.comment}"
              </p>

              {/* Author row */}
              <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-md bg-gradient-to-br ${
                      item.avatarColor || 'from-red-600 to-amber-700'
                    } flex items-center justify-center font-bold text-white text-[10px] shrink-0`}
                  >
                    {item.avatarInitials || item.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-white truncate">{item.author}</span>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-neutral-500 shrink-0">
                  <MapPin className="w-2.5 h-2.5 text-red-400 shrink-0" />
                  <span className="truncate max-w-[110px]">{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ======================= WRITE A REVIEW MODAL ======================= */}
      {isReviewModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-review-title"
        >
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Modal Header */}
            <div>
              <h3 id="modal-review-title" className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                Add a Testimonial
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Share your car buying, selling, or rental experience in Rwanda.
              </p>
            </div>

            {/* Success Banner */}
            {reviewSubmitSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-center space-y-1.5">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Murakoze Cyane!</h4>
                <p className="text-xs text-emerald-200">
                  Your review has been posted and added to the testimonials.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3">
                {validationError && (
                  <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-700 text-red-200 text-xs">
                    ⚠️ {validationError}
                  </div>
                )}

                {/* Rating selection (1 to 5 Stars) */}
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        type="button"
                        key={starVal}
                        onClick={() => setReviewForm({ ...reviewForm, rating: starVal })}
                        className="p-0.5 hover:scale-110 transition-transform focus:outline-none"
                        aria-label={`Rate ${starVal} stars`}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            starVal <= reviewForm.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-neutral-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-400 ml-1.5">
                      {reviewForm.rating} / 5
                    </span>
                  </div>
                </div>

                {/* Name & Role */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-semibold text-neutral-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexis Habimana"
                      value={reviewForm.author}
                      onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-neutral-400 mb-1">
                      Category
                    </label>
                    <select
                      value={reviewForm.transactionType}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setReviewForm({
                          ...reviewForm,
                          transactionType: val,
                          role: val === 'buy' ? 'Car Buyer' : val === 'sell' ? 'Car Seller' : 'Rental Client'
                        });
                      }}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-600"
                    >
                      <option value="buy">Car Buyer</option>
                      <option value="sell">Car Seller</option>
                      <option value="rent">Rental / Safari</option>
                      <option value="lease">Corporate Lease</option>
                    </select>
                  </div>
                </div>

                {/* Car & Location */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-semibold text-neutral-400 mb-1">
                      Car Model (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Toyota RAV4"
                      value={reviewForm.vehicleModel}
                      onChange={(e) => setReviewForm({ ...reviewForm, vehicleModel: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-neutral-400 mb-1">
                      Location in Rwanda
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kigali, Kicukiro"
                      value={reviewForm.location}
                      onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                {/* Review text */}
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 mb-1">
                    Your Review *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us briefly about your experience..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post</span>
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
