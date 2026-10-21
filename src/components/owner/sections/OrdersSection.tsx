import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  Truck,
  Package,
  XCircle,
  FileText,
  Printer,
  ChevronDown,
  Eye,
  AlertCircle,
  X,
  CreditCard,
  MapPin,
  Send,
} from 'lucide-react';
import { Order, OrderStatus, formatPriceINR } from '../../../types';
import { PackingSlipModal } from '../../PackingSlipModal';

interface OrdersSectionProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, notes?: string, carrier?: string) => Promise<void>;
  onRefresh: () => void;
}

export const OrdersSection: React.FC<OrdersSectionProps> = ({
  orders,
  onUpdateStatus,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showSlipOrder, setShowSlipOrder] = useState<Order | null>(null);

  // Status update form state inside modal
  const [newStatus, setNewStatus] = useState<OrderStatus>('Processing');
  const [carrier, setCarrier] = useState('BlueDart');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.items.some((i) => i.productName.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === 'all' ||
        o.orderStatus.toLowerCase() === statusFilter.toLowerCase();

      const matchesPayment =
        paymentFilter === 'all' ||
        o.paymentStatus.toLowerCase() === paymentFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus as OrderStatus);
    setCarrier((order as any).carrier || 'BlueDart');
    setTrackingNumber((order as any).trackingNumber || '');
    setStatusNotes(order.notes || '');
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      await onUpdateStatus(selectedOrder.id, newStatus, trackingNumber, statusNotes, carrier);
      // update local modal view
      setSelectedOrder({
        ...selectedOrder,
        orderStatus: newStatus,
        notes: statusNotes,
        ...(carrier ? { carrier } : {}),
        ...(trackingNumber ? { trackingNumber } : {}),
      } as Order);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'packed':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'processing':
      case 'accepted':
      case 'accepted & preparing':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Orders &amp; Fulfilment
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Real customer orders, status pipeline, courier tracking, and printable tax invoices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl transition-colors shadow-xs"
          >
            Refresh List
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order #, customer name, email, or soap..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#244635] bg-stone-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs border border-stone-300 rounded-lg bg-white focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="Placed">Placed</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Accepted">Accepted</option>
              <option value="Processing">Processing</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
            <span>Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs border border-stone-300 rounded-lg bg-white focus:outline-hidden"
            >
              <option value="all">All Payments</option>
              <option value="SUCCESS">Paid (Online)</option>
              <option value="captured">Captured</option>
              <option value="PENDING">Pending (COD/Online)</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-[#FAF7EF] border-b border-stone-200 text-stone-800 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Item Summary</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Fulfilment</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    className="hover:bg-stone-50/80 transition-colors cursor-pointer group"
                    onClick={() => handleOpenDetail(ord)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                      {new Date(ord.createdAt || ord.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-800">{ord.customerName}</div>
                      <div className="text-[10px] text-stone-400">{ord.customerEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate">
                      {ord.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        ord.paymentStatus === 'SUCCESS' || ord.paymentStatus === 'captured'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : ord.paymentStatus === 'REFUNDED'
                          ? 'bg-purple-50 text-purple-800 border-purple-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}>
                        {ord.paymentMethod?.toUpperCase()} • {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(ord.orderStatus)}`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-stone-900 whitespace-nowrap">
                      {formatPriceINR(ord.total)}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(ord)}
                          className="p-1.5 text-stone-500 hover:text-[#244635] hover:bg-stone-100 rounded-lg transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowSlipOrder(ord)}
                          className="p-1.5 text-stone-500 hover:text-indigo-600 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Print Packing Slip / Tax Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-3">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-800 text-base">No orders found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
              {searchQuery || statusFilter !== 'all' || paymentFilter !== 'all'
                ? 'Try clearing search or filter parameters to see more orders.'
                : 'Customer orders will automatically appear here once purchases are made.'}
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#FAF7EF] px-6 py-4 border-b border-stone-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#244635] text-white rounded-xl">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-stone-900 font-mono">
                    Order {selectedOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Placed on {new Date(selectedOrder.createdAt || selectedOrder.date).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSlipOrder(selectedOrder)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-xs rounded-xl transition-colors shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-stone-600" />
                  <span>Invoice Slip</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Customer & Shipping Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <h4 className="font-bold text-stone-800 mb-2 flex items-center gap-1.5">
                    <span>Customer Contact</span>
                  </h4>
                  <p className="font-medium text-stone-900">{selectedOrder.customerName}</p>
                  <p className="text-stone-600">{selectedOrder.customerEmail}</p>
                  <p className="text-stone-600">{selectedOrder.customerPhone || 'Phone not specified'}</p>
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <h4 className="font-bold text-stone-800 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" />
                    <span>Delivery Address</span>
                  </h4>
                  <p className="text-stone-700 leading-relaxed">
                    {selectedOrder.shippingAddress?.fullName && <strong>{selectedOrder.shippingAddress.fullName}<br /></strong>}
                    {selectedOrder.shippingAddress?.street || 'Studio Pickup / Street'}<br />
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                    {selectedOrder.shippingAddress?.phone && <><br />Contact: {selectedOrder.shippingAddress.phone}</>}
                  </p>
                </div>
              </div>

              {/* Items Purchased */}
              <div>
                <h4 className="font-bold text-stone-800 mb-3 text-sm">
                  Purchased Soap Items ({selectedOrder.items.length})
                </h4>
                <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between bg-white hover:bg-stone-50">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.image || '/logo.svg'}
                          alt={it.productName}
                          className="w-10 h-10 object-cover rounded-lg border border-stone-200"
                        />
                        <div>
                          <p className="font-semibold text-stone-900">{it.productName}</p>
                          <p className="text-[11px] text-stone-500">
                            Qty: <strong>{it.quantity}</strong> {it.weight ? `• ${it.weight}` : ''} {it.sku ? `• SKU: ${it.sku}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right font-bold text-stone-900">
                        {formatPriceINR((it.price || 0) * it.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals Breakdown */}
                <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1 text-right text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal:</span>
                    <span>{formatPriceINR(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount:</span>
                      <span>-{formatPriceINR(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping Delivery:</span>
                    <span>{selectedOrder.shippingFee === 0 ? 'FREE' : formatPriceINR(selectedOrder.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-stone-900 pt-1 border-t border-stone-200">
                    <span>Total Amount:</span>
                    <span>{formatPriceINR(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update & Courier Dispatch Panel */}
              <div className="p-4 bg-[#FAF7EF] rounded-2xl border border-[#ded4bf] space-y-4">
                <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#244635]" />
                  <span>Update Order Fulfilment &amp; Dispatch</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Fulfilment Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                      className="w-full p-2 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-[#244635]"
                    >
                      <option value="Pending Review">Pending Review</option>
                      <option value="Accepted">Accepted &amp; Preparing</option>
                      <option value="Processing">Processing / Saponifying</option>
                      <option value="Packed">Packed &amp; Ready for Courier</option>
                      <option value="Shipped">Shipped / Dispatched</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Courier Partner
                    </label>
                    <select
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full p-2 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-[#244635]"
                    >
                      <option value="BlueDart">BlueDart Express</option>
                      <option value="Delhivery">Delhivery</option>
                      <option value="India Post">India Post Speed Post</option>
                      <option value="DTDC">DTDC Courier</option>
                      <option value="Self / Local Studio Pickup">Local Studio Pickup</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    AWB Tracking Number / Courier Reference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BD987654321IN"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-xl bg-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Internal Fulfilment Notes / Packing Remarks
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Wrapped with biodegradable butter paper and lavender sprig."
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-xl bg-white text-xs"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 hover:bg-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveStatus}
                    disabled={isUpdating}
                    className="px-5 py-2 bg-[#244635] hover:bg-[#1b3427] text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {isUpdating ? <span>Updating...</span> : <span>Save Fulfilment Changes</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Slip Modal */}
      {showSlipOrder && (
        <PackingSlipModal
          order={showSlipOrder}
          onClose={() => setShowSlipOrder(null)}
        />
      )}
    </div>
  );
};
