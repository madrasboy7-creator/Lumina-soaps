import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Package,
  Layers,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { Collection, SoapProduct } from '../../../types';
import { cmsApi } from '../ownerApi';

export const CollectionManager: React.FC = () => {
  const { products, collections: storeCollections, refreshCMSData, showNotification } = useStore();
  const [collections, setCollections] = useState<Collection[]>(storeCollections || []);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const [formData, setFormData] = useState<Partial<Collection>>({
    name: '',
    slug: '',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80',
    displayOrder: 1,
    isPublished: true,
    productIds: [],
  });

  const loadCollections = async () => {
    try {
      setLoading(true);
      const res = await cmsApi.getCollections();
      const list = Array.isArray(res) ? res : (res as any)?.data || [];
      setCollections(list);
    } catch (err: any) {
      console.error('Failed to load collections', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleOpenModal = (col?: Collection) => {
    if (col) {
      setEditingCollection(col);
      setFormData({
        name: col.name,
        slug: col.slug,
        description: col.description || '',
        coverImage: col.coverImage || '',
        displayOrder: col.displayOrder || 1,
        isPublished: col.isPublished !== false,
        productIds: col.productIds || [],
      });
    } else {
      setEditingCollection(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        coverImage: 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80',
        displayOrder: collections.length + 1,
        isPublished: true,
        productIds: products.slice(0, 3).map((p) => p.id),
      });
    }
    setIsModalOpen(true);
  };

  const handleToggleProduct = (productId: string) => {
    const current = formData.productIds || [];
    if (current.includes(productId)) {
      setFormData({ ...formData, productIds: current.filter((id) => id !== productId) });
    } else {
      setFormData({ ...formData, productIds: [...current, productId] });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showNotification('Collection name is required', 'alert');
      return;
    }
    const slug = formData.slug?.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    try {
      const payload: Partial<Collection> = {
        ...formData,
        slug,
      };

      if (editingCollection) {
        await cmsApi.updateCollection(editingCollection.id, payload);
        showNotification(`Collection "${formData.name}" updated`, 'success');
      } else {
        await cmsApi.createCollection(payload);
        showNotification(`Collection "${formData.name}" created`, 'success');
      }
      setIsModalOpen(false);
      await loadCollections();
      await refreshCMSData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to save collection', 'alert');
    }
  };

  const handleDelete = async (col: Collection) => {
    if (window.confirm(`Delete collection "${col.name}"?`)) {
      try {
        await cmsApi.deleteCollection(col.id);
        showNotification(`Collection "${col.name}" removed`, 'info');
        await loadCollections();
        await refreshCMSData();
      } catch (err: any) {
        showNotification(err.message || 'Failed to delete collection', 'alert');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              CMS • Curations
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">Collection Manager</h1>
          <p className="text-xs text-stone-500">
            Group artisan soaps into curated themes such as Bestsellers, Gift Bundles, and Seasonal Releases.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => {
          const colProducts = products.filter((p) => col.productIds?.includes(p.id));
          return (
            <div
              key={col.id}
              className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-stone-100">
                  <img
                    src={col.coverImage || '/logo.svg'}
                    alt={col.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs p-1 rounded-xl">
                    <button
                      onClick={() => handleOpenModal(col)}
                      className="p-1.5 text-white hover:text-amber-300 transition-colors"
                      title="Edit Collection"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(col)}
                      className="p-1.5 text-rose-300 hover:text-rose-400 transition-colors"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#244635]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {col.isPublished ? 'Published' : 'Draft'}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-serif font-bold text-stone-900 text-base">{col.name}</h3>
                  <p className="text-[11px] text-stone-400 font-mono">/{col.slug}</p>
                  <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                    {col.description || 'Artisan cold process selection.'}
                  </p>

                  <div className="mt-4 pt-4 border-t border-stone-100">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      Included Soaps ({colProducts.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {colProducts.length === 0 ? (
                        <span className="text-xs text-stone-400 italic">No products linked yet</span>
                      ) : (
                        colProducts.map((p) => (
                          <span
                            key={p.id}
                            className="inline-block bg-stone-100 text-stone-700 text-[10px] font-medium px-2 py-0.5 rounded-lg"
                          >
                            {p.name}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs text-stone-500">
                <span>Display Order: {col.displayOrder || 1}</span>
                <button
                  onClick={() => handleOpenModal(col)}
                  className="font-semibold text-[#244635] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Edit Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Edit / Create Collection */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 animate-fadeIn space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                {editingCollection ? `Edit Collection: ${editingCollection.name}` : 'New Artisan Collection'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs overflow-y-auto flex-1 pr-1">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Collection Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  placeholder="e.g. Cedar Cured Botanical Sets"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  placeholder="e.g. cedar-cured-botanicals"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  placeholder="Theme description visible on the customer storefront..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={formData.coverImage || ''}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.displayOrder || 1}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  />
                </div>
              </div>

              {/* Products Checkbox List */}
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Select Included Products ({formData.productIds?.length || 0} selected)
                </label>
                <div className="max-h-48 overflow-y-auto border border-stone-200 rounded-xl p-2 space-y-1 bg-stone-50">
                  {products.map((p) => {
                    const isChecked = formData.productIds?.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-stone-100 cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleProduct(p.id)}
                          className="rounded text-[#244635] focus:ring-[#244635]"
                        />
                        <img
                          src={p.image || '/logo.svg'}
                          alt={p.name}
                          className="w-6 h-6 rounded object-cover border border-stone-200"
                        />
                        <span className="font-semibold text-stone-800">{p.name}</span>
                        <span className="text-stone-400 text-[10px] ml-auto">₹{p.price}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="colPublish"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded text-[#244635] focus:ring-[#244635]"
                />
                <label htmlFor="colPublish" className="text-stone-700 font-medium">
                  Publish (visible on storefront collections section)
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
                  <span>Save Collection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
