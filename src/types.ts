export type SoapCategory = string;

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  imageUrl?: string;
  order: number;
  enabled: boolean;
  productCount?: number;
}

export type SkinType =
  | 'All Skin Types'
  | 'Dry & Sensitive'
  | 'Oily & Acne-Prone'
  | 'Eczema & Psoriasis Prone'
  | 'Mature & Nourishing'
  | 'Normal & Combination';

export type ScentProfile =
  | 'French Lavender & Sage'
  | 'Eucalyptus & Peppermint'
  | 'Sweet Orange & Lemongrass'
  | 'Wild Rose & Geranium'
  | 'Raw Honey & Toasted Almond'
  | 'Activated Charcoal & Tea Tree'
  | 'Warm Oatmeal & Vanilla'
  | 'Unscented Pure Castile'
  | 'Mysore Sandalwood & Vetiver'
  | 'Lemongrass & Neem'
  | 'Bergamot & Cedarwood'
  | string;

export interface ProductReview {
  id: string;
  userId?: string;
  userName: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  status?: 'approved' | 'pending' | 'rejected' | 'hidden';
  images?: string[];
  productId?: string;
  productName?: string;
  productImage?: string;
  soapId?: string;
  soapName?: string;
  customerName?: string;
  customerEmail?: string;
  userEmail?: string;
  createdAt?: string;
  isVerifiedBuyer?: boolean;
}

export type Review = ProductReview;

export interface ProductVariant {
  id: string;
  name: string;
  weight: string;
  packSize: number;
  price: number;
  originalPrice?: number;
  sku: string;
  stock: number;
}

export interface SoapProduct {
  id: string;
  sku?: string;
  name: string;
  slug?: string;
  tagline: string;
  category: SoapCategory;
  price: number;
  originalPrice?: number;
  pricePaise?: number;
  salePricePaise?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  lowStockThreshold?: number;
  batchNumber: string;
  cureDate: string;
  weight: string;
  weightGrams?: number;
  dimensions?: string;
  scentProfile: string;
  skinTypes: string[];
  ingredients: string[];
  benefits: string[];
  description?: string;
  directions?: string;
  warnings?: string;
  usageInstructions?: string;
  storageInstructions?: string;
  variants?: ProductVariant[];
  badge?: 'Bestseller' | 'New Release' | 'Limited Batch' | 'Maker Favorite' | 'Sole Proprietor Special' | string;
  isNewRelease: boolean;
  isFeatured?: boolean;
  featured?: boolean;
  isBestSeller?: boolean;
  isPublished?: boolean;
  status?: 'draft' | 'published' | 'archived' | 'hidden';
  image: string;
  imageAlt?: string;
  gallery: string[];
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  shortDescription?: string;
  netWeight?: string;
  precautions?: string;
  coldProcessDescription?: string;
  reviews: ProductReview[];
}

// Promotion-only Gift Inventory item (NEVER purchasable independently)
export interface GiftItem {
  id: string;
  name: string;
  description: string;
  image: string;
  storagePath?: string;
  sku: string;
  stockQuantity: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ComboOfferType = 'fixed_price' | 'percentage_discount' | 'fixed_discount' | 'buy_x_get_y';

export interface ComboIncludedSoap {
  soapId: string;
  soapName?: string;
  quantity: number;
  image?: string;
}

// Combo Offer (Fixed Price, Percentage Discount, Fixed Amount, or Buy X Get Y)
export interface ComboOffer {
  id: string;
  title: string;
  description: string;
  image?: string;
  offerType: ComboOfferType;
  comboPrice?: number; // For fixed_price (in ₹ INR)
  discountPercentage?: number; // For percentage_discount (e.g. 15 for 15%)
  discountAmount?: number; // For fixed_discount (in ₹ INR)
  includedSoaps: ComboIncludedSoap[];
  minimumQuantity?: number; // For Buy X, Get Y threshold
  giftsPerThreshold?: number; // Reward count
  maxGiftsPerOrder?: number;
  giftItemId?: string;
  giftItem?: GiftItem;
  rewardSoapId?: string;
  rewardQuantity?: number;
  eligibleSoapIds?: string[];
  startsAt: string;
  endsAt?: string;
  usageLimit?: number;
  timesUsed?: number;
  isActive: boolean;
  terms?: string;
  thresholdQuantity?: number;
  freeShippingThreshold?: number;
  bannerText?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type OrderStatus =
  | 'Pending Payment'
  | 'Placed'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Refund Pending'
  | 'Refunded'
  | 'Pending Review'
  | 'Accepted & Preparing'
  | 'Handcrafted & Packaged'
  | 'PLACED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT FOR DELIVERY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURN_APPROVED'
  | 'RETURNED'
  | 'REFUND_PENDING'
  | 'REFUNDED';

export type PaymentStatus =
  | 'pending'
  | 'captured'
  | 'failed'
  | 'refunded'
  | 'partially_refunded'
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderItem {
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  batchNumber?: string;
  weight?: string;
  sku?: string;
  isGift?: boolean;
  giftItemId?: string;
  unitPricePaise?: number;
  lineTotalPaise?: number;
}

export interface ShippingAddress {
  id?: string;
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode?: string;
  pincode?: string;
  phone: string;
  isDefault?: boolean;
  type?: 'Home' | 'Work' | 'Other';
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  changedBy?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  createdAt?: string;
  userId?: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  subtotalPaise?: number;
  shippingFee: number;
  shippingPaise?: number;
  tax: number;
  taxPaise?: number;
  discount: number;
  discountPaise?: number;
  couponCode?: string;
  total: number;
  totalPaise?: number;
  currency?: string;
  paymentMethod: 'Razorpay' | 'COD' | 'razorpay' | 'cod' | 'UPI' | 'Card' | 'NetBanking' | string;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  providerOrderId?: string;
  providerPaymentId?: string;
  orderStatus: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  customerNote?: string;
  notes?: string;
  proprietorInternalNotes?: string;
  trackingNumber?: string;
  carrier?: string;
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
  cancellationReason?: string;
  refundReason?: string;
  returnReason?: string;
  returnNotes?: string;
  refundedAmountPaise?: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: ShippingAddress;
  addresses?: ShippingAddress[];
  role: 'customer' | 'admin' | 'owner';
  createdAt: string;
  totalOrders?: number;
  totalSpent?: number;
  status?: 'Active' | 'Suspended';
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  description: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  orderId?: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'delivery' | 'system' | 'return' | 'offer';
  timestamp?: string;
  createdAt?: string;
  read: boolean;
  link?: string;
}

export interface SupportTicketMessage {
  id: string;
  sender: 'customer' | 'admin' | string;
  senderName: string;
  message: string;
  createdAt: string;
  timestamp?: string;
  isInternal?: boolean;
}

export type TicketMessage = SupportTicketMessage;

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  customerName?: string;
  customerEmail?: string;
  category: string;
  subject: string;
  message?: string;
  orderId?: string;
  orderNumber?: string;
  status: 'OPEN' | 'IN PROGRESS' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt?: string;
  lastUpdated?: string;
  messages: SupportTicketMessage[];
  replies?: Array<{ id?: string; sender: string; senderName?: string; message: string; timestamp?: string }>;
}

export interface PromotionalBanner {
  id: string;
  title: string;
  subtitle: string;
  tag?: string;
  ctaText?: string;
  ctaLabel?: string;
  linkAction?: string;
  targetUrl?: string;
  imageUrl: string;
  imagePath?: string;
  badge?: string;
  active: boolean;
  isActive?: boolean;
  displayOrder: number;
  sortOrder?: number;
  startsAt?: string;
  endsAt?: string;
}

export interface StoreSettings {
  companyName: string;
  storeName?: string;
  brandStory: string;
  tagline: string;
  brandTagline?: string;
  logoUrl: string;
  ownerName: string;
  email: string;
  contactEmail?: string;
  phone: string;
  studioAddress: string;
  businessHours: string;
  gstNumber: string;
  currency: string;
  timeZone: string;
  standardShippingFee: number;
  freeShippingThreshold: number;
  codAvailable: boolean;
  taxPercentage: number;
  razorpayKeyIdConfigured: boolean;
  smtpConfigured: boolean;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  aboutText: string;
  shippingPolicy: string;
  privacyPolicy: string;
  termsAndConditions: string;
}

// Backward compatibility alias
export type CompanySettings = StoreSettings;

export interface AuditLog {
  id: string;
  timestamp: string;
  adminEmail: string;
  actorId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  description?: string;
  details: string;
}

export type SortOption =
  | 'relevance'
  | 'newest'
  | 'price-low'
  | 'price-high'
  | 'rating'
  | 'bestselling'
  | 'featured';

export const CURRENCY_SYMBOL = '₹';

export const formatPriceINR = (amount: number): string => {
  return `₹${Number(amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

export const paiseToINR = (paise: number): number => {
  return Math.round((paise || 0) / 100);
};

export const inrToPaise = (inr: number): number => {
  return Math.round((inr || 0) * 100);
};

export interface FilterState {
  searchQuery: string;
  selectedCategories: string[];
  selectedSkinTypes: string[];
  selectedScents: string[];
  priceRange: [number, number];
  minRating: number;
  inStockOnly: boolean;
  newReleasesOnly: boolean;
  sortBy: SortOption;
}

export interface CuringBatch {
  id: string;
  soapName: string;
  batchNumber: string;
  barCount: number;
  pourDate: string;
  expectedCureDate: string;
  status: 'Pouring' | 'Saponifying' | 'Curing on Racks' | 'Ready for Sale';
  essentialOilsUsed: string;
}

export interface CartItem extends OrderItem {
  selectedVariant?: ProductVariant;
}

export interface SaveForLaterItem {
  id: string;
  product: SoapProduct;
  savedAt: string;
}

export type StoreView =
  | 'home'
  | 'shop'
  | 'store'
  | 'combos'
  | 'combo-offers'
  | 'orders'
  | 'orders-history'
  | 'cart'
  | 'account'
  | 'profile'
  | 'admin'
  | 'owner'
  | 'about'
  | 'contact'
  | 'faq'
  | 'shipping-policy'
  | 'privacy-policy'
  | 'terms';

// The exact six main owner portal sections mandated:
// 1. Dashboard, 2. Orders, 3. Products, 4. Combo Offers, 5. Monthly Revenue, 6. Settings
export type OwnerSection =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'combos'
  | 'revenue'
  | 'settings';

export type AdminTab = OwnerSection;

export interface MonthRevenueData {
  month: number; // 1-12
  year: number;
  monthName: string; // e.g. "January 2026"
  qualifyingPaidOrders: number;
  grossCollectedRevenue: number;
  discounts: number;
  refunds: number;
  netCollectedRevenue: number;
  averageOrderValue: number;
}

export interface MonthlyRevenueReport {
  year: number;
  currentMonthRevenue: number;
  qualifyingPaidOrders: number;
  refundTotal: number;
  netCollectedRevenue: number;
  averageOrderValue: number;
  months: MonthRevenueData[];
}

export interface RevenueSummary {
  grossSoapSales: number;
  discounts: number;
  shippingCollected: number;
  taxCollected: number;
  confirmedPaymentsCollected: number;
  pendingPaymentsAmount: number;
  refunds: number;
  netCollectedAmount: number;
  confirmedOrdersCount: number;
  soapUnitsSold: number;
  averageOrderValue: number;
}

// --- OWNER WORKSPACE NAVIGATION TYPES ---
export type OwnerModule = 'overview' | 'cms' | 'crm' | 'operations' | 'settings' | OwnerSection;

export type CMSView =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'collections'
  | 'homepage'
  | 'banners'
  | 'brand'
  | 'promotions'
  | 'pages'
  | 'faqs'
  | 'seo'
  | 'media';

export type CRMView =
  | 'dashboard'
  | 'customers'
  | 'directory'
  | 'profile'
  | 'segments'
  | 'support'
  | 'reviews'
  | 'notifications'
  | 'campaigns';

export type OperationsView =
  | 'dashboard'
  | 'orders'
  | 'inventory'
  | 'curing'
  | 'dispatch'
  | 'invoices'
  | 'reports';

// --- CMS ENTITIES ---
export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  displayOrder: number;
  productIds: string[];
  ruleType?: 'manual' | 'bestsellers' | 'new_releases' | 'category';
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HomepagePillar {
  icon: string;
  title: string;
  subtitle: string;
  description?: string;
}

export interface HomepageConfig {
  heroHeadline: string;
  heroSubtitle: string;
  heroTag: string;
  heroImageUrl: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  hero?: {
    title?: string;
    headline?: string;
    subtitle?: string;
    imageUrl?: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    badge?: string;
  };
  announcementActive: boolean;
  announcementText: string;
  announcementLink?: string;
  announcementBar?: {
    enabled?: boolean;
    text?: string;
    link?: string;
  };
  seasonalAnnouncementActive?: boolean;
  seasonalAnnouncementText?: string;
  sectionsOrder: string[];
  sectionsVisibility: Record<string, boolean>;
  brandPillars: HomepagePillar[];
  storyExcerpt: string;
  lastUpdated: string;
}

export interface BrandPageContent {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  isPublished: boolean;
  lastUpdated: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface MediaItem {
  id: string;
  title?: string;
  filename: string;
  url: string;
  altText: string;
  fileType: string;
  fileSize: number; // bytes
  sizeKb?: number;
  dimensions?: string;
  associatedType?: 'product' | 'category' | 'banner' | 'general';
  associatedId?: string;
  uploadedAt: string;
}

export interface SEOMetadata {
  pageId: string;
  pageTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  indexing: boolean;
  keywords?: string[];
  lastUpdated: string;
}

// --- CRM ENTITIES ---
export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria?: string;
  criteriaType: 'first_time' | 'repeat' | 'high_value' | 'recent' | 'inactive' | 'open_ticket' | 'all';
  minValue?: number;
  manualCustomerIds?: string[];
  createdAt: string;
}

export interface InternalCustomerNote {
  id: string;
  customerId: string;
  note: string;
  author: string;
  createdAt: string;
}

export interface CustomerCampaign {
  id: string;
  title: string;
  subject?: string;
  message: string;
  targetSegmentId?: string;
  segmentId?: string;
  channel?: string;
  couponCode?: string;
  status: 'draft' | 'scheduled' | 'sent';
  audienceCount: number;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  deliveryMethod?: 'in_app' | 'email_provider_configured' | 'draft';
}


