import React, { useState, useEffect, useMemo } from 'react';
import {
  Truck,
  Package,
  Search,
  CheckCircle,
  Clock,
  Printer,
  ExternalLink,
  MapPin,
  Check,
  X,
  Phone,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { Order, formatPriceINR } from '../../../types';
import { operationsApi } from '../ownerApi';
import { PackingSlipModal } from '../../PackingSlipModal';

const CARRIERS = [
  'India Post Speed Post',
  'Delhivery Express',
  'Blue Dart Surface',
  'DTDC Courier',
  'Shiprocket Surface',
  'Local Studio Delivery',
];

export const DispatchManager: React.FC = () => {
  const { orders, updateOrderStatus, showNotification } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPackingSlipOrder, setSelectedPackingSlipOrder] = useState<Order | null>(null);

  // Dispatch Dialog State
  const [dispatchingOrder, setDispatchingOrder] = useState<Order | null>(null);
  const [carrier, setCarrier] = useState('India Post Speed Post');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Orders awaiting dispatch (Accepted, Processing)
  const dispatchQueue = useMemo(() => {
    return orders.filter(
      (o) =>
        o.orderStatus === 'Placed' ||
        o.orderStatus === 'Accepted & Preparing' ||
        o.orderStatus === 'Processing' ||
        o.orderStatus === 'Packed'
    );
  }, [orders]);

  // Recently shipped orders
  const recentShipped = useMemo(() => {
    return orders.filter((o) => o.orderStatus === 'Shipped');
  }, [orders]);

  const handleOpenDispatch = (order: Order) => {
    setDispatchingOrder(order);
    setCarrier(order.carrier || 'India Post Speed Post');
    setTrackingNumber(order.trackingNumber || '');
    setTrackingUrl(order.trackingUrl || '');
  };

  const handleConfirmDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchingOrder) return;
    if (!trackingNumber.trim()) {
      showNotification('Tracking number is required for dispatch', 'alert');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateOrderStatus(
        dispatchingOrder.id,
        'Shipped',
        trackingNumber.trim(),
        undefined,
        carrier
      );
      showNotification(`Order ${dispatchingOrder.orderNumber} dispatched via ${carrier}`, 'success');
      setDispatchingOrder(null);
    } catch (err: any) {
      showNotification(err.message || 'Failed to dispatch order', 'alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-amber-800 uppercase bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              Operations • Courier Log & Shipping
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">Dispatch Manager</h1>
          <p className="text-xs text-stone-500">
            Organize packed parcel batches, assign courier tracking numbers (India Post / Delhivery), and generate packing slips.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
          {dispatchQueue.length} Orders Awaiting Dispatch
        </span>
      </div>

      {/* Dispatch Priority Queue */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-base">
              Awaiting Courier Collection
            </h3>
            <p className="text-xs text-stone-500">Packaged artisan soap orders ready for tracking assignment</p>
          </div>
        </div>

        <div className="divide-y divide-stone-100 text-xs">
          {dispatchQueue.length === 0 ? (
            <div className="py-8 text-center text-stone-400">
              All prepared orders have been dispatched with couriers.
            </div>
          ) : (
            dispatchQueue.map((o) => (
              <div key={o.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">{o.orderNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {o.orderStatus}
                    </span>
                    <span className="text-stone-400 text-[11px] font-mono">
                      {new Date(o.createdAt || o.date).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-stone-800 font-semibold">{o.customerName}</p>
                  <p className="text-stone-600">
                    {o.shippingAddress?.street}, {o.shippingAddress?.city}, {o.shippingAddress?.state} - {o.shippingAddress?.pincode || o.shippingAddress?.zipCode}
                  </p>
                  <p className="text-stone-500 font-mono text-[10px]">
                    Phone: {o.shippingAddress?.phone || o.customerPhone} • {o.items.length} soap item(s) • Total: {formatPriceINR(o.total)}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedPackingSlipOrder(o)}
                    className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Packing Slip</span>
                  </button>
                  <button
                    onClick={() => handleOpenDispatch(o)}
                    className="px-4 py-2 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Dispatch Package</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recently Shipped Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-stone-900 text-base pb-3 border-b border-stone-100">
          Dispatched Shipments
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5">Order</th>
                <th className="py-2.5">Customer & Destination</th>
                <th className="py-2.5">Carrier</th>
                <th className="py-2.5">Tracking Number</th>
                <th className="py-2.5 text-right">Packing Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentShipped.slice(0, 6).map((o) => (
                <tr key={o.id} className="hover:bg-stone-50/60">
                  <td className="py-3 font-bold text-stone-900">{o.orderNumber}</td>
                  <td className="py-3">
                    <div className="font-medium text-stone-800">{o.customerName}</div>
                    <div className="text-[10px] text-stone-400">{o.shippingAddress?.city || 'India'}</div>
                  </td>
                  <td className="py-3 text-stone-700 font-medium">{o.carrier || 'India Post'}</td>
                  <td className="py-3 font-mono text-blue-700">{o.trackingNumber || 'Pending'}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setSelectedPackingSlipOrder(o)}
                      className="text-stone-500 hover:text-stone-900 font-semibold text-xs cursor-pointer"
                    >
                      Print Slip &gt;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Modal */}
      {dispatchingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-700" />
                <h3 className="font-serif font-bold text-stone-900 text-base">
                  Dispatch Parcel: {dispatchingOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setDispatchingOrder(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDispatch} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Select Carrier *</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                >
                  {CARRIERS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Airway Bill / Tracking Number *
                </label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. EK987654321IN"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Tracking Web Link (Optional)
                </label>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://www.indiapost.gov.in/..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDispatchingOrder(null)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'Dispatching...' : 'Confirm Dispatch'}</span>
                </button>
              </div>
            </form>
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
