import { Vehicle, ListingPricingPlan } from '../types';

export const LISTING_PRICING_PLANS: ListingPricingPlan[] = [
  {
    id: 'plan-free',
    name: 'Free Member Plan',
    carLimit: 2,
    priceFrw: 0,
    duration: 'per day (100% Free)',
    requiresAccount: true,
    badge: 'Account Holders (2 Cars/Day)',
    features: [
      'List up to 2 cars per day for FREE',
      'Exclusive perk for registered account holders',
      'Direct WhatsApp & Phone buyer connection',
      'Standard photo upload & gallery',
      'Automatic www.rwandacarhub.com watermark',
      '0 Frw / No mobile money payment needed'
    ]
  },
  {
    id: 'plan-starter',
    name: 'Starter Seller Plan',
    carLimit: 5,
    priceFrw: 5000,
    duration: 'per day',
    features: [
      'List up to 5 vehicles',
      'Daily high-priority search indexing',
      'Direct WhatsApp & Call buttons',
      'Standard photo gallery (up to 10 photos)',
      'Basic analytics & view counts',
      'www.rwandacarhub.com watermark protection'
    ]
  },
  {
    id: 'plan-pro',
    name: 'Weekly Dealer Pack',
    carLimit: 30,
    priceFrw: 15000,
    duration: 'per week',
    popular: true,
    features: [
      'List up to 30 vehicles',
      'Verified Seller badge included',
      'Featured badge on top of search results',
      'Full dealer showroom profile page',
      'Direct WhatsApp click-to-chat integration',
      'Instant SMS/Email lead notifications',
      'Social media boost on RwandaCarHub channels'
    ]
  },
  {
    id: 'plan-enterprise',
    name: 'Showroom Fleet Master',
    carLimit: 50,
    priceFrw: 35000,
    duration: 'per month',
    features: [
      'List up to 50 vehicles simultaneously',
      'Permanent Verified Showroom Gold Badge',
      'Priority placement on Home & Category pages',
      'Dedicated account manager in Kigali',
      'Professional photography & watermark support',
      'Comprehensive customer lead CRM dashboard',
      'Exportable inventory reports'
    ]
  }
];

export const INITIAL_CARS: Vehicle[] = [
  {
    id: 'veh-001',
    make: 'Toyota',
    model: 'Land Cruiser Prado TX-L',
    year: 2022,
    priceRwf: 82000000,
    priceUsd: 59500,
    purpose: 'buy',
    status: 'available',
    mileageKm: 34000,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    engineSize: '2.8L Turbo Diesel (1GD-FTV)',
    bodyType: 'SUV',
    color: 'Pearl White Metallic',
    location: 'Kigali, Kicukiro (Sonatubes)',
    condition: 'Foreign Used',
    dealerId: 'd1',
    seller: {
      name: 'Kigali City Motors Ltd',
      phone: '+250 788 225 193',
      whatsapp: '+250 738 225 193',
      email: 'trust@rwandacarhub.com',
      isVerified: true,
      rating: 4.9,
      reviewCount: 42,
      dealerName: 'Kigali City Motors Ltd'
    },
    images: [
      'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1000&auto=format&fit=crop&q=80'
    ],
    features: [
      'Sunroof & Roof Rails',
      '7 Leather Seats with Cooling',
      'KDSS Off-Road Suspension',
      '360-Degree Panoramic Camera',
      'Push Button Start & Keyless Entry',
      'JBL Premium Sound System',
      'Cool Box (Mini Refrigerator)',
      'RRA Duty Paid & Registered'
    ],
    description: 'Immaculate 2022 Toyota Land Cruiser Prado TX-L just imported from Japan. Mint condition with low genuine mileage. Ideal for executive city driving in Kigali and smooth off-road trips across Rwanda’s hills and national parks.',
    isFeatured: true,
    postedDate: '2026-09-02',
    vin: 'JTEBX3FJ70K098231',
    plateNumber: 'RAD 421 K'
  },
  {
    id: 'veh-002',
    make: 'Toyota',
    model: 'RAV4 Hybrid AWD',
    year: 2021,
    priceRwf: 38500000,
    priceUsd: 27900,
    purpose: 'buy',
    status: 'available',
    mileageKm: 42000,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    engineSize: '2.5L 4-Cylinder Hybrid',
    bodyType: 'SUV',
    color: 'Midnight Black',
    location: 'Kigali, Gasabo (Remera)',
    condition: 'Foreign Used',
    dealerId: 'd2',
    seller: {
      name: 'Akagera Prestige Auto Imports',
      phone: '+250 788 512 884',
      whatsapp: '+250 738 225 193',
      email: 'sales@akageraprestige.rw',
      isVerified: true,
      rating: 4.8,
      reviewCount: 36,
      dealerName: 'Akagera Prestige Auto Imports'
    },
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1000&auto=format&fit=crop&q=80'
    ],
    features: [
      'Ultra Low Fuel Consumption (4.8L / 100km)',
      'Electronic All-Wheel Drive (AWD-i)',
      'Apple CarPlay & Android Auto',
      'Toyota Safety Sense 2.0 (Lane Assist, Pre-collision)',
      'Heated Seats',
      'LED Projector Headlights'
    ],
    description: 'Fuel efficiency champion! This 2021 Toyota RAV4 Hybrid offers the best balance for Kigali commuting with low fuel expenses and reliable AWD traction for rainy seasons.',
    isFeatured: true,
    postedDate: '2026-09-04',
    vin: '2T3C1RFV1MW104921',
    plateNumber: 'RAC 890 B'
  },
  {
    id: 'veh-003',
    make: 'Mercedes-Benz',
    model: 'GLE 350 4MATIC AMG Line',
    year: 2020,
    priceRwf: 67000000,
    priceUsd: 48500,
    purpose: 'buy',
    status: 'sold',
    mileageKm: 51000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    engineSize: '2.0L Turbocharged I4',
    bodyType: 'SUV',
    color: 'Selenite Grey',
    location: 'Kigali, Gasabo (Nyarutarama)',
    condition: 'Foreign Used',
    dealerId: 'd2',
    seller: {
      name: 'Akagera Prestige Auto Imports',
      phone: '+250 788 225 193',
      whatsapp: '+250 738 225 193',
      email: 'trust@rwandacarhub.com',
      isVerified: true,
      rating: 4.8,
      reviewCount: 36,
      dealerName: 'Akagera Prestige Auto Imports'
    },
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1000&auto=format&fit=crop&q=80'
    ],
    features: [
      'AMG Styling Package & 21-inch Alloys',
      'Dual 12.3-inch MBUX Digital Displays',
      'Burmester Surround Sound',
      'Panoramic Sliding Glass Sunroof',
      'Air Balance Ambient Perfume & Fragrance',
      '64-Color Ambient Lighting'
    ],
    description: 'Executive prestige on Rwandan roads. Exceptional German luxury engineering, pristine condition, dealer maintained with full service records and clear title.',
    isFeatured: true,
    postedDate: '2026-09-01',
    vin: '4JGFF4EE3LA982104'
  },
  {
    id: 'veh-004',
    make: 'Toyota',
    model: 'Hilux Double Cabin 4x4 (GD-6)',
    year: 2023,
    priceRwf: 54000000,
    priceUsd: 39100,
    purpose: 'buy',
    status: 'available',
    mileageKm: 21000,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    engineSize: '2.8L D-4D Diesel',
    bodyType: 'Pickup Truck',
    color: 'Silver Metallic',
    location: 'Kigali, Gisozi Industrial Zone',
    condition: 'Brand New',
    dealerId: 'd4',
    seller: {
      name: 'Great Lakes Commercial & 4x4',
      phone: '+250 789 670 411',
      whatsapp: '+250 738 225 193',
      email: 'trust@rwandacarhub.com',
      isVerified: true,
      rating: 4.9,
      reviewCount: 51,
      dealerName: 'Great Lakes Commercial & 4x4'
    },
    images: [
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1000&auto=format&fit=crop&q=80'
    ],
    features: [
      'Heavy-Duty Suspension & Snorkel Ready',
      'Bedliner with Rear Roller Shutter',
      'Rear Differential Lock (4WD High & Low)',
      'Heavy-Duty Tow Bar (3.5 Tons)',
      'Touchscreen Infotainment with Navigation',
      'Rear View Camera & Parking Sensors'
    ],
    description: 'The ultimate workhorse for Rwanda’s terrain and construction projects. Brand new condition with manufacturer warranty, durable 2.8L diesel engine, and high ground clearance.',
    isFeatured: false,
    postedDate: '2026-08-29'
  },
  {
    id: 'veh-005',
    make: 'Hyundai',
    model: 'Tucson Executive Edition',
    year: 2022,
    priceRwf: 32000000,
    priceUsd: 23200,
    purpose: 'buy',
    status: 'available',
    mileageKm: 28000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    engineSize: '2.0L Smartstream',
    bodyType: 'SUV',
    color: 'Amazon Gray',
    location: 'Kigali, Kicukiro (Gahanga)',
    condition: 'Foreign Used',
    dealerId: 'd3',
    seller: {
      name: '1000 Hills Reliable Motors',
      phone: '+250 788 225 193',
      whatsapp: '+250 738 225 193',
      email: 'trust@rwandacarhub.com',
      isVerified: true,
      rating: 4.7,
      reviewCount: 29,
      dealerName: '1000 Hills Reliable Motors'
    },
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=1000&auto=format&fit=crop&q=80'
    ],
    features: [
      'Parametric Jewel Hidden LED Lights',
      'Wireless Phone Charging Pad',
      'Forward Collision-Avoidance Assist',
      'Dual-Zone Auto Climate Control',
      'Smart Cruise Control'
    ],
    description: 'Sleek futuristic design, high comfort, and low maintenance costs in Rwanda. Great compact SUV for family commutes around Kigali and weekend getaways to Lake Kivu.',
    isFeatured: false,
    postedDate: '2026-09-03'
  },
  {
    id: 'veh-006',
    make: 'Toyota',
    model: 'Yaris Cross Hybrid',
    year: 2021,
    priceRwf: 24500000,
    priceUsd: 17750,
    purpose: 'buy',
    status: 'sold',
    mileageKm: 31000,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    engineSize: '1.5L Petrol-Electric Hybrid',
    bodyType: 'Hatchback',
    color: 'Ruby Red',
    location: 'Kigali, Nyarugenge (Downtown)',
    condition: 'Foreign Used',
    seller: {
      name: 'Jean-Paul Uwizeye (Private Seller)',
      phone: '+250 788 225 193',
      whatsapp: '+250 738 225 193',
      email: 'trust@rwandacarhub.com',
      isVerified: true,
      rating: 5.0,
      reviewCount: 8
    },
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1000&auto=format&fit=crop&q=80'
    ],
    features: [
      'Extremely Low Fuel Use (3.9L/100km)',
      'Compact Easy Parking in Kigali Center',
      'Reversing Camera & Sensors',
      'Bluetooth & USB-C Audio',
      'Clean Interior (Non-smoker owner)'
    ],
    description: 'Privately owned, perfectly maintained daily driver. Super economical on gas, ideal for professionals working in Kigali CBD or Nyarugenge.',
    isFeatured: false,
    postedDate: '2026-09-05'
  },
  // RENTAL CARS
  {
    id: 'veh-007',
    make: 'Toyota',
    model: 'Land Cruiser 76 Hardtop (Safari Tour Spec)',
    year: 2023,
    priceRwf: 95000,
    priceUsd: 69,
    rentalPeriod: 'day',
    purpose: 'rent',
    status: 'rented',
    mileageKm: 18000,
    transmission: 'Manual',
    fuelType: 'Diesel',
    engineSize: '4.2L 1HZ Inline-6 Diesel',
    bodyType: 'SUV',
    color: 'Safari Sand Beige',
    location: 'Kigali, Kimihurura & Airport Delivery',
    condition: 'Brand New',
    dealerId: 'd4',
    seller: {
      name: 'Great Lakes Commercial & 4x4 Rentals',
      phone: '+250 788 225 193',
      whatsapp: '+250 738 225 193',
      email: 'rentals@rwandacarhub.com',
      isVerified: true,
      rating: 4.9,
      reviewCount: 78,
      dealerName: 'Great Lakes Commercial & 4x4'
    },
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1000&auto=format&fit=crop&q=80'
    ],
    features: [
      'Pop-up Roof for Wildlife Photography in Akagera & Volcanoes NP',
      'Dual Fuel Tanks (180 Liters Total)',
      'Electric Winch & Recovery Gear included',
      'High Clearance Mud-Terrain Tires',
      'Chauffeur / English/French Guide option available',
      'Free Kigali Airport Pickup'
    ],
    description: 'Designed specifically for gorilla trekking in Musanze (Volcanoes NP), safari game drives in Akagera, and Nyungwe canopy canopy walks. Self-drive or professional driver available.',
    isFeatured: true,
    postedDate: '2026-09-02'
  },
  {
    id: 'veh-008',
    make: 'Suzuki',
    model: 'Jimny Sierra AllGrip 4x4',
    year: 2023,
    priceRwf: 55000,
    priceUsd: 40,
    rentalPeriod: 'day',
    purpose: 'rent',
    mileageKm: 15000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    engineSize: '1.5L K15B Engine',
    bodyType: 'SUV',
    color: 'Kinetic Yellow',
    location: 'Kigali, Remera / Gasabo',
    condition: 'Brand New',
    dealerId: 'd3',
    seller: {
      name: '1000 Hills Reliable Motors',
      phone: '+250 788 225 193',
      whatsapp: '+250 738 225 193',
      email: 'rentals@rwandacarhub.com',
      isVerified: true,
      rating: 4.8,
      reviewCount: 45,
      dealerName: '1000 Hills Reliable Motors'
    },
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80'
    ],
    features: [
      'Compact 4WD Go-Anywhere Capability',
      'Smartphone Integration (CarPlay)',
      'Hill Descent Control',
      'AC & Clean Clean Seats',
      'Low Fuel Burn, Fun Driving Experience'
    ],
    description: 'Charming, adventurous, and capable! Rent the iconic Suzuki Jimny for weekend road trips around Lake Muhazi, Rubavu beach, or Kigali city cruising.',
    isFeatured: false,
    postedDate: '2026-09-03'
  },
  // LEASE CARS
  {
    id: 'veh-009',
    make: 'Toyota',
    model: 'Coaster Executive Bus (30-Seater)',
    year: 2022,
    priceRwf: 1850000,
    priceUsd: 1340,
    rentalPeriod: 'month',
    purpose: 'lease',
    status: 'leased',
    mileageKm: 48000,
    transmission: 'Manual',
    fuelType: 'Diesel',
    engineSize: '4.0L Turbo Diesel',
    bodyType: 'Van / Bus',
    color: 'White / Gold Stripe',
    location: 'Kigali, Sonatubes, Kicukiro',
    condition: 'Foreign Used',
    dealerId: 'd1',
    seller: {
      name: 'Kigali City Motors Corporate Fleet',
      phone: '+250 788 225 193',
      whatsapp: '+250 738 225 193',
      email: 'lease@rwandacarhub.com',
      isVerified: true,
      rating: 4.9,
      reviewCount: 31,
      dealerName: 'Kigali City Motors Ltd'
    },
    images: [
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1000&auto=format&fit=crop&q=80'
    ],
    features: [
      '30 Comfortable High-Back Reclining Seats',
      'Dual High-Capacity Air Conditioners',
      'Public Address & Microphone System',
      'Full Fleet Maintenance Contract Included',
      'GPS Tracking & Speed Governor Certified',
      'Ideal for Schools, NGOs, Corporate Staff Transport'
    ],
    description: 'Corporate long-term lease vehicle. Fully serviced by Kigali City Motors with regular maintenance and replacement vehicle guarantee during service intervals.',
    isFeatured: false,
    postedDate: '2026-08-20'
  },
  {
    id: 'veh-010',
    make: 'BMW',
    model: 'X5 xDrive40i M Sport',
    year: 2021,
    priceRwf: 2400000,
    priceUsd: 1740,
    rentalPeriod: 'month',
    purpose: 'lease',
    mileageKm: 38000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    engineSize: '3.0L TwinPower Turbo Inline-6',
    bodyType: 'SUV',
    color: 'Phytonic Blue Metallic',
    location: 'Kigali, Nyarutarama (Diplomatic Zone)',
    condition: 'Foreign Used',
    dealerId: 'd2',
    seller: {
      name: 'Akagera Prestige Auto Imports',
      phone: '+250 788 225 193',
      whatsapp: '+250 738 225 193',
      email: 'lease@rwandacarhub.com',
      isVerified: true,
      rating: 4.8,
      reviewCount: 22,
      dealerName: 'Akagera Prestige Auto Imports'
    },
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1000&auto=format&fit=crop&q=80'
    ],
    features: [
      'M Sport Package & M Brakes',
      'Panoramic Sky Lounge LED Roof',
      'Harmon Kardon Sound System',
      'Head-Up Display & Driving Assistant Professional',
      'Full Comprehensive Insurance Included in Monthly Lease',
      'Diplomat & Corporate Tax Exempt Friendly'
    ],
    description: 'Premium executive monthly lease tailored for diplomats, NGO directors, and multinational executives residing in Kigali. Flexible 6, 12, or 24-month lease contracts.',
    isFeatured: true,
    postedDate: '2026-08-25'
  },
  {
    id: 'veh-011',
    make: 'Toyota',
    model: 'Harrier Elegance (Venza)',
    year: 2019,
    priceRwf: 29500000,
    priceUsd: 21400,
    purpose: 'buy',
    mileageKm: 62000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    engineSize: '2.0L Valvematic',
    bodyType: 'SUV',
    color: 'Dark Burgundy Red',
    location: 'Kigali, Kicukiro (Niboye)',
    condition: 'Foreign Used',
    dealerId: 'd1',
    seller: {
      name: 'Kigali City Motors Ltd',
      phone: '+250 788 225 193',
      whatsapp: '+250 738 225 193',
      email: 'trust@rwandacarhub.com',
      isVerified: true,
      rating: 4.9,
      reviewCount: 42,
      dealerName: 'Kigali City Motors Ltd'
    },
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=1000&auto=format&fit=crop&q=80'
    ],
    features: [
      'Luxury Dark Burgundy Paint Finish',
      'Electric Tailgate & Memory Seats',
      'Cruise Control & Emergency Brake',
      'Alloy Wheels with Fresh Continental Tires',
      'Control Inspection Certificate Passed'
    ],
    description: 'Extremely popular luxury mid-size crossover in Rwanda. High road presence, superb resale value, and smooth ride on Kigali cobblestone and asphalt avenues.',
    isFeatured: false,
    postedDate: '2026-09-01'
  },
  {
    id: 'veh-012',
    make: 'BYD',
    model: 'Atto 3 Full Electric (EV)',
    year: 2024,
    priceRwf: 42000000,
    priceUsd: 30450,
    purpose: 'buy',
    mileageKm: 6500,
    transmission: 'Automatic',
    fuelType: 'Electric',
    engineSize: '60.48 kWh Blade Battery (420km Range)',
    bodyType: 'SUV',
    color: 'Skiing White',
    location: 'Kigali, Gasabo (KG 548 St)',
    condition: 'Brand New',
    seller: {
      name: 'Rwanda Green E-Mobility Group',
      phone: '+250 788 225 193',
      whatsapp: '+250 738 225 193',
      email: 'emobility@rwandacarhub.com',
      isVerified: true,
      rating: 5.0,
      reviewCount: 19
    },
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80'
    ],
    features: [
      'Zero Emissions & Rwanda EV Tax Exempt Status',
      '420 KM Real World Range on single charge',
      'Rotating 15.6-inch Touchscreen Infotainment',
      'Home Wallbox 7kW Fast Charger Included',
      '8 Years / 150,000 KM Battery Warranty'
    ],
    description: 'Leading Rwanda’s green transportation revolution! Benefit from 0% import duty and 0% VAT incentives for EVs in Rwanda. Charge cheaply at home or at Kigali EV charging stations.',
    isFeatured: true,
    postedDate: '2026-09-04'
  }
];
