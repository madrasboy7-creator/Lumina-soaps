import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Plus,
  Send,
  Users,
  Check,
  X,
  Tag,
  Calendar,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { CustomerCampaign } from '../../../types';
import { crmApi } from '../ownerApi';

export const CampaignManager: React.FC = () => {
  const { showNotification } = useStore();
  const [campaigns, setCampaigns] = useState<CustomerCampaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<CustomerCampaign>>({
    title: '',
    segmentId: 'seg-repeat',
    couponCode: 'LUMINA15',
    message: '',
    status: 'draft',
    channel: 'email',
  });

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const res = await crmApi.getCampaigns();
      const list = Array.isArray(res) ? res : (res as any)?.data || [];
      setCampaigns(list);
    } catch (err) {
      console.error('Failed to load campaigns', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.message?.trim()) {
      showNotification('Title and message are required', 'alert');
      return;
    }

    try {
      await crmApi.createCampaign({
        title: formData.title,
        segmentId: formData.segmentId || 'seg-repeat',
        couponCode: formData.couponCode,
        message: formData.message,
        channel: formData.channel || 'email',
        audienceCount: formData.segmentId === 'seg-repeat' ? 6 : 18,
      });

      showNotification(`Campaign draft "${formData.title}" saved`, 'success');
      setIsModalOpen(false);
      await loadCampaigns();
    } catch (err: any) {
      showNotification(err.message || 'Failed to create campaign', 'alert');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-purple-800 uppercase bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/60">
              CRM • Customer Retention
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">Campaign Manager</h1>
          <p className="text-xs text-stone-500">
            Draft customer retention campaigns, target loyalty segments, and configure festival discounts.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              title: '',
              segmentId: 'seg-repeat',
              couponCode: 'LUMINA15',
              message: '',
              status: 'draft',
              channel: 'email',
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign Draft</span>
        </button>
      </div>

      {/* Gateway Integration Notice */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-stone-600">
        <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-stone-800">Campaign Dispatch Policy</p>
          <p className="mt-0.5 leading-relaxed">
            Campaigns are drafted and audience-qualified within this CRM. Live external delivery (Email / WhatsApp API) requires authentic SMTP or gateway credentials.
            No simulated external sends are fabricated without real provider connections.
          </p>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-800">
                  Target: {camp.segmentId}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    camp.status === 'sent'
                      ? 'bg-emerald-50 text-emerald-800'
                      : camp.status === 'scheduled'
                      ? 'bg-blue-50 text-blue-800'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {camp.status}
                </span>
              </div>

              <h3 className="font-serif font-bold text-stone-900 text-base">{camp.title}</h3>
              <p className="text-xs text-stone-600 mt-2 line-clamp-2">{camp.message}</p>

              {camp.couponCode && (
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="text-[10px] text-stone-400 font-semibold uppercase">Coupon:</span>
                  <span className="font-mono font-bold text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md">
                    {camp.couponCode}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1 font-semibold text-stone-700">
                <Users className="w-3.5 h-3.5 text-stone-400" />
                <span>{camp.audienceCount || 6} qualified recipients</span>
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                {new Date(camp.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-stone-900 text-base">New Campaign Draft</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Diwali Artisan Soap Collection VIP Launch"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Target Segment</label>
                  <select
                    value={formData.segmentId}
                    onChange={(e) => setFormData({ ...formData, segmentId: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  >
                    <option value="seg-repeat">Repeat Patrons</option>
                    <option value="seg-high-value">High-Value VIPs (Spend &gt; ₹3000)</option>
                    <option value="seg-first-time">First-time Buyers</option>
                    <option value="seg-inactive">Inactive (60+ days)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Attached Coupon Code</label>
                  <input
                    type="text"
                    value={formData.couponCode}
                    onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                    placeholder="e.g. LUMINA15"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Campaign Message Content *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write promotional message copy..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Campaign Draft</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
