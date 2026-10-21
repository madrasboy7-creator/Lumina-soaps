import React, { useState, useEffect } from 'react';
import {
  Lock,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Store,
  Sparkles,
  KeyRound,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OwnerSection, OrderStatus, SoapProduct, ComboOffer, StoreSettings } from '../../types';

// Shell
import { OwnerSidebar } from './OwnerSidebar';
import { OwnerTopbar } from './OwnerTopbar';

// The 6 Main Core Sections
import { DashboardSection } from './sections/DashboardSection';
import { OrdersSection } from './sections/OrdersSection';
import { ProductsSection } from './sections/ProductsSection';
import { ComboOffersSection } from './sections/ComboOffersSection';
import { MonthlyRevenueSection } from './sections/MonthlyRevenueSection';
import { SettingsSection } from './sections/SettingsSection';

export const OwnerWorkspace: React.FC = () => {
  const {
    currentUser,
    ownerToken,
    setCurrentView,
    showNotification,
    companySettings,
    refreshStoreData,
  } = useStore();

  const [currentSection, setCurrentSection] = useState<OwnerSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data states
  const [dashboardStats, setDashboardStats] = useState<any>({
    totalProducts: 0,
    publishedProducts: 0,
    ordersAwaitingProcessing: 0,
    totalOrders: 0,
    currentMonthRevenue: 0,
    activeComboOffers: 0,
    lowStockProducts: 0,
    recentOrders: [],
    pendingOrders: [],
    lowStockAlerts: [],
  });
  const [products, setProducts] = useState<SoapProduct[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [offers, setOffers] = useState<ComboOffer[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(companySettings);
  const [isLoading, setIsLoading] = useState(false);

  // Authentication gate state
  const [isOwnerAuthorized, setIsOwnerAuthorized] = useState<boolean>(false);
  const [ownerEmail, setOwnerEmail] = useState('niranjana@luminasoaps.com');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'setup'>('login');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Verify owner authentication status
  const checkOwnerAuth = async () => {
    const token = localStorage.getItem('lumina_owner_token');
    if (!token) {
      setIsOwnerAuthorized(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/owner/verify', {
        headers: {
          'x-owner-token': token,
        },
      });
      if (res.ok) {
        setIsOwnerAuthorized(true);
      } else {
        localStorage.removeItem('lumina_owner_token');
        setIsOwnerAuthorized(false);
      }
    } catch (e) {
      setIsOwnerAuthorized(false);
    }
  };

  useEffect(() => {
    checkOwnerAuth();
  }, [ownerToken]);

  // Fetch data for the owner portal
  const loadPortalData = async () => {
    const token = localStorage.getItem('lumina_owner_token') || '';
    if (!token) return;

    setIsLoading(true);
    try {
      const headers = { 'x-owner-token': token };

      // Load dashboard, products, orders, offers, categories, settings in parallel
      const [dashRes, prodRes, ordRes, offRes, catRes, setRes] = await Promise.all([
        fetch('/api/owner/dashboard', { headers }),
        fetch('/api/owner/products', { headers }),
        fetch('/api/owner/orders', { headers }),
        fetch('/api/owner/offers', { headers }),
        fetch('/api/categories'),
        fetch('/api/owner/settings', { headers }),
      ]);

      if (dashRes.ok) setDashboardStats(await dashRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
      if (offRes.ok) setOffers(await offRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (setRes.ok) setSettings(await setRes.json());
    } catch (err) {
      console.error('Failed to load owner portal data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOwnerAuthorized) {
      loadPortalData();
    }
  }, [isOwnerAuthorized]);

  // Authentication handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError(null);

    const endpoint = authMode === 'setup' ? '/api/auth/owner/setup' : '/api/auth/owner/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: ownerEmail.trim(),
          password: ownerPassword,
          name: 'R. Niranjana',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.token) {
        localStorage.setItem('lumina_owner_token', data.token);
        setIsOwnerAuthorized(true);
        showNotification(`Welcome to Lumina Soaps Owner Portal, R. Niranjana`, 'success');
        loadPortalData();
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem('lumina_owner_token') || '';
      await fetch('/api/auth/owner/logout', {
        method: 'POST',
        headers: { 'x-owner-token': token },
      });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('lumina_owner_token');
    setIsOwnerAuthorized(false);
    showNotification('Signed out of Owner Portal', 'info');
    setCurrentView('home');
  };

  // Product Operations
  const handleCreateProduct = async (data: Partial<SoapProduct>): Promise<SoapProduct> => {
    const token = localStorage.getItem('lumina_owner_token') || '';
    const res = await fetch('/api/owner/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-owner-token': token,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create product');
    }
    const created = await res.json();
    showNotification(`Soap "${created.name}" created successfully`, 'success');
    loadPortalData();
    refreshStoreData();
    return created;
  };

  const handleUpdateProduct = async (id: string, data: Partial<SoapProduct>): Promise<SoapProduct> => {
    const token = localStorage.getItem('lumina_owner_token') || '';
    const res = await fetch(`/api/owner/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-owner-token': token,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update product');
    }
    const updated = await res.json();
    showNotification(`Soap "${updated.name}" updated`, 'success');
    loadPortalData();
    refreshStoreData();
    return updated;
  };

  const handleDeleteProduct = async (id: string): Promise<void> => {
    const token = localStorage.getItem('lumina_owner_token') || '';
    const res = await fetch(`/api/owner/products/${id}`, {
      method: 'DELETE',
      headers: { 'x-owner-token': token },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete product');
    }
    showNotification('Product removed / archived', 'info');
    loadPortalData();
    refreshStoreData();
  };

  const handleTogglePublish = async (id: string, isPublished: boolean): Promise<void> => {
    const token = localStorage.getItem('lumina_owner_token') || '';
    const res = await fetch(`/api/owner/products/${id}/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-owner-token': token,
      },
      body: JSON.stringify({ isPublished }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update publication status');
    }
    showNotification(isPublished ? 'Product published to customer storefront' : 'Product unpublished (draft mode)', 'info');
    loadPortalData();
    refreshStoreData();
  };

  // Order Operations
  const handleUpdateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    notes?: string,
    carrier?: string
  ): Promise<void> => {
    const token = localStorage.getItem('lumina_owner_token') || '';
    const res = await fetch(`/api/owner/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-owner-token': token,
      },
      body: JSON.stringify({ status, trackingNumber, notes, carrier }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update order status');
    }
    showNotification(`Order status updated to "${status}"`, 'success');
    loadPortalData();
    refreshStoreData();
  };

  // Combo Offer Operations
  const handleCreateOffer = async (data: Partial<ComboOffer>): Promise<ComboOffer> => {
    const token = localStorage.getItem('lumina_owner_token') || '';
    const res = await fetch('/api/owner/offers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-owner-token': token,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create combo offer');
    }
    const created = await res.json();
    showNotification(`Combo offer "${created.title}" created`, 'success');
    loadPortalData();
    refreshStoreData();
    return created;
  };

  const handleUpdateOffer = async (id: string, data: Partial<ComboOffer>): Promise<ComboOffer> => {
    const token = localStorage.getItem('lumina_owner_token') || '';
    const res = await fetch(`/api/owner/offers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-owner-token': token,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update combo offer');
    }
    const updated = await res.json();
    showNotification(`Combo offer "${updated.title}" updated`, 'success');
    loadPortalData();
    refreshStoreData();
    return updated;
  };

  const handleDeleteOffer = async (id: string): Promise<void> => {
    const token = localStorage.getItem('lumina_owner_token') || '';
    const res = await fetch(`/api/owner/offers/${id}`, {
      method: 'DELETE',
      headers: { 'x-owner-token': token },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete combo offer');
    }
    showNotification('Combo offer deleted', 'info');
    loadPortalData();
    refreshStoreData();
  };

  const handleToggleOfferActive = async (id: string): Promise<void> => {
    const token = localStorage.getItem('lumina_owner_token') || '';
    const res = await fetch(`/api/owner/offers/${id}/toggle`, {
      method: 'POST',
      headers: { 'x-owner-token': token },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to toggle offer status');
    }
    showNotification('Combo offer status updated', 'info');
    loadPortalData();
    refreshStoreData();
  };

  // Settings Operations
  const handleUpdateSettings = async (updates: Partial<StoreSettings>): Promise<void> => {
    const token = localStorage.getItem('lumina_owner_token') || '';
    const res = await fetch('/api/owner/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-owner-token': token,
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save store settings');
    }
    const updated = await res.json();
    setSettings(updated);
    showNotification('Store settings saved successfully', 'success');
    loadPortalData();
    refreshStoreData();
  };

  // If not authorized as owner, show dedicated authentication gate for R. Niranjana
  if (!isOwnerAuthorized) {
    return (
      <div className="min-h-screen bg-[#FAF7EF] flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#244635] to-[#1c2e1d] text-[#D9B98B] mx-auto flex items-center justify-center font-serif font-black text-2xl shadow-md">
              L
            </div>
            <h1 className="text-2xl font-serif font-bold text-stone-900">
              Lumina Soaps
            </h1>
            <p className="text-xs text-[#244635] font-semibold tracking-wider uppercase">
              Sole Proprietor Portal (R. Niranjana)
            </p>
            <p className="text-xs text-stone-500">
              {authMode === 'setup'
                ? 'Set up or update your verified sole proprietor credentials.'
                : 'Sign in to manage products, orders, combo offers, and revenue.'}
            </p>
          </div>

          {authError && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Owner Email Address
              </label>
              <input
                type="email"
                required
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="niranjana@luminasoaps.com"
                className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#244635] text-stone-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Owner Password
              </label>
              <input
                type="password"
                required
                value={ownerPassword}
                onChange={(e) => setOwnerPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#244635] text-stone-900"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 bg-[#244635] hover:bg-[#1a3327] text-white rounded-xl font-semibold shadow-md transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {isAuthenticating ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#D9B98B]" />
                  <span>{authMode === 'setup' ? 'Configure & Enter Portal' : 'Sign In as Owner'}</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'setup' : 'login');
                setAuthError(null);
              }}
              className="text-[#244635] font-semibold hover:underline"
            >
              {authMode === 'login' ? 'First time? Setup Account' : 'Back to Sign In'}
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="text-stone-500 hover:text-stone-800"
            >
              Return to Storefront &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#faf8f3] text-stone-800 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <OwnerSidebar
          currentSection={currentSection}
          onSelectSection={(sec) => setCurrentSection(sec)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onViewStorefront={() => setCurrentView('home')}
          onSignOut={handleSignOut}
          pendingOrdersCount={dashboardStats.ordersAwaitingProcessing}
          lowStockCount={dashboardStats.lowStockProducts}
          activeOffersCount={dashboardStats.activeComboOffers}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 h-full z-10 animate-slide-right">
            <OwnerSidebar
              currentSection={currentSection}
              onSelectSection={(sec) => {
                setCurrentSection(sec);
                setMobileMenuOpen(false);
              }}
              isCollapsed={false}
              onToggleCollapse={() => {}}
              onViewStorefront={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              onSignOut={handleSignOut}
              pendingOrdersCount={dashboardStats.ordersAwaitingProcessing}
              lowStockCount={dashboardStats.lowStockProducts}
              activeOffersCount={dashboardStats.activeComboOffers}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <OwnerTopbar
          currentSection={currentSection}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onViewStorefront={() => setCurrentView('home')}
          onSignOut={handleSignOut}
          ownerName={settings.ownerName || 'R. Niranjana'}
          storeName={settings.companyName || 'Lumina Soaps'}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {currentSection === 'dashboard' && (
            <DashboardSection
              stats={dashboardStats}
              onNavigate={(sec) => setCurrentSection(sec)}
              onAddProduct={() => setCurrentSection('products')}
              onCreateOffer={() => setCurrentSection('combos')}
            />
          )}

          {currentSection === 'orders' && (
            <OrdersSection
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
              onRefresh={loadPortalData}
            />
          )}

          {currentSection === 'products' && (
            <ProductsSection
              products={products}
              categories={categories}
              onCreateProduct={handleCreateProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onTogglePublish={handleTogglePublish}
              onRefresh={loadPortalData}
            />
          )}

          {currentSection === 'combos' && (
            <ComboOffersSection
              offers={offers}
              products={products}
              onCreateOffer={handleCreateOffer}
              onUpdateOffer={handleUpdateOffer}
              onDeleteOffer={handleDeleteOffer}
              onToggleActive={handleToggleOfferActive}
              onRefresh={loadPortalData}
            />
          )}

          {currentSection === 'revenue' && (
            <MonthlyRevenueSection />
          )}

          {currentSection === 'settings' && (
            <SettingsSection
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onRefresh={loadPortalData}
            />
          )}
        </main>
      </div>
    </div>
  );
};
