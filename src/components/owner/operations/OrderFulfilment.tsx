import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle,
  Truck,
  RotateCcw,
  Printer,
  Eye,
  AlertTriangle,
  X,
  Clock,
  IndianRupee,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { Order, OrderStatus, formatPriceINR } from '../../../types';
import { PackingSlipModal } from '../../PackingSlipModal';

interface OrderFulfilmentProps {
  initialOrderId?: string;
}

export const OrderFulfilment: React.FC<OrderFulfilmentProps> = ({ initialOrderId }) => {
  const {
    orders,
    updateOrderStatus,
    processRefund,
    showNotification,
  } = useStore();

  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'all'>('all');
  const [orderSearch, setOrderSearch] = useState(initialOrderId || '');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [selectedPackingSlipOrder, setSelectedPackingSlipOrder] = useState<Order | null>(null);

  // Tracking Dialog State
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [carrierInput, setCarrierInput] = useState('India Post Speed Post');
  const [trackingUrlInput, setTrackingUrlInput] = useState('');

  // Refund Dialog State
  const [refundOrder, setRefundOrder] = useState<Order | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState('Customer cancellation before dispatch');
  const [isRefunding, setIsRefunding] = useState(false);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderFilter !== 'all' && o.orderStatus !== orderFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          (o.shippingAddress?.city && o.shippingAddress.city.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [orders, orderFilter, orderSearch]);

  const handleOpenTracking = (order: Order) => {
    setTrackingOrder(order);
    setTrackingNumberInput(order.trackingNumber || '');
    setCarrierInput(order.carrier || 'India Post Speed Post');
    setTrackingUrlInput(order.trackingUrl || '');
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingOrder) return;
    if (!trackingNumberInput.trim()) {
      showNotification('Tracking number is required', 'alert');
      return;
    }

    try {
      await updateOrderStatus(
        trackingOrder.id,
        'Shipped',
        trackingNumberInput.trim(),
        undefined,
        carrierInput.trim()
      );
      showNotification(`Order ${trackingOrder.orderNumber} marked as Shipped via ${carrierInput}`, 'success');
      setTrackingOrder(null);
    } catch (err: any) {
      showNotification(err.message || 'Failed to update tracking', 'alert');
    }
  };

  const handleOpenRefund = (order: Order) => {
    setRefundOrder(order);
    setRefundAmount(order.total);
    setRefundReason('Customer cancellation before dispatch');
  };

  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundOrder) return;
    if (refundAmount <= 0 || refundAmount > refundOrder.total) {
      showNotification('Invalid refund amount', 'alert');
      return;
    }

    setIsRefunding(true);
    try {
      await processRefund(refundOrder.id, refundAmount, refundReason);
      showNotification(`Refund of ₹${refundAmount} recorded for ${refundOrder.orderNumber}`, 'success');
      setRefundOrder(null);
    } catch (err: any) {
      showNotification(err.message || 'Failed to process refund', 'alert');
    } finally {
      setIsRefunding(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showNotification(`Order status updated to ${newStatus}`, 'info');
    } catch (err: any) {
      showNotification(err.message || 'Failed to update status', 'alert');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-amber-800 uppercase bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              Operations • Order Fulfilment
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Order Processing & Fulfilment
          </h1>
          <p className="text-xs text-stone-500">
            Accept orders, generate packing slips, log courier tracking details, and issue recorded refunds.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 border border-stone-200">
          Total Orders: {orders.length}
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by order number, customer name, email, or city..."
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#244635] text-stone-800"
          />
        </div>

        <select
          value={orderFilter}
          onChange={(e) => setOrderFilter(e.target.value as any)}
          className="py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:ring-1 focus:ring-[#244635]"
        >
          <option value="all">All Order Stages</option>
          <option value="Placed">Placed</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Accepted">Accepted</option>
          <option value="Processing">Processing (Packaging)</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50/70 border-b border-stone-200/80 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Order Details</th>
                <th className="py-3 px-4">Customer & City</th>
                <th className="py-3 px-4">Soap Items</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status & Stage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No orders matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900 text-xs">{o.orderNumber}</div>
                      <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                        {new Date(o.createdAt || o.date).toLocaleDateString()}
                      </div>
                      <div className="font-bold text-[#244635] font-serif text-sm mt-1">
                        {formatPriceINR(o.total)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900">{o.customerName}</div>
                      <div className="text-[11px] text-stone-500">{o.customerEmail}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5 font-mono">
                        {o.shippingAddress?.city || 'India'} • {o.shippingAddress?.pincode || o.shippingAddress?.zipCode || ''}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-800">{o.items.length} item(s)</div>
                      <div className="text-[10px] text-stone-500 truncate max-w-xs mt-0.5">
                        {o.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          o.paymentStatus === 'SUCCESS' || o.paymentStatus === 'captured'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                      <div className="text-[10px] text-stone-400 font-mono mt-1 uppercase">
                        {o.paymentMethod}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                        className="py-1 px-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 focus:ring-1 focus:ring-[#244635]"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Pending Review">Pending Review</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      {o.trackingNumber && (
                        <div className="text-[10px] text-blue-700 font-mono mt-1">
                          Tracking: {o.trackingNumber}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrderDetails(o)}
                          className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedPackingSlipOrder(o)}
                          className="p-1.5 text-stone-600 hover:text-[#244635] hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Generate Packing Slip / Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenTracking(o)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Add Courier Tracking"
                        >
                          <Truck className="w-3.5 h-3.5" />
                        </button>
                        {o.paymentStatus !== 'refunded' && o.orderStatus !== 'Cancelled' && (
                          <button
                            onClick={() => handleOpenRefund(o)}
                            className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Process Refund"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracking Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-700" />
                <h3 className="font-serif font-bold text-stone-900 text-base">
                  Dispatch & Courier Tracking
                </h3>
              </div>
              <button
                onClick={() => setTrackingOrder(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTracking} className="space-y-4 text-xs">
              <p className="text-stone-600">
                Order <span className="font-bold">{trackingOrder.orderNumber}</span> for {trackingOrder.customerName}.
              </p>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Carrier Name *</label>
                <input
                  type="text"
                  required
                  value={carrierInput}
                  onChange={(e) => setCarrierInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  placeholder="e.g. India Post Speed Post, Delhivery, Blue Dart"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Tracking Number / AWB *</label>
                <input
                  type="text"
                  required
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  placeholder="e.g. EK123456789IN"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Carrier Tracking URL</label>
                <input
                  type="url"
                  value={trackingUrlInput}
                  onChange={(e) => setTrackingUrlInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  placeholder="https://..."
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTrackingOrder(null)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Mark as Shipped</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {refundOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif font-bold text-stone-900 text-base">Process Refund</h3>
              </div>
              <button
                onClick={() => setRefundOrder(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessRefund} className="space-y-4 text-xs">
              <p className="text-stone-600">
                Order <span className="font-bold">{refundOrder.orderNumber}</span> (Total Paid: ₹{refundOrder.total}).
              </p>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Refund Amount (INR) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={refundOrder.total}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Reason for Refund *</label>
                <textarea
                  rows={2}
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRefundOrder(null)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRefunding}
                  className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <span>{isRefunding ? 'Recording Refund...' : 'Confirm Refund'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-fadeIn space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                Order {selectedOrderDetails.orderNumber}
              </h3>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                <div className="font-semibold text-stone-900">{selectedOrderDetails.customerName}</div>
                <div className="text-stone-600">{selectedOrderDetails.shippingAddress?.street}</div>
                <div className="text-stone-600">
                  {selectedOrderDetails.shippingAddress?.city}, {selectedOrderDetails.shippingAddress?.state} - {selectedOrderDetails.shippingAddress?.pincode || selectedOrderDetails.shippingAddress?.zipCode}
                </div>
                <div className="text-stone-500 font-mono">
                  Phone: {selectedOrderDetails.shippingAddress?.phone || selectedOrderDetails.customerPhone}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-800 mb-2">Purchased Soaps</h4>
                <div className="divide-y divide-stone-100 border border-stone-100 rounded-xl overflow-hidden">
                  {selectedOrderDetails.items.map((item, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between bg-white">
                      <div>
                        <div className="font-semibold text-stone-900">{item.productName}</div>
                        <div className="text-[10px] text-stone-400">Qty: {item.quantity} • Unit: ₹{item.price}</div>
                      </div>
                      <div className="font-bold text-[#244635]">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 font-bold text-sm">
                <span>Total Amount:</span>
                <span className="text-[#244635] font-serif">{formatPriceINR(selectedOrderDetails.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Packing Slip Modal */}
      {selectedPackingSlipOrder && (
        <PackingSlipModal
          order={selectedPackingSlipOrder}
          onClose={() => setSelectedPackingSlipOrder(null)}
        />
      )}
    </div>
  );
};
