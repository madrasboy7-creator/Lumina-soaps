import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Check,
  X,
  ExternalLink,
  Sparkles,
  Tag,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { cmsApi } from '../ownerApi';

interface PromoBannerItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  placement: 'hero' | 'top_announcement' | 'cart_drawer' | 'checkout';
}

export const BannerManager: React.FC = () => {
  const { homepageConfig, refreshCMSData, showNotification } = useStore();

  const [banners, setBanners] = useState<PromoBannerItem[]>([
    {
      id: 'banner-1',
      title: 'Free Shipping Across India',
      subtitle: 'On all orders of 3 or more artisan cold process soap bars',
      badge: 'Free Delivery',
      ctaText: 'Shop Soaps',
      ctaLink: '/shop',
      placement: 'top_announcement',
      isActive: homepageConfig?.announcementBar?.enabled !== false,
    },
    {
      id: 'banner-2',
      title: 'Festive Herbal Gift Box Launch',
      subtitle: 'Cedar cured for 42 days with pure forest neem & wild honey',
      badge: 'Limited Release',
      ctaText: 'Explore Gifts',
      ctaLink: '/shop',
      imageUrl: 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80',
      placement: 'hero',
      isActive: true,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<PromoBannerItem | null>(null);

  const [formData, setFormData] = useState<Partial<PromoBannerItem>>({
    title: '',
    subtitle: '',
    badge: 'Offer',
    ctaText: 'Shop Now',
    ctaLink: '/shop',
    imageUrl: '',
    placement: 'hero',
    isActive: true,
  });

  const handleOpenModal = (banner?: PromoBannerItem) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData(banner);
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        badge: 'Special Announcement',
        ctaText: 'Explore',
        ctaLink: '/shop',
        imageUrl: 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80',
        placement: 'hero',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      showNotification('Banner title is required', 'alert');
      return;
    }

    if (editingBanner) {
      setBanners(
        banners.map((b) => (b.id === editingBanner.id ? ({ ...b, ...formData } as PromoBannerItem) : b))
      );
      showNotification(`Banner "${formData.title}" updated`, 'success');
    } else {
      const newBanner: PromoBannerItem = {
        id: `banner-${Date.now()}`,
        title: formData.title,
        subtitle: formData.subtitle,
        badge: formData.badge,
        ctaText: formData.ctaText,
        ctaLink: formData.ctaLink,
        imageUrl: formData.imageUrl,
        placement: formData.placement || 'hero',
        isActive: formData.isActive !== false,
      };
      setBanners([...banners, newBanner]);
      showNotification(`Banner "${formData.title}" created`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleToggle = (id: string) => {
    setBanners(
      banners.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
    showNotification('Banner visibility updated', 'info');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this banner?')) {
      setBanners(banners.filter((b) => b.id !== id));
      showNotification('Banner deleted', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-purple-800 uppercase bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/60">
              CMS • Announcements
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">Banner Manager</h1>
          <p className="text-xs text-stone-500">
            Configure header ribbons, festival banners, free shipping notices, and seasonal callouts.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Promotional Banner</span>
        </button>
      </div>

      {/* Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                  {b.placement}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggle(b.id)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                      b.isActive
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {b.isActive ? 'Active Live' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => handleOpenModal(b)}
                    className="p-1 text-stone-400 hover:text-stone-700"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1 text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {b.imageUrl && (
                <div className="h-32 rounded-2xl overflow-hidden mb-3 bg-stone-100">
                  <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                </div>
              )}

              {b.badge && (
                <span className="inline-block text-[10px] font-bold text-[#244635] bg-emerald-50 px-2 py-0.5 rounded-md mb-1.5">
                  {b.badge}
                </span>
              )}
              <h3 className="font-serif font-bold text-stone-900 text-base">{b.title}</h3>
              <p className="text-xs text-stone-600 mt-1">{b.subtitle}</p>
            </div>

            <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs">
              <span className="text-stone-400 font-mono text-[11px]">{b.ctaLink}</span>
              <span className="font-bold text-[#244635]">{b.ctaText} &rarr;</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                {editingBanner ? 'Edit Banner' : 'Create Promotional Banner'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Banner Headline *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  placeholder="e.g. Free Delivery Across India"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Subtitle / Details</label>
                <textarea
                  rows={2}
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                    placeholder="e.g. Festival Offer"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Placement</label>
                  <select
                    value={formData.placement}
                    onChange={(e) =>
                      setFormData({ ...formData, placement: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  >
                    <option value="hero">Homepage Hero</option>
                    <option value="top_announcement">Top Ribbon Bar</option>
                    <option value="cart_drawer">Cart Drawer Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={formData.ctaText || ''}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">CTA Destination Link</label>
                  <input
                    type="text"
                    value={formData.ctaLink || ''}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="bannerAct"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-[#244635] focus:ring-[#244635]"
                />
                <label htmlFor="bannerAct" className="text-stone-700 font-medium">
                  Active (show immediately on storefront)
                </label>
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
                  <span>Save Banner</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
