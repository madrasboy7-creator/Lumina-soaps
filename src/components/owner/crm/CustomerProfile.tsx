import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  MessageSquare,
  FileText,
  MapPin,
  Plus,
  Check,
  Shield,
  Star,
  Clock,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { formatPriceINR, Order, SupportTicket } from '../../../types';
import { CustomerOrderHistory } from './CustomerOrderHistory';
import { CustomerActivityTimeline, CustomerActivityEvent } from './CustomerActivityTimeline';
import { crmApi } from '../ownerApi';

interface CustomerProfileProps {
  customerId: string;
  onBack: () => void;
  onNavigateOrder?: (orderId: string) => void;
  onOpenTicket?: (ticketId: string) => void;
}

export const CustomerProfile: React.FC<CustomerProfileProps> = ({
  customerId,
  onBack,
  onNavigateOrder,
  onOpenTicket,
}) => {
  const { orders, supportTickets, products, showNotification } = useStore();
  const reviews = useMemo(() => products.flatMap((p) => p.reviews || []), [products]);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'activity' | 'addresses' | 'support'>('overview');
  const [noteContent, setNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [internalNotes, setInternalNotes] = useState<any[]>([]);

  // Find customer orders and tickets
  const customerOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.customerEmail.toLowerCase() === customerId.toLowerCase() ||
        o.userId === customerId ||
        o.id === customerId
    );
  }, [orders, customerId]);

  const customerTickets = useMemo(() => {
    return supportTickets.filter(
      (t) =>
        (t.userEmail && t.userEmail.toLowerCase() === customerId.toLowerCase()) ||
        (t.customerEmail && t.customerEmail.toLowerCase() === customerId.toLowerCase()) ||
        t.userId === customerId
    );
  }, [supportTickets, customerId]);

  const customerReviews = useMemo(() => {
    return reviews.filter(
      (r: any) =>
        (r.customerEmail && r.customerEmail.toLowerCase() === customerId.toLowerCase()) ||
        (r.userEmail && r.userEmail.toLowerCase() === customerId.toLowerCase()) ||
        r.userId === customerId
    );
  }, [reviews, customerId]);

  // Derived customer details
  const customerName = customerOrders[0]?.customerName || 'Loyal Client';
  const customerEmail = customerOrders[0]?.customerEmail || customerId;
  const customerPhone = customerOrders[0]?.shippingAddress?.phone || customerOrders[0]?.customerPhone || 'Not provided';
  const firstOrderDate = customerOrders[customerOrders.length - 1]?.createdAt || customerOrders[customerOrders.length - 1]?.date || new Date().toISOString();
  const totalCompletedSpend = customerOrders
    .filter(
      (o) =>
        o.paymentStatus === 'SUCCESS' ||
        o.paymentStatus === 'captured' ||
        (o.paymentMethod.toLowerCase() === 'cod' && o.orderStatus === 'Delivered')
    )
    .reduce((sum, o) => sum + o.total, 0);

  // Load customer profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await crmApi.getCustomer(customerId);
        if (res.data?.notes) {
          setInternalNotes(res.data.notes);
        }
      } catch (e) {
        // Fallback default
      }
    };
    fetchProfile();
  }, [customerId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    setIsAddingNote(true);
    try {
      const res = await crmApi.addCustomerNote(customerId, {
        note: noteContent,
        author: 'Thiru Kailash (Owner)',
      });
      if (res.data) {
        setInternalNotes([...internalNotes, res.data]);
      } else {
        setInternalNotes([
          ...internalNotes,
          {
            id: `note-${Date.now()}`,
            note: noteContent,
            author: 'Thiru Kailash (Owner)',
            createdAt: new Date().toISOString(),
          },
        ]);
      }
      setNoteContent('');
      showNotification('Internal owner note saved', 'success');
    } catch (err: any) {
      showNotification(err.message || 'Failed to save note', 'alert');
    } finally {
      setIsAddingNote(false);
    }
  };

  // Build events for activity timeline
  const activityEvents: CustomerActivityEvent[] = useMemo(() => {
    const list: CustomerActivityEvent[] = [];

    customerOrders.forEach((o) => {
      list.push({
        id: `ord-${o.id}`,
        type: 'order',
        title: `Placed Order ${o.orderNumber}`,
        description: `${o.items.length} soap item(s) via ${o.paymentMethod.toUpperCase()}`,
        timestamp: o.createdAt || o.date,
        meta: formatPriceINR(o.total),
      });
    });

    customerTickets.forEach((t) => {
      list.push({
        id: `tkt-${t.id}`,
        type: 'support',
        title: `Opened Support Ticket: ${t.subject}`,
        description: `Category: ${t.category} • Status: ${t.status}`,
        timestamp: t.createdAt,
      });
    });

    customerReviews.forEach((r: any) => {
      list.push({
        id: `rev-${r.id}`,
        type: 'review',
        title: `Submitted ${r.rating}★ Review for ${r.productName || r.soapName || 'Artisan Soap'}`,
        description: `"${r.comment || ''}"`,
        timestamp: r.date || r.createdAt || new Date().toISOString(),
      });
    });

    internalNotes.forEach((n) => {
      list.push({
        id: `nt-${n.id}`,
        type: 'note',
        title: `Internal Note by ${n.author}`,
        description: n.note,
        timestamp: n.createdAt,
      });
    });

    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [customerOrders, customerTickets, customerReviews, internalNotes]);

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-serif font-bold text-stone-900">{customerName}</h1>
          <p className="text-xs text-stone-500">Customer Profile & Loyalty History</p>
        </div>
      </div>

      {/* Customer Header Badge Card */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg text-stone-900">{customerName}</span>
            <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              {customerOrders.length > 1 ? 'Repeat Patron' : 'First-time Customer'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              <span>{customerEmail}</span>
            </div>
            {customerPhone && (
              <div className="flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>{customerPhone}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>Customer since {new Date(firstOrderDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-stone-100 pt-3 md:pt-0 md:pl-6 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Completed Lifetime Spend
            </span>
            <div className="text-xl font-bold font-serif text-[#244635] mt-0.5">
              {formatPriceINR(totalCompletedSpend)}
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Total Orders
            </span>
            <div className="text-xl font-bold font-serif text-stone-800 mt-0.5">
              {customerOrders.length}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-1">
        {(['overview', 'orders', 'activity', 'addresses', 'support'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-[#244635] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {tab === 'orders' ? `Orders (${customerOrders.length})` : tab === 'support' ? `Support (${customerTickets.length})` : tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Metrics */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs">
              <h3 className="font-serif font-bold text-stone-900 text-sm pb-3 border-b border-stone-100 mb-4">
                Patron Metrics Summary
              </h3>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Total Orders</span>
                  <p className="text-base font-bold text-stone-900 mt-1">{customerOrders.length}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Average Order</span>
                  <p className="text-base font-bold text-[#244635] mt-1">
                    {customerOrders.length > 0
                      ? formatPriceINR(Math.round(totalCompletedSpend / customerOrders.length))
                      : '₹0'}
                  </p>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Support Tickets</span>
                  <p className="text-base font-bold text-blue-700 mt-1">{customerTickets.length}</p>
                </div>
              </div>
            </div>

            {/* Internal Notes Section */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-700" />
                  <h3 className="font-serif font-bold text-stone-900 text-sm">
                    Internal Owner Notes
                  </h3>
                </div>
                <span className="text-[10px] bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-full font-bold border border-amber-200">
                  Confidential • Never visible to customer
                </span>
              </div>

              <form onSubmit={handleAddNote} className="space-y-3">
                <textarea
                  rows={3}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Add private note regarding soap fragrance preferences, allergy notes, delivery preferences..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#244635]"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isAddingNote || !noteContent.trim()}
                    className="px-4 py-2 rounded-xl bg-[#244635] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingNote ? 'Saving...' : 'Add Internal Note'}</span>
                  </button>
                </div>
              </form>

              <div className="space-y-2.5 pt-2">
                {internalNotes.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No internal owner notes recorded yet.</p>
                ) : (
                  internalNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-semibold text-amber-950">
                        <span>{note.author}</span>
                        <span className="text-[10px] text-amber-800/60 font-mono">
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-stone-700 leading-relaxed">{note.note}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Latest Order Spotlight */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs">
              <h3 className="font-serif font-bold text-stone-900 text-sm pb-3 border-b border-stone-100 mb-3">
                Latest Order
              </h3>
              {customerOrders[0] ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span>{customerOrders[0].orderNumber}</span>
                    <span className="text-[#244635] font-serif">
                      {formatPriceINR(customerOrders[0].total)}
                    </span>
                  </div>
                  <div className="text-stone-500 text-[11px]">
                    Status: <span className="font-semibold text-stone-800">{customerOrders[0].orderStatus}</span>
                  </div>
                  <div className="text-stone-500 text-[11px]">
                    Placed: {new Date(customerOrders[0].createdAt || customerOrders[0].date).toLocaleDateString()}
                  </div>
                  {onNavigateOrder && (
                    <button
                      onClick={() => onNavigateOrder(customerOrders[0].id)}
                      className="w-full mt-3 py-2 rounded-xl bg-stone-100 hover:bg-[#244635] hover:text-white font-semibold transition-colors cursor-pointer"
                    >
                      Process Order in Workshop &gt;
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-xs text-stone-400">No orders placed yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs">
          <CustomerOrderHistory orders={customerOrders} onNavigateOrder={onNavigateOrder} />
        </div>
      )}

      {/* Tab 3: Activity Timeline */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs">
          <CustomerActivityTimeline events={activityEvents} />
        </div>
      )}

      {/* Tab 4: Addresses */}
      {activeTab === 'addresses' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-stone-900 text-sm pb-3 border-b border-stone-100">
            Recorded Shipping Destinations
          </h3>
          {customerOrders.length === 0 ? (
            <p className="text-xs text-stone-400">No addresses on file.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customerOrders.slice(0, 3).map((o, idx) => (
                <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-stone-900">
                    <MapPin className="w-3.5 h-3.5 text-[#244635]" />
                    <span>Destination from {o.orderNumber}</span>
                  </div>
                  <p className="text-stone-700 font-semibold">{o.customerName}</p>
                  <p className="text-stone-600">{o.shippingAddress?.street} {o.shippingAddress?.apartment || ''}</p>
                  <p className="text-stone-600">
                    {o.shippingAddress?.city}, {o.shippingAddress?.state} - {o.shippingAddress?.pincode || o.shippingAddress?.zipCode}
                  </p>
                  <p className="text-stone-500 font-mono text-[10px]">Phone: {o.shippingAddress?.phone || o.customerPhone}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Support Tickets */}
      {activeTab === 'support' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-stone-900 text-sm pb-3 border-b border-stone-100">
            Support Interactions
          </h3>
          {customerTickets.length === 0 ? (
            <p className="text-xs text-stone-400">No support tickets opened by this customer.</p>
          ) : (
            <div className="space-y-3">
              {customerTickets.map((t) => (
                <div
                  key={t.id}
                  className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 flex items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">{t.subject}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-800">
                        {t.status}
                      </span>
                    </div>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      Category: {t.category} • Created: {new Date(t.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {onOpenTicket && (
                    <button
                      onClick={() => onOpenTicket(t.id)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 font-semibold cursor-pointer"
                    >
                      Open Conversation &gt;
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
