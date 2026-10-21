import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ShopView } from './components/ShopView';
import { CartView } from './components/CartView';
import { CustomerOrdersView } from './components/CustomerOrdersView';
import { AccountView } from './components/AccountView';
import { OwnerWorkspace } from './components/owner/OwnerWorkspace';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ComboOffersView } from './components/ComboOffersView';
import { Footer } from './components/Footer';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const StoreContent: React.FC = () => {
  const { currentView, notification } = useStore();
  const isOwnerWorkspace = currentView === 'admin' || currentView === 'owner';

  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#223522] flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div
            className={`flex items-center gap-2.5 py-3 px-4 rounded-xl shadow-2xl border text-xs font-bold ${
              notification.type === 'success'
                ? 'bg-[#1b341c] text-white border-emerald-500'
                : notification.type === 'alert'
                ? 'bg-amber-500 text-[#172b18] border-amber-300'
                : 'bg-[#29422a] text-white border-emerald-400'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : notification.type === 'alert' ? (
              <AlertCircle className="w-4 h-4 text-[#172b18]" />
            ) : (
              <Info className="w-4 h-4 text-emerald-300" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Navbar (Hidden on Owner Workspace) */}
      {!isOwnerWorkspace && <Navbar />}

      {/* Main View Router */}
      <main className="flex-1">
        {isOwnerWorkspace ? (
          <OwnerWorkspace />
        ) : currentView === 'home' ? (
          <HomeView />
        ) : currentView === 'shop' || (currentView as string) === 'store' ? (
          <ShopView />
        ) : currentView === 'combos' || (currentView as string) === 'combo-offers' ? (
          <ComboOffersView />
        ) : currentView === 'orders' || (currentView as string) === 'orders-history' ? (
          <CustomerOrdersView />
        ) : currentView === 'cart' ? (
          <CartView />
        ) : currentView === 'account' || (currentView as string) === 'profile' ? (
          <AccountView />
        ) : (
          <HomeView />
        )}
      </main>

      {/* Footer (Rendered on all customer views, not on owner workspace) */}
      {!isOwnerWorkspace && <Footer />}

      {/* Global Modals & Drawers */}
      <ProductModal />
      <CartDrawer />
      <AuthModal />
      <CheckoutModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
