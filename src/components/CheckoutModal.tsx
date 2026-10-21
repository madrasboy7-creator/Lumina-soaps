import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  MessageSquareHeart,
  Package,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ShippingAddress, Order, formatPriceINR } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    currentUser,
    submitOrder,
    setCurrentView,
  } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [customerNote, setCustomerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Address state defaulted to user's saved profile address
  const [address, setAddress] = useState<ShippingAddress>(() => {
    return (
      currentUser?.address || {
        fullName: currentUser?.name || 'Customer Name',
        street: 'Flat 402, Green Glen Layout, Bellandur',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560103',
        phone: currentUser?.phone || '+91 98451 88290',
      }
    );
  });

  if (!isCheckoutOpen) return null;

  const freeShipping = cartSubtotal >= 799;
  const shippingFee = freeShipping ? 0 : 60;
  const tax = Math.round(cartSubtotal * 0.05);
  const total = cartSubtotal + shippingFee + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const order = await submitOrder({
        shippingAddress: address,
        paymentMethod,
        customerNote: customerNote.trim() || undefined,
      });
      setCompletedOrder(order);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#ded5c5] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-[#1b2e1c] text-[#f7f4eb] p-4 sm:p-5 flex items-center justify-between border-b border-[#2d4d2e]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#faf7ef] p-0.5 shadow flex-shrink-0 flex items-center justify-center">
                <img src="/logo.svg" alt="Lumina Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg leading-tight">
                  {completedOrder ? 'Order Request Placed Successfully' : 'Place Handmade Soap Order Request'}
                </h3>
                <span className="text-xs text-[#a0c29c]">
                  Direct Small-Batch Order to Sole Proprietor • Currency: ₹ INR
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCheckoutOpen(false);
                setCompletedOrder(null);
              }}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-7">
            {completedOrder ? (
              /* Success / Order Request Received Screen */
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold bg-[#edf5ec] text-[#224420] px-3 py-1 rounded-full">
                    Order ID: {completedOrder.id}
                  </span>
                  <h4 className="font-serif font-bold text-2xl text-[#1a3319] mt-2">
                    Order Request Received by Owner!
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
                    Sole Proprietor Thiru Kailash has received your order request in real-time in the workshop admin panel. Your small-batch cured soap bars are being reviewed for packaging and dispatch.
                  </p>
                </div>

                {/* Status Box */}
                <div className="max-w-md mx-auto bg-[#faf8f4] p-4 rounded-xl border border-[#ebd8b7] text-left text-xs space-y-2">
                  <div className="flex justify-between pb-2 border-b border-[#e5dccb]">
                    <span className="text-gray-500">Current Order Status:</span>
                    <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      {completedOrder.orderStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estimated Delivery:</span>
                    <span className="font-semibold text-gray-800">{completedOrder.estimatedDeliveryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping to:</span>
                    <span className="font-semibold text-gray-800">
                      {completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state} - {completedOrder.shippingAddress.zipCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment:</span>
                    <span className="font-semibold text-gray-800">{completedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between pt-1 font-bold text-[#1a3219] text-sm">
                    <span>Total (₹ INR):</span>
                    <span className="text-base font-black">{formatPriceINR(completedOrder.total)}</span>
                  </div>
                </div>

                {/* Next Steps Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3">
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setCompletedOrder(null);
                      setCurrentView('orders');
                    }}
                    className="py-2.5 px-5 bg-[#2d4d2b] text-white rounded-xl text-xs font-bold hover:bg-[#1e341d] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Package className="w-4 h-4" />
                    <span>View in My Orders</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setCompletedOrder(null);
                      setCurrentView('shop');
                    }}
                    className="py-2.5 px-5 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    Continue Shopping Soaps
                  </button>
                </div>
              </div>
            ) : (
              /* Checkout Form */
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left 7 cols: User details & Address */}
                  <div className="md:col-span-7 space-y-4 text-xs">
                    {/* 1. Account Confirmation */}
                    <div className="p-3 bg-[#f2f7f1] rounded-xl border border-[#cfe2cc] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#2d4d2b] text-white flex items-center justify-center font-bold">
                          {currentUser?.name?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-[#1a3319]">{currentUser?.name}</p>
                          <p className="text-[11px] text-gray-500">{currentUser?.email}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Logged In Customer
                      </span>
                    </div>

                    {/* 2. Shipping Address */}
                    <div className="space-y-2.5">
                      <h4 className="font-bold text-sm text-[#1a3119] flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        <span>Pan-India Delivery Address</span>
                      </h4>

                      <div className="space-y-2 bg-[#fcfbf8] p-3.5 rounded-xl border border-[#ded6c5]">
                        <div>
                          <label className="font-semibold block mb-0.5 text-gray-600">Recipient Full Name</label>
                          <input
                            type="text"
                            required
                            value={address.fullName}
                            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-xs focus:ring-1 focus:ring-[#2d4d2b] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-semibold block mb-0.5 text-gray-600">Flat / House No. & Street Address</label>
                          <input
                            type="text"
                            required
                            value={address.street}
                            onChange={(e) => setAddress({ ...address, street: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-xs focus:ring-1 focus:ring-[#2d4d2b] focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="font-semibold block mb-0.5 text-gray-600">City</label>
                            <input
                              type="text"
                              required
                              value={address.city}
                              onChange={(e) => setAddress({ ...address, city: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded bg-white text-xs focus:ring-1 focus:ring-[#2d4d2b] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="font-semibold block mb-0.5 text-gray-600">State</label>
                            <input
                              type="text"
                              required
                              value={address.state}
                              onChange={(e) => setAddress({ ...address, state: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded bg-white text-xs focus:ring-1 focus:ring-[#2d4d2b] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="font-semibold block mb-0.5 text-gray-600">PIN Code</label>
                            <input
                              type="text"
                              required
                              value={address.zipCode}
                              onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded bg-white text-xs focus:ring-1 focus:ring-[#2d4d2b] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold block mb-0.5 text-gray-600">Contact Mobile Number (+91)</label>
                          <input
                            type="tel"
                            required
                            value={address.phone}
                            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-xs focus:ring-1 focus:ring-[#2d4d2b] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Note for Maker Thiru Kailash */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-sm text-[#1a3119] flex items-center gap-1.5">
                        <MessageSquareHeart className="w-4 h-4 text-rose-500" />
                        <span>Special Request or Gift Message for the Artisan (Optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={customerNote}
                        onChange={(e) => setCustomerNote(e.target.value)}
                        placeholder="e.g. Please wrap in butter paper with jute twine or include a personalized card."
                        className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-xs"
                      />
                    </div>

                    {/* 4. Payment Method */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-sm text-[#1a3119] flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-amber-600" />
                        <span>Payment Method (₹ INR)</span>
                      </h4>
                      <div className="space-y-1.5">
                        {[
                          { id: 'UPI' as const, label: 'UPI (Google Pay, PhonePe, Paytm, BHIM)' },
                          { id: 'Card' as const, label: 'Credit / Debit Card (Visa, MasterCard, RuPay)' },
                          { id: 'COD' as const, label: 'Cash on Delivery (COD Verified)' },
                        ].map((m) => (
                          <label
                            key={m.id}
                            className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                              paymentMethod === m.id
                                ? 'border-[#2d4d2b] bg-[#f3f7f2] font-semibold text-[#183117]'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment"
                              checked={paymentMethod === m.id}
                              onChange={() => setPaymentMethod(m.id)}
                              className="accent-[#2d4d2b]"
                            />
                            <span>{m.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right 5 cols: Order Items & Submit */}
                  <div className="md:col-span-5 bg-[#faf8f4] p-4 sm:p-5 rounded-2xl border border-[#ded6c5] flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#1a3219] pb-2 border-b border-[#e5dccb]">
                        Order Items Summary ({cart.length})
                      </h4>

                      <div className="max-h-52 overflow-y-auto py-2 space-y-2 text-xs divide-y divide-gray-100">
                        {cart.map((item) => (
                          <div key={item.product.id} className="pt-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-10 h-10 rounded object-cover border border-gray-200 flex-shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="truncate">
                                <p className="font-semibold text-gray-900 truncate">{item.product.name}</p>
                                <p className="text-[10px] text-gray-500 font-mono">
                                  Qty: {item.quantity} • {item.product.batchNumber}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-gray-800">
                              {formatPriceINR(item.product.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Cost breakdown in INR */}
                      <div className="pt-3 border-t border-[#e5dccb] space-y-1.5 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>{formatPriceINR(cartSubtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pan-India Speed Post</span>
                          <span>{freeShipping ? 'FREE' : formatPriceINR(shippingFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Handmade Soap GST (5%)</span>
                          <span>{formatPriceINR(tax)}</span>
                        </div>
                        <div className="flex justify-between text-base font-black text-[#1b341c] pt-2 border-t border-[#ded6c5]">
                          <span>Grand Total</span>
                          <span>{formatPriceINR(total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Submit Action */}
                    <div className="mt-5 space-y-2">
                      <button
                        type="submit"
                        disabled={isSubmitting || cart.length === 0}
                        className="w-full py-3 bg-[#c8923a] hover:bg-[#b5802c] active:scale-98 text-[#1a2d18] font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Truck className="w-4 h-4" />
                        <span>
                          {isSubmitting
                            ? 'Transmitting Request to Owner...'
                            : `Submit Order Request (${formatPriceINR(total)})`}
                        </span>
                      </button>

                      <div className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>The sole proprietor receives your request immediately</span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
