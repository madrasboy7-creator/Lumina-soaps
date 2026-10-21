import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  AlertCircle,
  Eye,
  ArrowUpDown,
  Tag,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { cmsApi } from '../ownerApi';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder: number;
  isActive: boolean;
  productCount?: number;
}

export const CategoryManager: React.FC = () => {
  const { products, showNotification, refreshProducts } = useStore();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    displayOrder: 1,
    isActive: true,
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await cmsApi.getCategories();
      const list = Array.isArray(res) ? res : (res as any)?.data || [];
      setCategories(list);
    } catch (err: any) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenModal = (cat?: CategoryItem) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        image: cat.image || '',
        displayOrder: cat.displayOrder || 1,
        isActive: cat.isActive !== false,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=600&q=80',
        displayOrder: categories.length + 1,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showNotification('Category title is required', 'alert');
      return;
    }
    const slug = formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    try {
      if (editingCategory) {
        await cmsApi.updateCategory(editingCategory.id, {
          ...formData,
          slug,
        });
        showNotification(`Category "${formData.name}" updated`, 'success');
      } else {
        await cmsApi.createCategory({
          ...formData,
          slug,
        });
        showNotification(`Category "${formData.name}" created`, 'success');
      }
      setIsModalOpen(false);
      await loadCategories();
    } catch (err: any) {
      showNotification(err.message || 'Failed to save category', 'alert');
    }
  };

  const handleDelete = async (cat: CategoryItem) => {
    // Check if products are using this category
    const usedCount = products.filter((p) => p.category === cat.name).length;
    if (usedCount > 0) {
      if (
        !window.confirm(
          `Notice: There are currently ${usedCount} live soaps assigned to "${cat.name}". Are you sure you want to delete this category?`
        )
      ) {
        return;
      }
    } else {
      if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    }

    try {
      await cmsApi.deleteCategory(cat.id);
      showNotification(`Category "${cat.name}" removed`, 'info');
      await loadCategories();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete category', 'alert');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              CMS • Navigation & Filters
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">Category Manager</h1>
          <p className="text-xs text-stone-500">
            Structure your artisan soaps into botanical categories, configure descriptions, and set customer navigation ordering.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.category === cat.name).length;
          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-mono">
                      Order: {cat.displayOrder || 1}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cat.isActive ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {cat.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(cat)}
                      className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 text-stone-400">
                      <Layers className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 text-sm">{cat.name}</h3>
                    <p className="text-[10px] text-stone-400 font-mono">/{cat.slug}</p>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                      {cat.description || 'No description provided.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs">
                <span className="text-stone-500">Live soaps assigned:</span>
                <span className="font-bold text-[#244635] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  {productCount} soaps
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit/Create Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'New Soap Category'}
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
                <label className="block text-stone-700 font-semibold mb-1">Category Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  placeholder="e.g. Sensitive & Baby Care"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  placeholder="e.g. sensitive-baby-care"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  placeholder="Brief description for storefront category cards and SEO..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-[#244635] focus:ring-[#244635]"
                />
                <label htmlFor="catActive" className="text-stone-700 font-medium">
                  Active (show in storefront filter sidebar)
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
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
