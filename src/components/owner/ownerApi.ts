import {
  SoapProduct,
  CategoryItem,
  Collection,
  HomepageConfig,
  PromotionalBanner,
  BrandPageContent,
  FAQItem,
  MediaItem,
  SEOMetadata,
  CustomerSegment,
  CustomerCampaign,
  Order,
  CuringBatch,
  AuditLog,
  RevenueSummary,
} from '../../types';

// Helper to get stored owner token
export const getOwnerToken = (): string => {
  return localStorage.getItem('lumina_owner_token') || '';
};

// Generic authenticated fetcher
export async function ownerRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getOwnerToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('x-owner-token', token);
  }
  
  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, { ...options, headers });
  
  if (res.status === 401 || res.status === 403) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Access Denied: Sole Proprietor authorization required.');
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

// ==========================================
// --- CMS API CLIENT ---
// ==========================================

export interface CMSDashboardStats {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  archivedProducts: number;
  totalCategories: number;
  totalCollections: number;
  activeBanners: number;
  incompleteProducts: number;
  incompleteSEO: number;
  recentModifications: AuditLog[];
}

export const cmsApi = {
  getDashboard: () => ownerRequest<CMSDashboardStats>('/api/owner/cms/dashboard'),
  
  // Products
  getProducts: () => ownerRequest<SoapProduct[]>('/api/owner/cms/products'),
  createProduct: (data: Partial<SoapProduct>) =>
    ownerRequest<SoapProduct>('/api/owner/cms/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProduct: (id: string, updates: Partial<SoapProduct>) =>
    ownerRequest<SoapProduct>(`/api/owner/cms/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  togglePublish: (id: string, isPublished: boolean) =>
    ownerRequest<SoapProduct>(`/api/owner/cms/products/${id}/publish`, {
      method: 'POST',
      body: JSON.stringify({ isPublished }),
    }),
  duplicateProduct: (id: string) =>
    ownerRequest<SoapProduct>(`/api/owner/cms/products/${id}/duplicate`, {
      method: 'POST',
    }),
  archiveProduct: (id: string) =>
    ownerRequest<{ success: boolean; product: SoapProduct }>(`/api/owner/cms/products/${id}`, {
      method: 'DELETE',
    }),

  // Categories
  getCategories: () => ownerRequest<CategoryItem[]>('/api/owner/cms/categories'),
  createCategory: (data: Partial<CategoryItem>) =>
    ownerRequest<CategoryItem>('/api/owner/cms/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategory: (id: string, updates: Partial<CategoryItem>) =>
    ownerRequest<CategoryItem>(`/api/owner/cms/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteCategory: (id: string) =>
    ownerRequest<{ success: boolean }>(`/api/owner/cms/categories/${id}`, {
      method: 'DELETE',
    }),

  // Collections
  getCollections: () => ownerRequest<Collection[]>('/api/owner/cms/collections'),
  createCollection: (data: Partial<Collection>) =>
    ownerRequest<Collection>('/api/owner/cms/collections', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCollection: (id: string, updates: Partial<Collection>) =>
    ownerRequest<Collection>(`/api/owner/cms/collections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteCollection: (id: string) =>
    ownerRequest<{ success: boolean }>(`/api/owner/cms/collections/${id}`, {
      method: 'DELETE',
    }),

  // Homepage Builder
  getHomepage: () => ownerRequest<HomepageConfig>('/api/owner/cms/homepage'),
  getHomepageConfig: () => ownerRequest<HomepageConfig>('/api/owner/cms/homepage'),
  updateHomepage: (config: Partial<HomepageConfig>) =>
    ownerRequest<HomepageConfig>('/api/owner/cms/homepage', {
      method: 'PUT',
      body: JSON.stringify(config),
    }),
  updateHomepageConfig: (config: Partial<HomepageConfig>) =>
    ownerRequest<HomepageConfig>('/api/owner/cms/homepage', {
      method: 'PUT',
      body: JSON.stringify(config),
    }),

  // Banners & Promos
  getBanners: () => ownerRequest<PromotionalBanner[]>('/api/owner/cms/banners'),
  createBanner: (data: Partial<PromotionalBanner>) =>
    ownerRequest<PromotionalBanner>('/api/owner/cms/banners', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateBanner: (id: string, updates: Partial<PromotionalBanner>) =>
    ownerRequest<PromotionalBanner>(`/api/owner/cms/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteBanner: (id: string) =>
    ownerRequest<{ success: boolean }>(`/api/owner/cms/banners/${id}`, {
      method: 'DELETE',
    }),

  // Brand Pages & Policies
  getPages: () => ownerRequest<BrandPageContent[]>('/api/owner/cms/pages'),
  getPage: (slug: string) => ownerRequest<BrandPageContent>(`/api/owner/cms/pages/${slug}`),
  updatePage: (slug: string, updates: Partial<BrandPageContent>) =>
    ownerRequest<BrandPageContent>(`/api/owner/cms/pages/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // FAQs
  getFAQs: () => ownerRequest<FAQItem[]>('/api/owner/cms/faqs'),
  createFAQ: (data: Partial<FAQItem>) =>
    ownerRequest<FAQItem>('/api/owner/cms/faqs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateFAQ: (id: string, updates: Partial<FAQItem>) =>
    ownerRequest<FAQItem>(`/api/owner/cms/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteFAQ: (id: string) =>
    ownerRequest<{ success: boolean }>(`/api/owner/cms/faqs/${id}`, {
      method: 'DELETE',
    }),

  // Media Library
  getMedia: () => ownerRequest<MediaItem[]>('/api/owner/cms/media'),
  createMedia: (data: Partial<MediaItem>) =>
    ownerRequest<MediaItem>('/api/owner/cms/media', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  uploadMedia: (data: Partial<MediaItem>) =>
    ownerRequest<MediaItem>('/api/owner/cms/media', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateMedia: (id: string, updates: Partial<MediaItem>) =>
    ownerRequest<MediaItem>(`/api/owner/cms/media/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteMedia: (id: string) =>
    ownerRequest<{ success: boolean }>(`/api/owner/cms/media/${id}`, {
      method: 'DELETE',
    }),

  // SEO
  getSEO: () => ownerRequest<SEOMetadata[]>('/api/owner/cms/seo'),
  updateSEO: (updatesOrPageId: string | any, possibleUpdates?: Partial<SEOMetadata>) => {
    if (typeof updatesOrPageId === 'string') {
      return ownerRequest<SEOMetadata>(`/api/owner/cms/seo/${updatesOrPageId}`, {
        method: 'PUT',
        body: JSON.stringify(possibleUpdates || {}),
      });
    }
    return ownerRequest<SEOMetadata>(`/api/owner/cms/seo`, {
      method: 'PUT',
      body: JSON.stringify(updatesOrPageId),
    });
  },
};

// ==========================================
// --- CRM API CLIENT ---
// ==========================================

export interface CRMDashboardStats {
  totalCustomers: number;
  repeatCustomers: number;
  repeatRate: number;
  highValueCustomers: number;
  openTickets: number;
  totalReviews: number;
  approvedReviews: number;
  averageRating: number;
  ratingDist: Record<number, number>;
  recentCustomers: any[];
}

export const crmApi = {
  getDashboard: () => ownerRequest<CRMDashboardStats>('/api/owner/crm/dashboard'),
  
  // Customers
  getCustomers: (params?: { search?: string; filter?: string }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.append('search', params.search);
    if (params?.filter) qs.append('filter', params.filter);
    return ownerRequest<any[]>(`/api/owner/crm/customers?${qs.toString()}`);
  },
  getCustomerProfile: (id: string) => ownerRequest<any>(`/api/owner/crm/customers/${id}`),
  getCustomer: (id: string) => ownerRequest<any>(`/api/owner/crm/customers/${id}`),
  addCustomerNote: (customerId: string, noteOrObj: string | { note: string; author?: string }) => {
    const note = typeof noteOrObj === 'string' ? noteOrObj : noteOrObj.note;
    return ownerRequest<any>(`/api/owner/crm/customers/${customerId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
  },

  // Segments
  getSegments: () => ownerRequest<CustomerSegment[]>('/api/owner/crm/segments'),
  createSegment: (data: Partial<CustomerSegment>) =>
    ownerRequest<CustomerSegment>('/api/owner/crm/segments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteSegment: (id: string) =>
    ownerRequest<{ success: boolean }>(`/api/owner/crm/segments/${id}`, {
      method: 'DELETE',
    }),

  // Support Inbox
  getTickets: () => ownerRequest<any[]>('/api/owner/crm/support'),
  getSupportTickets: () => ownerRequest<any[]>('/api/owner/crm/support'),
  replyToTicket: (ticketId: string, message: string) =>
    ownerRequest<any>(`/api/owner/crm/support/${ticketId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
  replySupportTicket: (ticketId: string, payload: { message: string; isInternal?: boolean }) => {
    if (payload.isInternal) {
      return ownerRequest<any>(`/api/owner/crm/support/${ticketId}/internal-note`, {
        method: 'POST',
        body: JSON.stringify({ message: payload.message }),
      });
    }
    return ownerRequest<any>(`/api/owner/crm/support/${ticketId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message: payload.message }),
    });
  },
  addInternalNote: (ticketId: string, message: string) =>
    ownerRequest<any>(`/api/owner/crm/support/${ticketId}/internal-note`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
  updateTicketStatus: (ticketId: string, status: string) =>
    ownerRequest<any>(`/api/owner/crm/support/${ticketId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  updateSupportTicket: (ticketId: string, updates: { status?: string }) =>
    ownerRequest<any>(`/api/owner/crm/support/${ticketId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: updates.status }),
    }),

  // Reviews Moderation
  getReviews: () => ownerRequest<any[]>('/api/owner/crm/reviews'),
  updateReviewStatus: (reviewId: string, productId: string, status: 'approved' | 'pending' | 'rejected') =>
    ownerRequest<{ success: boolean; status: string }>(`/api/owner/crm/reviews/${reviewId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ productId, status }),
    }),
  moderateReview: (reviewId: string, status: 'approved' | 'pending' | 'rejected' | 'hidden', productId?: string) =>
    ownerRequest<{ success: boolean; status: string }>(`/api/owner/crm/reviews/${reviewId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ productId, status: status === 'hidden' ? 'pending' : status }),
    }),

  // Notifications
  getNotifications: () => ownerRequest<any[]>('/api/owner/crm/notifications'),
  broadcastNotification: (data: { title: string; message: string; type?: string; userId?: string }) =>
    ownerRequest<any>('/api/owner/crm/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  sendNotification: (data: { title: string; message: string; audience?: string; type?: string }) =>
    ownerRequest<any>('/api/owner/crm/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Campaigns
  getCampaigns: () => ownerRequest<CustomerCampaign[]>('/api/owner/crm/campaigns'),
  createCampaign: (data: Partial<CustomerCampaign>) =>
    ownerRequest<CustomerCampaign>('/api/owner/crm/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCampaign: (id: string, updates: Partial<CustomerCampaign>) =>
    ownerRequest<CustomerCampaign>(`/api/owner/crm/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  sendCampaign: (id: string) =>
    ownerRequest<{ success: boolean; campaign: CustomerCampaign }>(`/api/owner/crm/campaigns/${id}/send`, {
      method: 'POST',
    }),
};

// ==========================================
// --- WORKSHOP OPERATIONS API CLIENT ---
// ==========================================

export interface OperationsDashboardStats {
  pendingFulfilment: number;
  readyToDispatch: number;
  lowStockAlerts: SoapProduct[];
  curingBatchesCount: number;
  readyBatchesCount: number;
  recentOrders: Order[];
}

export const operationsApi = {
  getDashboard: () => ownerRequest<OperationsDashboardStats>('/api/owner/operations/dashboard'),
  
  // Orders & Fulfilment
  getOrders: () => ownerRequest<Order[]>('/api/owner/operations/orders'),
  updateOrderStatus: (
    orderId: string,
    status: string,
    trackingNumber?: string,
    notes?: string,
    carrier?: string
  ) =>
    ownerRequest<Order>(`/api/owner/operations/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, trackingNumber, notes, carrier }),
    }),
  updateOrderNotes: (orderId: string, notes: string) =>
    ownerRequest<Order>(`/api/owner/operations/orders/${orderId}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    }),

  // Inventory
  getInventory: () => ownerRequest<{ soaps: SoapProduct[]; gifts: any[] }>('/api/owner/operations/inventory'),
  adjustInventory: (params: {
    soapId?: string;
    giftItemId?: string;
    quantityChange: number;
    movementType: 'restock' | 'damage' | 'waste' | 'manual_adjustment';
    reason?: string;
  }) =>
    ownerRequest<{ success: boolean }>('/api/owner/operations/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  // Curing Rack
  getCuringBatches: () => ownerRequest<CuringBatch[]>('/api/owner/operations/curing'),
  createCuringBatch: (data: Partial<CuringBatch>) =>
    ownerRequest<CuringBatch>('/api/owner/operations/curing', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCuringBatchStatus: (id: string, status: CuringBatch['status']) =>
    ownerRequest<CuringBatch>(`/api/owner/operations/curing/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // Dispatch
  getDispatchData: () => ownerRequest<{ readyOrders: Order[]; dispatchedRecent: Order[] }>('/api/owner/operations/dispatch'),
  assignDispatch: (orderId: string, data: { carrier: string; trackingNumber: string; trackingUrl?: string; notes?: string }) =>
    ownerRequest<Order>(`/api/owner/operations/dispatch/${orderId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Invoices
  getInvoices: () => ownerRequest<Order[]>('/api/owner/operations/invoices'),
  getInvoiceDetails: (orderId: string) =>
    ownerRequest<{ order: Order; businessDetails: any }>(`/api/owner/operations/invoices/${orderId}`),

  // Reports
  getReports: (startDate?: string, endDate?: string) => {
    const qs = new URLSearchParams();
    if (startDate) qs.append('startDate', startDate);
    if (endDate) qs.append('endDate', endDate);
    return ownerRequest<RevenueSummary>(`/api/owner/operations/reports?${qs.toString()}`);
  },
  getMonthlyReport: (year: number, month: number) =>
    ownerRequest<any>(`/api/owner/operations/reports/monthly?year=${year}&month=${month}`),
  exportCSVUrl: (startDate?: string, endDate?: string) => {
    const qs = new URLSearchParams();
    if (startDate) qs.append('startDate', startDate);
    if (endDate) qs.append('endDate', endDate);
    const token = getOwnerToken();
    if (token) qs.append('token', token);
    return `/api/owner/operations/reports/export?${qs.toString()}`;
  },

  // Audit Logs
  getAuditLogs: () => ownerRequest<AuditLog[]>('/api/owner/audit-logs'),
};
