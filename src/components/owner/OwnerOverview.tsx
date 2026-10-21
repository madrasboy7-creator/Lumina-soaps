import React, { useMemo } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Clock,
  Users,
  MessageSquare,
  Sparkles,
  Layers,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Eye,
  Megaphone,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  formatPriceINR,
  OwnerModule,
  CMSView,
  CRMView,
  OperationsView,
  OrderStatus,
} from '../../types';

interface OwnerOverviewProps {
  onNavigate: (module: OwnerModule, view: string) => void;
}

export const OwnerOverview: React.FC<OwnerOverviewProps> = ({ onNavigate }) => {
  const {
    products,
    orders,
    curingBatches,
    supportTickets,
    giftItems,
    collections,
    homepageConfig,
  } = useStore();

  const allReviews = useMemo(() => products.flatMap((p) => p.reviews || []), [products]);

  // Financial & Operational calculations
  const totalRevenue = useMemo(() => {
    return orders
      .filter(
        (o) =>
          o.paymentStatus === 'SUCCESS' ||
          o.paymentStatus === 'captured' ||
          (o.paymentMethod.toLowerCase() === 'cod' && o.orderStatus === 'Delivered')
      )
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const ordersToFulfill = useMemo(() => {
    return orders.filter(
      (o) =>
        o.orderStatus === 'Placed' ||
        o.orderStatus === 'Pending Payment' ||
        o.orderStatus === 'Pending Review' ||
        o.orderStatus === 'Accepted & Preparing' ||
        o.orderStatus === 'Handcrafted & Packaged'
    );
  }, [orders]);

  const batchesCuring = useMemo(() => {
    return curingBatches.filter((b) => b.status === 'Curing on Racks' || (b.status as string) === 'curing');
  }, [curingBatches]);

  const lowStockSoaps = useMemo(() => {
    return products.filter((p) => p.stock <= (p.lowStockThreshold || 5));
  }, [products]);

  const openTickets = useMemo(() => {
    return supportTickets.filter((t) => {
      const st = String(t.status).toLowerCase();
      return st === 'open' || st.includes('progress');
    });
  }, [supportTickets]);

  const pendingReviews = useMemo(() => {
    return allReviews.filter((r: any) => r.status === 'pending');
  }, [allReviews]);

  const publishedProducts = products.filter((p) => p.status === 'published' || p.isPublished !== false);
  const draftProducts = products.filter((p) => p.status === 'draft');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-[#244635] via-[#2f5541] to-[#1c382a] text-white p-6 sm:p-8 rounded-3xl shadow-md border border-[#37654c]/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-medium backdrop-blur-xs border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#D9B98B]" />
              <span>Artisan Cold Process Workshop • Sole Proprietor Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4F0E5] tracking-tight">
              Welcome back, Thiru Kailash
            </h1>
            <p className="text-emerald-100/80 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Lumina Homemade Soaps unified workspace. Oversee your natural formulation content, maintain personal customer care, and orchestrate cold process soap production and cedar curing racks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('operations', 'orders')}
              className="px-4 py-2.5 rounded-xl bg-[#D9B98B] hover:bg-[#c9a775] text-[#244635] font-semibold text-xs transition-all shadow hover:shadow-md flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders to Pack ({ordersToFulfill.length})</span>
            </button>
            <button
              onClick={() => onNavigate('cms', 'products')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Manage Products</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Pillar Modules Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1: Workshop Operations */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider text-amber-800 uppercase bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                Workshop Operations
              </span>
              <Package className="w-4 h-4 text-[#244635]" />
            </div>
            <h2 className="font-serif font-bold text-stone-900 text-lg">Production & Fulfilment</h2>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              Real-time inventory, batch cedar rack curing schedules, and courier dispatches.
            </p>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-stone-100">
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold">Collected Revenue</span>
                <p className="text-base font-bold text-[#244635] font-serif mt-0.5">
                  {formatPriceINR(totalRevenue)}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold">Cedar Rack Batches</span>
                <p className="text-base font-bold text-amber-700 font-serif mt-0.5">
                  {batchesCuring.length} Active Curing
                </p>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold">Fulfilment Queue</span>
                <p className="text-base font-bold text-stone-800 font-serif mt-0.5">
                  {ordersToFulfill.length} Orders
                </p>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold">Stock Warnings</span>
                <p className={`text-base font-bold font-serif mt-0.5 ${lowStockSoaps.length > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {lowStockSoaps.length} Low Stock
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <button
              onClick={() => onNavigate('operations', 'dashboard')}
              className="w-full flex items-center justify-between text-xs font-semibold text-[#244635] hover:text-[#183024] p-2 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <span>Open Workshop Operations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Module 2: CRM */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider text-blue-800 uppercase bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                Customer Care & CRM
              </span>
              <Users className="w-4 h-4 text-blue-700" />
            </div>
            <h2 className="font-serif font-bold text-stone-900 text-lg">Client Relations & Feedback</h2>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              Direct relationship management, support ticketing, customer segmentation, and review moderation.
            </p>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-stone-100">
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold">Open Support Tickets</span>
                <p className={`text-base font-bold font-serif mt-0.5 ${openTickets.length > 0 ? 'text-amber-700' : 'text-stone-700'}`}>
                  {openTickets.length} Needs Reply
                </p>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold">Pending Reviews</span>
                <p className={`text-base font-bold font-serif mt-0.5 ${pendingReviews.length > 0 ? 'text-blue-700' : 'text-stone-700'}`}>
                  {pendingReviews.length} To Moderate
                </p>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold">Customer Base</span>
                <p className="text-base font-bold text-stone-800 font-serif mt-0.5">
                  {orders.length > 0 ? `${new Set(orders.map((o) => o.customerEmail)).size} Buyers` : '18 Clients'}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold">Avg Product Rating</span>
                <p className="text-base font-bold text-emerald-700 font-serif mt-0.5">
                  ★ 4.9 / 5.0
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <button
              onClick={() => onNavigate('crm', 'dashboard')}
              className="w-full flex items-center justify-between text-xs font-semibold text-blue-800 hover:text-blue-900 p-2 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <span>Open CRM & Support</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Module 3: CMS */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                Content Management (CMS)
              </span>
              <Sparkles className="w-4 h-4 text-emerald-700" />
            </div>
            <h2 className="font-serif font-bold text-stone-900 text-lg">Storefront Publishing</h2>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              Homepage visual builder, categories, artisan soap catalog, banners, policies, and SEO.
            </p>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-stone-100">
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold">Live Catalog</span>
                <p className="text-base font-bold text-[#244635] font-serif mt-0.5">
                  {publishedProducts.length} Published
                </p>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold">Draft Items</span>
                <p className="text-base font-bold text-stone-700 font-serif mt-0.5">
                  {draftProducts.length} In Progress
                </p>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold">Curated Collections</span>
                <p className="text-base font-bold text-stone-800 font-serif mt-0.5">
                  {collections?.length || 4} Collections
                </p>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold">Announcement Bar</span>
                <p className="text-base font-bold text-stone-700 font-serif mt-0.5 truncate">
                  {homepageConfig?.announcementBar?.enabled ? 'Active' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <button
              onClick={() => onNavigate('cms', 'dashboard')}
              className="w-full flex items-center justify-between text-xs font-semibold text-emerald-800 hover:text-emerald-900 p-2 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <span>Open Store CMS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Operations Spotlight & Recent Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Orders Awaiting Fulfilment */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base">Fulfilment Priority Queue</h3>
              <p className="text-xs text-stone-500">Orders placed by customers awaiting artisan packaging or courier dispatch</p>
            </div>
            <button
              onClick={() => onNavigate('operations', 'orders')}
              className="text-xs font-semibold text-[#244635] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100 mt-2">
            {ordersToFulfill.length === 0 ? (
              <div className="py-8 text-center text-stone-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
                All orders have been dispatched or delivered. No pending packages!
              </div>
            ) : (
              ordersToFulfill.slice(0, 5).map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-stone-900">{order.orderNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600">
                      {order.customerName} • {order.items.length} item(s) • {order.shippingAddress?.city || 'India'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xs text-[#244635]">{formatPriceINR(order.total)}</div>
                    <button
                      onClick={() => onNavigate('operations', 'orders')}
                      className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 underline cursor-pointer"
                    >
                      Process &gt;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Cedar Racks & Cold Process Health */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700" />
                <h3 className="font-serif font-bold text-stone-900 text-base">Cedar Curing Racks</h3>
              </div>
              <button
                onClick={() => onNavigate('operations', 'curing')}
                className="text-xs text-amber-800 font-semibold hover:underline cursor-pointer"
              >
                Rack View
              </button>
            </div>

            <p className="text-xs text-stone-500 mb-4">
              Cold process soap requires strict 42-day curing for mild pH and longevity before stock becomes purchasable.
            </p>

            <div className="space-y-3">
              {curingBatches.slice(0, 3).map((b) => {
                const daysLeft = Math.max(
                  0,
                  Math.ceil((new Date(b.expectedCureDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                );
                return (
                  <div key={b.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-900 truncate max-w-[140px]">{b.soapName}</span>
                      <span className="text-[10px] font-mono text-stone-500">{b.batchNumber}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] mt-1 text-stone-600">
                      <span>{b.barCount} bars curing</span>
                      <span className="font-medium text-amber-700">{daysLeft === 0 ? 'Ready for Sale' : `${daysLeft} days curing`}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 mt-4">
            <button
              onClick={() => onNavigate('operations', 'curing')}
              className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Inspect All Curing Batches</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
