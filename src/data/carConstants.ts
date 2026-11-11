export interface CarBrandInfo {
  name: string;
  country: string;
  badge: string;
  description: string;
  popularModels: string[];
  logoSvg: string; // inline SVG markup for high-res crisp rendering
  accentColor: string;
}

// User-requested car makes including:
// Mazda, Subaru, Ford, Tesla, Kia, Genesis, Citroën, Peugeot, Geely, Nio, Xpeng
export const CAR_MAKES: string[] = [
  'Toyota',
  'Mercedes-Benz',
  'Audi',
  'BMW',
  'Mazda',
  'Subaru',
  'Ford',
  'Tesla',
  'Kia',
  'Genesis',
  'Citroën',
  'Peugeot',
  'Geely',
  'Nio',
  'Xpeng',
  'Hyundai',
  'Suzuki',
  'Nissan',
  'Land Rover',
  'BYD',
  'Volkswagen',
  'Mitsubishi',
  'Honda',
  'Lexus',
  'Volvo',
  'Chery',
  'Isuzu'
];

// User-requested Year of Fabrication range: 1990 - 2030
export const FABRICATION_YEARS: number[] = Array.from(
  { length: 2030 - 1990 + 1 },
  (_, i) => 2030 - i
);

// User-requested locations in Rwanda:
// Gikondo, Gisozi, Gatsata, Gatenga, Gacuriro, Kanombe, Kabuga, Kagugu, Kibagabaga, 
// Kimironko, Kimisagara, Rebero, Rusororo, Nyamirambo, Nyabugogo, Nyamata, Kamonyi, 
// Rwamagana, Rubavu, Muhanga, Musanze
export const RWANDA_LOCATIONS: { value: string; label: string; district: string }[] = [
  { value: 'Kigali, Gikondo', label: 'Gikondo (Kicukiro)', district: 'Kicukiro' },
  { value: 'Kigali, Gisozi', label: 'Gisozi (Gasabo)', district: 'Gasabo' },
  { value: 'Kigali, Gatsata', label: 'Gatsata (Gasabo)', district: 'Gasabo' },
  { value: 'Kigali, Gatenga', label: 'Gatenga (Kicukiro)', district: 'Kicukiro' },
  { value: 'Kigali, Gacuriro', label: 'Gacuriro (Gasabo)', district: 'Gasabo' },
  { value: 'Kigali, Kanombe', label: 'Kanombe (Kicukiro)', district: 'Kicukiro' },
  { value: 'Kigali, Kabuga', label: 'Kabuga (Kicukiro/Gasabo)', district: 'Kicukiro' },
  { value: 'Kigali, Kagugu', label: 'Kagugu (Gasabo)', district: 'Gasabo' },
  { value: 'Kigali, Kibagabaga', label: 'Kibagabaga (Gasabo)', district: 'Gasabo' },
  { value: 'Kigali, Kimironko', label: 'Kimironko (Gasabo)', district: 'Gasabo' },
  { value: 'Kigali, Kimisagara', label: 'Kimisagara (Nyarugenge)', district: 'Nyarugenge' },
  { value: 'Kigali, Rebero', label: 'Rebero (Kicukiro)', district: 'Kicukiro' },
  { value: 'Kigali, Rusororo', label: 'Rusororo (Gasabo)', district: 'Gasabo' },
  { value: 'Kigali, Nyamirambo', label: 'Nyamirambo (Nyarugenge)', district: 'Nyarugenge' },
  { value: 'Kigali, Nyabugogo', label: 'Nyabugogo (Nyarugenge)', district: 'Nyarugenge' },
  { value: 'Eastern Province, Nyamata', label: 'Nyamata (Bugesera)', district: 'Bugesera' },
  { value: 'Southern Province, Kamonyi', label: 'Kamonyi (Southern)', district: 'Kamonyi' },
  { value: 'Eastern Province, Rwamagana', label: 'Rwamagana (Eastern)', district: 'Rwamagana' },
  { value: 'Western Province, Rubavu', label: 'Rubavu / Gisenyi (Western)', district: 'Rubavu' },
  { value: 'Southern Province, Muhanga', label: 'Muhanga / Gitarama (Southern)', district: 'Muhanga' },
  { value: 'Northern Province, Musanze', label: 'Musanze / Ruhengeri (Northern)', district: 'Musanze' },
  // Additional core hub locations
  { value: 'Kigali, Kicukiro (Sonatubes)', label: 'Kicukiro (Sonatubes)', district: 'Kicukiro' },
  { value: 'Kigali, Gasabo (Remera)', label: 'Remera (Gasabo)', district: 'Gasabo' },
  { value: 'Kigali, Gasabo (Nyarutarama)', label: 'Nyarutarama (Gasabo)', district: 'Gasabo' },
  { value: 'Kigali, Nyarugenge (Downtown)', label: 'Nyarugenge (Downtown)', district: 'Nyarugenge' },
  { value: 'Kigali, Kimihurura', label: 'Kimihurura (Gasabo)', district: 'Gasabo' }
];

// Rich Brand Metadata with SVG Logos
export const CAR_BRANDS_METADATA: CarBrandInfo[] = [
  {
    name: 'Mazda',
    country: 'Japan',
    badge: 'SkyActiv Technology',
    description: 'Precision Japanese engineering known for sleek KODO design, responsive driving dynamics, and fuel-efficient SkyActiv engines.',
    popularModels: ['CX-5', 'CX-9', 'Mazda 3', 'CX-30', 'Demio'],
    accentColor: '#990000',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <circle cx="50" cy="50" r="44" stroke="#e2e8f0" stroke-width="4"/>
        <path d="M50 22 C34 38, 22 45, 22 56 C22 68, 35 76, 50 76 C65 76, 78 68, 78 56 C78 45, 66 38, 50 22 Z" stroke="#e2e8f0" stroke-width="3" fill="none"/>
        <path d="M28 50 C38 42, 45 48, 50 56 C55 48, 62 42, 72 50 C66 60, 56 64, 50 64 C44 64, 34 60, 28 50 Z" fill="#e2e8f0"/>
      </svg>
    `
  },
  {
    name: 'Subaru',
    country: 'Japan',
    badge: 'Symmetrical AWD',
    description: 'World-renowned for boxer engines and legendary Symmetrical All-Wheel Drive, the top choice for Rwanda’s steep hills and rainy season.',
    popularModels: ['Forester', 'Outback', 'XV / Crosstrek', 'Impreza', 'WRX'],
    accentColor: '#003399',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <ellipse cx="50" cy="50" rx="46" ry="36" stroke="#38bdf8" stroke-width="4"/>
        <!-- Pleiades 6 Stars -->
        <polygon points="65,36 67,42 73,42 68,46 70,52 65,48 60,52 62,46 57,42 63,42" fill="#38bdf8"/>
        <polygon points="45,46 46,50 50,50 47,53 48,57 45,54 42,57 43,53 40,50 44,50" fill="#38bdf8"/>
        <polygon points="56,54 57,57 60,57 58,59 59,62 56,60 53,62 54,59 52,57 55,57" fill="#38bdf8"/>
        <polygon points="36,54 37,57 40,57 38,59 39,62 36,60 33,62 34,59 32,57 35,57" fill="#38bdf8"/>
        <polygon points="46,62 47,65 50,65 48,67 49,70 46,68 43,70 44,67 42,65 45,65" fill="#38bdf8"/>
        <polygon points="58,68 59,71 62,71 60,73 61,76 58,74 55,76 56,73 54,71 57,71" fill="#38bdf8"/>
      </svg>
    `
  },
  {
    name: 'Ford',
    country: 'USA',
    badge: 'Built Ford Tough',
    description: 'Iconic American trucks and family SUVs engineered for heavy-duty towing, off-road durability, and long-distance African touring.',
    popularModels: ['Ranger 4x4', 'Everest', 'Explorer', 'F-150', 'EcoSport'],
    accentColor: '#002c6c',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <ellipse cx="50" cy="50" rx="46" ry="28" fill="#002c6c" stroke="#38bdf8" stroke-width="3"/>
        <text x="50" y="56" font-family="'Georgia', serif" font-style="italic" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">Ford</text>
      </svg>
    `
  },
  {
    name: 'Tesla',
    country: 'USA',
    badge: 'Electric Pioneer',
    description: 'The global benchmark for 100% electric vehicles with cutting-edge Autopilot, ultra-long battery range, and instantaneous acceleration.',
    popularModels: ['Model Y', 'Model 3', 'Model X', 'Model S', 'Cybertruck'],
    accentColor: '#e82127',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <path d="M22 28 C34 22, 66 22, 78 28 L72 35 C64 30, 36 30, 28 35 Z" fill="#e82127"/>
        <path d="M48 38 L52 38 L52 78 L48 78 Z" fill="#e82127"/>
        <path d="M34 38 C42 42, 58 42, 66 38 L68 44 C58 50, 42 50, 32 44 Z" fill="#e82127"/>
      </svg>
    `
  },
  {
    name: 'Kia',
    country: 'South Korea',
    badge: 'Movement that Inspires',
    description: 'Award-winning modern SUVs featuring futuristic exterior styling, spacious smart cockpits, and outstanding reliability records.',
    popularModels: ['Sportage', 'Sorento', 'Seltos', 'Telluride', 'EV6'],
    accentColor: '#05141f',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <rect x="8" y="24" width="84" height="52" rx="12" fill="#0a0f1d" stroke="#e2e8f0" stroke-width="3"/>
        <text x="50" y="58" font-family="'Outfit', sans-serif" font-weight="900" font-size="28" letter-spacing="4" fill="#ffffff" text-anchor="middle">KIA</text>
      </svg>
    `
  },
  {
    name: 'Genesis',
    country: 'South Korea',
    badge: 'Athletic Elegance',
    description: 'Hyundai Motor Group’s luxury automotive brand delivering flagship executive refinement, crest grilles, and first-class bespoke comfort.',
    popularModels: ['GV70', 'GV80', 'G80', 'G70', 'GV60 (EV)'],
    accentColor: '#1c1c1c',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <!-- Genesis Wings -->
        <path d="M12 44 C26 40, 40 46, 46 54 L44 58 C38 50, 24 46, 14 50 Z" fill="#94a3b8"/>
        <path d="M88 44 C74 40, 60 46, 54 54 L56 58 C62 50, 76 46, 86 50 Z" fill="#94a3b8"/>
        <ellipse cx="50" cy="52" rx="14" ry="10" fill="#0f172a" stroke="#e2e8f0" stroke-width="2"/>
        <text x="50" y="55" font-family="'Outfit', sans-serif" font-size="8" font-weight="bold" fill="#e2e8f0" text-anchor="middle">GENESIS</text>
      </svg>
    `
  },
  {
    name: 'Citroën',
    country: 'France',
    badge: 'Advanced Comfort',
    description: 'French automotive heritage famous for pioneering hydraulic and progressive hydraulic cushion suspensions, offering plush ride comfort.',
    popularModels: ['C5 Aircross', 'C3', 'C4', 'Berlingo', 'C3 Aircross'],
    accentColor: '#b0101a',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <!-- Double Chevrons -->
        <path d="M22 44 L50 24 L78 44 L70 50 L50 36 L30 50 Z" fill="#ef4444"/>
        <path d="M22 64 L50 44 L78 64 L70 70 L50 56 L30 70 Z" fill="#ef4444"/>
      </svg>
    `
  },
  {
    name: 'Peugeot',
    country: 'France',
    badge: 'Allure & Innovation',
    description: 'Striking French crossovers equipped with Peugeot i-Cockpit, compact steering wheels, and distinctive three-claw LED lighting signatures.',
    popularModels: ['3008 SUV', '5008 7-Seater', '2008 Crossover', 'Landtrek 4x4', '508'],
    accentColor: '#000000',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <path d="M26 20 L74 20 L80 62 L50 86 L20 62 Z" fill="#0a0f1d" stroke="#e2e8f0" stroke-width="3"/>
        <text x="50" y="34" font-family="'Outfit', sans-serif" font-size="9" font-weight="900" fill="#e2e8f0" letter-spacing="1" text-anchor="middle">PEUGEOT</text>
        <path d="M50 42 C44 48, 42 56, 44 64 C48 68, 56 68, 58 60 C58 54, 54 48, 50 42 Z" fill="#38bdf8"/>
      </svg>
    `
  },
  {
    name: 'Geely',
    country: 'China',
    badge: 'Intelligent Mobility',
    description: 'Owner of Volvo and Polestar, Geely delivers global safety architecture, turbo performance, and high-tech cabin displays.',
    popularModels: ['Coolray', 'Monjaro 4WD', 'Tugella', 'Okavango', 'Geometry C'],
    accentColor: '#002060',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <path d="M20 32 L80 32 L74 68 L50 78 L26 68 Z" fill="#002060" stroke="#60a5fa" stroke-width="3"/>
        <path d="M30 40 L70 40 L66 62 L50 68 L34 62 Z" fill="#0a0f1d"/>
        <text x="50" y="56" font-family="'Outfit', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">GEELY</text>
      </svg>
    `
  },
  {
    name: 'Nio',
    country: 'China',
    badge: 'Smart Premium EV',
    description: 'High-end electric vehicle brand famed for autonomous driving suites, NOMI AI voice assistant, and pioneering battery-swap technology.',
    popularModels: ['ES8 SUV', 'ET5 Sedan', 'ES6', 'EC7 Coupe SUV', 'ET7 Flagship'],
    accentColor: '#003366',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <!-- Nio Arch (The Sky) -->
        <path d="M26 42 C34 30, 66 30, 74 42" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
        <!-- Nio Chevron (The Horizon/Action) -->
        <path d="M32 54 L50 72 L68 54" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `
  },
  {
    name: 'Xpeng',
    country: 'China',
    badge: 'AI Software Defined EV',
    description: 'Fast-growing tech-focused electric automaker bringing 800V silicon carbide ultra-fast charging and XPILOT intelligent driving.',
    popularModels: ['G9 Luxury SUV', 'G6 Ultra Smart SUV', 'P7 Wing Edition', 'X9 MPV'],
    accentColor: '#ff6600',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <!-- Xpeng 4-Petal X Logo -->
        <path d="M26 30 C34 34, 40 40, 44 46 C38 48, 30 44, 26 38 Z" fill="#f97316"/>
        <path d="M74 30 C66 34, 60 40, 56 46 C62 48, 70 44, 74 38 Z" fill="#f97316"/>
        <path d="M26 70 C34 66, 40 60, 44 54 C38 52, 30 56, 26 62 Z" fill="#f97316"/>
        <path d="M74 70 C66 66, 60 60, 56 54 C62 52, 70 56, 74 62 Z" fill="#f97316"/>
      </svg>
    `
  },
  {
    name: 'Toyota',
    country: 'Japan',
    badge: 'Rwanda’s #1 Choice',
    description: 'The undisputed automotive king of Rwanda. Unequaled resale value, cheap spare parts across Kigali, and unbreakable 4x4 endurance.',
    popularModels: ['Land Cruiser Prado', 'RAV4 Hybrid', 'Hilux 4x4', 'Land Cruiser 300', 'Corolla Cross'],
    accentColor: '#eb0a1e',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <ellipse cx="50" cy="50" rx="44" ry="32" stroke="#ef4444" stroke-width="4"/>
        <ellipse cx="50" cy="42" rx="20" ry="14" stroke="#ef4444" stroke-width="3"/>
        <ellipse cx="50" cy="52" rx="10" ry="24" stroke="#ef4444" stroke-width="3"/>
      </svg>
    `
  },
  {
    name: 'Mercedes-Benz',
    country: 'Germany',
    badge: 'The Best or Nothing',
    description: 'Prestige German luxury sedans, 4MATIC all-wheel-drive SUVs, and iconic G-Wagons revered by Kigali’s executive business leaders.',
    popularModels: ['G-Wagon G63', 'C-Class', 'GLE 4MATIC', 'E-Class', 'GLC 300'],
    accentColor: '#00a3e0',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <circle cx="50" cy="50" r="42" stroke="#e2e8f0" stroke-width="4"/>
        <!-- Three-pointed Star -->
        <line x1="50" y1="50" x2="50" y2="10" stroke="#e2e8f0" stroke-width="4"/>
        <line x1="50" y1="50" x2="16" y2="70" stroke="#e2e8f0" stroke-width="4"/>
        <line x1="50" y1="50" x2="84" y2="70" stroke="#e2e8f0" stroke-width="4"/>
      </svg>
    `
  },
  {
    name: 'BMW',
    country: 'Germany',
    badge: 'Sheer Driving Pleasure',
    description: 'Bavarian dynamic performance, xDrive intelligence, and athletic luxury styling with iconic kidney grilles.',
    popularModels: ['X5 xDrive', 'X3', '3-Series', '5-Series', 'X6'],
    accentColor: '#0066b1',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <circle cx="50" cy="50" r="44" fill="#000000" stroke="#94a3b8" stroke-width="3"/>
        <circle cx="50" cy="50" r="30" stroke="#ffffff" stroke-width="2"/>
        <path d="M50 20 A30 30 0 0 1 80 50 L50 50 Z" fill="#0284c7"/>
        <path d="M20 50 A30 30 0 0 1 50 20 L50 50 Z" fill="#ffffff"/>
        <path d="M50 50 L50 80 A30 30 0 0 1 20 50 Z" fill="#0284c7"/>
        <path d="M50 50 L80 50 A30 30 0 0 1 50 80 Z" fill="#ffffff"/>
      </svg>
    `
  },
  {
    name: 'Hyundai',
    country: 'South Korea',
    badge: 'Smart Value & Hybrid',
    description: 'Sleek Parametric Jewel styling, high-efficiency hybrid drivetrains, and excellent long-term warranty in Rwanda.',
    popularModels: ['Tucson', 'Santa Fe', 'Creta', 'Ioniq 5 (EV)', 'Elantra'],
    accentColor: '#002c5f',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <ellipse cx="50" cy="50" rx="44" ry="30" stroke="#38bdf8" stroke-width="4"/>
        <path d="M36 34 L44 34 L36 66 L44 66 M40 50 L60 50 M56 34 L64 34 L56 66 L64 66" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `
  },
  {
    name: 'Land Rover',
    country: 'UK',
    badge: 'Above & Beyond',
    description: 'Supreme British all-terrain luxury and safari capability. Defender and Range Rover reign supreme on expeditions.',
    popularModels: ['Defender 110', 'Range Rover Sport', 'Discovery', 'Velar', 'Evoque'],
    accentColor: '#005a2b',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <ellipse cx="50" cy="50" rx="46" ry="26" fill="#005a2b" stroke="#e2e8f0" stroke-width="2"/>
        <text x="50" y="47" font-family="'Outfit', sans-serif" font-weight="900" font-size="11" fill="#ffffff" letter-spacing="1" text-anchor="middle">LAND</text>
        <text x="50" y="61" font-family="'Outfit', sans-serif" font-weight="900" font-size="11" fill="#ffffff" letter-spacing="1" text-anchor="middle">ROVER</text>
      </svg>
    `
  },
  {
    name: 'Volkswagen',
    country: 'Germany',
    badge: 'Assembled in Rwanda',
    description: 'Locally assembled in Kigali at CFAO / Special Economic Zone. High German build quality with strong regional dealer backing.',
    popularModels: ['Tiguan', 'Teramont', 'Touareg', 'Passat', 'Golf'],
    accentColor: '#001e50',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <circle cx="50" cy="50" r="42" stroke="#38bdf8" stroke-width="4"/>
        <path d="M30 32 L44 64 L50 48 L56 64 L70 32" stroke="#38bdf8" stroke-width="4" fill="none"/>
        <path d="M36 68 L50 36 L64 68" stroke="#38bdf8" stroke-width="4" fill="none"/>
      </svg>
    `
  },
  {
    name: 'Nissan',
    country: 'Japan',
    badge: 'Innovation that Excites',
    description: 'Rugged heavy-duty safari chassis (Patrol) and comfortable urban crossovers (X-Trail, Qashqai) with e-POWER.',
    popularModels: ['Patrol Y62', 'X-Trail', 'Navara 4x4', 'Qashqai', 'Kicks'],
    accentColor: '#c3002f',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <circle cx="50" cy="50" r="42" stroke="#e2e8f0" stroke-width="4"/>
        <rect x="14" y="42" width="72" height="16" fill="#0f172a" stroke="#e2e8f0" stroke-width="2"/>
        <text x="50" y="54" font-family="'Outfit', sans-serif" font-weight="900" font-size="12" fill="#ffffff" letter-spacing="2" text-anchor="middle">NISSAN</text>
      </svg>
    `
  },
  {
    name: 'BYD',
    country: 'China',
    badge: 'Build Your Dreams (EV)',
    description: 'World’s #1 new energy vehicle manufacturer. Blade Battery safety, high efficiency, and rapidly growing charging network in Kigali.',
    popularModels: ['Atto 3', 'Seal', 'Song Plus Hybrid', 'Tang EV', 'Dolphin'],
    accentColor: '#005bac',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <ellipse cx="50" cy="50" rx="44" ry="26" stroke="#38bdf8" stroke-width="3"/>
        <text x="50" y="58" font-family="'Outfit', sans-serif" font-weight="900" font-size="22" letter-spacing="3" fill="#ffffff" text-anchor="middle">BYD</text>
      </svg>
    `
  },
  {
    name: 'Audi',
    country: 'Germany',
    badge: 'Vorsprung durch Technik',
    description: 'Iconic Quattro permanent all-wheel drive, cutting-edge virtual cockpits, and matrix LED lights.',
    popularModels: ['Q7', 'Q5', 'A6', 'Q8', 'e-tron EV'],
    accentColor: '#bb0a30',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <!-- 4 Interlocking Rings -->
        <circle cx="26" cy="50" r="14" stroke="#e2e8f0" stroke-width="3" fill="none"/>
        <circle cx="42" cy="50" r="14" stroke="#e2e8f0" stroke-width="3" fill="none"/>
        <circle cx="58" cy="50" r="14" stroke="#e2e8f0" stroke-width="3" fill="none"/>
        <circle cx="74" cy="50" r="14" stroke="#e2e8f0" stroke-width="3" fill="none"/>
      </svg>
    `
  },
  {
    name: 'Suzuki',
    country: 'Japan',
    badge: 'Compact 4x4 Champion',
    description: 'Lightweight off-road champion. The Jimny and Grand Vitara offer genuine low-range 4x4 with ultra-low fuel consumption.',
    popularModels: ['Jimny 4x4', 'Grand Vitara', 'Swift', 'Ertiga', 'Fronx'],
    accentColor: '#e31b23',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <path d="M72 26 L28 48 L28 58 L72 36 Z" fill="#ef4444"/>
        <path d="M28 74 L72 52 L72 42 L28 64 Z" fill="#ef4444"/>
        <text x="50" y="88" font-family="'Outfit', sans-serif" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">SUZUKI</text>
      </svg>
    `
  },
  {
    name: 'Mitsubishi',
    country: 'Japan',
    badge: 'Super Select 4WD',
    description: 'Dakar Rally champion pedigree. Legendary Super Select 4WD-II allows driving in 4H on dry tarmac for ultimate rainy season grip.',
    popularModels: ['Pajero Super Select', 'Outlander PHEV', 'L200 / Triton', 'Pajero Sport', 'Eclipse Cross'],
    accentColor: '#e60012',
    logoSvg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
        <!-- Three Red Diamonds -->
        <polygon points="50,20 60,38 50,56 40,38" fill="#ef4444"/>
        <polygon points="36,58 20,68 30,86 46,76" fill="#ef4444"/>
        <polygon points="64,58 80,68 70,86 54,76" fill="#ef4444"/>
      </svg>
    `
  }
];
