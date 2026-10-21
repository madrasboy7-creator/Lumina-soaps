import React, { useState } from 'react';
import {
  Gift,
  Tag,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Package,
  Sparkles,
  Percent,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { GiftItem, ComboOffer, formatPriceINR } from '../../../types';

export const PromotionManager: React.FC = () => {
  const {
    offers,
    activeOffer,
    createOffer,
    updateOffer,
    giftItems,
    addGiftItem,
    updateGiftItem,
    deleteGiftItem,
    showNotification,
  } = useStore();

  // Active Combo Offer state
  const [offerForm, setOfferForm] = useState<ComboOffer>(
    activeOffer || {
      id: 'combo-1',
      title: 'Buy 6 Artisan Soaps, Get 1 Handcrafted Wooden Soap Dish Free',
      description: 'Handcrafted neem wood draining soap dish with every order of 6 cold process soaps.',
      thresholdQuantity: 6,
      minimumQuantity: 6,
      giftsPerThreshold: 1,
      maxGiftsPerOrder: 3,
      startsAt: new Date().toISOString(),
      giftItemId: giftItems[0]?.id || '',
      bannerText: 'Special Studio Offer: Buy 6 Soaps, Get a Handcrafted Soap Dish FREE! + Free Shipping across India',
      isActive: true,
      freeShippingThreshold: 999,
      offerType: 'buy_x_get_y',
      includedSoaps: [],
    }
  );

  const [isSavingOffer, setIsSavingOffer] = useState(false);

  // Gift Item Modal State
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<GiftItem | null>(null);
  const [giftFormData, setGiftFormData] = useState<Partial<GiftItem>>({
    name: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    stockQuantity: 50,
    sku: 'LUM-GIFT-01',
    isActive: true,
  });

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingOffer(true);
    try {
      if (activeOffer) {
        await updateOffer(activeOffer.id, offerForm);
      } else {
        await createOffer(offerForm);
      }
      showNotification('Promotion offer and threshold rules updated successfully', 'success');
    } catch (err: any) {
      showNotification(err.message || 'Failed to update offer', 'alert');
    } finally {
      setIsSavingOffer(false);
    }
  };

  const handleOpenGiftModal = (gift?: GiftItem) => {
    if (gift) {
      setEditingGift(gift);
      setGiftFormData(gift);
    } else {
      setEditingGift(null);
      setGiftFormData({
        name: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
        stockQuantity: 50,
        sku: `LUM-GIFT-0${giftItems.length + 1}`,
        isActive: true,
      });
    }
    setIsGiftModalOpen(true);
  };

  const handleSaveGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftFormData.name?.trim()) {
      showNotification('Gift item name is required', 'alert');
      return;
    }

    try {
      if (editingGift) {
        await updateGiftItem(editingGift.id, giftFormData);
        showNotification(`Gift item "${giftFormData.name}" updated`, 'success');
      } else {
        await addGiftItem({
          name: giftFormData.name!,
          description: giftFormData.description || '',
          image: giftFormData.image || '',
          stockQuantity: Number(giftFormData.stockQuantity || 0),
          sku: giftFormData.sku || 'LUM-GIFT',
          isActive: giftFormData.isActive !== false,
        });
        showNotification(`Gift item "${giftFormData.name}" added to inventory`, 'success');
      }
      setIsGiftModalOpen(false);
    } catch (err: any) {
      showNotification(err.message || 'Failed to save gift item', 'alert');
    }
  };

  const handleDeleteGift = async (id: string, name: string) => {
    if (window.confirm(`Delete promotional gift item "${name}"?`)) {
      try {
        await deleteGiftItem(id);
        showNotification(`Gift item "${name}" deleted`, 'info');
      } catch (err: any) {
        showNotification(err.message || 'Failed to delete gift item', 'alert');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-amber-800 uppercase bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              CMS • Promotions & Gifts
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Promotions & Free Gift Engine
          </h1>
          <p className="text-xs text-stone-500">
            Configure automated cart threshold perks (e.g. Buy 6 Soaps Get 1 Wooden Dish Free) and manage free gift stock.
          </p>
        </div>
      </div>

      {/* Main Combo Offer Rule Card */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="font-serif font-bold text-stone-900 text-base">
                Active Threshold Offer Rule
              </h2>
              <p className="text-xs text-stone-500">Automatically applied at checkout when customer soap count hits threshold</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="offerActive"
              checked={offerForm.isActive}
              onChange={(e) => setOfferForm({ ...offerForm, isActive: e.target.checked })}
              className="rounded text-[#244635] focus:ring-[#244635]"
            />
            <label htmlFor="offerActive" className="text-xs font-bold text-stone-800">
              Offer Active Live
            </label>
          </div>
        </div>

        <form onSubmit={handleSaveOffer} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Offer Display Title *</label>
              <input
                type="text"
                required
                value={offerForm.title}
                onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Threshold Soaps Count (Quantity)
              </label>
              <input
                type="number"
                min={1}
                value={offerForm.thresholdQuantity}
                onChange={(e) =>
                  setOfferForm({ ...offerForm, thresholdQuantity: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Selected Free Gift Item
              </label>
              <select
                value={offerForm.giftItemId}
                onChange={(e) => setOfferForm({ ...offerForm, giftItemId: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
              >
                {giftItems.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} (Stock: {g.stockQuantity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Free Shipping Threshold (INR)
              </label>
              <input
                type="number"
                min={0}
                value={offerForm.freeShippingThreshold || 999}
                onChange={(e) =>
                  setOfferForm({ ...offerForm, freeShippingThreshold: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-stone-700 font-semibold mb-1">
                Storefront Banner Ribbon Copy
              </label>
              <input
                type="text"
                value={offerForm.bannerText}
                onChange={(e) => setOfferForm({ ...offerForm, bannerText: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSavingOffer}
              className="px-6 py-2.5 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white font-semibold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSavingOffer ? 'Saving Rule...' : 'Save Promotion Rule'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Promotional Gift Items Inventory */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
          <div>
            <h2 className="font-serif font-bold text-stone-900 text-base">
              Promotional Gift Inventory
            </h2>
            <p className="text-xs text-stone-500">
              Gifts bundled free with qualifying orders (e.g. Handcrafted Wooden Soap Dishes, Sisal Soap Savers)
            </p>
          </div>
          <button
            onClick={() => handleOpenGiftModal()}
            className="px-3.5 py-2 rounded-xl bg-[#244635] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Gift Item</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {giftItems.map((g) => (
            <div
              key={g.id}
              className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-stone-500">{g.sku}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenGiftModal(g)}
                      className="p-1 text-stone-400 hover:text-stone-700"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteGift(g.id, g.name)}
                      className="p-1 text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={g.image || '/logo.svg'}
                    alt={g.name}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200 bg-white shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-stone-900 text-xs">{g.name}</h3>
                    <p className="text-[11px] text-stone-500 line-clamp-1">{g.description}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs">
                <span className="text-stone-500">Workshop Inventory:</span>
                <span className="font-bold text-stone-900 bg-white px-2.5 py-0.5 rounded-lg border border-stone-200">
                  {g.stockQuantity} units
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gift Modal */}
      {isGiftModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                {editingGift ? 'Edit Gift Item' : 'New Promotional Gift Item'}
              </h3>
              <button
                onClick={() => setIsGiftModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGift} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Gift Item Name *</label>
                <input
                  type="text"
                  required
                  value={giftFormData.name || ''}
                  onChange={(e) => setGiftFormData({ ...giftFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  placeholder="e.g. Handcrafted Neem Wood Dish"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={giftFormData.description || ''}
                  onChange={(e) => setGiftFormData({ ...giftFormData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">SKU</label>
                  <input
                    type="text"
                    value={giftFormData.sku || ''}
                    onChange={(e) => setGiftFormData({ ...giftFormData, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={giftFormData.stockQuantity || 0}
                    onChange={(e) =>
                      setGiftFormData({ ...giftFormData, stockQuantity: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={giftFormData.image || ''}
                  onChange={(e) => setGiftFormData({ ...giftFormData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGiftModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Gift Item</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
