import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Tag,
  Plus,
  Check,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { CustomerSegment } from '../../../types';
import { crmApi } from '../ownerApi';

interface CustomerSegmentsProps {
  onSelectCustomer?: (customerId: string) => void;
}

export const CustomerSegments: React.FC<CustomerSegmentsProps> = ({ onSelectCustomer }) => {
  const { orders, supportTickets } = useStore();
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<CustomerSegment | null>(null);

  const loadSegments = async () => {
    try {
      setLoading(true);
      const res = await crmApi.getSegments();
      const segs = Array.isArray(res) ? res : (res as any)?.data || [];
      setSegments(segs);
      if (!selectedSegment && segs.length > 0) {
        setSelectedSegment(segs[0]);
      }
    } catch (err) {
      console.error('Failed to load segments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSegments();
  }, []);

  // Compute members for each segment based on transparent business rules
  const segmentAudiences = useMemo(() => {
    const customerMap = new Map<string, any>();
    orders.forEach((o) => {
      const email = o.customerEmail.toLowerCase();
      const existing = customerMap.get(email) || {
        email,
        name: o.customerName,
        phone: o.shippingAddress?.phone || o.customerPhone,
        orderCount: 0,
        totalSpend: 0,
        lastOrderDate: o.createdAt || o.date,
        hasOpenTicket: false,
      };
      existing.orderCount += 1;
      existing.totalSpend += o.total;
      if (new Date(o.createdAt || o.date) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = o.createdAt || o.date;
      }
      customerMap.set(email, existing);
    });

    supportTickets.forEach((t) => {
      const st = String(t.status).toLowerCase();
      if (st === 'open' || st.includes('progress')) {
        const email = (t.userEmail || t.customerEmail || '').toLowerCase();
        const c = customerMap.get(email);
        if (c) c.hasOpenTicket = true;
      }
    });

    const allCustomers = Array.from(customerMap.values());
    const now = Date.now();

    const audiences: { [segId: string]: any[] } = {
      'seg-repeat': allCustomers.filter((c) => c.orderCount > 1),
      'seg-high-value': allCustomers.filter((c) => c.totalSpend >= 3000),
      'seg-first-time': allCustomers.filter((c) => c.orderCount === 1),
      'seg-inactive': allCustomers.filter(
        (c) => (now - new Date(c.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24) >= 60
      ),
      'seg-support-open': allCustomers.filter((c) => c.hasOpenTicket),
    };

    return audiences;
  }, [orders, supportTickets]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-purple-800 uppercase bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/60">
              CRM • Loyalty Cohorts
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">Customer Segments</h1>
          <p className="text-xs text-stone-500">
            Targeted customer groups based on real purchase frequencies, completed lifetime spend, and service status.
          </p>
        </div>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {segments.map((seg) => {
          const audience = segmentAudiences[seg.id] || [];
          const isSelected = selectedSegment?.id === seg.id;
          return (
            <div
              key={seg.id}
              onClick={() => setSelectedSegment(seg)}
              className={`p-5 bg-white rounded-3xl border shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
                isSelected ? 'border-[#244635] ring-2 ring-[#244635]/20' : 'border-stone-200/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-800">
                    Cohort
                  </span>
                  <span className="text-xs font-bold text-stone-800">
                    {audience.length} patrons
                  </span>
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-base">{seg.name}</h3>
                <p className="text-xs text-stone-600 mt-1">{seg.description}</p>
                <div className="mt-3 p-2 bg-stone-50 rounded-xl text-[10px] text-stone-500 font-mono">
                  Rule: {seg.criteria || seg.criteriaType}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs text-[#244635] font-semibold">
                <span>View Audience</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Audience List for Selected Segment */}
      {selectedSegment && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base">
                Members in "{selectedSegment.name}"
              </h3>
              <p className="text-xs text-stone-500">{selectedSegment.description}</p>
            </div>
            <span className="text-xs font-bold text-[#244635] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {(segmentAudiences[selectedSegment.id] || []).length} Patrons
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {(segmentAudiences[selectedSegment.id] || []).length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-400">
                No customers currently match this segment's criteria.
              </div>
            ) : (
              (segmentAudiences[selectedSegment.id] || []).map((c, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="font-semibold text-stone-900">{c.name}</div>
                    <div className="text-[11px] text-stone-500">{c.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#244635]">₹{c.totalSpend}</div>
                    <div className="text-[10px] text-stone-400">{c.orderCount} order(s)</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
