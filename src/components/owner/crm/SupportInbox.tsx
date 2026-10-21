import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag,
  ArrowRight,
  User,
  Plus,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { SupportTicket } from '../../../types';
import { SupportConversation } from './SupportConversation';
import { crmApi } from '../ownerApi';

interface SupportInboxProps {
  initialTicketId?: string;
}

export const SupportInbox: React.FC<SupportInboxProps> = ({ initialTicketId }) => {
  const { supportTickets: storeTickets, showNotification } = useStore();
  const [tickets, setTickets] = useState<SupportTicket[]>(storeTickets || []);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await crmApi.getSupportTickets();
      const list = Array.isArray(res) ? res : (res as any)?.data || [];
      setTickets(list);
      if (selectedTicket) {
        const updated = list.find((t: SupportTicket) => t.id === selectedTicket.id);
        if (updated) setSelectedTicket(updated);
      }
    } catch (err) {
      console.error('Failed to load tickets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (initialTicketId) {
      const found = tickets.find((t) => t.id === initialTicketId);
      if (found) setSelectedTicket(found);
    }
  }, [initialTicketId, tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        t.subject.toLowerCase().includes(q) ||
        (t.customerName || t.userName || '').toLowerCase().includes(q) ||
        (t.customerEmail || t.userEmail || '').toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesCat = categoryFilter === 'all' || t.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCat;
    });
  }, [tickets, searchQuery, statusFilter, categoryFilter]);

  if (selectedTicket) {
    return (
      <SupportConversation
        ticket={selectedTicket}
        onBack={() => setSelectedTicket(null)}
        onTicketUpdated={loadTickets}
      />
    );
  }

  const openCount = tickets.filter((t) => {
    const st = String(t.status).toLowerCase();
    return st === 'open' || st.includes('progress');
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-blue-800 uppercase bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
              CRM • Direct Patron Service
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">Support Inbox</h1>
          <p className="text-xs text-stone-500">
            Artisan customer care ticketing for order inquiries, delivery tracking questions, and custom soap formulation requests.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
          {openCount} Needs Owner Attention
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search tickets by subject, customer name, email, or ticket ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#244635] text-stone-800"
          />
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:ring-1 focus:ring-[#244635]"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="awaiting_customer">Awaiting Customer</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:ring-1 focus:ring-[#244635]"
          >
            <option value="all">All Categories</option>
            <option value="order_status">Order Status</option>
            <option value="product_question">Product Question</option>
            <option value="custom_order">Custom Formulation</option>
            <option value="feedback">Feedback</option>
            <option value="return_request">Return / Refund</option>
          </select>
        </div>
      </div>

      {/* Tickets List Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50/70 border-b border-stone-200/80 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Subject & Preview</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No support tickets matching current filters.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => {
                  const lastMsg = t.messages[t.messages.length - 1];
                  const st = String(t.status).toLowerCase();
                  const isOpen = st === 'open' || st.includes('progress');
                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className="hover:bg-stone-50/70 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-stone-500 text-[11px]">
                        #{t.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900 text-xs">{t.subject}</div>
                        <div className="text-[11px] text-stone-500 line-clamp-1 max-w-sm mt-0.5">
                          {lastMsg?.message || 'No messages yet'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-stone-800">{t.customerName || t.userName || 'Customer'}</div>
                        <div className="text-[10px] text-stone-400">{t.customerEmail || t.userEmail || ''}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-stone-100 text-stone-700 capitalize">
                          {t.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isOpen
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {t.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-400 text-[11px] font-mono">
                        {new Date(t.lastUpdated || t.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(t);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#244635] hover:text-white text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Open &gt;
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
