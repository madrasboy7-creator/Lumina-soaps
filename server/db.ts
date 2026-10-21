import fs from 'fs';
import path from 'path';
import {
  SoapProduct,
  Order,
  UserAccount,
  CuringBatch,
  ProductReview,
  CategoryItem,
  Coupon,
  NotificationItem,
  SupportTicket,
  PromotionalBanner,
  CompanySettings,
  StoreSettings,
  AuditLog,
  OrderStatus,
  PaymentStatus,
  GiftItem,
  ComboOffer,
  RevenueSummary,
  Collection,
  HomepageConfig,
  BrandPageContent,
  FAQItem,
  MediaItem,
  SEOMetadata,
  CustomerSegment,
  InternalCustomerNote,
  CustomerCampaign,
} from '../src/types';

interface DatabaseSchema {
  users: (UserAccount & { password?: string })[];
  categories: CategoryItem[];
  products: SoapProduct[];
  orders: Order[];
  curingBatches: CuringBatch[];
  coupons: Coupon[];
  notifications: NotificationItem[];
  supportTickets: SupportTicket[];
  promotionalBanners: PromotionalBanner[];
  companySettings: StoreSettings;
  auditLogs: AuditLog[];
  giftItems: GiftItem[];
  offers: ComboOffer[];
  collections: Collection[];
  homepageConfig: HomepageConfig;
  brandPages: BrandPageContent[];
  faqs: FAQItem[];
  media: MediaItem[];
  seo: SEOMetadata[];
  customerSegments: CustomerSegment[];
  customerNotes: InternalCustomerNote[];
  campaigns: CustomerCampaign[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');


const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-herbal',
    name: 'Herbal & Botanical',
    slug: 'herbal-botanical',
    description: 'Wildcrafted mountain herbs, neem decoctions, and healing plants.',
    image: 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=600&q=80',
    order: 1,
    enabled: true,
  },
  {
    id: 'cat-honey',
    name: 'Goat Milk & Honey',
    slug: 'goat-milk-honey',
    description: 'Ultra-creamy pasture-raised milk with raw forest honey.',
    image: 'https://images.unsplash.com/photo-1608248597359-2ff924294b43?auto=format&fit=crop&w=600&q=80',
    order: 2,
    enabled: true,
  },
  {
    id: 'cat-scrub',
    name: 'Exfoliating Scrub',
    slug: 'exfoliating-scrub',
    description: 'Ground walnut shells, sea salts, and crushed botanical foliage.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    order: 3,
    enabled: true,
  },
  {
    id: 'cat-aroma',
    name: 'Aromatherapy & Calming',
    slug: 'aromatherapy-calming',
    description: 'Pure distilled essential oils for meditative bath rituals.',
    image: 'https://images.unsplash.com/photo-1608248597359-2ff924294b43?auto=format&fit=crop&w=600&q=80',
    order: 4,
    enabled: true,
  },
  {
    id: 'cat-sensitive',
    name: 'Sensitive & Baby Care',
    slug: 'sensitive-baby-care',
    description: 'Fragrance-free castile formulas packed with natural olive squalane.',
    image: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=600&q=80',
    order: 5,
    enabled: true,
  },
  {
    id: 'cat-gift',
    name: 'Artisan Swirl Gift Sets',
    slug: 'artisan-gift-sets',
    description: 'Hand-stamped luxury gift assortments packed in pine boxes.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    order: 6,
    enabled: true,
  },
  {
    id: 'cat-face',
    name: 'Face & Complexion',
    slug: 'face-complexion',
    description: 'Pore-clearing clays, saffron radiance, and balanced sebum care.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    order: 7,
    enabled: true,
  },
  {
    id: 'cat-bundles',
    name: 'Value Bundles',
    slug: 'value-bundles',
    description: 'Curated 3-bar and 5-bar curing rack bundles at exceptional savings.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    order: 8,
    enabled: true,
  },
];

const SEED_PRODUCTS: SoapProduct[] = [
  {
    id: 'soap-inr-1',
    sku: 'LUM-SKU-SAF01',
    name: 'Kashmiri Saffron & Raw Honey Bar',
    tagline: 'Deeply nourishing royal complexion bar with pure saffron strands',
    category: 'Herbal & Botanical',
    price: 349,
    originalPrice: 449,
    rating: 4.9,
    reviewCount: 88,
    stock: 24,
    lowStockThreshold: 5,
    batchNumber: 'LUM-IN-2026-09A',
    cureDate: 'Cured 6 weeks on cedar racks',
    weight: '135g (4.8 oz)',
    dimensions: '3.2" x 2.4" x 1.1"',
    scentProfile: 'Raw Honey & Toasted Almond',
    skinTypes: ['All Skin Types', 'Dry & Sensitive'],
    ingredients: [
      'Cold-Pressed Virgin Coconut Oil',
      'Organic Extra Virgin Olive Oil',
      'Raw Kashmir Forest Honey',
      'Pure Mogra Saffron Threads',
      'Kokum Seed Butter',
      'Sweet Almond Oil',
      'Sweet Orange Essential Oil',
    ],
    benefits: [
      'Enhances natural radiance and evens skin tone',
      'Retains deep moisture without clogging pores',
      'Calms redness with anti-inflammatory saffron',
    ],
    description: 'Our signature cold-process bar infused with genuine Kashmiri Mogra saffron and unheated raw forest honey. Provides a rich, buttery lather that leaves skin velvety soft and deeply hydrated.',
    usageInstructions: 'Work into a dense, creamy lather with warm water between hands or a natural loofah. Massage gently over face and body, then rinse thoroughly.',
    storageInstructions: 'Allow bar to air dry between uses on a well-draining wooden soap dish away from direct streams of water.',
    variants: [
      { id: 'v-1-single', name: 'Single Artisan Bar (135g)', weight: '135g', packSize: 1, price: 349, originalPrice: 449, sku: 'LUM-SKU-SAF01-S', stock: 24 },
      { id: 'v-1-duo', name: 'Duo Pack (2x 135g)', weight: '270g', packSize: 2, price: 649, originalPrice: 898, sku: 'LUM-SKU-SAF01-D', stock: 12 },
      { id: 'v-1-trio', name: 'Family Trio (3x 135g)', weight: '405g', packSize: 3, price: 899, originalPrice: 1347, sku: 'LUM-SKU-SAF01-T', stock: 8 },
    ],
    badge: 'Bestseller',
    isNewRelease: true,
    isFeatured: true,
    isBestSeller: true,
    isPublished: true,
    image: 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597359-2ff924294b43?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['saffron', 'honey', 'glow', 'nourishing', 'dry skin', 'cold process'],
    coldProcessDescription: 'Traditional cold-process technique cured for 42 days on solid cedar drying racks, preserving natural botanical glycerin.',
    reviews: [
      {
        id: 'rev-1',
        userName: 'Priya Sharma',
        rating: 5,
        date: 'Sep 12, 2026',
        title: 'Instant glow and super moisturizing',
        comment: 'You can actually see the saffron threads inside the bar! It leaves my skin supple with no tight dry feeling after bathing.',
        verifiedPurchase: true,
        status: 'approved',
      },
      {
        id: 'rev-2',
        userName: 'Arjun Menon',
        rating: 5,
        date: 'Sep 10, 2026',
        title: 'Best natural soap in India',
        comment: 'The scent is calming and luxurious. Wonderful lather and lasts much longer than commercial soaps.',
        verifiedPurchase: true,
        status: 'approved',
      },
    ],
  },
  {
    id: 'soap-inr-2',
    sku: 'LUM-SKU-SAN02',
    name: 'Mysore Sandalwood & Vetiver Root Bar',
    tagline: 'Earthy grounding aroma with pure distilled sandalwood oil',
    category: 'Aromatherapy & Calming',
    price: 399,
    originalPrice: 499,
    rating: 4.8,
    reviewCount: 64,
    stock: 18,
    lowStockThreshold: 5,
    batchNumber: 'LUM-IN-2026-09B',
    cureDate: 'Cured 7 weeks on cedar racks',
    weight: '140g (4.9 oz)',
    dimensions: '3.2" x 2.4" x 1.2"',
    scentProfile: 'Mysore Sandalwood & Vetiver',
    skinTypes: ['All Skin Types', 'Mature & Nourishing'],
    ingredients: [
      'Saponified Virgin Coconut Oil',
      'Unrefined Shea Butter',
      'Castor Oil for dense bubbly lather',
      'Mysore Sandalwood Essential Extract',
      'Khus (Vetiver) Root Infusion',
      'Kaolin Clay',
    ],
    benefits: [
      'Deeply grounding aromatherapy during evening showers',
      'Gently detoxifies skin pores without dryness',
      'Leaves subtle lingering woody fragrance',
    ],
    description: 'Formulated with steam-distilled pure sandalwood oil from Karnataka and cooling vetiver roots. Calms the mind while restoring elasticity to dehydrated skin.',
    usageInstructions: 'Lather between palms with lukewarm water. Breathe in the warm herbal aroma for a spa-like bathing experience.',
    storageInstructions: 'Keep in an open, aerated soap dish. Do not leave submerged in puddles.',
    variants: [
      { id: 'v-2-single', name: 'Single Artisan Bar (140g)', weight: '140g', packSize: 1, price: 399, originalPrice: 499, sku: 'LUM-SKU-SAN02-S', stock: 18 },
      { id: 'v-2-duo', name: 'Duo Pack (2x 140g)', weight: '280g', packSize: 2, price: 749, originalPrice: 998, sku: 'LUM-SKU-SAN02-D', stock: 9 },
    ],
    badge: 'Maker Favorite',
    isNewRelease: false,
    isFeatured: true,
    isBestSeller: true,
    isPublished: true,
    image: 'https://images.unsplash.com/photo-1608248597359-2ff924294b43?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1608248597359-2ff924294b43?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['sandalwood', 'vetiver', 'calming', 'aromatherapy', 'mature skin'],
    coldProcessDescription: 'Hand-stirred at 105°F with cold-pressed botanical oils, poured into wooden slab molds and hand-cut.',
    reviews: [
      {
        id: 'rev-3',
        userName: 'Rohan Deshmukh',
        rating: 5,
        date: 'Sep 05, 2026',
        title: 'Authentic sandalwood aroma',
        comment: 'Unlike perfumed soaps, this smells 100% natural and woody. A staple in my home.',
        verifiedPurchase: true,
        status: 'approved',
      },
    ],
  },
  {
    id: 'soap-inr-3',
    sku: 'LUM-SKU-EUC03',
    name: 'Nilgiri Eucalyptus & Peppermint Tingle Bar',
    tagline: 'Vigorous morning awakening with crushed mint leaves and tea tree',
    category: 'Exfoliating Scrub',
    price: 279,
    originalPrice: 349,
    rating: 4.7,
    reviewCount: 52,
    stock: 20,
    lowStockThreshold: 4,
    batchNumber: 'LUM-IN-2026-09C',
    cureDate: 'Cured 5 weeks on cedar racks',
    weight: '130g (4.6 oz)',
    dimensions: '3.0" x 2.4" x 1.1"',
    scentProfile: 'Eucalyptus & Peppermint',
    skinTypes: ['All Skin Types', 'Oily & Acne-Prone'],
    ingredients: [
      'Saponified Olive & Coconut Oil',
      'Nilgiri Blue Gum Eucalyptus Oil',
      'Indian Peppermint Oil',
      'Crushed Dried Organic Peppermint Leaves',
      'French Green Clay',
      'Spirulina for natural emerald color',
    ],
    benefits: [
      'Cooling, tingling sensation post-workout',
      'Mild natural scrub texture sloughs dead skin cells',
      'Decongests breathing with eucalyptus steam',
    ],
    description: 'An energizing scrub bar that awakens sleepy mornings. Fresh Nilgiri eucalyptus essential oil cools the skin while crushed spearmint foliage gives a gentle exfoliating buffer.',
    usageInstructions: 'Glide directly against damp skin on arms, legs, and back to gently exfoliate.',
    storageInstructions: 'Dry on a raised rack away from humid bathroom floor puddles.',
    variants: [
      { id: 'v-3-single', name: 'Single Bar (130g)', weight: '130g', packSize: 1, price: 279, originalPrice: 349, sku: 'LUM-SKU-EUC03-S', stock: 20 },
      { id: 'v-3-trio', name: 'Trio Pack (3x 130g)', weight: '390g', packSize: 3, price: 749, originalPrice: 1047, sku: 'LUM-SKU-EUC03-T', stock: 6 },
    ],
    badge: 'New Release',
    isNewRelease: true,
    isFeatured: true,
    isBestSeller: false,
    isPublished: true,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['eucalyptus', 'peppermint', 'cooling', 'scrub', 'acne prone', 'exfoliating'],
    coldProcessDescription: 'Cold soap saponification using fresh mountain herbal decoction.',
    reviews: [],
  },
  {
    id: 'soap-inr-4',
    sku: 'LUM-SKU-NEE04',
    name: 'Neem & Tulsi Purifying Castile Bar',
    tagline: 'Potent Ayurvedic botanical duo for blemishes and clear skin',
    category: 'Herbal & Botanical',
    price: 299,
    originalPrice: 379,
    rating: 4.9,
    reviewCount: 71,
    stock: 22,
    lowStockThreshold: 5,
    batchNumber: 'LUM-IN-2026-09D',
    cureDate: 'Cured 6 weeks on cedar racks',
    weight: '135g (4.8 oz)',
    dimensions: '3.1" x 2.4" x 1.1"',
    scentProfile: 'Lemongrass & Neem',
    skinTypes: ['Oily & Acne-Prone', 'Eczema & Psoriasis Prone'],
    ingredients: [
      'Cold-Pressed Organic Neem Seed Oil',
      'Wild Sacred Tulsi (Holy Basil) Extract',
      'Extra Virgin Olive Oil',
      'Unrefined Kokum Butter',
      'Tea Tree Essential Oil',
      'Indian Lemongrass Oil',
    ],
    benefits: [
      'Clarifies stubborn body acne and back blemishes',
      'Naturally antibacterial and antifungal protection',
      'Non-stripping formulation maintains protective barrier',
    ],
    description: 'Time-tested Ayurvedic purifying bar crafted with cold-pressed unrefined neem seed oil and freshly harvested holy basil. Soothes irritated skin without harsh chemicals.',
    usageInstructions: 'Work into a creamy lather, leave on problem areas for 60 seconds, then rinse with cool water.',
    storageInstructions: 'Keep in a dry, ventilated spot to ensure hardness throughout the bar lifetime.',
    variants: [
      { id: 'v-4-single', name: 'Single Bar (135g)', weight: '135g', packSize: 1, price: 299, originalPrice: 379, sku: 'LUM-SKU-NEE04-S', stock: 22 },
      { id: 'v-4-duo', name: 'Duo Pack (2x 135g)', weight: '270g', packSize: 2, price: 549, originalPrice: 758, sku: 'LUM-SKU-NEE04-D', stock: 10 },
    ],
    badge: 'Bestseller',
    isNewRelease: false,
    isFeatured: true,
    isBestSeller: true,
    isPublished: true,
    image: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['neem', 'tulsi', 'acne', 'ayurvedic', 'purifying', 'herbal'],
    coldProcessDescription: 'Formulated with organic unrefined oils cured 42 days.',
    reviews: [],
  },
  {
    id: 'soap-inr-5',
    sku: 'LUM-SKU-MIL05',
    name: 'Organic Goat Milk & Wild Honey Swirl',
    tagline: 'Silky, ultra-gentle emollient lather for sensitive skin',
    category: 'Goat Milk & Honey',
    price: 329,
    originalPrice: 419,
    rating: 4.9,
    reviewCount: 94,
    stock: 15,
    lowStockThreshold: 5,
    batchNumber: 'LUM-IN-2026-09E',
    cureDate: 'Cured 8 weeks on cedar racks',
    weight: '140g (4.9 oz)',
    dimensions: '3.2" x 2.4" x 1.2"',
    scentProfile: 'Raw Honey & Toasted Almond',
    skinTypes: ['Dry & Sensitive', 'Eczema & Psoriasis Prone'],
    ingredients: [
      'Fresh Local Farm Goat Milk',
      'Wild Raw Forest Honey',
      'Extra Virgin Olive Oil',
      'Unrefined Shea Butter',
      'Sweet Almond Oil',
      'Colloidal Oat Flour',
    ],
    benefits: [
      'Rich in natural lactic acid for gentle cellular renewal',
      'Safe for sensitive skin and children over 6 months',
      'Produces extraordinarily creamy velvet lather',
    ],
    description: 'Chilled raw goat milk replaces all water in the saponification process, yielding an ultra-moisturizing, nutrient-packed bar bursting with vitamins A, B, and D.',
    usageInstructions: 'Lather under warm water and wash body head-to-toe. Safe and soothing for sensitive skin.',
    storageInstructions: 'Let rest on a wooden slat soap dish between daily uses.',
    variants: [
      { id: 'v-5-single', name: 'Single Bar (140g)', weight: '140g', packSize: 1, price: 329, originalPrice: 419, sku: 'LUM-SKU-MIL05-S', stock: 15 },
      { id: 'v-5-trio', name: 'Family Trio (3x 140g)', weight: '420g', packSize: 3, price: 849, originalPrice: 1257, sku: 'LUM-SKU-MIL05-T', stock: 5 },
    ],
    badge: 'Maker Favorite',
    isNewRelease: true,
    isFeatured: true,
    isBestSeller: true,
    isPublished: true,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['goat milk', 'honey', 'sensitive', 'colloidal oats', 'creamy', 'baby care'],
    coldProcessDescription: 'Cold-temperature churned to prevent caramelization of milk sugars.',
    reviews: [],
  },
  {
    id: 'soap-inr-6',
    sku: 'LUM-SKU-CHA06',
    name: 'Activated Coconut Charcoal & Tea Tree Bar',
    tagline: 'Deep pore magnet drawing out environmental pollutants and excess oil',
    category: 'Exfoliating Scrub',
    price: 289,
    originalPrice: 359,
    rating: 4.8,
    reviewCount: 43,
    stock: 16,
    lowStockThreshold: 4,
    batchNumber: 'LUM-IN-2026-09F',
    cureDate: 'Cured 5 weeks on cedar racks',
    weight: '130g (4.6 oz)',
    dimensions: '3.0" x 2.4" x 1.1"',
    scentProfile: 'Activated Charcoal & Tea Tree',
    skinTypes: ['Oily & Acne-Prone', 'All Skin Types'],
    ingredients: [
      'Activated Coconut Shell Carbon',
      'Australian Tea Tree Essential Oil',
      'Cold-Pressed Castor Oil',
      'Virgin Coconut Oil',
      'Unrefined Kokum Butter',
    ],
    benefits: [
      'Micro-porous carbon acts like a magnet for micro-pollutants',
      'Clarifies congested pores on face and chest',
      'Crisp medicinal herbal cleanliness',
    ],
    description: 'Steam-activated coconut shell charcoal binds to excess grease and smog particles. Paired with pure Australian tea tree oil for a deep, pristine clean.',
    usageInstructions: 'Massage over wet skin with hands to work up rich gray froth. Rinse clean with warm water.',
    storageInstructions: 'Store upright in a dry dish.',
    variants: [
      { id: 'v-6-single', name: 'Single Bar (130g)', weight: '130g', packSize: 1, price: 289, originalPrice: 359, sku: 'LUM-SKU-CHA06-S', stock: 16 },
      { id: 'v-6-duo', name: 'Duo Pack (2x 130g)', weight: '260g', packSize: 2, price: 529, originalPrice: 718, sku: 'LUM-SKU-CHA06-D', stock: 8 },
    ],
    badge: 'Limited Batch',
    isNewRelease: false,
    isFeatured: false,
    isBestSeller: false,
    isPublished: true,
    image: 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['charcoal', 'tea tree', 'detox', 'black soap', 'pore cleansing'],
    coldProcessDescription: 'Formulated with ultra-fine coconut husk activated carbon.',
    reviews: [],
  },
  {
    id: 'soap-inr-7',
    sku: 'LUM-SKU-LAV07',
    name: 'Kashmir Lavender & French Clay Relaxing Bar',
    tagline: 'Evening unwind calming ritual with pure mountain lavender buds',
    category: 'Aromatherapy & Calming',
    price: 319,
    originalPrice: 399,
    rating: 4.9,
    reviewCount: 59,
    stock: 21,
    lowStockThreshold: 5,
    batchNumber: 'LUM-IN-2026-09G',
    cureDate: 'Cured 6 weeks on cedar racks',
    weight: '135g (4.8 oz)',
    dimensions: '3.1" x 2.4" x 1.1"',
    scentProfile: 'French Lavender & Sage',
    skinTypes: ['All Skin Types', 'Dry & Sensitive'],
    ingredients: [
      'Kashmir Highland Lavender Essential Oil',
      'French Pink Kaolin Clay',
      'Whole Dried Organic Lavender Florets',
      'Extra Virgin Olive Oil',
      'Unrefined Shea Butter',
    ],
    benefits: [
      'Prepares body and mind for deep, restful sleep',
      'Pink clay gently mineralizes delicate skin',
      'Floral, herbaceous relaxing bouquet',
    ],
    description: 'Infused with soothing Kashmir valley lavender essence and gentle mineral-rich pink clay. Perfect for tranquil twilight showers.',
    usageInstructions: 'Lather under warm evening water to release relaxing essential aromatherapy vapors.',
    storageInstructions: 'Dry thoroughly between washes.',
    variants: [
      { id: 'v-7-single', name: 'Single Bar (135g)', weight: '135g', packSize: 1, price: 319, originalPrice: 399, sku: 'LUM-SKU-LAV07-S', stock: 21 },
      { id: 'v-7-duo', name: 'Duo Pack (2x 135g)', weight: '270g', packSize: 2, price: 599, originalPrice: 798, sku: 'LUM-SKU-LAV07-D', stock: 10 },
    ],
    badge: 'New Release',
    isNewRelease: true,
    isFeatured: true,
    isBestSeller: false,
    isPublished: true,
    image: 'https://images.unsplash.com/photo-1608248597359-2ff924294b43?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1608248597359-2ff924294b43?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['lavender', 'calming', 'pink clay', 'sleep', 'aromatherapy'],
    coldProcessDescription: 'Infused with low-temperature cold lavender distillation.',
    reviews: [],
  },
  {
    id: 'soap-inr-8',
    sku: 'LUM-SKU-CAS08',
    name: 'Pure Olive Castile Bar (Fragrance Free)',
    tagline: '100% cold-pressed EVOO traditional castile for hypersensitive skin',
    category: 'Sensitive & Baby Care',
    price: 259,
    originalPrice: 319,
    rating: 5.0,
    reviewCount: 38,
    stock: 19,
    lowStockThreshold: 4,
    batchNumber: 'LUM-IN-2026-09H',
    cureDate: 'Cured 12 weeks on cedar racks',
    weight: '125g (4.4 oz)',
    dimensions: '3.0" x 2.3" x 1.0"',
    scentProfile: 'Unscented Pure Castile',
    skinTypes: ['All Skin Types', 'Dry & Sensitive', 'Eczema & Psoriasis Prone'],
    ingredients: [
      '100% Pure Extra Virgin Olive Oil',
      'Purified Spring Water',
      'Sodium Hydroxide (None remains after saponification)',
    ],
    benefits: [
      'Zero synthetic fragrances, zero essential oils, zero irritants',
      'Cured for a minimum of 12 full weeks for extreme mildness',
      'Produces a lotion-like, gentle cleansing slip',
    ],
    description: 'The purest soap imaginable. Made purely with 100% Spanish extra virgin olive oil and cured for a patient 3 months. Hypoallergenic and doctor recommended.',
    usageInstructions: 'Gently glide over baby or sensitive adult skin. Suitable for face and intimate areas.',
    storageInstructions: 'Pure Castile softens quickly if wet; use a raised wire or wooden soap cradle.',
    variants: [
      { id: 'v-8-single', name: 'Single Bar (125g)', weight: '125g', packSize: 1, price: 259, originalPrice: 319, sku: 'LUM-SKU-CAS08-S', stock: 19 },
      { id: 'v-8-trio', name: 'Trio Pack (3x 125g)', weight: '375g', packSize: 3, price: 699, originalPrice: 957, sku: 'LUM-SKU-CAS08-T', stock: 7 },
    ],
    badge: 'Sole Proprietor Special',
    isNewRelease: false,
    isFeatured: false,
    isBestSeller: false,
    isPublished: true,
    image: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['castile', 'unscented', 'baby', 'eczema', 'pure olive', 'hypoallergenic'],
    coldProcessDescription: '12-week traditional cure for mildest possible pH profile.',
    reviews: [],
  },
];

const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c-welcome10',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 499,
    maxDiscountAmount: 150,
    expiryDate: '2027-12-31',
    usageLimit: 1000,
    usedCount: 42,
    isActive: true,
    description: 'Get 10% OFF on your handcrafted soap order above ₹499',
  },
  {
    id: 'c-lumina100',
    code: 'LUMINA100',
    discountType: 'fixed',
    discountValue: 100,
    minOrderValue: 799,
    maxDiscountAmount: 100,
    expiryDate: '2027-12-31',
    usageLimit: 500,
    usedCount: 28,
    isActive: true,
    description: 'Flat ₹100 OFF on orders above ₹799 + Free Delivery',
  },
  {
    id: 'c-purecare15',
    code: 'PURECARE15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 1199,
    maxDiscountAmount: 250,
    expiryDate: '2027-12-31',
    usageLimit: 300,
    usedCount: 19,
    isActive: true,
    description: 'Special 15% OFF for botanical self-care orders over ₹1,199',
  },
];

const INITIAL_GIFT_ITEMS: GiftItem[] = [
  {
    id: 'gift-dish-1',
    name: 'Artisan Slotted Cedarwood Soap Saver Dish',
    description: 'Handcrafted from reclaimed aromatic cedarwood with self-draining channels to keep cold-process soaps dry and long-lasting.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    sku: 'LUM-GIFT-CEDAR01',
    stockQuantity: 150,
    isActive: true,
  },
  {
    id: 'gift-pouch-2',
    name: 'Natural Sisal & Organza Foaming Exfoliating Pouch',
    description: 'Biodegradable woven sisal plant fiber pouch designed to create ultra-dense creamy botanical lather.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    sku: 'LUM-GIFT-POUCH02',
    stockQuantity: 200,
    isActive: true,
  },
  {
    id: 'gift-sampler-3',
    name: 'Pure Castile Mini Travel Sampler Bar (45g)',
    description: '100% Spanish extra-virgin olive oil gentle castile mini bar cured for 12 weeks.',
    image: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=600&q=80',
    sku: 'LUM-GIFT-SAMP03',
    stockQuantity: 100,
    isActive: true,
  },
];

const INITIAL_OFFERS: ComboOffer[] = [
  {
    id: 'offer-buy6-get1',
    title: 'BUY 6 SOAPS, GET 1 FREE GIFT!',
    description: 'Select any 6 handcrafted cold-process soaps and unlock your complimentary Artisan Cedarwood Soap Saver Dish! Every 6 soaps earns 1 free gift (up to 3 gifts per order).',
    minimumQuantity: 6,
    giftsPerThreshold: 1,
    maxGiftsPerOrder: 3,
    startsAt: new Date().toISOString(),
    isActive: true,
    giftItemId: 'gift-dish-1',
    offerType: 'buy_x_get_y',
    includedSoaps: [],
  },
];

const INITIAL_BANNERS: PromotionalBanner[] = [
  {
    id: 'ban-1',
    title: 'Discover Your Everyday Soap Ritual',
    subtitle: 'Simple ingredients, delightful fragrances and a little everyday luxury. Handcrafted cold-process bars cured on solid cedar drying racks.',
    tag: 'BUY 6 SOAPS, GET 1 FREE GIFT!',
    ctaText: 'Shop Soaps',
    ctaLabel: 'Shop Soaps',
    linkAction: 'shop',
    targetUrl: '/shop',
    imageUrl: 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=1200&q=80',
    badge: 'BUY 6, GET 1 FREE GIFT',
    active: true,
    displayOrder: 1,
  },
  {
    id: 'ban-2',
    title: 'Raw Goat Milk & Kashmir Forest Honey',
    subtitle: 'Nourishing botanical lather that soothes sensitive skin naturally with organic lactic acid and pure emollients.',
    tag: 'Artisan Batch No. 9',
    ctaText: 'Explore Goat Milk Bars',
    ctaLabel: 'Explore Goat Milk Bars',
    linkAction: 'shop',
    targetUrl: '/shop',
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-2ff924294b43?auto=format&fit=crop&w=1200&q=80',
    badge: '100% CHEMICAL FREE',
    active: true,
    displayOrder: 2,
  },
];

const INITIAL_SETTINGS: StoreSettings = {
  companyName: 'Lumina Soaps',
  brandStory: 'Lumina Soaps is handcrafted by sole proprietor R. Niranjana with pure, botanical cold-process methods. Formulated with cold-pressed plant oils, unrefined plant butters, and wildcrafted herbs, our soaps celebrate nature in every lather.',
  tagline: 'Nature in Every Lather.',
  logoUrl: '/logo.svg',
  ownerName: 'R. Niranjana',
  email: process.env.OWNER_EMAIL || process.env.INITIAL_ADMIN_EMAIL || 'niranjana@luminasoaps.com',
  phone: '+91 98765 43210',
  studioAddress: 'Lumina Soaps Studio, Coimbatore, Tamil Nadu, India',
  businessHours: 'Mon – Sat: 9:00 AM – 6:00 PM IST',
  gstNumber: 'Unregistered Sole Proprietorship (Under GST Exemption Threshold)',
  currency: 'INR',
  timeZone: 'Asia/Kolkata',
  standardShippingFee: 70,
  freeShippingThreshold: 999,
  codAvailable: true,
  taxPercentage: 0,
  razorpayKeyIdConfigured: Boolean(process.env.RAZORPAY_KEY_ID),
  smtpConfigured: Boolean(process.env.SMTP_USER),
  socialLinks: {
    instagram: 'https://instagram.com/luminasoaps',
    facebook: 'https://facebook.com/luminasoaps',
  },
  aboutText: 'Lumina Soaps is a single-owner artisanal soapery founded by R. Niranjana, committed to natural cold-process bars handcrafted with pure plant oils, raw botanicals, and unrefined butters.',
  shippingPolicy: 'We ship across India via trusted express couriers. Standard delivery charge is ₹70. All orders over ₹999 qualify for Free Standard Delivery. Orders are dispatched within 24-48 business hours.',
  privacyPolicy: 'We respect customer privacy and never share private data.',
  termsAndConditions: 'All soaps are handcrafted in small batches. Slight natural variations in pattern and shade are normal.',
};

const INITIAL_BATCHES: CuringBatch[] = [
  {
    id: 'batch-01',
    soapName: 'Kashmiri Saffron & Raw Honey Bar',
    batchNumber: 'LUM-IN-2026-09A',
    barCount: 48,
    pourDate: '2026-08-01',
    expectedCureDate: '2026-09-12',
    status: 'Ready for Sale',
    essentialOilsUsed: 'Mogra Saffron Infusion & Sweet Orange',
  },
  {
    id: 'batch-02',
    soapName: 'Mysore Sandalwood & Vetiver Root Bar',
    batchNumber: 'LUM-IN-2026-09B',
    barCount: 40,
    pourDate: '2026-08-05',
    expectedCureDate: '2026-09-20',
    status: 'Ready for Sale',
    essentialOilsUsed: 'Pure Sandalwood Extract & Vetiver Root',
  },
  {
    id: 'batch-03',
    soapName: 'Nilgiri Eucalyptus & Peppermint Tingle Bar',
    batchNumber: 'LUM-IN-2026-09C',
    barCount: 50,
    pourDate: '2026-08-15',
    expectedCureDate: '2026-09-26',
    status: 'Curing on Racks',
    essentialOilsUsed: 'Blue Gum Eucalyptus & Peppermint',
  },
  {
    id: 'batch-04',
    soapName: 'Kashmir Lavender & French Clay Relaxing Bar',
    batchNumber: 'LUM-IN-2026-10A',
    barCount: 60,
    pourDate: '2026-09-02',
    expectedCureDate: '2026-10-14',
    status: 'Curing on Racks',
    essentialOilsUsed: 'Highland Lavender & Clary Sage',
  },
];

const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-bestsellers',
    name: 'Bestselling Artisan Bars',
    slug: 'bestsellers',
    description: 'Our most cherished customer-favorite botanical formulations, cured 42 days.',
    coverImage: 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80',
    displayOrder: 1,
    productIds: ['soap-inr-1', 'soap-inr-2', 'soap-inr-3'],
    ruleType: 'bestsellers',
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'col-new-releases',
    name: 'Fresh Cedar Rack Releases',
    slug: 'new-releases',
    description: 'Recently cured small-batch cold process creations fresh from the cedar racks.',
    coverImage: 'https://images.unsplash.com/photo-1608248597359-2ff924294b43?auto=format&fit=crop&w=800&q=80',
    displayOrder: 2,
    productIds: ['soap-inr-1', 'soap-inr-5', 'soap-inr-7'],
    ruleType: 'new_releases',
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'col-herbal-botanical',
    name: 'Herbal & Botanical Heritage',
    slug: 'herbal-botanical-heritage',
    description: 'Wildcrafted mountain herbs, cold-pressed virgin neem, and calming chamomile.',
    coverImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    displayOrder: 3,
    productIds: ['soap-inr-1', 'soap-inr-4', 'soap-inr-6'],
    ruleType: 'category',
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'col-gift-sets',
    name: 'Artisan Gift Assortments',
    slug: 'artisan-gift-sets',
    description: 'Handcrafted luxury assortments packaged in pine keepsake boxes with dried botanicals.',
    coverImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    displayOrder: 4,
    productIds: ['soap-inr-6', 'soap-inr-8'],
    ruleType: 'manual',
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'col-value-bundles',
    name: 'Curing Rack Value Bundles',
    slug: 'value-bundles',
    description: 'Generous multi-bar family packs with complimentary wooden soap rest.',
    coverImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    displayOrder: 5,
    productIds: ['soap-inr-8'],
    ruleType: 'manual',
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'col-seasonal',
    name: 'Monsoon Saffron & Sandalwood Edition',
    slug: 'seasonal-edition',
    description: 'Limited seasonal curing batch steeped in forest honey and warm resins.',
    coverImage: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80',
    displayOrder: 6,
    productIds: ['soap-inr-1', 'soap-inr-2'],
    ruleType: 'manual',
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
];

const INITIAL_HOMEPAGE_CONFIG: HomepageConfig = {
  heroHeadline: 'Pure Care. Natural Glow.',
  heroSubtitle: 'Small-batch artisanal soaps cured 42 days on solid cedar racks for maximum gentleness and rich conditioning lather.',
  heroTag: '100% Cold-Process Botanical Soaps',
  heroImageUrl: 'https://images.unsplash.com/photo-1607006311820-d15873f8425b?auto=format&fit=crop&w=1600&q=80',
  heroCtaText: 'Shop All Soaps',
  heroCtaLink: 'shop',
  heroSecondaryCtaText: 'Explore New Releases',
  heroSecondaryCtaLink: 'shop',
  announcementActive: true,
  announcementText: '🌿 Pure artisan cold-process soaps handcrafted in Bengaluru. Free shipping on all orders over ₹799.',
  announcementLink: 'shop',
  seasonalAnnouncementActive: true,
  seasonalAnnouncementText: '✨ Freshly cured Cedar Rack Batch LUM-IN-2026-09 now available for dispatch.',
  sectionsOrder: ['hero', 'value_props', 'categories', 'new_releases', 'featured', 'bestsellers', 'curing_story', 'testimonials'],
  sectionsVisibility: {
    hero: true,
    value_props: true,
    categories: true,
    new_releases: true,
    featured: true,
    bestsellers: true,
    curing_story: true,
    testimonials: true,
  },
  brandPillars: [
    { icon: 'Leaf', title: '100% Plant-Based', subtitle: 'Virgin edible oils, pure plant butters, no animal fats' },
    { icon: 'Award', title: '42-Day Cedar Curing', subtitle: 'Naturally formed skin-nourishing botanical glycerin' },
    { icon: 'Truck', title: 'Free Pan-India Delivery', subtitle: 'Express courier delivery on all orders over ₹799' },
    { icon: 'ShieldCheck', title: 'Sole Proprietor Special', subtitle: 'Hand-stamped and packaged by Thiru Kailash' },
  ],
  storyExcerpt: 'Every batch of Lumina soap is made slowly using traditional room-temperature saponification. We never use melt-and-pour bases, synthetic foaming chemicals (SLS/SLES), phthalate perfumes, or artificial hardening additives.',
  lastUpdated: '2026-09-15T00:00:00.000Z',
};

const INITIAL_BRAND_PAGES: BrandPageContent[] = [
  {
    id: 'page-about',
    title: 'About Lumina Soaps',
    slug: 'about',
    summary: 'Our artisan philosophy and commitment to natural cold-process skincare.',
    content: 'Lumina Homemade Soaps was founded in Bengaluru as a dedicated artisan craft studio by Thiru Kailash. We believe everyday bathing should be a restorative sensory ritual rooted in botanical purity. Every bar is hand-measured, small-batch blended, hand-cut, and cured for a full six weeks on cedar drying racks.',
    isPublished: true,
    lastUpdated: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'page-story',
    title: 'The Cold Process Story',
    slug: 'story',
    summary: 'The 42-day journey from botanical oils to cured luxury bar.',
    content: 'Unlike mass-market commercial soaps which extract natural glycerin for high-margin cosmetics, our traditional cold process keeps 100% of the natural botanical glycerin inside the bar. Saponification happens gently over 48 hours, followed by 42 days of open-air curing on aromatic cedar racks to achieve natural hardness and long-lasting lather.',
    isPublished: true,
    lastUpdated: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'page-workshop',
    title: 'The Artisan Workshop',
    slug: 'workshop',
    summary: 'Indiranagar studio operations, sanitation and batch records.',
    content: 'Located in Indiranagar, Bengaluru, our micro-soapery adheres to strict hygiene, food-grade stainless steel blending, and cedar wood rack storage. Each wooden mould pours exactly 48 to 60 bars per batch, numbered with batch traceability codes.',
    isPublished: true,
    lastUpdated: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'page-care',
    title: 'Soap Care Instructions',
    slug: 'care',
    summary: 'How to prolong the life of your natural botanical soap bar.',
    content: 'Because cold-process soaps contain high amounts of natural glycerin without chemical hardeners, they thrive when kept dry between uses. We recommend placing your bar on a slatted wooden soap dish with good drainage, away from direct shower spray.',
    isPublished: true,
    lastUpdated: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'page-shipping',
    title: 'Shipping Policy',
    slug: 'shipping-policy',
    summary: 'Pan-India courier delivery times, dispatch schedule and rates.',
    content: 'All orders are handcrafted and packaged with biodegradable paper packaging and dispatched from Bengaluru within 24 to 48 business hours. We deliver across India via India Post Speed Post, Blue Dart, DTDC, and Delhivery. Standard delivery fee is ₹50 for orders below ₹799; orders ₹799 and above enjoy Free Delivery.',
    isPublished: true,
    lastUpdated: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'page-cancellation',
    title: 'Cancellation Policy',
    slug: 'cancellation-policy',
    summary: 'Cancellation guidelines prior to artisan order dispatch.',
    content: 'Orders may be cancelled free of charge before they are handed over to our dispatch courier. Once an order is handed over and a tracking number is generated, standard return guidelines apply.',
    isPublished: true,
    lastUpdated: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'page-refund',
    title: 'Return & Refund Policy',
    slug: 'refund-policy',
    summary: 'Hygiene considerations and transit damage resolution.',
    content: 'Due to personal hygiene and bath safety regulations, used soap bars cannot be returned. If an item arrives damaged in transit or incorrect items were received, notify us within 48 hours of delivery for an immediate replacement or full refund.',
    isPublished: true,
    lastUpdated: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'page-privacy',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    summary: 'Protection of customer shipping and account details.',
    content: 'We hold customer trust sacred. Personal details including name, address, phone number, and purchase history are kept strictly confidential for order fulfillment and customer support. We never sell, lease, or monetize customer data.',
    isPublished: true,
    lastUpdated: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'page-terms',
    title: 'Terms & Conditions',
    slug: 'terms',
    summary: 'Single-proprietorship sales terms and natural variations.',
    content: 'Lumina Homemade Soaps is operated as a sole-proprietor business in Bengaluru, Karnataka. Natural color variations, herb fleck patterns, and slight weight differences (+/- 5g) reflect genuine handmade cold-process methods and are not defects.',
    isPublished: true,
    lastUpdated: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'page-contact',
    title: 'Grievance & Customer Support',
    slug: 'contact',
    summary: 'Sole proprietor contact channels and direct assistance.',
    content: 'For any inquiries, custom bridal batch requests, or order assistance, write directly to proprietor Thiru Kailash at mailmethirukailash@gmail.com or via WhatsApp at +91 98765 43210 (Mon-Sat, 9 AM to 6 PM IST).',
    isPublished: true,
    lastUpdated: '2026-09-01T00:00:00.000Z',
  },
];

const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Formulation & Ingredients',
    question: 'What makes cold-process soap superior to commercial store-bought bars?',
    answer: 'Commercial soaps typically remove natural glycerin to sell separately in moisturizing creams, replacing it with synthetic detergents (surfactants like SLS) and petroleum preservatives. Our cold process retains 100% of natural plant glycerin, creating a mild bar that respects your skin barrier.',
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: 'faq-2',
    category: 'Formulation & Ingredients',
    question: 'Why do you cure soaps for 42 days on cedar drying racks?',
    answer: 'The 42-day curing process allows all residual moisture to evaporate naturally while the crystalline soap lattice completes full saponification. This produces a hard, long-lasting bar with dense, gentle foam that will not dissolve into mush in your soap dish.',
    displayOrder: 2,
    isPublished: true,
  },
  {
    id: 'faq-3',
    category: 'Skin Compatibility',
    question: 'Are Lumina soaps safe for sensitive and eczema-prone skin?',
    answer: 'Yes! We formulate several ultra-mild bars such as our Kashmiri Saffron & Raw Honey, Goat Milk & Forest Honey, and Unscented Pure Castile with zero synthetic fragrance, zero artificial coloring, and soothing botanical butters.',
    displayOrder: 3,
    isPublished: true,
  },
  {
    id: 'faq-4',
    category: 'Shipping & Delivery',
    question: 'How long does delivery take across India?',
    answer: 'Orders are dispatched within 24-48 business hours from our Bengaluru soapery. Standard metro transit takes 2-4 days; non-metro locations take 4-6 days via India Post Speed Post or express couriers.',
    displayOrder: 4,
    isPublished: true,
  },
  {
    id: 'faq-5',
    category: 'Product Care',
    question: 'How long does a single 135g Lumina soap bar last?',
    answer: 'When placed on a draining soap dish that lets water drip away between baths, a 135g bar typically lasts 3 to 4 weeks with daily full-body use by an individual.',
    displayOrder: 5,
    isPublished: true,
  },
];

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'med-saffron-1',
    filename: 'kashmiri-saffron-honey-artisan-bar.jpg',
    url: 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80',
    altText: 'Kashmiri Saffron and Raw Honey Artisan Soap Bar with Mogra strands',
    fileType: 'image/jpeg',
    fileSize: 248500,
    associatedType: 'product',
    associatedId: 'soap-inr-1',
    uploadedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'med-sandalwood-1',
    filename: 'mysore-sandalwood-vetiver-bar.jpg',
    url: 'https://images.unsplash.com/photo-1608248597359-2ff924294b43?auto=format&fit=crop&w=800&q=80',
    altText: 'Mysore Sandalwood and Vetiver Root cold-process bar',
    fileType: 'image/jpeg',
    fileSize: 312400,
    associatedType: 'product',
    associatedId: 'soap-inr-2',
    uploadedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'med-charcoal-1',
    filename: 'activated-charcoal-tea-tree-detox.jpg',
    url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    altText: 'Activated Bamboo Charcoal and Australian Tea Tree purifying soap',
    fileType: 'image/jpeg',
    fileSize: 289100,
    associatedType: 'product',
    associatedId: 'soap-inr-3',
    uploadedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'med-hero-banner',
    filename: 'lumina-curing-rack-hero-banner.jpg',
    url: 'https://images.unsplash.com/photo-1607006311820-d15873f8425b?auto=format&fit=crop&w=1600&q=80',
    altText: 'Lumina Homemade Soaps curing on cedar drying racks in Bengaluru workshop',
    fileType: 'image/jpeg',
    fileSize: 642000,
    associatedType: 'banner',
    uploadedAt: '2026-09-01T00:00:00.000Z',
  },
];

const INITIAL_SEO: SEOMetadata[] = [
  {
    pageId: 'home',
    pageTitle: 'Lumina Homemade Soaps | Artisan Cold Process Soaps in India',
    metaDescription: 'Handcrafted small-batch artisan soaps cured 42 days on solid cedar racks. 100% plant-based virgin oils, raw honey, and wild herbs. Free delivery over ₹799.',
    canonicalUrl: 'https://luminasoaps.in/',
    ogTitle: 'Lumina Homemade Soaps | Pure Care. Natural Glow.',
    ogDescription: 'Experience traditional cold-process bath bars made by sole proprietor Thiru Kailash in Bengaluru.',
    ogImage: 'https://images.unsplash.com/photo-1607006311820-d15873f8425b?auto=format&fit=crop&w=1200&q=80',
    indexing: true,
    keywords: ['homemade soap india', 'cold process soap', 'artisan soap bengaluru', 'saffron soap', 'natural bath bars'],
    lastUpdated: '2026-09-01T00:00:00.000Z',
  },
  {
    pageId: 'shop',
    pageTitle: 'Shop Handcrafted Botanical Soaps | Lumina Homemade Soaps',
    metaDescription: 'Explore our full collection of natural cold-process soaps: Kashmiri Saffron, Mysore Sandalwood, Goat Milk, and Charcoal detox bars in India.',
    canonicalUrl: 'https://luminasoaps.in/shop',
    indexing: true,
    keywords: ['buy handmade soap', 'natural soaps online india', 'cold process bath bar'],
    lastUpdated: '2026-09-01T00:00:00.000Z',
  },
];

const INITIAL_CUSTOMER_SEGMENTS: CustomerSegment[] = [
  {
    id: 'seg-repeat',
    name: 'Repeat Connoisseurs',
    description: 'Customers with 2 or more placed orders who appreciate artisan soaps.',
    criteriaType: 'repeat',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'seg-high-value',
    name: 'High-Value Patrons (₹1500+)',
    description: 'Customers whose completed order spend exceeds ₹1,500.',
    criteriaType: 'high_value',
    minValue: 1500,
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'seg-first-time',
    name: 'First-Time Explorers',
    description: 'Customers who have placed exactly one order with us.',
    criteriaType: 'first_time',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'seg-recent',
    name: 'Recent Purchasers (Last 30 Days)',
    description: 'Customers who purchased a bar within the last 30 calendar days.',
    criteriaType: 'recent',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'seg-support',
    name: 'Open Inquiries & Support',
    description: 'Customers currently awaiting support feedback or resolution.',
    criteriaType: 'open_ticket',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
];

const INITIAL_CAMPAIGNS: CustomerCampaign[] = [
  {
    id: 'camp-autumn-cure',
    title: 'Cedar Rack Autumn Harvest Unveiling',
    subject: 'Freshly Cured Kashmiri Saffron & Cedar Batches are Live',
    message: 'Greetings from our Bengaluru workshop! Our latest small-batch cure has completed its 42-day seasoning on cedar drying racks. Enjoy 10% off your next restock with coupon code LUMINA10.',
    targetSegmentId: 'seg-repeat',
    couponCode: 'LUMINA10',
    status: 'draft',
    audienceCount: 1,
    createdAt: '2026-09-15T00:00:00.000Z',
    deliveryMethod: 'in_app',
  },
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDirectory();
    this.data = this.loadDatabase();
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private createDefaultSchema(): DatabaseSchema {
    const ownerEmail = process.env.OWNER_EMAIL || process.env.INITIAL_ADMIN_EMAIL || 'niranjana@luminasoaps.com';
    return {
      users: [
        {
          id: 'user-owner-niranjana',
          name: 'R. Niranjana (Sole Proprietor)',
          email: ownerEmail,
          phone: '+91 98765 43210',
          role: 'owner',
          createdAt: new Date().toISOString(),
          status: 'Active',
          address: {
            fullName: 'R. Niranjana',
            street: 'Lumina Studio, Race Course Road',
            city: 'Coimbatore',
            state: 'Tamil Nadu',
            zipCode: '641018',
            pincode: '641018',
            phone: '+91 98765 43210',
            type: 'Work',
          },
        },
      ],
      categories: INITIAL_CATEGORIES,
      products: [],
      orders: [],
      curingBatches: [],
      coupons: [],
      notifications: [],
      supportTickets: [],
      promotionalBanners: [],
      companySettings: {
        companyName: 'Lumina Soaps',
        brandStory: 'Lumina Soaps is handcrafted by sole proprietor R. Niranjana with pure, botanical cold-process methods. Formulated with cold-pressed plant oils, unrefined plant butters, and wildcrafted herbs, our soaps celebrate nature in every lather.',
        tagline: 'Nature in Every Lather.',
        logoUrl: '/logo.svg',
        ownerName: 'R. Niranjana',
        email: ownerEmail,
        phone: '+91 98765 43210',
        studioAddress: 'Lumina Soaps Studio, Coimbatore, Tamil Nadu, India',
        businessHours: 'Mon – Sat: 9:00 AM – 6:00 PM IST',
        gstNumber: 'Unregistered Sole Proprietorship (Under GST Exemption Threshold)',
        currency: 'INR',
        timeZone: 'Asia/Kolkata',
        standardShippingFee: 60,
        freeShippingThreshold: 499,
        codAvailable: true,
        taxPercentage: 0,
        razorpayKeyIdConfigured: !!process.env.RAZORPAY_KEY_ID,
        smtpConfigured: !!process.env.SMTP_USER,
        socialLinks: {
          instagram: 'https://instagram.com/luminasoaps',
          facebook: 'https://facebook.com/luminasoaps',
        },
        aboutText: 'Lumina Soaps is a single-owner artisanal soapery founded by R. Niranjana, committed to natural cold-process bars handcrafted with pure plant oils, raw botanicals, and unrefined butters.',
        shippingPolicy: 'Standard courier delivery across India. Orders over ₹499 qualify for Free Standard Delivery.',
        privacyPolicy: 'Your personal data and address information are strictly used for order fulfillment and communication.',
        termsAndConditions: 'All products are handcrafted in small batches. Variations in marble pattern and botanical hue are authentic features of natural soapmaking.',
      },
      giftItems: [],
      offers: [],
      collections: [],
      homepageConfig: INITIAL_HOMEPAGE_CONFIG,
      brandPages: [],
      faqs: [],
      media: [],
      seo: [],
      customerSegments: [],
      customerNotes: [],
      campaigns: [],
      auditLogs: [
        {
          id: 'audit-1',
          timestamp: new Date().toISOString(),
          adminEmail: ownerEmail,
          action: 'System Initialized',
          details: 'Lumina Soaps single-owner production environment ready. Nature in Every Lather.',
        },
      ],
    };
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8').trim();
        if (!raw) {
          const fresh = this.createDefaultSchema();
          this.saveDatabase(fresh);
          return fresh;
        }
        const parsed = JSON.parse(raw);
        // Ensure all schema sections exist
        return {
          users: Array.isArray(parsed.users) && parsed.users.length > 0 ? parsed.users : [],
          categories: Array.isArray(parsed.categories) && parsed.categories.length > 0 ? parsed.categories : INITIAL_CATEGORIES,
          products: Array.isArray(parsed.products) ? parsed.products : [],
          orders: Array.isArray(parsed.orders) ? parsed.orders : [],
          curingBatches: Array.isArray(parsed.curingBatches) ? parsed.curingBatches : [],
          coupons: Array.isArray(parsed.coupons) ? parsed.coupons : [],
          notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
          supportTickets: Array.isArray(parsed.supportTickets) ? parsed.supportTickets : [],
          promotionalBanners: Array.isArray(parsed.promotionalBanners) ? parsed.promotionalBanners : [],
          companySettings: { ...INITIAL_SETTINGS, ...(parsed.companySettings || {}) },
          auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : [],
          giftItems: Array.isArray(parsed.giftItems) ? parsed.giftItems : [],
          offers: Array.isArray(parsed.offers) ? parsed.offers : [],
          collections: Array.isArray(parsed.collections) ? parsed.collections : [],
          homepageConfig: parsed.homepageConfig ? { ...INITIAL_HOMEPAGE_CONFIG, ...parsed.homepageConfig } : INITIAL_HOMEPAGE_CONFIG,
          brandPages: Array.isArray(parsed.brandPages) ? parsed.brandPages : [],
          faqs: Array.isArray(parsed.faqs) ? parsed.faqs : [],
          media: Array.isArray(parsed.media) ? parsed.media : [],
          seo: Array.isArray(parsed.seo) ? parsed.seo : [],
          customerSegments: Array.isArray(parsed.customerSegments) ? parsed.customerSegments : [],
          customerNotes: Array.isArray(parsed.customerNotes) ? parsed.customerNotes : [],
          campaigns: Array.isArray(parsed.campaigns) ? parsed.campaigns : [],
        };
      }
    } catch (e) {
      console.error('Error loading database.json, initializing clean defaults', e);
    }

    const initial = this.createDefaultSchema();
    this.saveDatabase(initial);
    return initial;
  }

  // Active owner authentication sessions (token -> session info)
  private activeOwnerSessions = new Map<string, { email: string; createdAt: number; expiresAt: number }>();

  public createOwnerSession(email: string): string {
    const token = `lum_sec_${Date.now()}_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    this.activeOwnerSessions.set(token, { email, createdAt: Date.now(), expiresAt });
    return token;
  }

  public validateOwnerSession(token: string): { valid: boolean; email?: string } {
    if (!token) return { valid: false };
    const session = this.activeOwnerSessions.get(token);
    if (!session) return { valid: false };
    if (Date.now() > session.expiresAt) {
      this.activeOwnerSessions.delete(token);
      return { valid: false };
    }
    return { valid: true, email: session.email };
  }

  public revokeOwnerSession(token: string): void {
    if (token) {
      this.activeOwnerSessions.delete(token);
    }
  }

  private saveDatabase(data?: DatabaseSchema) {
    try {
      const payload = data || this.data;
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(payload, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (e) {
      console.error('Error saving database to file atomically:', e);
    }
  }

  private logAction(action: string, details: string, adminEmail: string = 'mailmethirukailash@gmail.com') {
    const log: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      adminEmail,
      action,
      details,
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 100) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 100);
    }
  }

  // --- PRODUCTS ---
  public getProducts(filter?: { category?: string; search?: string; inStock?: boolean; featured?: boolean; includeUnpublished?: boolean }): SoapProduct[] {
    let list = this.data.products;
    if (!filter?.includeUnpublished) {
      list = list.filter((p) => p.isPublished !== false && p.status !== 'draft' && p.status !== 'archived');
    }
    if (filter?.category && filter.category !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter?.inStock) {
      list = list.filter((p) => p.stock > 0);
    }
    if (filter?.featured) {
      list = list.filter((p) => p.featured || p.isNewRelease || p.isFeatured);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.scentProfile.toLowerCase().includes(q) ||
          p.ingredients.some((i) => i.toLowerCase().includes(q)) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // For public customer queries, only show approved reviews
    if (!filter?.includeUnpublished) {
      list = list.map((p) => ({
        ...p,
        reviews: (p.reviews || []).filter((r) => r.status === 'approved' || !r.status),
      }));
    }

    return list;
  }

  public getProductById(id: string): SoapProduct | undefined {
    return this.data.products.find((p) => p.id === id || p.slug === id);
  }

  public createProduct(productData: Partial<SoapProduct>): SoapProduct {
    const id = `soap-${Date.now()}`;
    const newProduct: SoapProduct = {
      id,
      slug: productData.slug || (productData.name || 'new-soap').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      sku: productData.sku || `LUM-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: productData.name || 'New Artisan Soap Bar',
      status: productData.status || (productData.isPublished !== false ? 'published' : 'draft'),
      tagline: productData.tagline || 'Cold-process handcrafted soap',
      category: productData.category || 'Herbal & Botanical',
      price: Number(productData.price) || 299,
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
      rating: productData.rating || 5.0,
      reviewCount: 0,
      stock: Number(productData.stock) || 20,
      lowStockThreshold: Number(productData.lowStockThreshold) || 5,
      batchNumber: productData.batchNumber || `LUM-IN-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
      cureDate: productData.cureDate || 'Cured 6 weeks on cedar racks',
      weight: productData.weight || '135g (4.8 oz)',
      dimensions: productData.dimensions || '3.2" x 2.4" x 1.1"',
      scentProfile: productData.scentProfile || 'Unscented Pure Castile',
      skinTypes: productData.skinTypes || ['All Skin Types'],
      ingredients: productData.ingredients || ['Saponified Olive Oil', 'Coconut Oil'],
      benefits: productData.benefits || ['Gentle cleansing', 'Preserves skin moisture'],
      description: productData.description || 'Handmade cold process soap cured on cedar racks.',
      usageInstructions: productData.usageInstructions || 'Lather with warm water and rinse thoroughly.',
      storageInstructions: productData.storageInstructions || 'Allow to dry between uses on a soap dish.',
      variants: productData.variants || [
        { id: `v-${Date.now()}`, name: 'Single Bar', weight: productData.weight || '135g', packSize: 1, price: Number(productData.price) || 299, sku: `SKU-${Date.now()}`, stock: Number(productData.stock) || 20 }
      ],
      badge: productData.badge,
      isNewRelease: Boolean(productData.isNewRelease),
      isFeatured: Boolean(productData.isFeatured),
      isBestSeller: Boolean(productData.isBestSeller),
      isPublished: productData.isPublished !== false,
      image: productData.image || 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80',
      gallery: productData.gallery && productData.gallery.length > 0 ? productData.gallery : [productData.image || 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80'],
      tags: productData.tags || ['soap', 'handcrafted'],
      coldProcessDescription: productData.coldProcessDescription || 'Traditional cold process cured 42 days.',
      reviews: [],
    };

    this.data.products.unshift(newProduct);
    this.logAction('Product Created', `Created product "${newProduct.name}" (SKU: ${newProduct.sku})`);
    this.saveDatabase();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<SoapProduct>): SoapProduct | null {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    this.data.products[idx] = {
      ...this.data.products[idx],
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : this.data.products[idx].price,
      stock: updates.stock !== undefined ? Number(updates.stock) : this.data.products[idx].stock,
    };

    this.logAction('Product Updated', `Updated product "${this.data.products[idx].name}"`);
    this.saveDatabase();
    return this.data.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const product = this.data.products.find((p) => p.id === id);
    if (!product) return false;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    this.logAction('Product Deleted', `Deleted product "${product.name}"`);
    this.saveDatabase();
    return true;
  }

  public toggleNewRelease(id: string): SoapProduct | null {
    const product = this.data.products.find((p) => p.id === id);
    if (!product) return null;
    product.isNewRelease = !product.isNewRelease;
    this.saveDatabase();
    return product;
  }

  public addProductReview(productId: string, reviewData: Partial<ProductReview>): ProductReview | null {
    const product = this.data.products.find((p) => p.id === productId);
    if (!product) return null;

    const review: ProductReview = {
      id: `rev-${Date.now()}`,
      userId: reviewData.userId,
      userName: reviewData.userName || 'Verified Soap Buyer',
      rating: Number(reviewData.rating) || 5,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: reviewData.title || 'Wonderful soap',
      comment: reviewData.comment || '',
      verifiedPurchase: reviewData.verifiedPurchase !== false,
      status: 'approved',
    };

    product.reviews.unshift(review);
    product.reviewCount = product.reviews.length;
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.rating = Number((sum / product.reviews.length).toFixed(1));

    this.saveDatabase();
    return review;
  }

  // --- CATEGORIES ---
  public getCategories(): CategoryItem[] {
    return this.data.categories.sort((a, b) => a.order - b.order);
  }

  public createCategory(cat: Partial<CategoryItem>): CategoryItem {
    const newCat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: cat.name || 'New Category',
      slug: (cat.name || 'new-category').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: cat.description || '',
      image: cat.image || 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=600&q=80',
      order: this.data.categories.length + 1,
      enabled: cat.enabled !== false,
    };
    this.data.categories.push(newCat);
    this.logAction('Category Created', `Created category "${newCat.name}"`);
    this.saveDatabase();
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<CategoryItem>): CategoryItem | null {
    const idx = this.data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.logAction('Category Updated', `Updated category "${this.data.categories[idx].name}"`);
    this.saveDatabase();
    return this.data.categories[idx];
  }

  public deleteCategory(id: string): boolean {
    const idx = this.data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    const name = this.data.categories[idx].name;
    this.data.categories.splice(idx, 1);
    this.logAction('Category Deleted', `Deleted category "${name}"`);
    this.saveDatabase();
    return true;
  }

  // --- ORDERS ---
  public getOrders(role?: string, userId?: string): Order[] {
    if (role === 'owner' || role === 'admin') {
      return this.data.orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    if (userId) {
      return this.data.orders
        .filter((o) => o.userId === userId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return [];
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  public createOrder(orderData: Partial<Order>): Order {
    const id = `ord-${Date.now()}`;
    const orderNumber = `LUM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Validate inventory & decrement
    const items = orderData.items || [];
    for (const item of items) {
      const product = this.data.products.find((p) => p.id === item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
      }
    }

    const order: Order = {
      id,
      orderNumber,
      date: new Date().toISOString(),
      userId: orderData.userId || 'guest-unknown',
      customerName: orderData.customerName || 'Customer',
      customerEmail: orderData.customerEmail || 'customer@example.com',
      customerPhone: orderData.customerPhone || '',
      shippingAddress: orderData.shippingAddress || {
        fullName: orderData.customerName || 'Customer',
        street: 'Main Street',
        city: 'City',
        state: 'State',
        zipCode: '000000',
        phone: orderData.customerPhone || '',
      },
      items,
      subtotal: Number(orderData.subtotal) || 0,
      shippingFee: Number(orderData.shippingFee) || 0,
      tax: Number(orderData.tax) || 0,
      discount: Number(orderData.discount) || 0,
      couponCode: orderData.couponCode,
      total: Number(orderData.total) || 0,
      paymentMethod: orderData.paymentMethod || 'UPI',
      paymentStatus: orderData.paymentStatus || 'SUCCESS',
      paymentId: orderData.paymentId || `PAY-${Date.now()}`,
      orderStatus: 'PLACED',
      statusHistory: [
        {
          status: 'PLACED',
          timestamp: new Date().toISOString(),
          note: 'Order placed by customer',
        },
      ],
      customerNote: orderData.customerNote,
    };

    this.data.orders.unshift(order);

    // Update customer stats
    const user = this.data.users.find((u) => u.id === order.userId);
    if (user) {
      user.totalOrders = (user.totalOrders || 0) + 1;
      user.totalSpent = (user.totalSpent || 0) + order.total;
    }

    // Push notification to user
    this.addNotification({
      userId: order.userId || 'guest',
      title: `Order Placed: ${order.orderNumber}`,
      message: `Your order for ₹${order.total} has been confirmed and placed with artisan maker Thiru Kailash.`,
      type: 'order',
    });

    // Notify admin
    this.addNotification({
      userId: 'user-owner-kailash',
      title: `🛒 New Customer Order: ${order.orderNumber}`,
      message: `New order from ${order.customerName} for ${order.items.length} soap item(s) totalling ₹${order.total}.`,
      type: 'order',
    });

    this.logAction('Order Placed', `Order ${order.orderNumber} placed for ₹${order.total} by ${order.customerName}`);
    this.saveDatabase();
    return order;
  }

  public updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    notes?: string,
    carrier?: string
  ): Order | null {
    const order = this.data.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    order.orderStatus = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;
    if (notes) order.proprietorInternalNotes = notes;

    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: notes || `Status updated to ${status} by Sole Proprietor`,
    });

    // Notify customer
    this.addNotification({
      userId: order.userId || 'guest',
      title: `Order ${order.orderNumber}: ${status}`,
      message: trackingNumber
        ? `Your package has been dispatched via ${carrier || 'India Post'} (Tracking: ${trackingNumber}).`
        : `Your order status is now ${status}.`,
      type: status === 'DELIVERED' ? 'delivery' : 'order',
    });

    this.logAction('Order Status Updated', `Order ${order.orderNumber} updated to ${status}`);
    this.saveDatabase();
    return order;
  }

  public cancelOrder(orderId: string, reason: string): Order | null {
    const order = this.data.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    // Only eligible orders (PLACED or CONFIRMED) can be cancelled
    if (order.orderStatus !== 'PLACED' && order.orderStatus !== 'CONFIRMED') {
      throw new Error('Order cannot be cancelled after processing or dispatch.');
    }

    order.orderStatus = 'CANCELLED';
    order.paymentStatus = 'REFUNDED';
    order.statusHistory.push({
      status: 'CANCELLED',
      timestamp: new Date().toISOString(),
      note: `Cancelled: ${reason}`,
    });

    // Restore inventory
    for (const item of order.items) {
      const product = this.data.products.find((p) => p.id === item.productId);
      if (product) {
        product.stock += item.quantity;
      }
    }

    this.addNotification({
      userId: order.userId || 'guest',
      title: `Order Cancelled: ${order.orderNumber}`,
      message: `Your order has been cancelled and a refund has been initiated. Reason: ${reason}`,
      type: 'order',
    });

    this.logAction('Order Cancelled', `Order ${order.orderNumber} cancelled. Reason: ${reason}`);
    this.saveDatabase();
    return order;
  }

  public requestReturn(orderId: string, reason: string, notes?: string): Order | null {
    const order = this.data.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    if (order.orderStatus !== 'DELIVERED') {
      throw new Error('Only delivered orders can be submitted for return or refund.');
    }

    order.orderStatus = 'RETURN_REQUESTED';
    order.returnReason = reason;
    order.returnNotes = notes;
    order.statusHistory.push({
      status: 'RETURN_REQUESTED',
      timestamp: new Date().toISOString(),
      note: `Customer requested return: ${reason}`,
    });

    // Notify owner
    this.addNotification({
      userId: 'user-owner-kailash',
      title: `Return Requested: ${order.orderNumber}`,
      message: `Customer ${order.customerName} submitted a return request for reason: ${reason}.`,
      type: 'return',
    });

    this.logAction('Return Requested', `Return requested for order ${order.orderNumber} (${reason})`);
    this.saveDatabase();
    return order;
  }

  // Check if customer can review a product (verified purchase check)
  public canUserReviewProduct(userId: string, productId: string): boolean {
    return this.data.orders.some(
      (o) =>
        o.userId === userId &&
        (o.orderStatus === 'DELIVERED' || o.orderStatus === 'SHIPPED') &&
        o.items.some((item) => item.productId === productId)
    );
  }

  // --- COUPONS ---
  public getCoupons(): Coupon[] {
    return this.data.coupons;
  }

  public verifyCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon; discount: number; message?: string } {
    const coupon = this.data.coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid or expired coupon code.' };
    }

    if (subtotal < coupon.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        message: `This coupon requires a minimum cart value of ₹${coupon.minOrderValue}.`,
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return { valid: true, coupon, discount, message: `Coupon applied: ₹${discount} discount` };
  }

  public createCoupon(couponData: Partial<Coupon>): Coupon {
    const newCoupon: Coupon = {
      id: `c-${Date.now()}`,
      code: (couponData.code || 'SAVE10').toUpperCase().trim(),
      discountType: couponData.discountType || 'percentage',
      discountValue: Number(couponData.discountValue) || 10,
      minOrderValue: Number(couponData.minOrderValue) || 500,
      maxDiscountAmount: Number(couponData.maxDiscountAmount) || 150,
      expiryDate: couponData.expiryDate || '2027-12-31',
      usageLimit: Number(couponData.usageLimit) || 100,
      usedCount: 0,
      isActive: couponData.isActive !== false,
      description: couponData.description || 'Artisan soap coupon',
    };
    this.data.coupons.push(newCoupon);
    this.logAction('Coupon Created', `Created coupon ${newCoupon.code}`);
    this.saveDatabase();
    return newCoupon;
  }

  public toggleCoupon(id: string): Coupon | null {
    const coupon = this.data.coupons.find((c) => c.id === id);
    if (!coupon) return null;
    coupon.isActive = !coupon.isActive;
    this.saveDatabase();
    return coupon;
  }

  public deleteCoupon(id: string): boolean {
    const idx = this.data.coupons.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.data.coupons.splice(idx, 1);
    this.saveDatabase();
    return true;
  }

  // --- NOTIFICATIONS ---
  public getNotifications(userId: string): NotificationItem[] {
    return this.data.notifications
      .filter((n) => n.userId === 'all' || n.userId === userId)
      .sort((a, b) => new Date(b.timestamp || b.createdAt || '').getTime() - new Date(a.timestamp || a.createdAt || '').getTime());
  }

  public addNotification(notif: { userId: string; title: string; message: string; type: NotificationItem['type'] }): NotificationItem {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: notif.userId,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      timestamp: new Date().toISOString(),
      read: false,
    };
    this.data.notifications.unshift(newNotif);
    this.saveDatabase();
    return newNotif;
  }

  public markNotificationAsRead(id: string): boolean {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveDatabase();
      return true;
    }
    return false;
  }

  public markAllNotificationsAsRead(userId: string): void {
    this.data.notifications.forEach((n) => {
      if (n.userId === 'all' || n.userId === userId) {
        n.read = true;
      }
    });
    this.saveDatabase();
  }

  // --- SUPPORT TICKETS ---
  public getSupportTickets(userId?: string): SupportTicket[] {
    if (userId) {
      return this.data.supportTickets
        .filter((t) => t.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return this.data.supportTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createSupportTicket(ticketData: Partial<SupportTicket>): SupportTicket {
    const newTicket: SupportTicket = {
      id: `tick-${Date.now()}`,
      ticketNumber: `TICK-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: ticketData.userId || 'guest',
      userName: ticketData.userName || 'Customer',
      userEmail: ticketData.userEmail || 'customer@example.com',
      category: ticketData.category || 'Order',
      subject: ticketData.subject || 'Support request',
      message: ticketData.message || '',
      status: 'OPEN',
      priority: ticketData.priority || 'MEDIUM',
      createdAt: new Date().toISOString(),
      messages: ticketData.messages || [
        {
          id: `msg-${Date.now()}`,
          sender: 'customer',
          senderName: ticketData.userName || 'Customer',
          message: ticketData.message || ticketData.subject || '',
          createdAt: new Date().toISOString(),
        },
      ],
      replies: [],
    };
    this.data.supportTickets.unshift(newTicket);
    this.addNotification({
      userId: 'user-owner-kailash',
      title: `📩 New Support Ticket: ${newTicket.ticketNumber}`,
      message: `${newTicket.userName} raised a ticket regarding ${newTicket.category}: "${newTicket.subject}"`,
      type: 'system',
    });
    this.saveDatabase();
    return newTicket;
  }

  public addTicketReply(ticketId: string, sender: 'customer' | 'admin', senderName: string, message: string): SupportTicket | null {
    const ticket = this.data.supportTickets.find((t) => t.id === ticketId);
    if (!ticket) return null;

    if (!ticket.replies) ticket.replies = [];
    ticket.replies.push({
      id: `rep-${Date.now()}`,
      sender,
      senderName,
      message,
      timestamp: new Date().toISOString(),
    });

    if (!ticket.messages) ticket.messages = [];
    ticket.messages.push({
      id: `msg-${Date.now()}`,
      sender,
      senderName,
      message,
      createdAt: new Date().toISOString(),
    });

    if (sender === 'admin') {
      ticket.status = 'IN PROGRESS';
      this.addNotification({
        userId: ticket.userId,
        title: `Response on Support Ticket ${ticket.ticketNumber}`,
        message: `Thiru Kailash has replied to your query: "${ticket.subject}"`,
        type: 'system',
      });
    }

    this.saveDatabase();
    return ticket;
  }

  public updateTicketStatus(ticketId: string, status: SupportTicket['status']): SupportTicket | null {
    const ticket = this.data.supportTickets.find((t) => t.id === ticketId);
    if (!ticket) return null;
    ticket.status = status;
    this.saveDatabase();
    return ticket;
  }

  // --- BANNERS & SETTINGS ---
  public getBanners(): PromotionalBanner[] {
    return (this.data.promotionalBanners || []).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public updateBanners(banners: PromotionalBanner[]): PromotionalBanner[] {
    this.data.promotionalBanners = banners;
    this.saveDatabase();
    return this.data.promotionalBanners;
  }

  public createBanner(bannerData: Partial<PromotionalBanner>): PromotionalBanner {
    const newBanner: PromotionalBanner = {
      id: `ban-${Date.now()}`,
      title: bannerData.title || 'Handcrafted Artisan Soap',
      subtitle: bannerData.subtitle || 'Pure cold process botanical soap bar',
      tag: bannerData.tag || 'Handmade',
      ctaText: bannerData.ctaText || 'Shop Soaps',
      imageUrl: bannerData.imageUrl || 'https://images.unsplash.com/photo-1607006314633-85e7d95a2894?auto=format&fit=crop&w=1200&q=80',
      badge: bannerData.badge || 'Artisan Special',
      active: bannerData.active !== false,
      isActive: bannerData.active !== false,
      displayOrder: Number(bannerData.displayOrder) || (this.data.promotionalBanners ? this.data.promotionalBanners.length + 1 : 1),
    };
    if (!this.data.promotionalBanners) {
      this.data.promotionalBanners = [];
    }
    this.data.promotionalBanners.push(newBanner);
    this.saveDatabase();
    return newBanner;
  }

  public updateBanner(id: string, updates: Partial<PromotionalBanner>): PromotionalBanner | null {
    if (!this.data.promotionalBanners) this.data.promotionalBanners = [];
    const banner = this.data.promotionalBanners.find((b) => b.id === id);
    if (!banner) return null;
    Object.assign(banner, updates);
    this.saveDatabase();
    return banner;
  }

  public deleteBanner(id: string): boolean {
    if (!this.data.promotionalBanners) return false;
    const idx = this.data.promotionalBanners.findIndex((b) => b.id === id);
    if (idx === -1) return false;
    this.data.promotionalBanners.splice(idx, 1);
    this.saveDatabase();
    return true;
  }

  public getCompanySettings(): CompanySettings {
    return this.data.companySettings;
  }

  public updateCompanySettings(updates: Partial<CompanySettings>): CompanySettings {
    this.data.companySettings = {
      ...this.data.companySettings,
      ...updates,
    };
    this.logAction('Settings Updated', 'Company profile and story updated by owner');
    this.saveDatabase();
    return this.data.companySettings;
  }

  // --- CURING BATCHES ---
  public getCuringBatches(): CuringBatch[] {
    return this.data.curingBatches;
  }

  public createCuringBatch(batchData: Partial<CuringBatch>): CuringBatch {
    const newBatch: CuringBatch = {
      id: `batch-${Date.now()}`,
      soapName: batchData.soapName || 'Artisan Cold Process Soap',
      batchNumber: batchData.batchNumber || `LUM-IN-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
      barCount: Number(batchData.barCount) || 40,
      pourDate: batchData.pourDate || new Date().toISOString().split('T')[0],
      expectedCureDate: batchData.expectedCureDate || new Date(Date.now() + 42 * 86400000).toISOString().split('T')[0],
      status: batchData.status || 'Pouring',
      essentialOilsUsed: batchData.essentialOilsUsed || 'Pure Botanical Essential Oils',
    };
    this.data.curingBatches.unshift(newBatch);
    this.logAction('Batch Logged', `Logged curing batch ${newBatch.batchNumber} (${newBatch.soapName})`);
    this.saveDatabase();
    return newBatch;
  }

  public updateCuringBatchStatus(id: string, status: CuringBatch['status']): CuringBatch | null {
    const batch = this.data.curingBatches.find((b) => b.id === id);
    if (!batch) return null;
    batch.status = status;
    this.saveDatabase();
    return batch;
  }

  // --- USER AUTHENTICATION & DIRECTORY ---
  public findUserByEmail(email: string): (UserAccount & { password?: string }) | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  public findUserById(id: string): UserAccount | undefined {
    const user = this.data.users.find((u) => u.id === id);
    if (!user) return undefined;
    const { password, ...safeUser } = user;
    return safeUser;
  }

  public createUser(userData: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    role?: 'customer' | 'admin' | 'owner';
    address?: any;
  }): UserAccount {
    const existing = this.findUserByEmail(userData.email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: UserAccount & { password?: string } = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      phone: userData.phone || '',
      password: userData.password || '',
      role: userData.role || 'customer',
      createdAt: new Date().toISOString(),
      status: 'Active',
      totalOrders: 0,
      totalSpent: 0,
      address: userData.address,
      addresses: userData.address ? [userData.address] : [],
    };

    this.data.users.push(newUser);
    this.saveDatabase();
    const { password, ...safeUser } = newUser;
    return safeUser;
  }

  public updateUserProfile(id: string, updates: Partial<UserAccount>): UserAccount | null {
    const user = this.data.users.find((u) => u.id === id);
    if (!user) return null;

    if (updates.name) user.name = updates.name;
    if (updates.phone) user.phone = updates.phone;
    if (updates.address) {
      user.address = updates.address;
      if (!user.addresses) user.addresses = [];
      const idx = user.addresses.findIndex((a) => a.id === updates.address?.id);
      if (idx !== -1) {
        user.addresses[idx] = updates.address;
      } else {
        user.addresses.push(updates.address);
      }
    }
    if (updates.addresses) {
      user.addresses = updates.addresses;
    }

    this.saveDatabase();
    const { password, ...safeUser } = user;
    return safeUser;
  }

  public getAllCustomers(): UserAccount[] {
    return this.data.users
      .filter((u) => u.role === 'customer')
      .map(({ password, ...safe }) => safe);
  }

  // --- ANALYTICS & AUDIT ---
  public getStats() {
    const totalOrders = this.data.orders.length;
    const totalRevenue = this.data.orders.reduce((sum, o) => (o.paymentStatus === 'SUCCESS' ? sum + o.total : sum), 0);
    const totalCustomers = this.data.users.filter((u) => u.role === 'customer').length;
    const totalProducts = this.data.products.length;
    const totalInventoryUnits = this.data.products.reduce((sum, p) => sum + p.stock, 0);
    const lowStockCount = this.data.products.filter((p) => p.stock <= (p.lowStockThreshold || 5)).length;
    const activeCuringBatches = this.data.curingBatches.filter((b) => b.status === 'Curing on Racks' || b.status === 'Saponifying').length;
    const pendingOrders = this.data.orders.filter((o) => o.orderStatus === 'PLACED' || o.orderStatus === 'CONFIRMED').length;
    const openTickets = this.data.supportTickets.filter((t) => t.status === 'OPEN' || t.status === 'IN PROGRESS').length;
    const pendingReturns = this.data.orders.filter((o) => o.orderStatus === 'RETURN_REQUESTED').length;

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      totalInventoryUnits,
      lowStockCount,
      activeCuringBatches,
      pendingOrders,
      openTickets,
      pendingReturns,
      averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
    };
  }

  // --- PROMOTIONAL GIFT INVENTORY (Promotion-Only, never sold independently) ---
  public getGiftItems(): GiftItem[] {
    return this.data.giftItems || [];
  }

  public getGiftItemById(id: string): GiftItem | undefined {
    return (this.data.giftItems || []).find((g) => g.id === id);
  }

  public createGiftItem(itemData: Partial<GiftItem>): GiftItem {
    const newItem: GiftItem = {
      id: `gift-${Date.now()}`,
      name: itemData.name || 'Artisan Promotional Gift',
      description: itemData.description || '',
      image: itemData.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      sku: itemData.sku || `LUM-GIFT-${Math.floor(100 + Math.random() * 900)}`,
      stockQuantity: Number(itemData.stockQuantity) || 0,
      isActive: itemData.isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (!this.data.giftItems) this.data.giftItems = [];
    this.data.giftItems.push(newItem);
    this.logAction('Gift Item Created', `Added promotional gift: ${newItem.name} (Stock: ${newItem.stockQuantity})`);
    this.saveDatabase();
    return newItem;
  }

  public updateGiftItem(id: string, updates: Partial<GiftItem>): GiftItem | null {
    if (!this.data.giftItems) this.data.giftItems = [];
    const item = this.data.giftItems.find((g) => g.id === id);
    if (!item) return null;
    Object.assign(item, updates, { updatedAt: new Date().toISOString() });
    this.logAction('Gift Item Updated', `Updated promotional gift: ${item.name}`);
    this.saveDatabase();
    return item;
  }

  public deleteGiftItem(id: string): boolean {
    if (!this.data.giftItems) return false;
    const idx = this.data.giftItems.findIndex((g) => g.id === id);
    if (idx === -1) return false;
    const [removed] = this.data.giftItems.splice(idx, 1);
    this.logAction('Gift Item Removed', `Removed promotional gift item: ${removed.name}`);
    this.saveDatabase();
    return true;
  }

  // --- COMBO OFFERS (Buy 6 Soaps, Get 1 Free Gift) ---
  public getOffers(): ComboOffer[] {
    return this.data.offers || [];
  }

  public getActiveOffer(): ComboOffer | null {
    const offers = this.data.offers || [];
    const now = new Date().toISOString();
    return (
      offers.find((o) => {
        if (!o.isActive) return false;
        if (o.startsAt && o.startsAt > now) return false;
        if (o.endsAt && o.endsAt < now) return false;
        return true;
      }) || null
    );
  }

  public createOffer(data: Partial<ComboOffer>): ComboOffer {
    const newOffer: ComboOffer = {
      id: `offer-${Date.now()}`,
      title: data.title || 'Special Handcrafted Combo',
      description: data.description || 'Artisan soap assortment crafted for natural skin care.',
      image: data.image || '',
      offerType: data.offerType || 'fixed_price',
      comboPrice: data.comboPrice !== undefined ? Number(data.comboPrice) : undefined,
      discountPercentage: data.discountPercentage !== undefined ? Number(data.discountPercentage) : undefined,
      discountAmount: data.discountAmount !== undefined ? Number(data.discountAmount) : undefined,
      includedSoaps: Array.isArray(data.includedSoaps) ? data.includedSoaps : [],
      minimumQuantity: Number(data.minimumQuantity) || 1,
      giftsPerThreshold: Number(data.giftsPerThreshold) || 1,
      maxGiftsPerOrder: Number(data.maxGiftsPerOrder) || 1,
      startsAt: data.startsAt || new Date().toISOString(),
      endsAt: data.endsAt,
      usageLimit: data.usageLimit ? Number(data.usageLimit) : undefined,
      timesUsed: 0,
      isActive: data.isActive !== false,
      terms: data.terms || 'Limited small-batch offer while cured stocks last.',
      eligibleSoapIds: data.eligibleSoapIds,
      giftItemId: data.giftItemId || '',
      rewardSoapId: data.rewardSoapId,
      rewardQuantity: data.rewardQuantity || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (!this.data.offers) this.data.offers = [];
    this.data.offers.unshift(newOffer);
    this.logAction('Offer Created', `Created combo offer: ${newOffer.title}`);
    this.saveDatabase();
    return newOffer;
  }

  public updateOffer(id: string, updates: Partial<ComboOffer>): ComboOffer | null {
    if (!this.data.offers) this.data.offers = [];
    const offer = this.data.offers.find((o) => o.id === id);
    if (!offer) return null;
    Object.assign(offer, updates, { updatedAt: new Date().toISOString() });
    this.logAction('Offer Updated', `Updated combo offer: ${offer.title}`);
    this.saveDatabase();
    return offer;
  }

  public deleteOffer(id: string): boolean {
    if (!this.data.offers) return false;
    const idx = this.data.offers.findIndex((o) => o.id === id);
    if (idx === -1) return false;
    const removed = this.data.offers.splice(idx, 1)[0];
    this.logAction('Offer Deleted', `Deleted combo offer: ${removed.title}`);
    this.saveDatabase();
    return true;
  }

  public toggleOfferActive(id: string): ComboOffer | null {
    if (!this.data.offers) return null;
    const offer = this.data.offers.find((o) => o.id === id);
    if (!offer) return null;
    offer.isActive = !offer.isActive;
    offer.updatedAt = new Date().toISOString();
    this.logAction('Offer Toggled', `Toggled offer ${offer.title} status to ${offer.isActive ? 'Active' : 'Inactive'}`);
    this.saveDatabase();
    return offer;
  }

  // --- SERVER-AUTHORITATIVE CHECKOUT QUOTE & PROMOTION CALCULATION ---
  public calculateCheckoutQuote(params: {
    items: { soapId: string; quantity: number }[];
    couponCode?: string;
  }) {
    const items = params.items || [];
    const validLines: {
      soap: SoapProduct;
      quantity: number;
      lineTotal: number;
    }[] = [];

    let eligibleSoapCount = 0;
    let subtotal = 0;

    for (const reqItem of items) {
      const soap = this.getProductById(reqItem.soapId);
      if (!soap) continue;
      const qty = Math.max(1, Number(reqItem.quantity) || 1);
      const lineTotal = soap.price * qty;
      validLines.push({ soap, quantity: qty, lineTotal });
      subtotal += lineTotal;
      eligibleSoapCount += qty;
    }

    // Active combo offer check
    const activeOffer = this.getActiveOffer();
    let freeGiftsAwarded: { gift: GiftItem; quantity: number }[] = [];
    let promoProgress = {
      activeOfferTitle: activeOffer?.title || '',
      eligibleCount: eligibleSoapCount,
      threshold: activeOffer?.minimumQuantity || 6,
      giftsUnlocked: 0,
      nextUnlockNeeded: 0,
      message: '',
      isUnlocked: false,
    };

    if (activeOffer) {
      const threshold = activeOffer.minimumQuantity || 6;
      const giftsPerThreshold = activeOffer.giftsPerThreshold || 1;
      const maxGifts = activeOffer.maxGiftsPerOrder || 3;

      const potentialGifts = Math.floor(eligibleSoapCount / threshold) * giftsPerThreshold;
      const awardedCount = Math.min(maxGifts, potentialGifts);

      if (awardedCount > 0) {
        const giftItem = activeOffer.giftItemId ? this.getGiftItemById(activeOffer.giftItemId) : null;
        if (giftItem && giftItem.stockQuantity > 0) {
          const finalAward = Math.min(awardedCount, giftItem.stockQuantity);
          freeGiftsAwarded.push({ gift: giftItem, quantity: finalAward });
          promoProgress.giftsUnlocked = finalAward;
          promoProgress.isUnlocked = true;
          promoProgress.message = `Congratulations! You unlocked ${finalAward} free gift${finalAward > 1 ? 's' : ''}: ${giftItem.name}!`;
        } else {
          promoProgress.message = 'Promotion qualified, but gift stock is currently being restocked.';
        }
      } else {
        const needed = threshold - eligibleSoapCount;
        promoProgress.nextUnlockNeeded = needed > 0 ? needed : 0;
        promoProgress.message = `You have added ${eligibleSoapCount} eligible soap${eligibleSoapCount === 1 ? '' : 's'}. Add ${needed} more to unlock your FREE GIFT!`;
      }
    }

    // Coupon discount verification
    let discount = 0;
    if (params.couponCode) {
      const couponCheck = this.verifyCoupon(params.couponCode, subtotal);
      if (couponCheck.valid) {
        discount = couponCheck.discount;
      }
    }

    const shippingThreshold = this.data.companySettings.freeShippingThreshold || 999;
    const standardShipping = this.data.companySettings.standardShippingFee || 70;
    const shippingFee = subtotal >= shippingThreshold || subtotal === 0 ? 0 : standardShipping;
    const taxRate = this.data.companySettings.taxPercentage || 0;
    const tax = Math.round(((subtotal - discount) * taxRate) / 100);
    const finalTotal = Math.max(0, subtotal - discount + shippingFee + tax);

    return {
      lines: validLines,
      freeGifts: freeGiftsAwarded,
      subtotal,
      discount,
      shippingFee,
      tax,
      total: finalTotal,
      currency: 'INR',
      promoProgress,
    };
  }

  // --- REVENUE REPORTING & FINANCIAL AGGREGATION ---
  public getRevenueSummary(startDate?: string, endDate?: string): RevenueSummary {
    const orders = this.data.orders.filter((o) => {
      const d = o.createdAt || o.date;
      if (startDate && d < startDate) return false;
      if (endDate && d > endDate) return false;
      return true;
    });

    let grossSoapSales = 0;
    let discounts = 0;
    let shippingCollected = 0;
    let taxCollected = 0;
    let confirmedPaymentsCollected = 0;
    let pendingPaymentsAmount = 0;
    let refunds = 0;
    let confirmedOrdersCount = 0;
    let soapUnitsSold = 0;

    for (const o of orders) {
      const isPaid =
        o.paymentStatus === 'SUCCESS' ||
        o.paymentStatus === 'captured' ||
        (o.paymentMethod.toLowerCase() === 'cod' && o.orderStatus === 'DELIVERED');

      if (isPaid) {
        confirmedPaymentsCollected += o.total;
        confirmedOrdersCount++;
        grossSoapSales += o.subtotal;
        discounts += o.discount;
        shippingCollected += o.shippingFee;
        taxCollected += o.tax;

        for (const item of o.items) {
          if (!item.isGift) {
            soapUnitsSold += item.quantity;
          }
        }
      } else if (o.paymentStatus === 'PENDING' && o.orderStatus !== 'CANCELLED') {
        pendingPaymentsAmount += o.total;
      }

      if (o.paymentStatus === 'REFUNDED' || o.orderStatus === 'REFUNDED') {
        refunds += o.refundedAmountPaise ? Math.round(o.refundedAmountPaise / 100) : o.total;
      }
    }

    const netCollectedAmount = Math.max(0, confirmedPaymentsCollected - refunds);
    const averageOrderValue = confirmedOrdersCount > 0 ? Math.round(confirmedPaymentsCollected / confirmedOrdersCount) : 0;

    return {
      grossSoapSales,
      discounts,
      shippingCollected,
      taxCollected,
      confirmedPaymentsCollected,
      pendingPaymentsAmount,
      refunds,
      netCollectedAmount,
      confirmedOrdersCount,
      soapUnitsSold,
      averageOrderValue,
    };
  }

  public getRevenueMonthlyReport(year: number, month: number) {
    const startMonth = `${year}-${String(month).padStart(2, '0')}-01T00:00:00.000Z`;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const endMonth = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01T00:00:00.000Z`;

    const summary = this.getRevenueSummary(startMonth, endMonth);
    const monthOrders = this.data.orders.filter((o) => {
      const d = o.createdAt || o.date;
      return d >= startMonth && d < endMonth;
    });

    // Daily breakdown for the selected month
    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyData: { day: number; date: string; sales: number; orders: number }[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayOrders = monthOrders.filter((o) => (o.createdAt || o.date).startsWith(dayStr));
      const daySales = dayOrders
        .filter((o) => o.paymentStatus === 'SUCCESS' || o.paymentStatus === 'captured' || (o.paymentMethod.toLowerCase() === 'cod' && o.orderStatus === 'DELIVERED'))
        .reduce((sum, o) => sum + o.total, 0);

      dailyData.push({
        day: d,
        date: dayStr,
        sales: daySales,
        orders: dayOrders.length,
      });
    }

    return {
      year,
      month,
      summary,
      dailyData,
      totalOrdersInMonth: monthOrders.length,
    };
  }

  public getYearlyMonthlyRevenue(selectedYear?: number) {
    const year = selectedYear || new Date().getFullYear();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentYear = new Date().getFullYear();
    const currentMonthNum = new Date().getMonth() + 1;

    let currentMonthRevenue = 0;
    let qualifyingPaidOrdersTotal = 0;
    let refundTotal = 0;
    let netCollectedTotal = 0;
    const monthsData: Array<{
      month: number;
      year: number;
      monthName: string;
      qualifyingPaidOrders: number;
      grossCollectedRevenue: number;
      discounts: number;
      refunds: number;
      netCollectedRevenue: number;
      averageOrderValue: number;
    }> = [];

    for (let m = 1; m <= 12; m++) {
      const startMonth = `${year}-${String(m).padStart(2, '0')}-01T00:00:00.000Z`;
      const nextM = m === 12 ? 1 : m + 1;
      const nextY = m === 12 ? year + 1 : year;
      const endMonth = `${nextY}-${String(nextM).padStart(2, '0')}-01T00:00:00.000Z`;

      const monthOrders = (this.data.orders || []).filter((o) => {
        const d = o.createdAt || o.date;
        return d && d >= startMonth && d < endMonth;
      });

      let grossCollectedRevenue = 0;
      let discounts = 0;
      let refunds = 0;
      let qualifyingPaidOrders = 0;

      for (const o of monthOrders) {
        const isPaid =
          o.paymentStatus === 'SUCCESS' ||
          o.paymentStatus === 'captured' ||
          (o.paymentMethod.toLowerCase() === 'cod' && (o.orderStatus === 'DELIVERED' || o.orderStatus === 'Delivered'));

        if (isPaid) {
          grossCollectedRevenue += o.total;
          qualifyingPaidOrders++;
          discounts += o.discount || 0;
        }

        if (o.paymentStatus === 'REFUNDED' || o.orderStatus === 'REFUNDED' || o.orderStatus === 'Refunded') {
          refunds += o.refundedAmountPaise ? Math.round(o.refundedAmountPaise / 100) : o.total;
        }
      }

      const netCollectedRevenue = Math.max(0, grossCollectedRevenue - refunds);
      const averageOrderValue = qualifyingPaidOrders > 0 ? Math.round(grossCollectedRevenue / qualifyingPaidOrders) : 0;

      if (year === currentYear && m === currentMonthNum) {
        currentMonthRevenue = netCollectedRevenue;
      }

      qualifyingPaidOrdersTotal += qualifyingPaidOrders;
      refundTotal += refunds;
      netCollectedTotal += netCollectedRevenue;

      monthsData.push({
        month: m,
        year,
        monthName: `${monthNames[m - 1]} ${year}`,
        qualifyingPaidOrders,
        grossCollectedRevenue,
        discounts,
        refunds,
        netCollectedRevenue,
        averageOrderValue,
      });
    }

    const overallAov = qualifyingPaidOrdersTotal > 0 ? Math.round((netCollectedTotal + refundTotal) / qualifyingPaidOrdersTotal) : 0;

    return {
      year,
      currentMonthRevenue,
      qualifyingPaidOrders: qualifyingPaidOrdersTotal,
      refundTotal,
      netCollectedRevenue: netCollectedTotal,
      averageOrderValue: overallAov,
      months: monthsData,
    };
  }

  public exportYearlyRevenueCSV(year?: number): string {
    const report = this.getYearlyMonthlyRevenue(year);
    const headers = [
      'Month & Year',
      'Qualifying Paid Orders',
      'Gross Collected Revenue (INR)',
      'Discounts (INR)',
      'Refunds (INR)',
      'Net Collected Revenue (INR)',
      'Average Order Value (INR)',
    ];

    const rows = report.months.map((m) => [
      `"${m.monthName}"`,
      m.qualifyingPaidOrders,
      m.grossCollectedRevenue,
      m.discounts,
      m.refunds,
      m.netCollectedRevenue,
      m.averageOrderValue,
    ]);

    rows.push([
      `"Total (${report.year})"`,
      report.qualifyingPaidOrders,
      report.netCollectedRevenue + report.refundTotal,
      report.months.reduce((sum, m) => sum + m.discounts, 0),
      report.refundTotal,
      report.netCollectedRevenue,
      report.averageOrderValue,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  public getOwnerDashboard() {
    const allProducts = this.data.products || [];
    const publishedProducts = allProducts.filter((p) => p.isPublished !== false && p.status !== 'draft' && p.status !== 'archived');
    const allOrders = this.data.orders || [];
    const pendingOrders = allOrders.filter((o) =>
      ['Pending Review', 'Placed', 'Confirmed', 'Processing', 'Accepted', 'Accepted & Preparing', 'PLACED', 'CONFIRMED', 'PROCESSING'].includes(o.orderStatus)
    );
    const activeOffers = (this.data.offers || []).filter((off) => off.isActive !== false);
    const lowStockAlerts = allProducts.filter((p) => p.stock <= (p.lowStockThreshold || 5));

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const monthlyReport = this.getYearlyMonthlyRevenue(currentYear);
    const thisMonthData = monthlyReport.months.find((m) => m.month === currentMonth) || {
      netCollectedRevenue: 0,
      qualifyingPaidOrders: 0,
    };

    return {
      totalProducts: allProducts.length,
      publishedProducts: publishedProducts.length,
      ordersAwaitingProcessing: pendingOrders.length,
      totalOrders: allOrders.length,
      currentMonthRevenue: thisMonthData.netCollectedRevenue,
      activeComboOffers: activeOffers.length,
      lowStockProducts: lowStockAlerts.length,
      recentOrders: allOrders.slice(0, 5),
      pendingOrders: pendingOrders.slice(0, 5),
      lowStockAlerts: lowStockAlerts.slice(0, 5),
      monthlyRevenueOverview: {
        currentMonthRevenue: thisMonthData.netCollectedRevenue,
        netCollectedRevenue: monthlyReport.netCollectedRevenue,
        qualifyingPaidOrders: monthlyReport.qualifyingPaidOrders,
      },
    };
  }

  public exportRevenueCSV(startDate?: string, endDate?: string): string {
    const orders = this.data.orders.filter((o) => {
      const d = o.createdAt || o.date;
      if (startDate && d < startDate) return false;
      if (endDate && d > endDate) return false;
      return true;
    });

    const headers = [
      'Order Number',
      'Date',
      'Customer Name',
      'Customer Email',
      'Payment Method',
      'Payment Status',
      'Order Status',
      'Paid Soap Units',
      'Free Gift Units',
      'Subtotal (INR)',
      'Discount (INR)',
      'Shipping (INR)',
      'Total (INR)',
    ];

    const rows = orders.map((o) => {
      const paidUnits = o.items.filter((i) => !i.isGift).reduce((sum, i) => sum + i.quantity, 0);
      const giftUnits = o.items.filter((i) => i.isGift).reduce((sum, i) => sum + i.quantity, 0);
      return [
        o.orderNumber,
        new Date(o.createdAt || o.date).toISOString().split('T')[0],
        `"${o.customerName.replace(/"/g, '""')}"`,
        `"${o.customerEmail}"`,
        o.paymentMethod,
        o.paymentStatus,
        o.orderStatus,
        paidUnits,
        giftUnits,
        o.subtotal,
        o.discount,
        o.shippingFee,
        o.total,
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  public adjustInventory(params: {
    soapId?: string;
    giftItemId?: string;
    quantityChange: number;
    movementType: 'restock' | 'damage' | 'waste' | 'manual_adjustment';
    reason?: string;
    actor?: string;
  }) {
    if (params.soapId) {
      const soap = this.getProductById(params.soapId);
      if (!soap) throw new Error('Soap product not found');
      const newStock = soap.stock + params.quantityChange;
      if (newStock < 0) throw new Error('Cannot reduce stock below 0');
      soap.stock = newStock;
      this.logAction(
        'Soap Stock Adjusted',
        `${params.movementType.toUpperCase()}: ${soap.name} stock changed by ${params.quantityChange > 0 ? '+' : ''}${params.quantityChange} to ${newStock} (Reason: ${params.reason || 'Manual'})`,
        params.actor || 'mailmethirukailash@gmail.com'
      );
    } else if (params.giftItemId) {
      const gift = this.getGiftItemById(params.giftItemId);
      if (!gift) throw new Error('Gift inventory item not found');
      const newStock = gift.stockQuantity + params.quantityChange;
      if (newStock < 0) throw new Error('Cannot reduce gift stock below 0');
      gift.stockQuantity = newStock;
      this.logAction(
        'Gift Stock Adjusted',
        `${params.movementType.toUpperCase()}: ${gift.name} stock changed by ${params.quantityChange > 0 ? '+' : ''}${params.quantityChange} to ${newStock} (Reason: ${params.reason || 'Manual'})`,
        params.actor || 'mailmethirukailash@gmail.com'
      );
    } else {
      throw new Error('Either soapId or giftItemId must be provided for inventory adjustment');
    }
    this.saveDatabase();
    return { success: true };
  }

  public processRefund(orderId: string, amount: number, reason: string) {
    const order = this.getOrderById(orderId);
    if (!order) throw new Error('Order not found');

    order.paymentStatus = 'REFUNDED';
    order.orderStatus = 'Refunded';
    order.refundReason = reason;
    order.refundedAmountPaise = Math.round(amount * 100);

    order.statusHistory.push({
      status: 'Refunded',
      timestamp: new Date().toISOString(),
      note: `Refund of ₹${amount} recorded. Reason: ${reason}`,
    });

    this.logAction('Refund Processed', `Recorded refund of ₹${amount} for order ${order.orderNumber}. Reason: ${reason}`);
    this.saveDatabase();
    return order;
  }

  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  public logAudit(action: string, details: string, actor: string = 'mailmethirukailash@gmail.com', entityType?: string, entityId?: string) {
    const log: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      adminEmail: actor,
      actorId: actor,
      action,
      entityType,
      entityId,
      description: action,
      details,
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 300) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 300);
    }
    this.saveDatabase();
    return log;
  }

  // --- CMS: COLLECTIONS ---
  public getCollections(): Collection[] {
    return (this.data.collections || []).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public getCollectionById(id: string): Collection | null {
    return (this.data.collections || []).find((c) => c.id === id || c.slug === id) || null;
  }

  public createCollection(data: Partial<Collection>): Collection {
    const newCol: Collection = {
      id: `col-${Date.now()}`,
      name: data.name || 'New Collection',
      slug: data.slug || (data.name || 'new-collection').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: data.description || '',
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80',
      displayOrder: data.displayOrder || (this.data.collections?.length || 0) + 1,
      productIds: data.productIds || [],
      ruleType: data.ruleType || 'manual',
      isPublished: data.isPublished !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (!this.data.collections) this.data.collections = [];
    this.data.collections.push(newCol);
    this.logAudit('Collection Created', `Created collection "${newCol.name}" with ${newCol.productIds.length} items`, 'mailmethirukailash@gmail.com', 'collection', newCol.id);
    this.saveDatabase();
    return newCol;
  }

  public updateCollection(id: string, updates: Partial<Collection>): Collection | null {
    const col = (this.data.collections || []).find((c) => c.id === id);
    if (!col) return null;
    Object.assign(col, updates, { updatedAt: new Date().toISOString() });
    this.logAudit('Collection Updated', `Updated collection "${col.name}"`, 'mailmethirukailash@gmail.com', 'collection', col.id);
    this.saveDatabase();
    return col;
  }

  public deleteCollection(id: string): boolean {
    const index = (this.data.collections || []).findIndex((c) => c.id === id);
    if (index === -1) return false;
    const deleted = this.data.collections.splice(index, 1)[0];
    this.logAudit('Collection Deleted', `Deleted collection "${deleted.name}"`, 'mailmethirukailash@gmail.com', 'collection', id);
    this.saveDatabase();
    return true;
  }

  // --- CMS: HOMEPAGE CONFIG ---
  public getHomepageConfig(): HomepageConfig {
    return this.data.homepageConfig || INITIAL_HOMEPAGE_CONFIG;
  }

  public updateHomepageConfig(updates: Partial<HomepageConfig>): HomepageConfig {
    this.data.homepageConfig = {
      ...(this.data.homepageConfig || INITIAL_HOMEPAGE_CONFIG),
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    this.logAudit('Homepage Updated', 'Modified homepage layout, hero, and section visibility', 'mailmethirukailash@gmail.com', 'homepage', 'homepage-config');
    this.saveDatabase();
    return this.data.homepageConfig;
  }

  // --- CMS: BRAND PAGES & POLICIES ---
  public getBrandPages(): BrandPageContent[] {
    return this.data.brandPages || INITIAL_BRAND_PAGES;
  }

  public getBrandPageBySlug(slug: string): BrandPageContent | null {
    return (this.data.brandPages || []).find((p) => p.slug === slug || p.id === slug) || null;
  }

  public updateBrandPage(slugOrId: string, updates: Partial<BrandPageContent>): BrandPageContent | null {
    if (!this.data.brandPages) this.data.brandPages = [...INITIAL_BRAND_PAGES];
    let page = this.data.brandPages.find((p) => p.slug === slugOrId || p.id === slugOrId);
    if (!page) {
      page = {
        id: `page-${slugOrId}`,
        title: updates.title || slugOrId,
        slug: slugOrId,
        content: updates.content || '',
        isPublished: true,
        lastUpdated: new Date().toISOString(),
      };
      this.data.brandPages.push(page);
    } else {
      Object.assign(page, updates, { lastUpdated: new Date().toISOString() });
    }
    this.logAudit('Brand Page Updated', `Updated policy/brand page "${page.title}" (${page.slug})`, 'mailmethirukailash@gmail.com', 'page', page.id);
    this.saveDatabase();
    return page;
  }

  // --- CMS: FAQS ---
  public getFAQs(): FAQItem[] {
    return (this.data.faqs || []).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public createFAQ(data: Partial<FAQItem>): FAQItem {
    const faq: FAQItem = {
      id: `faq-${Date.now()}`,
      question: data.question || 'New FAQ Question',
      answer: data.answer || 'Answer details...',
      category: data.category || 'General',
      displayOrder: data.displayOrder || (this.data.faqs?.length || 0) + 1,
      isPublished: data.isPublished !== false,
    };
    if (!this.data.faqs) this.data.faqs = [];
    this.data.faqs.push(faq);
    this.logAudit('FAQ Created', `Created FAQ "${faq.question}"`, 'mailmethirukailash@gmail.com', 'faq', faq.id);
    this.saveDatabase();
    return faq;
  }

  public updateFAQ(id: string, updates: Partial<FAQItem>): FAQItem | null {
    const faq = (this.data.faqs || []).find((f) => f.id === id);
    if (!faq) return null;
    Object.assign(faq, updates);
    this.logAudit('FAQ Updated', `Updated FAQ "${faq.question}"`, 'mailmethirukailash@gmail.com', 'faq', faq.id);
    this.saveDatabase();
    return faq;
  }

  public deleteFAQ(id: string): boolean {
    const idx = (this.data.faqs || []).findIndex((f) => f.id === id);
    if (idx === -1) return false;
    const removed = this.data.faqs.splice(idx, 1)[0];
    this.logAudit('FAQ Deleted', `Deleted FAQ "${removed.question}"`, 'mailmethirukailash@gmail.com', 'faq', id);
    this.saveDatabase();
    return true;
  }

  // --- CMS: MEDIA LIBRARY ---
  public getMedia(): MediaItem[] {
    return this.data.media || INITIAL_MEDIA;
  }

  public createMedia(data: Partial<MediaItem>): MediaItem {
    const item: MediaItem = {
      id: `med-${Date.now()}`,
      filename: data.filename || 'uploaded-image.jpg',
      url: data.url || 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80',
      altText: data.altText || 'Lumina Artisan Soap Image',
      fileType: data.fileType || 'image/jpeg',
      fileSize: Number(data.fileSize) || 250000,
      associatedType: data.associatedType || 'general',
      associatedId: data.associatedId,
      uploadedAt: new Date().toISOString(),
    };
    if (!this.data.media) this.data.media = [];
    this.data.media.unshift(item);
    this.logAudit('Media Uploaded', `Registered media asset "${item.filename}"`, 'mailmethirukailash@gmail.com', 'media', item.id);
    this.saveDatabase();
    return item;
  }

  public updateMedia(id: string, updates: Partial<MediaItem>): MediaItem | null {
    const item = (this.data.media || []).find((m) => m.id === id);
    if (!item) return null;
    Object.assign(item, updates);
    this.logAudit('Media Updated', `Updated alt text and metadata for "${item.filename}"`, 'mailmethirukailash@gmail.com', 'media', item.id);
    this.saveDatabase();
    return item;
  }

  public deleteMedia(id: string): boolean {
    const idx = (this.data.media || []).findIndex((m) => m.id === id);
    if (idx === -1) return false;
    const removed = this.data.media.splice(idx, 1)[0];
    this.logAudit('Media Removed', `Removed media asset "${removed.filename}"`, 'mailmethirukailash@gmail.com', 'media', id);
    this.saveDatabase();
    return true;
  }

  // --- CMS: SEO METADATA ---
  public getSEOMetadata(): SEOMetadata[] {
    return this.data.seo || INITIAL_SEO;
  }

  public getSEOByPage(pageId: string): SEOMetadata | null {
    return (this.data.seo || []).find((s) => s.pageId === pageId) || null;
  }

  public updateSEOMetadata(pageId: string, updates: Partial<SEOMetadata>): SEOMetadata {
    if (!this.data.seo) this.data.seo = [...INITIAL_SEO];
    let seo = this.data.seo.find((s) => s.pageId === pageId);
    if (!seo) {
      seo = {
        pageId,
        pageTitle: updates.pageTitle || `${pageId.toUpperCase()} | Lumina Homemade Soaps`,
        metaDescription: updates.metaDescription || '',
        canonicalUrl: updates.canonicalUrl,
        indexing: updates.indexing !== false,
        keywords: updates.keywords || [],
        lastUpdated: new Date().toISOString(),
      };
      this.data.seo.push(seo);
    } else {
      Object.assign(seo, updates, { lastUpdated: new Date().toISOString() });
    }
    this.logAudit('SEO Updated', `Updated SEO tags for page "${pageId}"`, 'mailmethirukailash@gmail.com', 'seo', pageId);
    this.saveDatabase();
    return seo;
  }

  // --- CMS: PRODUCT DUPLICATION ---
  public duplicateProduct(id: string): SoapProduct | null {
    const original = this.getProductById(id);
    if (!original) return null;
    const randSuffix = Math.floor(100 + Math.random() * 900);
    const newProduct: SoapProduct = {
      ...original,
      id: `soap-inr-${Date.now()}`,
      name: `${original.name} (Draft Copy)`,
      sku: `${original.sku || 'LUM-SKU'}-COPY-${randSuffix}`,
      slug: `${original.slug || 'soap'}-copy-${randSuffix}`,
      status: 'draft',
      isPublished: false,
      reviews: [],
      rating: 5,
      reviewCount: 0,
      stock: 0, // Fresh draft copy starts with 0 inventory until assigned
    };
    this.data.products.push(newProduct);
    this.logAudit('Product Duplicated', `Duplicated "${original.name}" into new draft "${newProduct.name}"`, 'mailmethirukailash@gmail.com', 'product', newProduct.id);
    this.saveDatabase();
    return newProduct;
  }

  // --- CRM: REVIEWS AGGREGATION & MODERATION ---
  public getAllReviews(): (ProductReview & { productId: string; productName: string; productImage: string })[] {
    const all: (ProductReview & { productId: string; productName: string; productImage: string })[] = [];
    for (const prod of this.data.products) {
      if (prod.reviews && prod.reviews.length > 0) {
        for (const rev of prod.reviews) {
          all.push({
            ...rev,
            status: rev.status || 'approved',
            productId: prod.id,
            productName: prod.name,
            productImage: prod.image,
          });
        }
      }
    }
    return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public updateReviewStatus(productId: string, reviewId: string, status: 'approved' | 'pending' | 'rejected'): boolean {
    const prod = this.getProductById(productId);
    if (!prod || !prod.reviews) return false;
    const review = prod.reviews.find((r) => r.id === reviewId);
    if (!review) return false;
    review.status = status;

    // Recalculate rating and reviewCount for approved reviews only
    const approved = prod.reviews.filter((r) => r.status === 'approved');
    prod.reviewCount = approved.length;
    prod.rating = approved.length > 0
      ? Number((approved.reduce((sum, r) => sum + r.rating, 0) / approved.length).toFixed(1))
      : 5;

    this.logAudit('Review Moderated', `Review by ${review.userName} for "${prod.name}" set to ${status}`, 'mailmethirukailash@gmail.com', 'review', reviewId);
    this.saveDatabase();
    return true;
  }

  // --- CRM: ENHANCED CUSTOMER DIRECTORY & PROFILES ---
  public getEnhancedCustomers(params?: { search?: string; filter?: string }) {
    const customers = this.data.users.filter((u) => u.role === 'customer');
    const enriched = customers.map((c) => {
      const customerOrders = this.data.orders.filter(
        (o) => o.userId === c.id || (o.customerEmail && o.customerEmail.toLowerCase() === c.email.toLowerCase())
      );
      const paidOrders = customerOrders.filter(
        (o) => o.paymentStatus === 'SUCCESS' || o.paymentStatus === 'captured' || (o.paymentMethod.toLowerCase() === 'cod' && o.orderStatus === 'DELIVERED')
      );
      const totalSpent = paidOrders.reduce((sum, o) => sum + o.total, 0);
      const lastOrder = customerOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      const openTickets = (this.data.supportTickets || []).filter(
        (t) => (t.userId === c.id || t.userEmail.toLowerCase() === c.email.toLowerCase()) && (t.status === 'OPEN' || t.status === 'IN PROGRESS' || t.status === 'IN_PROGRESS')
      ).length;

      let classification: 'High-Value Patron' | 'Repeat Connoisseur' | 'First-Time Customer' | 'New Member' = 'New Member';
      if (customerOrders.length >= 3 || totalSpent >= 1500) {
        classification = 'High-Value Patron';
      } else if (customerOrders.length >= 2) {
        classification = 'Repeat Connoisseur';
      } else if (customerOrders.length === 1) {
        classification = 'First-Time Customer';
      }

      const notes = (this.data.customerNotes || []).filter((n) => n.customerId === c.id);

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone || '',
        customerSince: c.createdAt || '2026-01-01',
        totalOrders: customerOrders.length,
        totalSpent,
        latestOrderDate: lastOrder ? (lastOrder.createdAt || lastOrder.date) : null,
        classification,
        openTickets,
        status: c.status || 'Active',
        address: c.address,
        notesCount: notes.length,
      };
    });

    // Apply filtering and search
    let result = enriched;
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)
      );
    }

    if (params?.filter) {
      if (params.filter === 'repeat') result = result.filter((c) => c.totalOrders >= 2);
      else if (params.filter === 'high-value') result = result.filter((c) => c.totalSpent >= 1500);
      else if (params.filter === 'first-time') result = result.filter((c) => c.totalOrders === 1);
      else if (params.filter === 'no-orders') result = result.filter((c) => c.totalOrders === 0);
      else if (params.filter === 'open-tickets') result = result.filter((c) => c.openTickets > 0);
    }

    return result;
  }

  public getCustomerProfile(customerId: string) {
    const customer = this.data.users.find((u) => u.id === customerId);
    if (!customer) return null;

    const orders = this.data.orders.filter(
      (o) => o.userId === customer.id || (o.customerEmail && o.customerEmail.toLowerCase() === customer.email.toLowerCase())
    );
    const tickets = (this.data.supportTickets || []).filter(
      (t) => t.userId === customer.id || (t.userEmail && t.userEmail.toLowerCase() === customer.email.toLowerCase())
    );
    const notes = (this.data.customerNotes || []).filter((n) => n.customerId === customer.id);
    const notifications = (this.data.notifications || []).filter((n) => n.userId === customer.id || n.userId === 'all');

    // Reviews by customer
    const reviews: any[] = [];
    for (const p of this.data.products) {
      for (const r of p.reviews || []) {
        if (r.userId === customer.id || (r.userName && r.userName.toLowerCase() === customer.name.toLowerCase())) {
          reviews.push({ ...r, productName: p.name, productImage: p.image });
        }
      }
    }

    const { password, ...safeCustomer } = customer;

    return {
      customer: safeCustomer,
      orders,
      tickets,
      notes,
      notifications,
      reviews,
    };
  }

  public addCustomerNote(customerId: string, noteText: string, author: string = 'Thiru Kailash'): InternalCustomerNote {
    const note: InternalCustomerNote = {
      id: `note-${Date.now()}`,
      customerId,
      note: noteText,
      author,
      createdAt: new Date().toISOString(),
    };
    if (!this.data.customerNotes) this.data.customerNotes = [];
    this.data.customerNotes.unshift(note);
    this.saveDatabase();
    return note;
  }

  // --- CRM: CUSTOMER SEGMENTS ---
  public getCustomerSegments() {
    const segments = this.data.customerSegments || INITIAL_CUSTOMER_SEGMENTS;
    const allCustomers = this.getEnhancedCustomers();

    return segments.map((seg) => {
      let audienceCount = 0;
      if (seg.criteriaType === 'first_time') audienceCount = allCustomers.filter((c) => c.totalOrders === 1).length;
      else if (seg.criteriaType === 'repeat') audienceCount = allCustomers.filter((c) => c.totalOrders >= 2).length;
      else if (seg.criteriaType === 'high_value') audienceCount = allCustomers.filter((c) => c.totalSpent >= (seg.minValue || 1500)).length;
      else if (seg.criteriaType === 'recent') audienceCount = allCustomers.filter((c) => c.latestOrderDate && (Date.now() - new Date(c.latestOrderDate).getTime()) < 30 * 24 * 3600 * 1000).length;
      else if (seg.criteriaType === 'inactive') audienceCount = allCustomers.filter((c) => !c.latestOrderDate || (Date.now() - new Date(c.latestOrderDate).getTime()) >= 60 * 24 * 3600 * 1000).length;
      else if (seg.criteriaType === 'open_ticket') audienceCount = allCustomers.filter((c) => c.openTickets > 0).length;
      else audienceCount = allCustomers.length;

      return {
        ...seg,
        audienceCount,
      };
    });
  }

  public createCustomerSegment(data: Partial<CustomerSegment>): CustomerSegment {
    const seg: CustomerSegment = {
      id: `seg-${Date.now()}`,
      name: data.name || 'New Segment',
      description: data.description || '',
      criteriaType: data.criteriaType || 'all',
      minValue: data.minValue,
      manualCustomerIds: data.manualCustomerIds,
      createdAt: new Date().toISOString(),
    };
    if (!this.data.customerSegments) this.data.customerSegments = [];
    this.data.customerSegments.push(seg);
    this.logAudit('Segment Created', `Created customer segment "${seg.name}"`, 'mailmethirukailash@gmail.com', 'segment', seg.id);
    this.saveDatabase();
    return seg;
  }

  public deleteCustomerSegment(id: string): boolean {
    const idx = (this.data.customerSegments || []).findIndex((s) => s.id === id);
    if (idx === -1) return false;
    const deleted = this.data.customerSegments.splice(idx, 1)[0];
    this.logAudit('Segment Deleted', `Deleted customer segment "${deleted.name}"`, 'mailmethirukailash@gmail.com', 'segment', id);
    this.saveDatabase();
    return true;
  }

  // --- CRM: CAMPAIGNS ---
  public getCampaigns(): CustomerCampaign[] {
    return this.data.campaigns || INITIAL_CAMPAIGNS;
  }

  public createCampaign(data: Partial<CustomerCampaign>): CustomerCampaign {
    const campaign: CustomerCampaign = {
      id: `camp-${Date.now()}`,
      title: data.title || 'Untitled Campaign',
      subject: data.subject || 'Lumina Artisan Soaps Update',
      message: data.message || '',
      targetSegmentId: data.targetSegmentId || 'seg-repeat',
      couponCode: data.couponCode,
      status: 'draft',
      audienceCount: Number(data.audienceCount) || 1,
      createdAt: new Date().toISOString(),
      deliveryMethod: 'in_app',
    };
    if (!this.data.campaigns) this.data.campaigns = [];
    this.data.campaigns.unshift(campaign);
    this.logAudit('Campaign Drafted', `Created marketing campaign draft "${campaign.title}"`, 'mailmethirukailash@gmail.com', 'campaign', campaign.id);
    this.saveDatabase();
    return campaign;
  }

  public updateCampaign(id: string, updates: Partial<CustomerCampaign>): CustomerCampaign | null {
    const campaign = (this.data.campaigns || []).find((c) => c.id === id);
    if (!campaign) return null;
    Object.assign(campaign, updates);
    this.logAudit('Campaign Updated', `Updated campaign draft "${campaign.title}"`, 'mailmethirukailash@gmail.com', 'campaign', campaign.id);
    this.saveDatabase();
    return campaign;
  }

  public sendCampaign(id: string): CustomerCampaign | null {
    const campaign = (this.data.campaigns || []).find((c) => c.id === id);
    if (!campaign) return null;

    campaign.status = 'sent';
    campaign.sentAt = new Date().toISOString();
    campaign.deliveryMethod = 'in_app';

    // Broadcast system notification to customers in target audience
    this.data.notifications.unshift({
      id: `notif-camp-${Date.now()}`,
      userId: 'all',
      title: `✨ ${campaign.title}`,
      message: campaign.message,
      type: 'promo',
      timestamp: new Date().toISOString(),
      read: false,
    });

    this.logAudit('Campaign Sent', `Dispatched in-app campaign "${campaign.title}" to target segment`, 'mailmethirukailash@gmail.com', 'campaign', campaign.id);
    this.saveDatabase();
    return campaign;
  }

  // --- WORKSHOP OPERATIONS HELPERS ---
  public getOperationsDashboard() {
    const pendingFulfilment = this.data.orders.filter(
      (o) => o.orderStatus === 'Placed' || o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing' || o.orderStatus === 'Packed'
    ).length;

    const readyToDispatch = this.data.orders.filter(
      (o) => o.orderStatus === 'Packed' || o.orderStatus === 'Handcrafted & Packaged'
    ).length;

    const lowStockAlerts = this.data.products.filter(
      (p) => p.stock <= (p.lowStockThreshold || 5)
    );

    const curingBatchesCount = this.data.curingBatches.filter(
      (b) => b.status === 'Curing on Racks' || b.status === 'Saponifying'
    ).length;

    const readyBatchesCount = this.data.curingBatches.filter(
      (b) => b.status === 'Ready for Sale'
    ).length;

    const recentOrders = this.data.orders.slice(0, 10);

    return {
      pendingFulfilment,
      readyToDispatch,
      lowStockAlerts,
      curingBatchesCount,
      readyBatchesCount,
      recentOrders,
    };
  }

  public assignDispatch(orderId: string, params: { carrier: string; trackingNumber: string; trackingUrl?: string; notes?: string }): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    order.carrier = params.carrier || 'India Post Speed Post';
    order.trackingNumber = params.trackingNumber;
    order.trackingUrl = params.trackingUrl || `https://www.indiapost.gov.in/_layouts/15/dpt.ptc.trackandtrace/tracking.aspx`;
    order.orderStatus = 'Shipped';

    order.statusHistory.push({
      status: 'Shipped',
      timestamp: new Date().toISOString(),
      note: `Dispatched via ${order.carrier} (Tracking: ${order.trackingNumber}) ${params.notes ? `• ${params.notes}` : ''}`,
      changedBy: 'Sole Proprietor',
    });

    // Notify customer
    this.data.notifications.unshift({
      id: `notif-disp-${Date.now()}`,
      userId: order.userId || 'guest',
      orderId: order.id,
      title: '📦 Order Handed to Courier',
      message: `Your order ${order.orderNumber} has been dispatched via ${order.carrier}. Tracking: ${order.trackingNumber}`,
      type: 'delivery',
      timestamp: new Date().toISOString(),
      read: false,
    });

    this.logAudit('Order Dispatched', `Assigned courier ${order.carrier} and tracking ${order.trackingNumber} to order ${order.orderNumber}`, 'mailmethirukailash@gmail.com', 'order', order.id);
    this.saveDatabase();
    return order;
  }
}

export const db = new Database();
