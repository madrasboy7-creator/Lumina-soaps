import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  ShoppingBag,
  MessageSquare,
  ShieldAlert,
  ArrowUpDown,
  Tag,
  Calendar,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { formatPriceINR } from '../../../types';
import { crmApi } from '../ownerApi';

interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  orderCount: number;
  totalSpend: number;
  lastOrderDate?: string;
  classification: 'new' | 'repeat' | 'vip' | 'inactive';
  openTicketsCount: number;
  status: 'active' | 'suspended';
}

interface CustomerDirectoryProps {
  onSelectCustomer: (customerId: string) => void;
}

export const CustomerDirectory: React.FC<CustomerDirectoryProps> = ({ onSelectCustomer }) => {
  const { orders, supportTickets } = useStore();
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClassification, setFilterClassification] = useState<string>('all');

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await crmApi.getCustomers();
      const list = Array.isArray(res) ? res : (res as any)?.data;
      if (list && list.length > 0) {
        setCustomers(list);
      } else {
        // Fallback calculation from orders if empty
        const map = new Map<string, CustomerSummary>();
        orders.forEach((o) => {
          const email = o.customerEmail.toLowerCase();
          const existing = map.get(email) || {
            id: email,
            name: o.customerName,
            email: o.customerEmail,
            phone: o.shippingAddress?.phone || o.customerPhone,
            createdAt: o.createdAt || o.date,
            orderCount: 0,
            totalSpend: 0,
            lastOrderDate: o.createdAt || o.date,
            classification: 'new',
            openTicketsCount: 0,
            status: 'active',
          };
          existing.orderCount += 1;
          existing.totalSpend += o.total;
          if (new Date(o.createdAt || o.date) > new Date(existing.lastOrderDate!)) {
            existing.lastOrderDate = o.createdAt || o.date;
          }
          if (existing.orderCount > 1) existing.classification = 'repeat';
          if (existing.totalSpend > 3000) existing.classification = 'vip';
          map.set(email, existing);
        });
        setCustomers(Array.from(map.values()));
      }
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q));

      const matchesClass =
        filterClassification === 'all' ||
        (filterClassification === 'open_support' ? c.openTicketsCount > 0 : c.classification === filterClassification);

      return matchesSearch && matchesClass;
    });
  }, [customers, searchQuery, filterClassification]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-blue-800 uppercase bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
              CRM • Customer Accounts
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">Customer Directory</h1>
          <p className="text-xs text-stone-500">
            Real customer database with purchase history, lifetime value, loyalty classification, and support tickets.
          </p>
        </div>

        <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
          Total Customers: {customers.length}
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search customer by name, email, or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#244635] text-stone-800"
          />
        </div>

        <select
          value={filterClassification}
          onChange={(e) => setFilterClassification(e.target.value)}
          className="py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:ring-1 focus:ring-[#244635]"
        >
          <option value="all">All Classifications</option>
          <option value="new">New Buyers</option>
          <option value="repeat">Repeat Customers</option>
          <option value="vip">VIP / High-Value</option>
          <option value="inactive">Inactive</option>
          <option value="open_support">Has Open Support</option>
        </select>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50/70 border-b border-stone-200/80 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Orders Placed</th>
                <th className="py-3 px-4">Completed Spend</th>
                <th className="py-3 px-4">Latest Order</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Support</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No customers found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-semibold text-stone-900 text-xs">{c.name}</div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-stone-400" />
                          <span>{c.email}</span>
                        </div>
                        {c.phone && (
                          <div className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5 font-mono">
                            <Phone className="w-2.5 h-2.5 text-stone-400" />
                            <span>{c.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-800">
                      {c.orderCount} order(s)
                    </td>
                    <td className="py-3 px-4 font-bold text-[#244635]">
                      {formatPriceINR(c.totalSpend)}
                    </td>
                    <td className="py-3 px-4 text-stone-600 text-[11px]">
                      {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          c.classification === 'vip'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : c.classification === 'repeat'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {c.classification}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {c.openTicketsCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <MessageSquare className="w-3 h-3" />
                          <span>{c.openTicketsCount} open</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-stone-400">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectCustomer(c.id)}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#244635] hover:text-white text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        View Profile &gt;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
