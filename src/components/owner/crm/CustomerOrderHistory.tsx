import React from 'react';
import { ShoppingBag, ArrowRight, CheckCircle2, Clock, Truck, AlertCircle } from 'lucide-react';
import { Order, formatPriceINR, OwnerModule } from '../../../types';

interface CustomerOrderHistoryProps {
  orders: Order[];
  onNavigateOrder?: (orderId: string) => void;
}

export const CustomerOrderHistory: React.FC<CustomerOrderHistoryProps> = ({
  orders,
  onNavigateOrder,
}) => {
  if (!orders || orders.length === 0) {
    return <div className="py-8 text-center text-xs text-stone-400">No previous orders on record.</div>;
  }

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div
          key={o.id}
          className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:border-[#244635] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900">{o.orderNumber}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-stone-100 text-stone-700">
                {o.orderStatus}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  o.paymentStatus === 'SUCCESS' || o.paymentStatus === 'captured'
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-amber-50 text-amber-800'
                }`}
              >
                {o.paymentStatus}
              </span>
            </div>

            <p className="text-stone-500 text-[11px]">
              Placed on {new Date(o.createdAt || o.date).toLocaleDateString()} • {o.items.length} soap item(s) • Method: {o.paymentMethod.toUpperCase()}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {o.items.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-stone-50 text-stone-700 text-[10px] px-2 py-0.5 rounded-md border border-stone-200/60"
                >
                  {item.productName} (x{item.quantity})
                </span>
              ))}
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
            <div className="text-sm font-bold text-[#244635] font-serif">
              {formatPriceINR(o.total)}
            </div>
            {onNavigateOrder && (
              <button
                onClick={() => onNavigateOrder(o.id)}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#244635] hover:text-white text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Fulfill in Operations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
