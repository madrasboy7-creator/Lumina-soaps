import { SoapProduct, CuringBatch } from '../types';

export const INITIAL_PRODUCTS: SoapProduct[] = [
  {
    id: 'soap-1',
    name: 'Wild Lavender & French Clary Sage Bar',
    tagline: 'Deeply relaxing floral lather with calming botanicals',
    category: 'Aromatherapy & Calming',
    price: 9.50,
    originalPrice: 12.00,
    rating: 4.9,
    reviewCount: 184,
    stock: 14,
    batchNumber: 'LUM-BATCH-2026-09A',
    cureDate: 'Cured 6 weeks on cedar racks',
    weight: '4.8 oz (136g)',
    dimensions: '3.2" x 2.4" x 1.1"',
    scentProfile: 'French Lavender & Sage',
    skinTypes: ['All Skin Types', 'Dry & Sensitive'],
    ingredients: [
      'Organic Saponified Extra Virgin Olive Oil',
      'Raw Organic Shea Butter',
      'Virgin Coconut Oil',
      'French Purple Brazilian Clay',
      'Pure Bulgarian Lavender Essential Oil',
      'Clary Sage Extract',
      'Hand-harvested Organic Lavender Buds'
    ],
    benefits: [
      'Relieves evening stress and promotes restful sleep',
      'Rich, velvety lather without stripping natural skin oils',
      'Naturally antiseptic and calming for redness'
    ],
    badge: 'Bestseller',
    isNewRelease: false,
    image: 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597359-2ff924294b43?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    coldProcessDescription: 'Cold-processed in small 32-bar wooden molds using mountain spring water and unrefined oils, cured slowly for 42 days.',
    reviews: [
      {
        id: 'rev-1',
        userName: 'Eleanor Vance',
        rating: 5,
        date: 'Sept 14, 2026',
        title: 'Heavenly calming scent and silky lather',
        comment: 'This is my 4th bar from Lumina. The lavender scent is pure essential oil, never artificial. My skin feels nourished without tightness.',
        verifiedPurchase: true
      },
      {
        id: 'rev-2',
        userName: 'Marcus Chen',
        rating: 5,
        date: 'Sept 02, 2026',
        title: 'Best artisan soap I have ever bought',
        comment: 'You can feel the quality of the raw shea butter. Lasts for weeks if kept on a draining dish.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'soap-2',
    name: 'Raw Honey & Golden Goat Milk Bar',
    tagline: 'Ultra-nourishing farm goat milk with raw wildflower honeycomb',
    category: 'Goat Milk & Honey',
    price: 10.00,
    originalPrice: 13.00,
    rating: 5.0,
    reviewCount: 96,
    stock: 9,
    batchNumber: 'LUM-BATCH-2026-09C',
    cureDate: 'Cured 7 weeks',
    weight: '5.0 oz (142g)',
    dimensions: '3.4" x 2.4" x 1.2"',
    scentProfile: 'Raw Honey & Toasted Almond',
    skinTypes: ['Dry & Sensitive', 'Eczema & Psoriasis Prone'],
    ingredients: [
      'Farm Fresh Raw Goat Milk (never powdered)',
      'Raw Wildflower Honey from local apiaries',
      'Organic Saponified Sweet Almond Oil',
      'Unrefined Mango Kernel Butter',
      'Colloidal Organic Oat Flour',
      'Cold-Pressed Jojoba Seed Oil'
    ],
    benefits: [
      'Natural lactic acid gently sloughs away flakes',
      'Deeply replenishes dry skin barrier',
      'Free from all added fragrances or synthetic dyes'
    ],
    badge: 'Maker Favorite',
    isNewRelease: true,
    image: 'https://images.unsplash.com/photo-1608248597359-2ff924294b43?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1608248597359-2ff924294b43?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    coldProcessDescription: 'Crafted with chilled local farm goat milk to preserve delicate vitamins A and D, cold-saponified and hand-stamped with the Lumina emblem.',
    reviews: [
      {
        id: 'rev-3',
        userName: 'Sarah Jenkins',
        rating: 5,
        date: 'Aug 29, 2026',
        title: 'Saved my sensitive winter skin',
        comment: 'I suffer from eczema patches on my arms and legs. This goat milk soap is the gentlest cleanser I have ever tried.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'soap-3',
    name: 'Activated Charcoal & Tea Tree Detox Bar',
    tagline: 'Deep pore purification with organic tea tree and bamboo charcoal',
    category: 'Herbal & Botanical',
    price: 9.00,
    rating: 4.8,
    reviewCount: 142,
    stock: 6,
    batchNumber: 'LUM-BATCH-2026-08D',
    cureDate: 'Cured 6 weeks',
    weight: '4.6 oz (130g)',
    dimensions: '3.1" x 2.3" x 1.1"',
    scentProfile: 'Activated Charcoal & Tea Tree',
    skinTypes: ['Oily & Acne-Prone', 'All Skin Types'],
    ingredients: [
      'Activated Steam-Washed Bamboo Charcoal',
      'Organic Cold-Pressed Castor Oil',
      'Australian Tea Tree Essential Oil',
      'Saponified Organic Coconut and Olive Oils',
      'Bentonite Montmorillonite Clay',
      'Peppermint Leaf Extract'
    ],
    benefits: [
      'Draws out impurities, sebum and daily pollutants',
      'Clarity-boosting botanical astringent',
      'Creates a dense, mineral-rich charcoal froth'
    ],
    badge: 'Bestseller',
    isNewRelease: false,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    coldProcessDescription: 'Formulated with ultra-fine activated bamboo charcoal powder and Australian melaleuca alternifolia, cured for 6 weeks for optimal hardness.',
    reviews: [
      {
        id: 'rev-4',
        userName: 'David Miller',
        rating: 5,
        date: 'Sept 08, 2026',
        title: 'Clears acne without drying',
        comment: 'Controls forehead shine and keeps breakouts away. My face feels squeaky clean but never irritated.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'soap-4',
    name: 'Eucalyptus Mint Awakening Morning Bar',
    tagline: 'Vigorous crushed mint and invigorating eucalyptus steam shower bar',
    category: 'Exfoliating Scrub',
    price: 9.75,
    originalPrice: 12.50,
    rating: 4.9,
    reviewCount: 78,
    stock: 12,
    batchNumber: 'LUM-BATCH-2026-09E',
    cureDate: 'Cured 5 weeks',
    weight: '4.7 oz (133g)',
    dimensions: '3.2" x 2.4" x 1.1"',
    scentProfile: 'Eucalyptus & Peppermint',
    skinTypes: ['All Skin Types'],
    ingredients: [
      'Organic Crushed Peppermint Leaves',
      'Wild Tasmanian Blue Gum Eucalyptus Oil',
      'French Green Montmorillonite Clay',
      'Saponified Organic Babassu Oil',
      'Organic Cocoa Seed Butter',
      'Cold-Pressed Avocado Oil'
    ],
    benefits: [
      'Opens sinuses and awakens morning senses',
      'Light natural herbal exfoliation from mint flecks',
      'Refreshing cool tingling sensation'
    ],
    badge: 'New Release',
    isNewRelease: true,
    image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80'
    ],
    featured: false,
    coldProcessDescription: 'Infused with double-distilled peppermint and eucalyptus steam distillations, colored purely with mineral green sea clay.',
    reviews: [
      {
        id: 'rev-5',
        userName: 'Chloe Bennett',
        rating: 5,
        date: 'Sept 17, 2026',
        title: 'Transforms shower into a luxury spa',
        comment: 'The eucalyptus vapor in a hot shower is incredible. Leaves you energized and ready for the day.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'soap-5',
    name: 'Wild Rose Petal & Pink French Clay Bar',
    tagline: 'Silky romantic rosehip oil with gently polishing French pink clay',
    category: 'Aromatherapy & Calming',
    price: 11.00,
    rating: 5.0,
    reviewCount: 115,
    stock: 8,
    batchNumber: 'LUM-BATCH-2026-09F',
    cureDate: 'Cured 6 weeks',
    weight: '4.9 oz (138g)',
    dimensions: '3.3" x 2.3" x 1.2"',
    scentProfile: 'Wild Rose & Geranium',
    skinTypes: ['Mature & Nourishing', 'Dry & Sensitive'],
    ingredients: [
      'Cold-Pressed Organic Rosehip Seed Oil',
      'Damask Rose Flower Hydrosol',
      'French Rose Kaolin Clay',
      'Egyptian Rose Geranium Essential Oil',
      'Saponified Extra Virgin Olive & Argan Oils',
      'Dried Organic Rose Petals'
    ],
    benefits: [
      'Supports cellular elasticity and radiant complexion',
      'Delicate natural floral aroma that lingers subtly',
      'Non-stripping conditioning lather'
    ],
    badge: 'Limited Batch',
    isNewRelease: true,
    image: 'https://images.unsplash.com/photo-1547793548-710ec861bb6e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1547793548-710ec861bb6e?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    coldProcessDescription: 'A romantic swirl of pink kaolin clay and cold-pressed virgin rosehip oil, hand-topped with heirloom dried miniature rosebuds.',
    reviews: [
      {
        id: 'rev-6',
        userName: 'Sophia Adams',
        rating: 5,
        date: 'Sept 10, 2026',
        title: 'Smells like a blooming garden',
        comment: 'The swirl is gorgeous, and the rose geranium scent is sophisticated, not grandma-rose at all. So luxurious!',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'soap-6',
    name: 'Sweet Orange Blossom & Lemongrass Sunrise',
    tagline: 'Zesty uplifting citrus burst with brightening organic turmeric',
    category: 'Herbal & Botanical',
    price: 9.25,
    rating: 4.7,
    reviewCount: 64,
    stock: 15,
    batchNumber: 'LUM-BATCH-2026-08B',
    cureDate: 'Cured 5 weeks',
    weight: '4.6 oz (130g)',
    dimensions: '3.2" x 2.3" x 1.1"',
    scentProfile: 'Sweet Orange & Lemongrass',
    skinTypes: ['All Skin Types', 'Oily & Acne-Prone'],
    ingredients: [
      'Wild Harvested Turmeric Root Powder',
      'Sweet Orange Peel Essential Oil',
      'East Indian Lemongrass Oil',
      'Saponified Organic Coconut Oil',
      'Unrefined Shea Butter',
      'Calendula Flower Infused Olive Oil'
    ],
    benefits: [
      'Turmeric provides natural antioxidant glow',
      'Citrus oils naturally clarify and balance oiliness',
      'Cheery sunny aroma boosts mood'
    ],
    badge: 'Sole Proprietor Special',
    isNewRelease: false,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
    ],
    featured: false,
    coldProcessDescription: 'Infused with sun-drenched calendula flowers and organic turmeric root, scented with pure cold-pressed citrus distillates.',
    reviews: [
      {
        id: 'rev-7',
        userName: 'Jessica Taylor',
        rating: 5,
        date: 'Sept 04, 2026',
        title: 'Bright and cheery lather',
        comment: 'The scent fills the entire bathroom. Really helps wake me up on dark mornings.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'soap-7',
    name: 'Pure Castile & Organic Chamomile (Unscented)',
    tagline: '100% pure extra virgin olive oil bar for the most delicate skin',
    category: 'Sensitive & Baby Care',
    price: 9.00,
    rating: 5.0,
    reviewCount: 89,
    stock: 18,
    batchNumber: 'LUM-BATCH-2026-07K',
    cureDate: 'Cured 12 weeks for ultimate mildness',
    weight: '4.5 oz (128g)',
    dimensions: '3.1" x 2.3" x 1.1"',
    scentProfile: 'Unscented Pure Castile',
    skinTypes: ['Dry & Sensitive', 'Eczema & Psoriasis Prone'],
    ingredients: [
      '100% First Cold-Pressed Spanish Olive Oil',
      'German Chamomile Botanical Tea Infusion',
      'Pure Distilled Mountain Spring Water',
      'Zero Fragrances, Zero Essential Oils, Zero Colorants'
    ],
    benefits: [
      'Aged 12 full weeks to yield a gentle castile lotion-lather',
      'Safe for newborns, eczema sufferers and fragrance allergies',
      'Zero sting, completely hypoallergenic'
    ],
    badge: 'Bestseller',
    isNewRelease: false,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80'
    ],
    featured: false,
    coldProcessDescription: 'Traditional 100% olive oil Castile formula steeped with chamomile flower tea and allowed to cure for 3 full months.',
    reviews: [
      {
        id: 'rev-8',
        userName: 'Hannah Scott',
        rating: 5,
        date: 'Sept 15, 2026',
        title: 'Only soap my baby can use without rashes',
        comment: 'Truly 100% unscented and made properly. A rare find nowadays.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'soap-8',
    name: 'Lumina Artisan 4-Bar Heritage Gift Box',
    tagline: 'Hand-tied cedar keepsake box with our four signature cold-process bars',
    category: 'Artisan Swirl Gift Sets',
    price: 36.00,
    originalPrice: 42.00,
    rating: 5.0,
    reviewCount: 52,
    stock: 5,
    batchNumber: 'LUM-GIFT-2026-B02',
    cureDate: 'Specially curated cured batch',
    weight: '19.2 oz total (4 bars)',
    dimensions: '7.5" x 5.5" x 2.8"',
    scentProfile: 'French Lavender & Sage',
    skinTypes: ['All Skin Types'],
    ingredients: [
      'Includes 1x Wild Lavender, 1x Raw Honey Goat Milk, 1x Charcoal Detox, 1x Rose Clay Bar',
      'Packed with natural wood excelsior & cotton botanical ribbon',
      'Includes handwritten personalized artisan batch card'
    ],
    benefits: [
      'Complete luxury sampling of Lumina bestselling formulas',
      'Zero plastic, fully biodegradable compostable packaging',
      'Arrives ready for gifting with customized maker wax seal'
    ],
    badge: 'Limited Batch',
    isNewRelease: true,
    image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    coldProcessDescription: 'Curated collection of our 4 top handcrafted soaps, bundled in a sustainably harvested pine wood crate with a sealed wax maker stamp.',
    reviews: [
      {
        id: 'rev-9',
        userName: 'Rachel Green',
        rating: 5,
        date: 'Sept 18, 2026',
        title: 'Sent this to my sister and she cried of joy',
        comment: 'The presentation is stunning. The aroma when opening the cedar box is unforgettable.',
        verifiedPurchase: true
      }
    ]
  }
];

export const INITIAL_CURING_BATCHES: CuringBatch[] = [
  {
    id: 'batch-01',
    soapName: 'Raw Honey & Golden Goat Milk Bar',
    batchNumber: 'LUM-BATCH-2026-10A',
    barCount: 32,
    pourDate: '2026-09-02',
    expectedCureDate: '2026-10-14',
    status: 'Curing on Racks',
    essentialOilsUsed: 'Unscented Raw Local Honey & Almond'
  },
  {
    id: 'batch-02',
    soapName: 'Spiced Clove & Pumpkin Seed Autumn Release',
    batchNumber: 'LUM-BATCH-2026-10B',
    barCount: 28,
    pourDate: '2026-09-12',
    expectedCureDate: '2026-10-24',
    status: 'Curing on Racks',
    essentialOilsUsed: 'Cinnamon Bark, Sweet Clove & Sweet Orange'
  },
  {
    id: 'batch-03',
    soapName: 'Forest Pine & Juniper Mountain Bar',
    batchNumber: 'LUM-BATCH-2026-10C',
    barCount: 36,
    pourDate: '2026-09-18',
    expectedCureDate: '2026-10-30',
    status: 'Saponifying',
    essentialOilsUsed: 'Siberian Fir Needle, Juniper Berry & Cedarwood'
  }
];
