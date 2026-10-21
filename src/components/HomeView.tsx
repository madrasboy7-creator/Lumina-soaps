import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Truck,
  Leaf,
  Package,
  Gift,
  ShoppingBag,
  Info,
} from 'lucide-react';
import { formatPriceINR } from '../types';

export const HomeView: React.FC = () => {
  const {
    products,
    offers,
    categories,
    companySettings,
    setCurrentView,
    setFilters,
    addToCart,
    setIsCartOpen,
    showNotification,
  } = useStore();

  const publishedProducts = products.filter(
    (p) => p.isPublished !== false && p.status !== 'draft' && p.status !== 'archived'
  );

  const activeOffers = (offers || []).filter((o) => {
    if (!o.isActive) return false;
    const now = new Date().toISOString();
    if (o.startsAt && o.startsAt > now) return false;
    if (o.endsAt && o.endsAt < now) return false;
    return true;
  });

  const featuredProducts = publishedProducts.filter((p) => p.isFeatured || p.featured).slice(0, 4);
  const bestSellers = publishedProducts.filter((p) => p.isBestSeller).slice(0, 4);

  const handleCategorySelect = (categoryName: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategories: [categoryName],
      newReleasesOnly: false,
      searchQuery: '',
    }));
    setCurrentView('shop');
  };

  const handleAddComboToCart = (offer: any) => {
    if (!offer.includedSoaps || offer.includedSoaps.length === 0) {
      showNotification('This combo has no assigned products yet.', 'alert');
      return;
    }
    let added = 0;
    offer.includedSoaps.forEach((it: any) => {
      const prod = products.find((p) => p.id === it.soapId);
      if (prod) {
        addToCart(prod, it.quantity || 1);
        added += it.quantity || 1;
      }
    });
    if (added > 0) {
      showNotification(`Added "${offer.title}" to cart!`, 'success');
      setIsCartOpen(true);
    } else {
      showNotification('Selected combo soaps are currently not in stock.', 'alert');
    }
  };

  return (
    <div className="w-full flex flex-col space-y-12 sm:space-y-16 pb-16 animate-fade-in">
      {/* 1. HERO BANNER */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[380px] sm:min-h-[460px] flex items-center bg-[#1c2e1d] text-white">
          {/* Background image overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1607006311820-d15873f8425b?auto=format&fit=crop&w=1600&q=80"
              alt="Handcrafted Cold Process Soap Studio"
              className="w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#172718] via-[#1c2e1d]/85 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-12 md:p-16 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Small-Batch Cold Process Soapery</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-[#FAF7EF] leading-tight">
              {companySettings.tagline || 'Nature in Every Lather.'}
            </h1>

            <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-light">
              Pure botanical cold-process soaps formulated by sole proprietor {companySettings.ownerName || 'R. Niranjana'}. Handcrafted in small batches with food-grade plant oils, unrefined butters, and wild herbs cured for over 42 days on solid cedar drying racks.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentView('shop')}
                className="px-6 py-3 rounded-xl bg-[#D9B98B] hover:bg-[#c9a775] text-[#1c2e1d] font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Shop All Soaps</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {activeOffers.length > 0 && (
                <button
                  onClick={() => setCurrentView('combos')}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7EF] font-semibold text-xs tracking-wider border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#D9B98B]" />
                  <span>View Combo Offers</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Value Prop Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[
            { icon: Leaf, title: '100% Plant Oils', description: 'Zero sulfates, parabens, SLS' },
            { icon: Award, title: '42-Day Cedar Cured', description: 'Dense, long-lasting artisan bar' },
            { icon: Truck, title: `Free Delivery > ₹${companySettings.freeShippingThreshold || 999}`, description: 'Pan-India express courier' },
            { icon: ShieldCheck, title: 'Sole Proprietor', description: 'Handcrafted by R. Niranjana' },
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="bg-white border border-[#e8e4d8] rounded-xl p-3.5 flex items-center gap-3 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#244635] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1e341f]">{pillar.title}</p>
                  <p className="text-[11px] text-stone-500">{pillar.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. IF CATALOGUE IS EMPTY: SHOW REQUIRED EMPTY STATE */}
      {publishedProducts.length === 0 ? (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6 text-center">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#ded4bf] shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF7EF] border border-[#ded4bf] text-[#244635] mx-auto flex items-center justify-center shadow-xs">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c2e1d]">
              Our soap collection is getting ready. Please check back soon.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
              Every bar of Lumina Soap is handcrafted in small batches using traditional cold-process saponification and slowly seasoned for over 42 days on solid cedar curing racks. We never rush our craft.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <Info className="w-3.5 h-3.5" />
                <span>Small batch cure in progress • Sole Proprietor R. Niranjana</span>
              </span>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* 3. CATEGORY NAVIGATION GRID (Only shown when categories have published soaps) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8b5a2b]">
                  Botanical Formulations
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c2e1d]">
                  Shop by Category
                </h2>
              </div>
              <button
                onClick={() => {
                  setFilters((prev) => ({ ...prev, selectedCategories: [] }));
                  setCurrentView('shop');
                }}
                className="text-xs sm:text-sm font-semibold text-[#8b5a2b] hover:text-[#6f451f] flex items-center gap-1 group"
              >
                <span>View All Soaps</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {categories.map((cat) => {
                const count = publishedProducts.filter(
                  (p) => p.category.toLowerCase() === cat.name.toLowerCase()
                ).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.name)}
                    className="group text-left bg-white border border-[#e5e1d5] hover:border-[#8b5a2b] rounded-2xl p-3.5 transition-all hover:shadow-md hover:-translate-y-1 flex flex-col justify-between"
                  >
                    <div className="aspect-square w-full rounded-xl overflow-hidden mb-3 bg-[#f5f3ec]">
                      <img
                        src={cat.imageUrl || cat.image || '/logo.svg'}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#1c2e1d] group-hover:text-[#8b5a2b] transition-colors leading-tight mb-1">
                        {cat.name}
                      </h3>
                      <span className="text-[11px] text-gray-500">
                        {count} {count === 1 ? 'Soap' : 'Soaps'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 4. FEATURED PRODUCTS (Automatically hidden if 0 featured) */}
          {featuredProducts.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8b5a2b]">
                    Artisan Picks
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c2e1d]">
                    Featured Artisan Soaps
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="text-xs sm:text-sm font-semibold text-[#8b5a2b] hover:text-[#6f451f] flex items-center gap-1 group"
                >
                  <span>Explore Store</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* 5. BEST SELLERS (Automatically hidden if 0 bestsellers) */}
          {bestSellers.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8b5a2b]">
                    Customer Favorites
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c2e1d]">
                    Best Sellers
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, sortBy: 'bestselling' }));
                    setCurrentView('shop');
                  }}
                  className="text-xs sm:text-sm font-semibold text-[#8b5a2b] hover:text-[#6f451f] flex items-center gap-1 group"
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {bestSellers.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* 6. PUBLISHED COMBO OFFERS (Automatically hidden if 0 active offers) */}
      {activeOffers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8b5a2b]">
                Special Promotions
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c2e1d]">
                Active Combo Offers
              </h2>
            </div>
            <button
              onClick={() => setCurrentView('combos')}
              className="text-xs sm:text-sm font-semibold text-[#8b5a2b] hover:text-[#6f451f] flex items-center gap-1 group"
            >
              <span>View All Combos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOffers.slice(0, 3).map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
                      {offer.offerType.replace(/_/g, ' ')}
                    </span>
                    {offer.comboPrice && (
                      <span className="font-bold text-lg text-[#244635] font-serif">
                        {formatPriceINR(offer.comboPrice)}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-lg text-stone-900 leading-snug">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                    {offer.description}
                  </p>

                  {offer.includedSoaps && offer.includedSoaps.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap gap-1.5">
                      {offer.includedSoaps.map((it: any, idx: number) => (
                        <span key={idx} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                          {it.soapName || it.soapId} (x{it.quantity})
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleAddComboToCart(offer)}
                  className="mt-4 w-full py-2.5 bg-[#244635] hover:bg-[#1b3427] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#D9B98B]" />
                  <span>Add Combo to Basket</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. COMPANY STORY & SOLE PROPRIETOR TRUST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#1c2e1d] rounded-3xl p-8 sm:p-12 text-[#faf7ef] shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-400/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Sole Proprietorship Craft</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-bold leading-tight text-white">
              Hand-Poured by {companySettings.ownerName || 'R. Niranjana'}
            </h2>

            <p className="text-sm sm:text-base text-[#d2ded1] leading-relaxed">
              {companySettings.aboutText ||
                '"Lumina Soaps is not an industrial factory or mass reseller. Every single soap batch is formulated with raw botanical oils, pure plant butters, and therapeutic botanicals, cured for 42 days on solid cedar racks. We celebrate nature in every lather."'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#314a33]">
              <div>
                <p className="text-xs text-[#9fc29b]">Maker &amp; Proprietor</p>
                <p className="text-base font-bold text-white">{companySettings.ownerName || 'R. Niranjana'}</p>
                <p className="text-xs text-amber-300">{companySettings.studioAddress || 'Coimbatore, India'}</p>
              </div>
              <div>
                <p className="text-xs text-[#9fc29b]">Direct Contact</p>
                <p className="text-sm font-semibold text-white">{companySettings.email || 'niranjana@luminasoaps.com'}</p>
                <p className="text-xs text-gray-400">Personal Support</p>
              </div>
              <div>
                <p className="text-xs text-[#9fc29b]">Aged Seasoning</p>
                <p className="text-base font-bold text-white">42 Days on Cedar</p>
                <p className="text-xs text-[#9fc29b]">Pure Cold Process</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
