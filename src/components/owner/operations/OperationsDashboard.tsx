import React, { useMemo } from 'react';
import {
  Package,
  ShoppingBag,
  Clock,
  Truck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { OperationsView, formatPriceINR } from '../../../types';

interface OperationsDashboardProps {
  onNavigateOperations: (view: OperationsView, param?: string) => void;
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({
  onNavigateOperations,
}) => {
  const { products, orders, curingBatches, giftItems } = useStore();

  const totalCollectedRevenue = useMemo(() => {
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
        o.orderStatus === 'Processing'
    );
  }, [orders]);

  const ordersReadyToDispatch = useMemo(() => {
    return orders.filter(
      (o) => o.orderStatus === 'Processing' || o.orderStatus === 'Accepted & Preparing' || o.orderStatus === 'Packed'
    );
  }, [orders]);

  const batchesCuring = useMemo(() => {
    return curingBatches.filter(
      (b) => b.status === 'Curing on Racks' || (b.status as string) === 'curing'
    );
  }, [curingBatches]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock <= (p.lowStockThreshold || 5));
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-amber-800 uppercase bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              Workshop Operations • Studio Floor
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Operations & Production Dashboard
          </h1>
          <p className="text-xs text-stone-500">
            Real-time management of artisan soap inventory, 42-day cedar curing racks, parcel packaging, and courier dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateOperations('orders')}
            className="px-4 py-2 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Process Fulfilment ({ordersToFulfill.length})</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Collected Revenue</div>
          <div className="text-2xl font-bold font-serif text-[#244635] mt-1">
            {formatPriceINR(totalCollectedRevenue)}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Excludes cancelled & unpaid</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Orders In Queue</div>
          <div className="text-2xl font-bold font-serif text-amber-900 mt-1">
            {ordersToFulfill.length}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">
            {ordersReadyToDispatch.length} ready for packing slip
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Cedar Curing Batches</div>
          <div className="text-2xl font-bold font-serif text-stone-900 mt-1">
            {batchesCuring.length}
          </div>
          <div className="text-[11px] text-stone-500 font-medium mt-1">
            42-day cold process cure
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Stock Alerts</div>
          <div className={`text-2xl font-bold font-serif mt-1 ${lowStockProducts.length > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
            {lowStockProducts.length}
          </div>
          <div className="text-[11px] text-stone-500 font-medium mt-1">
            Bars below low-stock threshold
          </div>
        </div>
      </div>

      {/* Main Operations Split: Priority Orders & Cedar Rack Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Orders in Fulfilment */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-sm">
                Orders Awaiting Handcrafting & Dispatch
              </h3>
              <p className="text-xs text-stone-500">Prioritized for packaging slip generation and courier collection</p>
            </div>
            <button
              onClick={() => onNavigateOperations('orders')}
              className="text-xs font-semibold text-[#244635] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {ordersToFulfill.length === 0 ? (
              <div className="py-12 text-center text-xs text-stone-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
                All orders are currently dispatched or delivered!
              </div>
            ) : (
              ordersToFulfill.slice(0, 5).map((o) => (
                <div key={o.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">{o.orderNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {o.orderStatus}
                      </span>
                    </div>
                    <p className="text-stone-600">
                      {o.customerName} • {o.items.length} soap item(s) • Destination: {o.shippingAddress?.city || 'India'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#244635] font-serif">{formatPriceINR(o.total)}</div>
                    <button
                      onClick={() => onNavigateOperations('orders')}
                      className="text-[11px] font-semibold text-stone-500 hover:text-stone-900 underline cursor-pointer"
                    >
                      Fulfill &gt;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Cedar Racks Status */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700" />
                <h3 className="font-serif font-bold text-stone-900 text-sm">Cedar Curing Floor</h3>
              </div>
              <button
                onClick={() => onNavigateOperations('curing')}
                className="text-xs text-amber-800 font-semibold hover:underline cursor-pointer"
              >
                Rack View &gt;
              </button>
            </div>

            <p className="text-xs text-stone-500 mb-4">
              42-day aging ensures moisture evaporation, bar hardness, and gentle lather before inventory release.
            </p>

            <div className="space-y-3">
              {curingBatches.slice(0, 3).map((b) => {
                const daysLeft = Math.max(
                  0,
                  Math.ceil((new Date(b.expectedCureDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                );
                return (
                  <div key={b.id} className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60 text-xs">
                    <div className="flex items-center justify-between font-semibold text-stone-900">
                      <span className="truncate max-w-[150px]">{b.soapName}</span>
                      <span className="text-[10px] font-mono text-stone-400">{b.batchNumber}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-600 mt-1">
                      <span>{b.barCount} bars curing</span>
                      <span className={`font-bold ${daysLeft === 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
                        {daysLeft === 0 ? 'Ready for Sale' : `${daysLeft} days curing`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 mt-4">
            <button
              onClick={() => onNavigateOperations('curing')}
              className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Inspect All Curing Racks</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
