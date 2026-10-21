import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { PackingSlipModal } from './PackingSlipModal';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Printer,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const ORDER_TIMELINE_STEPS = [
  { key: 'PLACED', label: 'Placed' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'PROCESSING', label: 'Processing' },
  { key: 'PACKED', label: 'Packed' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
];

function getTimelineIndex(status: OrderStatus): number {
  switch (status) {
    case 'Pending Review':
    case 'PLACED':
      return 0;
    case 'CONFIRMED':
    case 'Accepted & Preparing':
      return 1;
    case 'PROCESSING':
      return 2;
    case 'PACKED':
    case 'Handcrafted & Packaged':
      return 3;
    case 'SHIPPED':
      return 4;
    case 'OUT_FOR_DELIVERY':
      return 5;
    case 'DELIVERED':
      return 6;
    default:
      return 0;
  }
}

export const CustomerOrdersView: React.FC = () => {
  const {
    orders,
    currentUser,
    setCurrentView,
    openCustomerLogin,
    cancelOrder,
    requestReturn,
    setSelectedProduct,
    products,
    showNotification,
  } = useStore();

  const [activeSlipOrder, setActiveSlipOrder] = useState<Order | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('Ordered by mistake');
  const [isCancelling, setIsCancelling] = useState(false);

  // Return request state
  const [returningOrderId, setReturningOrderId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('Damaged during courier transit');
  const [returnNotes, setReturnNotes] = useState('');
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  // Review modal state
  const [reviewingItem, setReviewingItem] = useState<{
    productId: string;
    productName: string;
  } | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
        <Package className="w-14 h-14 text-gray-300 mx-auto mb-3" />
        <h2 className="text-2xl font-serif font-bold text-[#1c2e1d] mb-2">
          Customer Login Required
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6">
          Please log in to your Lumina customer account to track your orders, view order timelines, and access invoices.
        </p>
        <button
          onClick={() => openCustomerLogin('login')}
          className="px-6 py-3 bg-[#8b5a2b] hover:bg-[#6f451f] text-white text-xs font-bold rounded-xl shadow transition-colors"
        >
          Sign In as Customer
        </button>
      </div>
    );
  }

  // Filter orders belonging to this user
  const userOrders = orders.filter(
    (o) =>
      o.userId === currentUser.id ||
      o.customerEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const handleConfirmCancel = async () => {
    if (!cancellingOrderId) return;
    setIsCancelling(true);
    try {
      await cancelOrder(cancellingOrderId, cancelReason);
      setCancellingOrderId(null);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleConfirmReturn = async () => {
    if (!returningOrderId) return;
    setIsSubmittingReturn(true);
    try {
      await requestReturn(returningOrderId, returnReason, returnNotes);
      setReturningOrderId(null);
      setReturnNotes('');
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingItem) return;
    setIsSubmittingReview(true);

    try {
      const res = await fetch(`/api/products/${reviewingItem.productId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: currentUser.name,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });

      if (res.ok) {
        showNotification('Thank you! Your verified review has been submitted.', 'success');
        setReviewingItem(null);
        setReviewTitle('');
        setReviewComment('');
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#ded6c5] mb-6">
        <div>
          <button
            onClick={() => setCurrentView('shop')}
            className="text-xs text-[#8b5a2b] hover:underline flex items-center gap-1 font-semibold mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1c2e1d]">
            Your Orders ({userOrders.length})
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Track small-batch curing, artisan packaging, and courier delivery from Thiru Kailash's workshop in Bengaluru (₹ INR)
          </p>
        </div>
      </div>

      {/* Orders List */}
      {userOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#ded6c5] shadow-xs">
          <Package className="w-14 h-14 mx-auto text-gray-300 mb-3" />
          <h3 className="font-serif font-bold text-lg text-gray-800">No Orders Yet</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto mb-5">
            You haven't placed any handmade soap orders yet. Browse our freshly cured botanicals and add them to your basket!
          </p>
          <button
            onClick={() => setCurrentView('shop')}
            className="py-2.5 px-6 bg-[#8b5a2b] hover:bg-[#6f451f] text-white font-bold text-xs rounded-xl shadow transition-colors"
          >
            Explore Artisan Soaps
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => {
            const isCancelled = order.orderStatus === 'CANCELLED';
            const isReturnRequested = order.orderStatus === 'RETURN_REQUESTED';
            const isDelivered = order.orderStatus === 'DELIVERED';
            const canCancel =
              !isCancelled &&
              !isDelivered &&
              order.orderStatus !== 'SHIPPED' &&
              order.orderStatus !== 'OUT_FOR_DELIVERY';
            const currentStepIdx = getTimelineIndex(order.orderStatus);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#ded6c5] shadow-xs overflow-hidden"
              >
                {/* Header row */}
                <div className="bg-[#faf8f3] p-4 sm:p-5 border-b border-[#e5decb] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">
                        Order Placed
                      </span>
                      <span className="font-bold text-[#1c2e1d]">
                        {new Date(order.date || order.createdAt || Date.now()).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">
                        Total Amount
                      </span>
                      <span className="font-black text-[#1c2e1d] text-sm">
                        ₹{order.total}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">
                        Ship To
                      </span>
                      <span className="font-semibold text-gray-700">
                        {order.shippingAddress.fullName}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">
                        Order #
                      </span>
                      <span className="font-mono font-bold text-[#8b5a2b]">
                        {order.orderNumber || order.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveSlipOrder(order)}
                      className="px-3 py-1.5 bg-white border border-[#d6cfbe] hover:border-[#8b5a2b] text-[#1c2e1d] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-gray-600" />
                      <span>Invoice / Slip</span>
                    </button>
                  </div>
                </div>

                {/* Status & Timeline */}
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          isCancelled
                            ? 'bg-red-100 text-red-800'
                            : isReturnRequested
                            ? 'bg-purple-100 text-purple-800'
                            : isDelivered
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        ● {order.orderStatus}
                      </span>
                      {order.trackingNumber && (
                        <span className="text-xs text-gray-500 font-mono">
                          Courier: {order.carrier || 'BlueDart'} (AWB: {order.trackingNumber})
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      {canCancel && (
                        <button
                          onClick={() => setCancellingOrderId(order.id)}
                          className="text-xs text-red-600 hover:text-red-700 hover:underline font-semibold"
                        >
                          Cancel Order
                        </button>
                      )}

                      {isDelivered && !isReturnRequested && (
                        <button
                          onClick={() => setReturningOrderId(order.id)}
                          className="text-xs text-[#8b5a2b] hover:underline font-semibold flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Request Return / Refund</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Progress Timeline (Hidden if Cancelled) */}
                  {!isCancelled && (
                    <div className="mt-4 mb-2">
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {ORDER_TIMELINE_STEPS.map((step, idx) => {
                          const isDone = idx <= currentStepIdx;
                          const isCurrent = idx === currentStepIdx;

                          return (
                            <div key={step.key} className="flex flex-col items-center">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 transition-all ${
                                  isDone
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}
                              >
                                {isDone ? '✓' : idx + 1}
                              </div>
                              <span
                                className={`text-[10px] sm:text-xs leading-tight ${
                                  isDone ? 'font-bold text-[#1c2e1d]' : 'text-gray-400'
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Timeline connecting bar */}
                      <div className="w-full bg-gray-200 h-1 rounded-full mt-3 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (currentStepIdx / (ORDER_TIMELINE_STEPS.length - 1)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {isCancelled && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>This order was cancelled: {order.cancellationReason || 'Customer requested'}</span>
                    </div>
                  )}

                  {isReturnRequested && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-700 flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 flex-shrink-0" />
                      <span>Return requested: {order.returnReason}. Artisan team is reviewing your pickup.</span>
                    </div>
                  )}
                </div>

                {/* Items in this order */}
                <div className="p-4 sm:p-6 divide-y divide-gray-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#f7f5ed] rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div>
                          <p className="text-xs sm:text-sm font-bold text-[#1c2e1d]">
                            {item.productName}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            {item.variantName && (
                              <span className="bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.2 rounded text-[10px]">
                                {item.variantName}
                              </span>
                            )}
                            <span>Qty: {item.quantity}</span>
                            <span>•</span>
                            <span className="font-semibold text-gray-800">₹{item.price} each</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[#1c2e1d] whitespace-nowrap">
                          ₹{item.price * item.quantity}
                        </span>

                        {isDelivered && (
                          <button
                            onClick={() =>
                              setReviewingItem({
                                productId: item.productId,
                                productName: item.productName,
                              })
                            }
                            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#8b5a2b] border border-amber-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>Write Review</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Address & Note summary footer */}
                <div className="bg-[#faf8f3] p-4 text-xs text-gray-600 flex flex-wrap justify-between gap-2 border-t border-[#ded6c5]">
                  <div>
                    <span className="font-bold text-[#1c2e1d]">Shipping Address: </span>
                    <span>
                      {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                      {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </span>
                  </div>
                  {order.customerNote && (
                    <div>
                      <span className="font-bold text-[#1c2e1d]">Note: </span>
                      <span className="italic">{order.customerNote}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-serif font-bold text-[#1c2e1d]">
              Cancel Order Request
            </h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to cancel this order? Small-batch soaps reserved for this shipment will be returned to studio curing stock.
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg"
              >
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Need to change delivery address">Need to change delivery address</option>
                <option value="Wanted to add another soap bar">Wanted to add another soap bar</option>
                <option value="Found alternative">Found alternative</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCancellingOrderId(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {returningOrderId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-serif font-bold text-[#1c2e1d]">
              Request Return or Replacement
            </h3>
            <p className="text-xs text-gray-600">
              We stand by our 100% cold-process quality guarantee. Please share the reason so Thiru Kailash can arrange resolution.
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Return Reason</label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg"
              >
                <option value="Damaged during courier transit">Damaged during courier transit</option>
                <option value="Wrong soap bar received">Wrong soap bar received</option>
                <option value="Skin allergic reaction / sensitivity">Skin allergic reaction / sensitivity</option>
                <option value="Quality dissatisfaction">Quality dissatisfaction</option>
                <option value="Other issue">Other issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Additional Notes</label>
              <textarea
                rows={3}
                placeholder="Provide batch number or details if visible..."
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReturningOrderId(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReturn}
                disabled={isSubmittingReturn}
                className="px-4 py-2 bg-[#8b5a2b] hover:bg-[#6f451f] text-white text-xs font-bold rounded-lg transition-colors"
              >
                {isSubmittingReturn ? 'Submitting...' : 'Submit Return Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {reviewingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handlePostReview} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-serif font-bold text-[#1c2e1d]">
              Review "{reviewingItem.productName}"
            </h3>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
              ✓ Verified Customer Purchase
            </span>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Rating</label>
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 cursor-pointer focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Review Headline</label>
              <input
                type="text"
                required
                placeholder="e.g. Incredibly creamy lather and calming scent!"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Your Detailed Experience</label>
              <textarea
                required
                rows={4}
                placeholder="How does your skin feel after use? Did you notice benefits with lather or scent?"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewingItem(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-5 py-2 bg-[#8b5a2b] hover:bg-[#6f451f] text-white text-xs font-bold rounded-lg transition-colors"
              >
                {isSubmittingReview ? 'Submitting...' : 'Post Verified Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Printable Packing Slip Modal */}
      {activeSlipOrder && (
        <PackingSlipModal
          order={activeSlipOrder}
          onClose={() => setActiveSlipOrder(null)}
        />
      )}
    </div>
  );
};
