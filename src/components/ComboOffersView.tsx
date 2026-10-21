import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Package,
  CheckCircle,
  Tag,
  Clock,
  Gift,
  Plus,
} from 'lucide-react';
import { ComboOffer, formatPriceINR } from '../types';

export const ComboOffersView: React.FC = () => {
  const {
    offers,
    products,
    addToCart,
    setIsCartOpen,
    showNotification,
    setCurrentView,
  } = useStore();

  const activeOffers = (offers || []).filter((o) => {
    if (!o.isActive) return false;
    const now = new Date().toISOString();
    if (o.startsAt && o.startsAt > now) return false;
    if (o.endsAt && o.endsAt < now) return false;
    return true;
  });

  const handleAddComboToCart = (offer: ComboOffer) => {
    if (!offer.includedSoaps || offer.includedSoaps.length === 0) {
      showNotification('This offer has no specified soap products.', 'alert');
      return;
    }

    let itemsAdded = 0;
    offer.includedSoaps.forEach((item) => {
      const prod = products.find((p) => p.id === item.soapId);
      if (prod) {
        addToCart(prod, item.quantity || 1);
        itemsAdded += item.quantity || 1;
      }
    });

    if (itemsAdded > 0) {
      showNotification(`Added "${offer.title}" (${itemsAdded} bars) to your cart!`, 'success');
      setIsCartOpen(true);
    } else {
      showNotification('Items in this combo are currently being cured / out of stock.', 'alert');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 animate-fade-in">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Curated Soap Bundles &amp; Value Packs</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900">
          Handcrafted Combo Offers
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Enjoy special artisanal bundles crafted by sole proprietor R. Niranjana. Pair complementary botanical formulations for deep skin nourishment and special savings.
        </p>
      </div>

      {/* Offers Grid */}
      {activeOffers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {activeOffers.map((offer) => {
            const hasIncluded = offer.includedSoaps && offer.includedSoaps.length > 0;
            return (
              <div
                key={offer.id}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Banner / Badge */}
                  <div className="relative bg-[#244635] text-white p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9B98B] bg-[#1a3327] px-2.5 py-0.5 rounded-full border border-[#356149]">
                        {offer.offerType === 'fixed_price'
                          ? 'Special Price Bundle'
                          : offer.offerType === 'percentage_discount'
                          ? `${offer.discountPercentage}% Discount`
                          : offer.offerType === 'fixed_discount'
                          ? `Flat ${formatPriceINR(offer.discountAmount || 0)} Off`
                          : 'Quantity Reward'}
                      </span>
                      {offer.endsAt && (
                        <span className="text-[10px] text-stone-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#D9B98B]" />
                          <span>Ends {new Date(offer.endsAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-xl text-[#F4F0E5] leading-tight">
                      {offer.title}
                    </h3>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4 text-xs">
                    <p className="text-stone-600 leading-relaxed">
                      {offer.description || 'Specially selected artisan cold-process soap bars curated for balanced skin care.'}
                    </p>

                    {/* Pricing Highlight */}
                    <div className="p-4 bg-[#FAF7EF] rounded-2xl border border-[#ded4bf]">
                      {offer.offerType === 'fixed_price' && (
                        <div className="flex items-baseline justify-between">
                          <span className="text-stone-600 font-medium">Combo Price:</span>
                          <span className="text-2xl font-bold font-serif text-[#244635]">
                            {formatPriceINR(offer.comboPrice || 0)}
                          </span>
                        </div>
                      )}
                      {offer.offerType === 'percentage_discount' && (
                        <div className="flex items-baseline justify-between">
                          <span className="text-stone-600 font-medium">Bundle Savings:</span>
                          <span className="text-2xl font-bold text-blue-800">
                            {offer.discountPercentage}% OFF
                          </span>
                        </div>
                      )}
                      {offer.offerType === 'fixed_discount' && (
                        <div className="flex items-baseline justify-between">
                          <span className="text-stone-600 font-medium">Instant Discount:</span>
                          <span className="text-2xl font-bold text-amber-800">
                            {formatPriceINR(offer.discountAmount || 0)} OFF
                          </span>
                        </div>
                      )}
                      {offer.offerType === 'buy_x_get_y' && (
                        <div className="flex items-baseline justify-between">
                          <span className="text-stone-600 font-medium">Exclusive Reward:</span>
                          <span className="text-base font-bold text-purple-800">
                            Buy {offer.minimumQuantity} Soaps, Get {offer.rewardQuantity || 1} Free
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Included Soaps List */}
                    {hasIncluded && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                          Included in this pack:
                        </span>
                        <div className="space-y-2">
                          {offer.includedSoaps.map((it, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200"
                            >
                              <div className="flex items-center gap-2">
                                <Package className="w-3.5 h-3.5 text-[#244635]" />
                                <span className="font-semibold text-stone-800">
                                  {it.soapName || it.soapId}
                                </span>
                              </div>
                              <span className="font-bold text-stone-700 bg-white px-2 py-0.5 rounded border border-stone-200">
                                x{it.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {offer.terms && (
                      <p className="text-[10px] text-stone-400 italic pt-1">
                        * {offer.terms}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleAddComboToCart(offer)}
                    className="w-full py-3 bg-[#244635] hover:bg-[#1b3427] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 group-hover:bg-[#183023]"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#D9B98B]" />
                    <span>Add Combo to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 sm:p-16 text-center max-w-xl mx-auto shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 mx-auto flex items-center justify-center">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-900">
            Fresh combo offers are currently being prepared
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Our artisan maker R. Niranjana is curating new seasonal bundles. In the meantime, browse our individual small-batch soaps.
          </p>
          <button
            onClick={() => setCurrentView('shop')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#244635] hover:bg-[#1b3427] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Explore All Soaps</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
