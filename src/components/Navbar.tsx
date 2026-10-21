import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Package,
  ShieldCheck,
  MapPin,
  ChevronDown,
  X,
  Sparkles,
  LogOut,
  Bell,
  Check,
  Tag,
  Crown,
  Home,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { useStore, StoreView } from '../context/StoreContext';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    wishlist,
    currentUser,
    isOwner,
    openCustomerLogin,
    openOwnerLogin,
    logoutUser,
    currentView,
    setCurrentView,
    filters,
    setFilters,
    orders,
    categories,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    recentSearches,
    addRecentSearch,
  } = useStore();

  const [selectedSearchCategory, setSelectedSearchCategory] = useState<string>('all');
  const [searchInput, setSearchInput] = useState<string>(filters.searchQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);

  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Pending orders count for proprietor badge
  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === 'Pending Review' || o.orderStatus === 'PLACED'
  ).length;

  // Search suggestions live query
  useEffect(() => {
    if (!searchInput.trim()) {
      setSearchSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchInput.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchSuggestions(data.suggestions || []);
        }
      } catch {
        // silent fallback
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Click outside to close search popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (queryToUse?: string) => {
    const q = queryToUse !== undefined ? queryToUse : searchInput;
    if (q.trim()) {
      addRecentSearch(q.trim());
    }

    setFilters((prev) => ({
      ...prev,
      searchQuery: q,
      selectedCategories: selectedSearchCategory !== 'all' ? [selectedSearchCategory] : [],
    }));

    setIsSearchFocused(false);
    setCurrentView('shop');
  };

  const handleCategoryClick = (catName: string | 'all') => {
    if (catName === 'all') {
      setFilters((prev) => ({
        ...prev,
        selectedCategories: [],
        newReleasesOnly: false,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        selectedCategories: [catName],
        newReleasesOnly: false,
      }));
    }
    setCurrentView('shop');
  };

  const handleNewReleasesClick = () => {
    setFilters((prev) => ({
      ...prev,
      newReleasesOnly: true,
      selectedCategories: [],
    }));
    setCurrentView('shop');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#1c2e1d] text-[#f7f5ed] shadow-md border-b border-[#2d462f]">
      {/* Top Announcement Bar & Sole Proprietor Switcher */}
      <div className="bg-[#28432a] text-[#d6e5d4] text-xs py-1.5 px-4 font-medium border-b border-[#355737] flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Cold-Process Handcrafted Artisanal Soaps</span>
        </div>
        <div className="flex-1 text-center font-medium">
          🌿 <span className="font-semibold text-white">Free Pan-India Delivery</span> on orders over ₹799 | Small Batch Cured 42 Days
        </div>
        <div className="flex items-center gap-3 text-xs text-[#cfdecb]">
          {isOwner ? (
            <div className="flex items-center gap-2">
              <span className="text-amber-300 font-bold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Thiru Kailash</span>
              </span>
              <button
                onClick={() => setCurrentView(currentView === 'owner' || currentView === 'admin' ? 'home' : 'owner')}
                className="bg-amber-500 hover:bg-amber-400 text-[#172b18] px-2.5 py-0.5 rounded font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{currentView === 'owner' || currentView === 'admin' ? 'View Storefront' : 'Owner Workspace'}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentView('owner')}
              className="hover:text-amber-300 text-amber-200/90 font-semibold underline underline-offset-2 flex items-center gap-1 bg-[#1c331d] px-2 py-0.5 rounded border border-[#3e603e] cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Sole Proprietor Portal</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <button
          id="brand-logo-btn"
          onClick={() => {
            setCurrentView('home');
            setFilters((prev) => ({ ...prev, searchQuery: '', selectedCategories: [], newReleasesOnly: false }));
          }}
          className="flex items-center gap-2.5 text-left focus:outline-none rounded-lg p-1 group cursor-pointer"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#faf7ef] rounded-full p-1 shadow-md flex-shrink-0 flex items-center justify-center overflow-hidden border border-amber-400/40">
            <img
              src="/logo.svg"
              alt="Lumina Homemade Soaps Logo"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif tracking-widest text-lg sm:text-xl font-bold text-[#faf7ef] leading-tight group-hover:text-amber-300 transition-colors">
              LUMINA SOAPS
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#9fc29b] font-medium">
              Nature in Every Lather. • ₹ INR
            </span>
          </div>
        </button>

        {/* Deliver-To indicator */}
        <div
          onClick={() => {
            if (currentUser) setCurrentView('account');
            else openCustomerLogin();
          }}
          className="hidden xl:flex items-center gap-1.5 text-xs text-[#cfdecb] px-2 py-1 hover:border hover:border-[#4f774e] rounded cursor-pointer transition-all"
        >
          <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] text-[#9fc29b]">Deliver to</span>
            <span className="font-semibold text-white truncate max-w-[110px]">
              {currentUser?.address?.city || 'India'}
            </span>
          </div>
        </div>

        {/* Search Bar with live suggestions */}
        <div ref={searchBoxRef} className="relative flex-1 max-w-xl mx-1 sm:mx-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit();
            }}
            className="flex items-center rounded-lg overflow-hidden shadow-inner bg-white"
          >
            {/* Category select dropdown */}
            <div className="hidden md:block relative bg-[#f1efe6] border-r border-[#dedad0]">
              <select
                value={selectedSearchCategory}
                onChange={(e) => setSelectedSearchCategory(e.target.value)}
                className="appearance-none bg-transparent text-xs text-[#2b3d2b] font-medium py-2.5 pl-3 pr-7 focus:outline-none cursor-pointer"
              >
                <option value="all">All Soaps</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#5e775d] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                value={searchInput}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search botanical soaps, ingredients (neem, honey, lavender)..."
                className="w-full py-2 px-3 text-xs sm:text-sm text-[#1e2e1e] placeholder-[#7d947b] focus:outline-none"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setFilters((prev) => ({ ...prev, searchQuery: '' }));
                  }}
                  className="p-1 mr-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              aria-label="Search soaps"
              className="bg-[#c8923a] hover:bg-[#b5802c] text-[#1a2e1b] px-4 py-2.5 transition-colors flex items-center justify-center font-bold cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Search suggestions dropdown */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white text-[#1c2e1d] rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in duration-100">
              {searchSuggestions.length > 0 ? (
                <div>
                  <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Suggestions
                  </div>
                  {searchSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSearchInput(sug);
                        handleSearchSubmit(sug);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#f3efe6] flex items-center gap-2 text-gray-700"
                    >
                      <Search className="w-3.5 h-3.5 text-gray-400" />
                      <span>{sug}</span>
                    </button>
                  ))}
                </div>
              ) : recentSearches.length > 0 ? (
                <div>
                  <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Trending & Recent Searches
                  </div>
                  {recentSearches.map((rec, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSearchInput(rec);
                        handleSearchSubmit(rec);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#f3efe6] flex items-center gap-2 text-gray-700"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{rec}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Right Navigation Icons & Account */}
        <div className="flex items-center gap-1 sm:gap-2 text-sm">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
              className="relative p-2 text-[#d1e2cf] hover:text-white rounded transition-colors"
              title="Studio & Order Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {isNotifMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-72 sm:w-80 bg-white text-[#243524] rounded-2xl shadow-2xl border border-[#dedad0] py-2 z-50 animate-in fade-in"
                onMouseLeave={() => setIsNotifMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1c2e1d]">Studio Alerts</span>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[10px] text-[#8b5a2b] hover:underline font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-xs text-gray-400 text-center">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.orderId) setCurrentView('orders');
                          setIsNotifMenuOpen(false);
                        }}
                        className={`p-3 text-xs cursor-pointer hover:bg-gray-50 transition-colors ${
                          !n.read ? 'bg-amber-50/60' : ''
                        }`}
                      >
                        <p className="font-bold text-[#1c2e1d]">{n.title}</p>
                        <p className="text-gray-600 mt-0.5 line-clamp-2">{n.message}</p>
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          {new Date(n.createdAt || n.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={() => {
              if (currentUser) {
                setCurrentView('account');
              } else {
                openCustomerLogin();
              }
            }}
            className="relative p-2 text-[#d1e2cf] hover:text-white rounded transition-colors hidden sm:block"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Account Button */}
          <div className="relative">
            <button
              id="user-account-btn"
              onClick={() => {
                if (!currentUser) {
                  openCustomerLogin('login');
                } else {
                  setIsAccountMenuOpen(!isAccountMenuOpen);
                }
              }}
              className="flex items-center gap-1.5 px-2 py-1 hover:border hover:border-[#4f774e] rounded transition-all text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#2a452c] flex items-center justify-center text-amber-300 border border-[#3e6640]">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden lg:flex flex-col text-left leading-tight">
                <span className="text-[10px] text-[#9fc29b]">
                  {currentUser ? 'Namaste,' : 'Customer'}
                </span>
                <span className="font-semibold text-xs text-white flex items-center gap-0.5">
                  {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
                  <ChevronDown className="w-3 h-3 text-[#9fc29b]" />
                </span>
              </div>
            </button>

            {/* Account Popover Menu */}
            {currentUser && isAccountMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white text-[#243524] rounded-xl shadow-2xl border border-[#dedad0] py-2 z-50 animate-in fade-in duration-150"
                onMouseLeave={() => setIsAccountMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-gray-100 bg-[#fbf9f4]">
                  <p className="text-xs text-gray-500">
                    {currentUser.role === 'owner' ? 'Artisan Sole Proprietor' : 'Lumina Customer'}
                  </p>
                  <p className="text-sm font-bold text-[#1e341f] truncate">{currentUser.name}</p>
                  <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                </div>

                <div className="py-1 text-xs">
                  {currentUser.role === 'owner' ? (
                    <button
                      onClick={() => {
                        setCurrentView('owner');
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#f2f6f1] flex items-center gap-2.5 text-amber-900 font-bold"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>Sole Proprietor Workspace</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setCurrentView('orders');
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#f2f6f1] flex items-center gap-2.5 text-gray-700 font-semibold"
                      >
                        <Package className="w-4 h-4 text-[#3c643b]" />
                        <span>My Orders ({orders.length})</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView('account');
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#f2f6f1] flex items-center gap-2.5 text-gray-700 font-semibold"
                      >
                        <User className="w-4 h-4 text-[#3c643b]" />
                        <span>Manage Profile & Addresses</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-1 mt-1">
                  <button
                    onClick={() => {
                      logoutUser();
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon & Trigger */}
          <button
            id="nav-cart-trigger"
            onClick={() => {
              // Open full cart view or toggle drawer
              setCurrentView('cart');
            }}
            className="relative flex items-center gap-1.5 px-3 py-1.5 bg-[#28432a] hover:bg-[#325635] text-white rounded-lg transition-all border border-[#3e6640] cursor-pointer"
            aria-label="Shopping Basket"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-amber-300" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 w-5 h-5 bg-[#c8923a] text-[#182a1a] text-xs font-black rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold">Basket</span>
          </button>

          {/* Owner Portal Link (Opens in Separate Tab) */}
          <a
            id="nav-owner-portal-link"
            href="/?view=admin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1b311c] hover:bg-[#254228] text-amber-300 hover:text-amber-200 text-xs font-semibold rounded-lg border border-amber-500/40 transition-all cursor-pointer shadow-xs"
            title="Open Sole Proprietor Owner Portal in separate tab"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Owner Portal</span>
            <ExternalLink className="w-3 h-3 text-amber-400/80" />
          </a>
        </div>
      </div>

      {/* Main Sections Navigation Tab Bar: HOME | SHOP | ORDERS | CART | ACCOUNT */}
      <nav className="bg-[#142215] border-t border-[#253d26] px-4 sm:px-6 py-1 flex items-center justify-between overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 sm:gap-4 text-xs font-bold whitespace-nowrap">
          <button
            id="nav-tab-home"
            onClick={() => setCurrentView('home')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'home'
                ? 'bg-[#375a39] text-amber-300 shadow-xs'
                : 'text-[#d1e0d0] hover:bg-[#203622]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>HOME</span>
          </button>

          <button
            id="nav-tab-shop"
            onClick={() => setCurrentView('shop')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'shop'
                ? 'bg-[#375a39] text-amber-300 shadow-xs'
                : 'text-[#d1e0d0] hover:bg-[#203622]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>SHOP</span>
          </button>

          <button
            id="nav-tab-combos"
            onClick={() => setCurrentView('combos')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'combos' || (currentView as string) === 'combo-offers'
                ? 'bg-[#375a39] text-amber-300 shadow-xs'
                : 'text-[#d1e0d0] hover:bg-[#203622]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>COMBO OFFERS</span>
          </button>

          <button
            id="nav-tab-orders"
            onClick={() => {
              if (!currentUser) openCustomerLogin('login');
              else setCurrentView('orders');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'orders'
                ? 'bg-[#375a39] text-amber-300 shadow-xs'
                : 'text-[#d1e0d0] hover:bg-[#203622]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>ORDERS</span>
            {orders.length > 0 && currentUser && (
              <span className="text-[10px] px-1.5 py-0.2 bg-[#28432a] text-amber-200 rounded-full">
                {orders.length}
              </span>
            )}
          </button>

          <button
            id="nav-tab-cart"
            onClick={() => setCurrentView('cart')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'cart'
                ? 'bg-[#375a39] text-amber-300 shadow-xs'
                : 'text-[#d1e0d0] hover:bg-[#203622]'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>CART</span>
            {cartCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-400 text-[#142215] font-black rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-account"
            onClick={() => {
              if (!currentUser) openCustomerLogin('login');
              else setCurrentView('account');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'account'
                ? 'bg-[#375a39] text-amber-300 shadow-xs'
                : 'text-[#d1e0d0] hover:bg-[#203622]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>ACCOUNT</span>
          </button>

          {isOwner && (
            <button
              id="nav-tab-admin"
              onClick={() => setCurrentView('owner')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'owner' || currentView === 'admin'
                  ? 'bg-amber-500 text-[#172b18] shadow-xs'
                  : 'text-amber-300 hover:bg-[#203622]'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>OWNER WORKSPACE</span>
              {pendingOrdersCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 bg-red-600 text-white rounded-full font-bold">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Quick New Releases filter pill */}
        <button
          onClick={handleNewReleasesClick}
          className="hidden md:flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-bold px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>✨ New Releases Showcase</span>
        </button>
      </nav>
    </header>
  );
};
