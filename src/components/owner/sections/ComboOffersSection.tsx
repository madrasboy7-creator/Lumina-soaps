import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  EyeOff,
  AlertCircle,
  Calendar,
  Tag,
  Gift,
  X,
  Package,
} from 'lucide-react';
import { ComboOffer, ComboOfferType, SoapProduct, formatPriceINR } from '../../../types';

interface ComboOffersSectionProps {
  offers: ComboOffer[];
  products: SoapProduct[];
  onCreateOffer: (data: Partial<ComboOffer>) => Promise<ComboOffer>;
  onUpdateOffer: (id: string, data: Partial<ComboOffer>) => Promise<ComboOffer>;
  onDeleteOffer: (id: string) => Promise<void>;
  onToggleActive: (id: string) => Promise<void>;
  onRefresh: () => void;
}

export const ComboOffersSection: React.FC<ComboOffersSectionProps> = ({
  offers,
  products,
  onCreateOffer,
  onUpdateOffer,
  onDeleteOffer,
  onToggleActive,
  onRefresh,
}) => {
  const [editingOffer, setEditingOffer] = useState<Partial<ComboOffer> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [offerType, setOfferType] = useState<ComboOfferType>('fixed_price');
  const [comboPrice, setComboPrice] = useState<number>(599);
  const [discountPercentage, setDiscountPercentage] = useState<number>(15);
  const [discountAmount, setDiscountAmount] = useState<number>(100);
  const [minimumQuantity, setMinimumQuantity] = useState<number>(4);
  const [rewardQuantity, setRewardQuantity] = useState<number>(1);
  const [rewardSoapId, setRewardSoapId] = useState<string>('');
  const [startsAt, setStartsAt] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endsAt, setEndsAt] = useState<string>('');
  const [usageLimit, setUsageLimit] = useState<number | undefined>(undefined);
  const [terms, setTerms] = useState('Available while handcrafted stocks last.');
  const [isActive, setIsActive] = useState<boolean>(true);

  // Included soaps mapping: { soapId: quantity }
  const [selectedSoapMap, setSelectedSoapMap] = useState<Record<string, number>>({});

  const handleOpenCreate = () => {
    setEditingOffer({});
    setTitle('');
    setDescription('');
    setImage('');
    setOfferType('fixed_price');
    setComboPrice(599);
    setDiscountPercentage(15);
    setDiscountAmount(100);
    setMinimumQuantity(4);
    setRewardQuantity(1);
    setRewardSoapId(products[0]?.id || '');
    setStartsAt(new Date().toISOString().split('T')[0]);
    setEndsAt('');
    setUsageLimit(undefined);
    setTerms('Available while handcrafted stocks last.');
    setIsActive(true);
    setSelectedSoapMap({});
    setFormError(null);
  };

  const handleOpenEdit = (offer: ComboOffer) => {
    setEditingOffer(offer);
    setTitle(offer.title);
    setDescription(offer.description);
    setImage(offer.image || '');
    setOfferType(offer.offerType || 'fixed_price');
    setComboPrice(offer.comboPrice || 599);
    setDiscountPercentage(offer.discountPercentage || 15);
    setDiscountAmount(offer.discountAmount || 100);
    setMinimumQuantity(offer.minimumQuantity || 4);
    setRewardQuantity(offer.rewardQuantity || 1);
    setRewardSoapId(offer.rewardSoapId || products[0]?.id || '');
    setStartsAt(offer.startsAt ? offer.startsAt.split('T')[0] : '');
    setEndsAt(offer.endsAt ? offer.endsAt.split('T')[0] : '');
    setUsageLimit(offer.usageLimit);
    setTerms(offer.terms || '');
    setIsActive(offer.isActive !== false);

    const map: Record<string, number> = {};
    if (offer.includedSoaps) {
      offer.includedSoaps.forEach((it) => {
        map[it.soapId] = it.quantity || 1;
      });
    }
    setSelectedSoapMap(map);
    setFormError(null);
  };

  const handleToggleSoap = (soapId: string) => {
    setSelectedSoapMap((prev) => {
      const copy = { ...prev };
      if (copy[soapId]) {
        delete copy[soapId];
      } else {
        copy[soapId] = 1;
      }
      return copy;
    });
  };

  const handleSoapQtyChange = (soapId: string, qty: number) => {
    if (qty <= 0) {
      handleToggleSoap(soapId);
      return;
    }
    setSelectedSoapMap((prev) => ({
      ...prev,
      [soapId]: qty,
    }));
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Offer title is required.');
      return;
    }

    const includedList = Object.entries(selectedSoapMap).map(([soapId, quantity]) => {
      const product = products.find((p) => p.id === soapId);
      return {
        soapId,
        soapName: product?.name || 'Artisan Soap',
        quantity,
        image: product?.image,
      };
    });

    if (offerType !== 'buy_x_get_y' && includedList.length === 0) {
      setFormError('Please select at least one soap included in this combo.');
      return;
    }

    const payload: Partial<ComboOffer> = {
      title: title.trim(),
      description: description.trim(),
      image: image.trim() || undefined,
      offerType,
      comboPrice: offerType === 'fixed_price' ? Number(comboPrice) : undefined,
      discountPercentage: offerType === 'percentage_discount' ? Number(discountPercentage) : undefined,
      discountAmount: offerType === 'fixed_discount' ? Number(discountAmount) : undefined,
      includedSoaps: includedList,
      minimumQuantity: offerType === 'buy_x_get_y' ? Number(minimumQuantity) : undefined,
      rewardQuantity: offerType === 'buy_x_get_y' ? Number(rewardQuantity) : undefined,
      rewardSoapId: offerType === 'buy_x_get_y' ? rewardSoapId : undefined,
      startsAt: startsAt ? new Date(startsAt).toISOString() : new Date().toISOString(),
      endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      terms: terms.trim(),
      isActive,
    };

    setIsSaving(true);
    try {
      if (editingOffer?.id) {
        await onUpdateOffer(editingOffer.id, payload);
      } else {
        await onCreateOffer(payload);
      }
      setEditingOffer(null);
      onRefresh();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save combo offer');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (offer: ComboOffer) => {
    if (!window.confirm(`Are you sure you want to delete combo offer "${offer.title}"?`)) {
      return;
    }
    try {
      await onDeleteOffer(offer.id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete offer');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Combo Offers &amp; Bundles
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Create fixed-price bundles, percentage savings, and buy-X-get-Y promotions. Validated on server and displayed on storefront.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-[#244635] hover:bg-[#1b3427] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Combo Offer</span>
        </button>
      </div>

      {/* Offers Cards Grid */}
      {offers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {offers.map((off) => {
            return (
              <div
                key={off.id}
                className={`bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between shadow-xs ${
                  off.isActive ? 'border-emerald-200' : 'border-stone-200 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      off.offerType === 'fixed_price'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : off.offerType === 'percentage_discount'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : off.offerType === 'fixed_discount'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-purple-50 text-purple-800 border-purple-300'
                    }`}>
                      {off.offerType.replace(/_/g, ' ')}
                    </span>
                    <button
                      onClick={() => onToggleActive(off.id)}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-colors ${
                        off.isActive
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-stone-100 text-stone-600 border-stone-300'
                      }`}
                    >
                      {off.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  <h3 className="font-serif font-bold text-base text-stone-900 leading-snug">
                    {off.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {off.description}
                  </p>

                  {/* Pricing / Benefit Highlights */}
                  <div className="my-3 p-3 bg-[#FAF7EF] rounded-xl border border-[#ded4bf] text-xs">
                    {off.offerType === 'fixed_price' && (
                      <div className="flex items-center justify-between">
                        <span className="text-stone-600">Bundle Price:</span>
                        <span className="font-bold text-sm text-[#244635]">
                          {formatPriceINR(off.comboPrice || 0)}
                        </span>
                      </div>
                    )}
                    {off.offerType === 'percentage_discount' && (
                      <div className="flex items-center justify-between">
                        <span className="text-stone-600">Discount:</span>
                        <span className="font-bold text-sm text-blue-800">
                          {off.discountPercentage}% OFF
                        </span>
                      </div>
                    )}
                    {off.offerType === 'fixed_discount' && (
                      <div className="flex items-center justify-between">
                        <span className="text-stone-600">Flat Savings:</span>
                        <span className="font-bold text-sm text-amber-800">
                          {formatPriceINR(off.discountAmount || 0)} OFF
                        </span>
                      </div>
                    )}
                    {off.offerType === 'buy_x_get_y' && (
                      <div className="flex items-center justify-between">
                        <span className="text-stone-600">Condition:</span>
                        <span className="font-bold text-xs text-purple-800">
                          Buy {off.minimumQuantity} Soaps, Get {off.rewardQuantity || 1} Free
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Included Soaps */}
                  {off.includedSoaps && off.includedSoaps.length > 0 && (
                    <div className="space-y-1 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                        Included Soaps
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {off.includedSoaps.map((it, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 text-[11px]"
                          >
                            <Package className="w-3 h-3 text-stone-400" />
                            <span>{it.soapName || it.soapId} (x{it.quantity})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-stone-400">
                    {off.endsAt ? `Until ${new Date(off.endsAt).toLocaleDateString('en-IN')}` : 'Ongoing offer'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(off)}
                      className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                      title="Edit Offer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(off)}
                      className="p-1.5 text-rose-600 hover:text-rose-900 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Offer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 p-16 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 mx-auto flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-800 text-base">No combo offers configured yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
            Create attractive combo offers, gift sets, or quantity rewards. Once published, active combos appear automatically on the homepage and customer combo section.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-[#244635] hover:bg-[#1b3427] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Combo</span>
          </button>
        </div>
      )}

      {/* Modal: Create or Edit Offer */}
      {editingOffer !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="bg-[#FAF7EF] px-6 py-4 border-b border-stone-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#244635] text-white rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    {editingOffer.id ? `Edit Combo Offer: ${editingOffer.title}` : 'Create New Combo Offer'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Select included soaps, configure discount or bundle pricing.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingOffer(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kashmiri Saffron & Sandalwood Radiance Duo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#244635]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the aroma combination, skin benefits, or special gifting theme..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-xl"
                />
              </div>

              {/* Offer Type Selector */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Promotion Type *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'fixed_price', label: 'Fixed Price Bundle' },
                    { id: 'percentage_discount', label: 'Percentage % Off' },
                    { id: 'fixed_discount', label: 'Flat ₹ Discount' },
                    { id: 'buy_x_get_y', label: 'Buy X, Get Y' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setOfferType(t.id as ComboOfferType)}
                      className={`p-2 rounded-xl border text-center font-semibold text-[11px] transition-colors ${
                        offerType === t.id
                          ? 'bg-[#244635] text-white border-[#244635]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type-Specific Input */}
              {offerType === 'fixed_price' && (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Combo Bundle Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={comboPrice}
                    onChange={(e) => setComboPrice(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-xl font-bold text-base text-[#244635]"
                  />
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    Customers pay this fixed price when purchasing the bundle together.
                  </p>
                </div>
              )}

              {offerType === 'percentage_discount' && (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Discount Percentage (%) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    required
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-xl font-bold text-base text-blue-800"
                  />
                </div>
              )}

              {offerType === 'fixed_discount' && (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Flat Discount Amount in INR (₹) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-xl font-bold text-base text-amber-800"
                  />
                </div>
              )}

              {offerType === 'buy_x_get_y' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-purple-50/50 rounded-xl border border-purple-200">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Minimum Soaps to Buy (X) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={minimumQuantity}
                      onChange={(e) => setMinimumQuantity(Number(e.target.value))}
                      className="w-full p-2 border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Free Reward Bars (Y) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={rewardQuantity}
                      onChange={(e) => setRewardQuantity(Number(e.target.value))}
                      className="w-full p-2 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* Select Included Soaps */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Select Included Soaps &amp; Quantities
                </label>
                {products.length > 0 ? (
                  <div className="border border-stone-200 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2 bg-stone-50/50">
                    {products.map((p) => {
                      const isSelected = Boolean(selectedSoapMap[p.id]);
                      const currentQty = selectedSoapMap[p.id] || 1;
                      return (
                        <div
                          key={p.id}
                          className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${
                            isSelected ? 'bg-white border-[#244635]' : 'bg-white/60 border-stone-200'
                          }`}
                        >
                          <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSoap(p.id)}
                              className="rounded text-[#244635] focus:ring-[#244635]"
                            />
                            <div>
                              <span className="font-semibold text-stone-900">{p.name}</span>
                              <span className="text-[10px] text-stone-500 ml-1.5">
                                ({formatPriceINR(p.price)})
                              </span>
                            </div>
                          </label>

                          {isSelected && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-stone-500 text-[11px]">Qty:</span>
                              <input
                                type="number"
                                min={1}
                                max={20}
                                value={currentQty}
                                onChange={(e) => handleSoapQtyChange(p.id, Number(e.target.value))}
                                className="w-14 p-1 border border-stone-300 rounded text-center font-bold"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-stone-500 italic p-3 bg-stone-50 rounded-xl border border-stone-200">
                    No products exist in catalogue yet. Add soap products first to bundle them into combo offers.
                  </p>
                )}
              </div>

              {/* Dates & Active */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="offerActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-[#244635] focus:ring-[#244635]"
                />
                <label htmlFor="offerActive" className="font-semibold text-stone-800 cursor-pointer">
                  Activate this offer immediately on storefront
                </label>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingOffer(null)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 hover:bg-stone-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#244635] hover:bg-[#1b3427] text-white rounded-xl font-semibold shadow-xs disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingOffer.id ? 'Save Changes' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
