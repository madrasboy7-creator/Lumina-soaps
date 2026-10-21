import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Bookmark,
  Check,
  Truck,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    coupons,
    initiateCheckout,
    saveForLater,
    saveItemForLater,
    moveSavedToCart,
    removeSavedItem,
    setCurrentView,
    companySettings,
    comboOfferProgress,
    unlockedGifts,
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const freeDeliveryThreshold = companySettings.freeShippingThreshold || 999;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');

    const res = await applyCoupon(couponCodeInput.trim());
    setCouponLoading(false);
    if (res.success) {
      setCouponCodeInput('');
    } else {
      setCouponError(res.message);
    }
  };

  if (cart.length === 0 && saveForLater.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <ShoppingBag className="w-10 h-10 text-amber-700" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c2e1d] mb-2">
          Your Shopping Basket is Empty
        </h2>
        <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
          Explore our small-batch cold-process herbal soaps, cured 42 days for rich botanical care.
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-6 py-3.5 bg-[#8b5a2b] hover:bg-[#6f451f] text-white font-bold text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2"
        >
          <span>Explore Artisan Collection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Back button & title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => setCurrentView('shop')}
            className="text-xs text-[#8b5a2b] hover:underline font-semibold flex items-center gap-1 mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c2e1d]">
            Shopping Basket ({cart.reduce((acc, i) => acc + i.quantity, 0)} items)
          </h1>
        </div>
      </div>

      {/* Free Delivery Progress Bar */}
      <div className="bg-white border border-[#e5dfd3] rounded-2xl p-4 mb-6 shadow-xs">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-700" />
            {remainingForFreeDelivery === 0 ? (
              <span className="text-emerald-700 font-bold">
                🎉 Congratulations! You have unlocked Free Pan-India Delivery!
              </span>
            ) : (
              <span className="text-[#1c2e1d]">
                Add <span className="font-bold text-amber-700">₹{remainingForFreeDelivery}</span> more of artisan soaps to get <span className="text-emerald-700 font-bold">FREE Delivery</span>
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              remainingForFreeDelivery === 0 ? 'bg-emerald-600' : 'bg-amber-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Combo Offer Progress Card (Section 4D & Rule 2) */}
      <div
        className={`p-4 rounded-2xl mb-6 border transition-all ${
          comboOfferProgress.isUnlocked
            ? 'bg-gradient-to-r from-amber-50 to-emerald-50/50 border-amber-300 shadow-xs'
            : 'bg-[#faf7f2] border-amber-200/80'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-base">🎁</span>
            <span className={comboOfferProgress.isUnlocked ? 'text-amber-950 font-bold' : 'text-stone-800'}>
              {comboOfferProgress.message}
            </span>
          </div>
          {comboOfferProgress.isUnlocked ? (
            <span className="text-[10px] bg-amber-400 text-stone-950 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider self-start sm:self-auto">
              FREE GIFT UNLOCKED
            </span>
          ) : (
            <span className="text-[11px] text-amber-800 font-medium">
              Buy 6 Soaps, Get 1 Free Gift
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cart.length > 0 || unlockedGifts.length > 0 ? (
            <div className="bg-white border border-[#e5dfd3] rounded-2xl divide-y divide-gray-100 shadow-xs overflow-hidden">
              {cart.map((item) => {
                const price = item.selectedVariant ? item.selectedVariant.price : item.product.price;
                const weight = item.selectedVariant ? item.selectedVariant.weight : item.product.weight;
                const maxStock = item.selectedVariant ? item.selectedVariant.stock : item.product.stock;

                return (
                  <div key={`${item.product.id}-${item.selectedVariant?.id || 'base'}`} className="p-4 sm:p-5 flex gap-4 sm:gap-6">
                    {/* Product Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#f6f4ee] rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm sm:text-base font-serif font-bold text-[#1c2e1d] leading-snug">
                            {item.product.name}
                          </h3>
                          <span className="text-base font-bold text-[#1c2e1d] whitespace-nowrap">
                            ₹{price * item.quantity}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                          {item.selectedVariant && (
                            <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-medium">
                              {item.selectedVariant.name}
                            </span>
                          )}
                          <span>Weight: {weight}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium">In Stock ({maxStock} available)</span>
                        </div>
                      </div>

                      {/* Controls (Quantity, Save for Later, Remove) */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-2 border-t border-gray-50">
                        {/* Quantity selector */}
                        <div className="flex items-center border border-[#d5cfbe] rounded-lg overflow-hidden bg-[#faf8f2]">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)
                            }
                            className="p-1.5 hover:bg-gray-200 text-gray-700 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-[#1c2e1d]">
                            {item.quantity}
                          </span>
                          <button
                            aria-label="Increase quantity"
                            disabled={item.quantity >= maxStock}
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)
                            }
                            className="p-1.5 hover:bg-gray-200 text-gray-700 transition-colors disabled:opacity-40"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <button
                            onClick={() => saveItemForLater(item.product.id, item.selectedVariant?.id)}
                            className="text-[#8b5a2b] hover:text-[#6f451f] font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>Save for later</span>
                          </button>

                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-[#e5dfd3] rounded-2xl p-8 text-center">
              <p className="text-sm text-gray-500">Your active basket items are currently empty.</p>
            </div>
          )}

          {/* Save For Later Section */}
          {saveForLater.length > 0 && (
            <div className="bg-[#f7f5ed] border border-[#ded8c8] rounded-2xl p-5 shadow-xs">
              <h3 className="text-base font-serif font-bold text-[#1c2e1d] mb-4 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-700" />
                <span>Saved for Later ({saveForLater.length} items)</span>
              </h3>

              <div className="divide-y divide-[#ded8c8]">
                {saveForLater.map((saved) => {
                  const price = saved.selectedVariant ? saved.selectedVariant.price : saved.product.price;
                  return (
                    <div key={`${saved.product.id}-${saved.selectedVariant?.id || 'base'}`} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={saved.product.image}
                          alt={saved.product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-white"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-[#1c2e1d]">{saved.product.name}</p>
                          <p className="text-xs text-gray-600">₹{price}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveSavedToCart(saved)}
                          className="px-3 py-1.5 bg-[#8b5a2b] hover:bg-[#6f451f] text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          Move to Basket
                        </button>
                        <button
                          onClick={() => removeSavedItem(saved.product.id, saved.selectedVariant?.id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Price Breakdown in ₹ INR & Coupon Input */}
        <div className="space-y-5">
          {/* Coupon Code Card */}
          <div className="bg-white border border-[#e5dfd3] rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8b5a2b] mb-3 flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              <span>Apply Coupon / Promo Code</span>
            </h3>

            {appliedCoupon ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800 tracking-wider">
                    {appliedCoupon.code}
                  </span>
                  <p className="text-[11px] text-emerald-700">
                    Saved ₹{cartDiscount} on your order!
                  </p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-600 hover:underline font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. LUMINA10)"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 uppercase font-mono"
                />
                <button
                  type="submit"
                  disabled={couponLoading || !couponCodeInput}
                  className="px-4 py-2 bg-[#1c2e1d] hover:bg-[#28432a] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {couponLoading ? 'Checking...' : 'Apply'}
                </button>
              </form>
            )}

            {couponError && <p className="text-xs text-red-600 mt-2">{couponError}</p>}

            {/* Available coupons suggestion chips */}
            {coupons.filter((c) => c.isActive).length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-[11px] text-gray-500 font-medium">Available Offers:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {coupons
                    .filter((c) => c.isActive)
                    .map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setCouponCodeInput(c.code);
                          applyCoupon(c.code);
                        }}
                        className="text-[11px] bg-[#faf8f2] border border-[#ded8c8] hover:border-[#8b5a2b] px-2 py-0.5 rounded font-mono font-semibold text-[#1c2e1d] cursor-pointer"
                      >
                        {c.code}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Card in ₹ INR */}
          <div className="bg-white border border-[#e5dfd3] rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1c2e1d] mb-4">
              Order Summary (INR)
            </h3>

            <div className="space-y-2.5 text-xs sm:text-sm text-gray-600 pb-4 border-b border-gray-100">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#1c2e1d]">₹{cartSubtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Pan-India Delivery</span>
                {cartDeliveryFee === 0 ? (
                  <span className="text-emerald-700 font-bold">FREE</span>
                ) : (
                  <span className="font-semibold text-[#1c2e1d]">₹{cartDeliveryFee}</span>
                )}
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{cartDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>Taxes & GST</span>
                <span>Included in price</span>
              </div>
            </div>

            {/* Total */}
            <div className="py-4 border-b border-gray-100 flex items-baseline justify-between">
              <span className="text-base font-bold text-[#1c2e1d]">Order Total</span>
              <div className="text-right">
                <span className="text-2xl font-serif font-bold text-[#1c2e1d]">₹{cartTotal}</span>
                <p className="text-[10px] text-gray-400">All prices in Indian Rupees (₹)</p>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              id="proceed-to-checkout-btn"
              onClick={initiateCheckout}
              disabled={cart.length === 0}
              className="w-full mt-4 py-3.5 bg-[#c8923a] hover:bg-[#b5802c] text-[#192b1a] font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-500 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Sole Proprietor Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
