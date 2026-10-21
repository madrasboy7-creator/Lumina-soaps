import React, { useState, useMemo } from 'react';
import {
  Printer,
  Search,
  FileText,
  CheckCircle,
  ExternalLink,
  Calendar,
  IndianRupee,
  Eye,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { Order, formatPriceINR } from '../../../types';
import { PackingSlipModal } from '../../PackingSlipModal';

export const InvoiceManager: React.FC = () => {
  const { orders, companySettings } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPackingSlipOrder, setSelectedPackingSlipOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.toLowerCase();
      return (
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        (o.shippingAddress?.city && o.shippingAddress.city.toLowerCase().includes(q))
      );
    });
  }, [orders, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-amber-800 uppercase bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              Operations • Documentation
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">Invoice & Packing Slip Manager</h1>
          <p className="text-xs text-stone-500">
            Generate printable packing slips and tax invoices with batch numbers, Cedar Curing notes, and INR pricing breakdown.
          </p>
        </div>

        <div className="text-xs text-stone-500 bg-stone-100 p-2 rounded-xl border border-stone-200 flex items-center gap-2">
          <Building className="w-4 h-4 text-stone-700" />
          <span>{companySettings?.companyName || 'Lumina Homemade Soaps'} (Sole Proprietor)</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by invoice number, order number, customer name, or destination city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#244635] text-stone-800"
          />
        </div>
        <span className="text-xs text-stone-500 font-semibold shrink-0">
          {filteredOrders.length} records
        </span>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50/70 border-b border-stone-200/80 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Invoice / Order #</th>
                <th className="py-3 px-4">Invoice Date</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Line Items</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Amount (INR)</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No orders matching search query.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      {o.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 text-[11px] font-mono">
                      {new Date(o.createdAt || o.date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900">{o.customerName}</div>
                      <div className="text-[10px] text-stone-400">{o.customerEmail}</div>
                      <div className="text-[10px] text-stone-500">{o.shippingAddress?.city || 'India'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-800">{o.items.length} soap item(s)</span>
                      <div className="text-[10px] text-stone-400 truncate max-w-xs mt-0.5">
                        {o.items.map((i) => i.productName).join(', ')}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] uppercase font-bold text-stone-700">
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#244635]">
                      {formatPriceINR(o.total)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedPackingSlipOrder(o)}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#244635] hover:text-white text-stone-700 font-semibold text-xs transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Invoice / Slip</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
