import { Testimonial } from '../types';

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    author: 'Jean-Claude Mugisha',
    role: 'Private Car Buyer',
    location: 'Kigali, Kicukiro',
    rating: 5,
    comment:
      'Bought my Toyota RAV4 Hybrid through RwandaCarHub. The pre-purchase inspection report matched the actual condition 100%, and transfer of Carte Jaune at RRA took only 48 hours without any street broker inflating the price.',
    date: 'August 28, 2026',
    vehicleModel: '2019 Toyota RAV4 Hybrid',
    transactionType: 'buy',
    verifiedBuyer: true,
    avatarInitials: 'JM',
    avatarColor: 'from-red-600 to-amber-700',
    helpfulCount: 34
  },
  {
    id: 'test-2',
    author: 'Diane Uwase',
    role: 'Verified Private Seller',
    location: 'Kigali, Nyarutarama',
    rating: 5,
    comment:
      'I posted my Mercedes-Benz C200 using the 5,000 Frw starter package. The watermark protection gave serious buyers immediate confidence. I received 4 genuine WhatsApp inquiries within 24 hours and finalized the sale safely at a Kigali bank branch.',
    date: 'August 14, 2026',
    vehicleModel: '2017 Mercedes-Benz C200 AMG Line',
    transactionType: 'sell',
    verifiedBuyer: true,
    avatarInitials: 'DU',
    avatarColor: 'from-purple-600 to-indigo-800',
    helpfulCount: 29
  },
  {
    id: 'test-3',
    author: 'Emmanuel Ntwari',
    role: 'Safari Guide & Tour Director',
    location: 'Musanze / Volcanoes NP & Kigali',
    rating: 5,
    comment:
      'For our wildlife expeditions from Volcanoes National Park to Akagera, vehicle reliability is non-negotiable. RwandaCarHub provided two Toyota Prado TX-L 4x4s with pop-up safari roofs in pristine mechanical state. Excellent service!',
    date: 'July 30, 2026',
    vehicleModel: '2018 Toyota Land Cruiser Prado TX-L',
    transactionType: 'rent',
    verifiedBuyer: true,
    avatarInitials: 'EN',
    avatarColor: 'from-emerald-600 to-teal-800',
    helpfulCount: 42
  },
  {
    id: 'test-4',
    author: 'Dr. Patrick Habimana',
    role: 'Medical Consultant & Family Buyer',
    location: 'Kigali, Gasabo (KG 11 Ave)',
    rating: 5,
    comment:
      'The watermark www.rwandacarhub.com is brilliant—it prevents fraudulent middleman reposting. I met the verified owner at Kigali Heights, inspected the vehicle, and paid safely via MoMo. Transparent and hassle-free.',
    date: 'July 19, 2026',
    vehicleModel: '2018 Toyota Harrier Elegance',
    transactionType: 'buy',
    verifiedBuyer: true,
    avatarInitials: 'PH',
    avatarColor: 'from-blue-600 to-cyan-800',
    helpfulCount: 21
  },
  {
    id: 'test-5',
    author: 'Sarah Van Der Beek',
    role: 'Country Logistics Coordinator (Agricultural NGO)',
    location: 'Kigali, Kimihurura',
    rating: 5,
    comment:
      'We leased three 4WD Toyota Hilux pickup trucks for field teams operating across the Eastern Province. Transparent corporate contracts, prompt servicing support, and reliable replacement vehicles whenever scheduled maintenance occurs.',
    date: 'June 22, 2026',
    vehicleModel: '2021 Toyota Hilux Double Cabin 4x4',
    transactionType: 'lease',
    verifiedBuyer: true,
    avatarInitials: 'SV',
    avatarColor: 'from-amber-600 to-orange-800',
    helpfulCount: 18
  },
  {
    id: 'test-6',
    author: 'Aimable Gasana',
    role: 'Dealership General Manager',
    location: 'Kigali, Remera / Giporoso',
    rating: 5,
    comment:
      'As a licensed auto showroom in Kigali, the RwandaCarHub Fleet Package has replaced traditional newspaper ads for us. Verified buyers contact us directly on WhatsApp with pre-calculated financing requests.',
    date: 'June 10, 2026',
    vehicleModel: '2020 Land Rover Range Rover Velar',
    transactionType: 'sell',
    verifiedBuyer: true,
    avatarInitials: 'AG',
    avatarColor: 'from-rose-600 to-red-800',
    helpfulCount: 37
  },
  {
    id: 'test-7',
    author: 'Grace Mukamana',
    role: 'First-time Car Owner',
    location: 'Rubavu / Gisenyi',
    rating: 5,
    comment:
      'I live in Rubavu and was nervous about traveling to Kigali to buy a car. The seller uploaded 15 high-res photos and video walkarounds. We agreed on inspection at Gatsata, and everything was verified before signing.',
    date: 'May 27, 2026',
    vehicleModel: '2016 Toyota Corolla Axio',
    transactionType: 'buy',
    verifiedBuyer: true,
    avatarInitials: 'GM',
    avatarColor: 'from-violet-600 to-pink-800',
    helpfulCount: 15
  },
  {
    id: 'test-8',
    author: 'David & Chloe Miller',
    role: 'International Tourists & Explorers',
    location: 'Kigali International Airport (Kanombe)',
    rating: 5,
    comment:
      'Booked a RAV4 for self-drive around Lake Kivu and Nyungwe Forest. Handover at Kanombe airport was on time, communication was super swift via WhatsApp, and the security deposit was refunded on the spot upon return.',
    date: 'May 04, 2026',
    vehicleModel: '2017 Toyota RAV4 4WD',
    transactionType: 'rent',
    verifiedBuyer: true,
    avatarInitials: 'DM',
    avatarColor: 'from-teal-600 to-emerald-900',
    helpfulCount: 26
  }
];

export const TESTIMONIAL_STATS = {
  averageRating: 4.9,
  totalReviews: 1480,
  verifiedTransactions: '2,300+',
  satisfactionRate: '99.2%',
  repeatCustomerRate: '94%'
};
