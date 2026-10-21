import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPriceINR } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartCount,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    initiateCheckout,
    currentUser,
    isCustomer,
    openCustomerLogin,
  } = useStore();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 799;
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const shippingFee = cartSubtotal >= freeShippingThreshold ? 0 : 60;
  const estimatedTax = Math.round(cartSubtotal * 0.05);
  const estimatedTotal = cartSubtotal + shippingFee + estimatedTax;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        />

        {/* Sliding Drawer */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#e5dfd3]"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#e5dfd3] bg-[#fbf9f4] flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-xl text-[#1e341f]">
                  Your Artisan Basket
                </h2>
                <span className="text-xs text-gray-500">
                  {cartCount} {cartCount === 1 ? 'handcrafted bar' : 'handcrafted bars'}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100"
                aria-label="Close basket"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="bg-[#f0f6ee] p-3.5 border-b border-[#d8e8d6] text-xs text-[#2c4e2a]">
              {remainingForFreeShipping > 0 ? (
                <div className="space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span>
                      Add <strong className="text-[#193517]">{formatPriceINR(remainingForFreeShipping)}</strong> for FREE Pan-India Shipping
                    </span>
                    <span className="font-mono">{freeShippingProgress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-[#d6e5d4] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2d4d2b] h-full rounded-full transition-all duration-300"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 font-bold text-[#1b3d19]">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>🎉 You qualified for FREE Pan-India Speed Post Delivery!</span>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                  <div className="w-16 h-16 rounded-full bg-[#f4f2ea] flex items-center justify-center text-[#758a74] mb-3">
                    🧼
                  </div>
                  <h3 className="font-serif font-bold text-lg text-gray-800">Your basket is empty</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">
                    Explore our botanical cold-process soaps cured with raw honey, neem, saffron, and essential oils.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 py-2 px-4 bg-[#2d4d2b] text-white text-xs font-bold rounded-lg hover:bg-[#20361f]"
                  >
                    Start Browsing Soaps
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3.5 p-3 rounded-xl border border-gray-100 bg-[#fbf9f4] relative group"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-18 h-18 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-gray-900 leading-tight truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-red-600 p-0.5"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                          {item.product.batchNumber} • {item.product.weight}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity picker */}
                        <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden text-xs">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-0.5 hover:bg-gray-100 text-gray-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-0.5 hover:bg-gray-100 text-gray-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Line Total in INR */}
                        <span className="font-bold text-sm text-[#1b341c]">
                          {formatPriceINR(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-[#e5dfd3] bg-[#fbf9f4] space-y-3">
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-800">{formatPriceINR(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pan-India Shipping</span>
                    <span>{shippingFee === 0 ? 'FREE' : formatPriceINR(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Handmade Soap GST (5%)</span>
                    <span>{formatPriceINR(estimatedTax)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900 pt-1 border-t border-gray-200">
                    <span>Total (₹ INR)</span>
                    <span className="text-base text-[#1b341c]">
                      {formatPriceINR(estimatedTotal)}
                    </span>
                  </div>
                </div>

                {!currentUser ? (
                  <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 leading-tight flex items-start gap-2">
                    <span className="text-base">🔒</span>
                    <div>
                      <strong>Login Required to Order:</strong> You must create or sign into your customer account to submit an order request to the owner.
                    </div>
                  </div>
                ) : !isCustomer ? (
                  <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200 text-[11px] text-blue-900 leading-tight">
                    👑 <strong>Signed in as Owner:</strong> You can place test orders directly, or switch to a customer account.
                  </div>
                ) : null}

                <button
                  id="cart-proceed-checkout"
                  onClick={() => {
                    setIsCartOpen(false);
                    initiateCheckout();
                  }}
                  className="w-full py-3 bg-[#c8923a] hover:bg-[#b5802c] active:scale-98 text-[#182a17] font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>{!currentUser ? 'Sign In & Place Order' : 'Proceed to Checkout'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3a6038]" />
                  <span>Direct request dispatched to Sole Proprietor</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
