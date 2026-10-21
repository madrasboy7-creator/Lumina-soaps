import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  CheckCircle,
  XCircle,
  EyeOff,
  Search,
  Filter,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { Review } from '../../../types';
import { crmApi } from '../ownerApi';

export const ReviewManager: React.FC = () => {
  const { orders, refreshProducts, showNotification } = useStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');

  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await crmApi.getReviews();
      const list = Array.isArray(res) ? res : (res as any)?.data || [];
      setReviews(list);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleModerate = async (reviewId: string, status: 'approved' | 'rejected' | 'hidden') => {
    try {
      await crmApi.moderateReview(reviewId, status);
      showNotification(`Review status changed to ${status}`, 'success');
      await loadReviews();
      await refreshProducts();
    } catch (err: any) {
      showNotification(err.message || 'Failed to moderate review', 'alert');
    }
  };

  // Check verified purchase from real orders
  const verifiedOrderMap = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => {
      const email = o.customerEmail.toLowerCase();
      o.items.forEach((item) => {
        set.add(`${email}_${item.productId}`);
        set.add(`${email}_${item.productName.toLowerCase()}`);
      });
    });
    return set;
  }, [orders]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        (r.soapName || r.productName || '').toLowerCase().includes(q) ||
        (r.customerName || r.userName || '').toLowerCase().includes(q) ||
        (r.comment || '').toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchesRating = ratingFilter === 'all' || r.rating === Number(ratingFilter);

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, searchQuery, statusFilter, ratingFilter]);

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-amber-800 uppercase bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              CRM • Feedback Moderation
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">Review Moderation</h1>
          <p className="text-xs text-stone-500">
            Audit customer product reviews before they appear publicly on storefront soap pages. Real order verification.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
          {pendingCount} Pending Moderation
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search reviews by soap name, reviewer name, or comment keywords..."
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
            <option value="all">All Moderation Status</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved (Live)</option>
            <option value="rejected">Rejected</option>
            <option value="hidden">Hidden</option>
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:ring-1 focus:ring-[#244635]"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">★ 5 Stars</option>
            <option value="4">★ 4 Stars</option>
            <option value="3">★ 3 Stars</option>
            <option value="2">★ 2 Stars</option>
            <option value="1">★ 1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-stone-200/80 text-center text-xs text-stone-400">
            No reviews matching your filter criteria.
          </div>
        ) : (
          filteredReviews.map((r) => {
            const isVerified =
              r.isVerifiedBuyer ||
              (r.customerEmail &&
                (verifiedOrderMap.has(`${r.customerEmail.toLowerCase()}_${r.soapId || r.productId || ''}`) ||
                  verifiedOrderMap.has(`${r.customerEmail.toLowerCase()}_${(r.soapName || r.productName || '').toLowerCase()}`)));

            return (
              <div
                key={r.id}
                className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">{r.soapName}</span>
                    <div className="flex items-center text-amber-500 font-bold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-stone-700 font-bold text-xs">{r.rating}.0</span>
                    </div>

                    {isVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified Artisan Buyer</span>
                      </span>
                    )}

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        r.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-900'
                          : r.status === 'rejected'
                          ? 'bg-rose-100 text-rose-900'
                          : r.status === 'hidden'
                          ? 'bg-stone-100 text-stone-600'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {r.status || 'pending'}
                    </span>
                  </div>

                  <p className="text-stone-700 leading-relaxed italic bg-stone-50 p-3 rounded-2xl border border-stone-100">
                    "{r.comment}"
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-stone-400">
                    <span className="font-semibold text-stone-600">{r.customerName || r.userName || 'Customer'}</span>
                    {r.customerEmail && <span>({r.customerEmail})</span>}
                    <span>•</span>
                    <span className="font-mono">{new Date(r.date || r.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0 border-t md:border-t-0 md:border-l border-stone-100 pt-3 md:pt-0 md:pl-4">
                  {r.status !== 'approved' && (
                    <button
                      onClick={() => handleModerate(r.id, 'approved')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve Live</span>
                    </button>
                  )}

                  {r.status !== 'rejected' && (
                    <button
                      onClick={() => handleModerate(r.id, 'rejected')}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Review</span>
                    </button>
                  )}

                  {r.status !== 'hidden' && (
                    <button
                      onClick={() => handleModerate(r.id, 'hidden')}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <EyeOff className="w-3 h-3" />
                      <span>Hide</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
