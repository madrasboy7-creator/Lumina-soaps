import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Check,
  X,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  Archive,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  ArrowUpDown,
  Tag,
  Globe,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { SoapProduct, SoapCategory, ScentProfile, formatPriceINR } from '../../../types';
import { cmsApi } from '../ownerApi';

const CATEGORIES: SoapCategory[] = [
  'Herbal & Botanical',
  'Goat Milk & Honey',
  'Exfoliating Scrub',
  'Aromatherapy & Calming',
  'Sensitive & Baby Care',
  'Artisan Swirl Gift Sets',
];

const SCENTS: ScentProfile[] = [
  'French Lavender & Sage',
  'Raw Honey & Toasted Almond',
  'Activated Charcoal & Tea Tree',
  'Eucalyptus & Peppermint',
  'Wild Rose & Geranium',
  'Sweet Orange & Lemongrass',
  'Warm Oatmeal & Vanilla',
  'Unscented Pure Castile',
];

interface ProductContentManagerProps {
  initialCreateOpen?: boolean;
}

export const ProductContentManager: React.FC<ProductContentManagerProps> = ({
  initialCreateOpen = false,
}) => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    showNotification,
    setCurrentView,
    setSelectedProduct,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(initialCreateOpen);
  const [editingProduct, setEditingProduct] = useState<SoapProduct | null>(null);
  const [previewProduct, setPreviewProduct] = useState<SoapProduct | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState<Partial<SoapProduct>>({
    name: '',
    tagline: '',
    category: 'Herbal & Botanical',
    price: 299,
    originalPrice: undefined,
    stock: 24,
    lowStockThreshold: 5,
    batchNumber: 'LUM-BATCH-2026-10',
    cureDate: 'Cured 6 weeks on cedar racks',
    weight: '125g (Handmade Bar)',
    scentProfile: 'French Lavender & Sage',
    ingredients: ['Saponified Coconut Oil', 'Sesame Oil', 'Pure Neem Oil', 'Raw Wild Honey'],
    benefits: ['Gentle moisturizing lather', 'Antibacterial protection', 'Natural botanical aroma'],
    image: 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80',
    directions: 'Work into a dense, creamy lather with warm water between hands. Massage gently and rinse thoroughly.',
    warnings: 'For external use only. Discontinue use if irritation occurs.',
    isNewRelease: false,
    status: 'published',
    isPublished: true,
    sku: 'LUM-SOAP-101',
    slug: 'botanical-artisan-soap',
    seoTitle: '',
    seoDescription: '',
    imageAlt: '',
  });

  // Open Editor for new or existing product
  const handleOpenEditor = (product?: SoapProduct) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ...product,
        ingredients: Array.isArray(product.ingredients) ? product.ingredients : [],
        benefits: Array.isArray(product.benefits) ? product.benefits : [],
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        tagline: '',
        category: 'Herbal & Botanical',
        price: 299,
        originalPrice: undefined,
        stock: 24,
        lowStockThreshold: 5,
        batchNumber: `LUM-BATCH-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
        cureDate: 'Cured 6 weeks on cedar racks',
        weight: '125g (Handmade Bar)',
        scentProfile: 'French Lavender & Sage',
        ingredients: ['Saponified Coconut Oil', 'Sesame Oil', 'Pure Neem Oil', 'Raw Wild Honey'],
        benefits: ['Gentle moisturizing lather', 'Antibacterial protection', 'Natural botanical aroma'],
        image: 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=800&q=80',
        directions: 'Work into a dense, creamy lather with warm water between hands. Massage gently and rinse thoroughly.',
        warnings: 'For external use only. Discontinue use if irritation occurs.',
        isNewRelease: false,
        status: 'published',
        isPublished: true,
        sku: `LUM-SOAP-${Math.floor(100 + Math.random() * 900)}`,
        slug: '',
        seoTitle: '',
        seoDescription: '',
        imageAlt: '',
      });
    }
    setIsEditorOpen(true);
  };

  // Duplicate product
  const handleDuplicate = async (product: SoapProduct) => {
    try {
      const res = await cmsApi.duplicateProduct(product.id);
      if (res) {
        showNotification(`Created draft duplicate of "${product.name}"`, 'success');
        await refreshProducts();
      }
    } catch (err: any) {
      showNotification(err.message || 'Failed to duplicate product', 'alert');
    }
  };

  // Toggle Publish / Unpublish
  const handleTogglePublish = async (product: SoapProduct) => {
    try {
      const newStatus = product.status === 'published' ? 'draft' : 'published';
      const isPub = newStatus === 'published';
      await updateProduct(product.id, {
        status: newStatus,
        isPublished: isPub,
      });
      showNotification(
        `Product "${product.name}" is now ${newStatus === 'published' ? 'Published live' : 'Unpublished (Draft)'}`,
        'success'
      );
      await refreshProducts();
    } catch (err: any) {
      showNotification(err.message || 'Failed to update publication status', 'alert');
    }
  };

  // Save product
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showNotification('Product title is required', 'alert');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      showNotification('Price must be greater than 0', 'alert');
      return;
    }

    setIsSaving(true);
    try {
      const slug = formData.slug?.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload: Partial<SoapProduct> = {
        ...formData,
        slug,
        isPublished: formData.status === 'published',
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        showNotification(`Updated product "${formData.name}"`, 'success');
      } else {
        await addProduct(payload);
        showNotification(`Created new product "${formData.name}"`, 'success');
      }
      setIsEditorOpen(false);
      setEditingProduct(null);
      await refreshProducts();
    } catch (err: any) {
      showNotification(err.message || 'Failed to save product', 'alert');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      try {
        await deleteProduct(id);
        showNotification(`Product "${name}" deleted.`, 'info');
        await refreshProducts();
      } catch (err: any) {
        showNotification(err.message || 'Failed to delete product', 'alert');
      }
    }
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.scentProfile && p.scentProfile.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'published' && (p.status === 'published' || p.isPublished !== false)) ||
        p.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              CMS • Products
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">Product Content & Catalog</h1>
          <p className="text-xs text-stone-500">
            Author artisan formulations, descriptions, botanical ingredients, media gallery, and publication status.
          </p>
        </div>

        <button
          onClick={() => handleOpenEditor()}
          className="px-4 py-2.5 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Soap Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by name, scent, ingredients, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#244635] text-stone-800"
          />
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#244635]"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#244635]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="hidden">Hidden</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50/70 border-b border-stone-200/80 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Soap Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Pricing</th>
                <th className="py-3 px-4">Workshop Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No products matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isPub = p.status === 'published' || p.isPublished !== false;
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image || '/logo.svg'}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-stone-900 text-xs flex items-center gap-1.5">
                              <span>{p.name}</span>
                              {p.isNewRelease && (
                                <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                                  NEW
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-stone-500 truncate max-w-xs">
                              {p.scentProfile || p.tagline}
                            </div>
                            <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                              SKU: {p.sku || p.batchNumber || 'N/A'} • {p.weight}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-700 font-medium">{p.category}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900">{formatPriceINR(p.price)}</div>
                        {p.originalPrice && (
                          <div className="text-[10px] text-stone-400 line-through">
                            {formatPriceINR(p.originalPrice)}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              p.stock === 0
                                ? 'bg-rose-500'
                                : p.stock <= (p.lowStockThreshold || 5)
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                          <span className="font-semibold text-stone-800">{p.stock} bars</span>
                        </div>
                        <div className="text-[10px] text-stone-400 mt-0.5">{p.cureDate}</div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleTogglePublish(p)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                            isPub
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200'
                          }`}
                          title="Click to toggle publication"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${isPub ? 'bg-emerald-600' : 'bg-stone-400'}`}
                          />
                          <span>{isPub ? 'Published' : p.status || 'Draft'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedProduct(p);
                              setCurrentView('shop');
                            }}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                            title="Preview on storefront"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(p)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                            title="Duplicate as Draft"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditor(p)}
                            className="p-1.5 rounded-lg text-[#244635] hover:bg-emerald-50 transition-colors"
                            title="Edit Product Content"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Content Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 animate-fadeIn">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50 rounded-t-3xl">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#244635]" />
                <h3 className="text-base font-serif font-bold text-stone-900">
                  {editingProduct ? `Edit "${editingProduct.name}"` : 'Create Artisan Soap Formulation'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Scrollable form */}
            <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              {/* Section 1: Basic Information */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-stone-900 text-sm pb-1 border-b border-stone-100">
                  1. Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Soap Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                      placeholder="e.g. Pure Wild Neem & Raw Honey Bar"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as SoapCategory })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Short Tagline / Catchphrase</label>
                    <input
                      type="text"
                      value={formData.tagline || ''}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                      placeholder="e.g. Antibacterial clarity with cold-pressed forest neem"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Scent Profile</label>
                    <select
                      value={formData.scentProfile}
                      onChange={(e) => setFormData({ ...formData, scentProfile: e.target.value as ScentProfile })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                    >
                      {SCENTS.map((scent) => (
                        <option key={scent} value={scent}>
                          {scent}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">SKU / Code</label>
                    <input
                      type="text"
                      value={formData.sku || ''}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                      placeholder="e.g. LUM-SOAP-101"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                      placeholder="e.g. pure-wild-neem-honey"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing & Workshop Inventory Reference */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-stone-900 text-sm pb-1 border-b border-stone-100">
                  2. Pricing & Workshop Stock
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Selling Price (INR) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.price || 0}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Original / Compare Price (INR)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.originalPrice || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          originalPrice: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      placeholder="Optional"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Workshop Stock Quantity
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.stock || 0}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Low Stock Warning At</label>
                    <input
                      type="number"
                      min={1}
                      value={formData.lowStockThreshold || 5}
                      onChange={(e) =>
                        setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Artisan Formulation & Cold Process Details */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-stone-900 text-sm pb-1 border-b border-stone-100">
                  3. Artisan Formulation & Cedar Curing
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Net Bar Weight</label>
                    <input
                      type="text"
                      value={formData.weight || ''}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                      placeholder="e.g. 125g (Handmade Bar)"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Cure Time & Rack Info</label>
                    <input
                      type="text"
                      value={formData.cureDate || ''}
                      onChange={(e) => setFormData({ ...formData, cureDate: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                      placeholder="e.g. Cured 6 weeks on cedar racks"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-stone-700 font-semibold mb-1">
                      Ingredients (comma separated)
                    </label>
                    <textarea
                      rows={2}
                      value={Array.isArray(formData.ingredients) ? formData.ingredients.join(', ') : ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ingredients: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                      placeholder="e.g. Saponified Coconut Oil, Cold-Pressed Neem Oil, Pure Sesame Oil, Raw Forest Honey, Tea Tree Oil"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-stone-700 font-semibold mb-1">
                      Benefits & Qualities (comma separated)
                    </label>
                    <textarea
                      rows={2}
                      value={Array.isArray(formData.benefits) ? formData.benefits.join(', ') : ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          benefits: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                      placeholder="e.g. Clarifying lather, Soothes skin inflammation, Antibacterial cleansing, Zero artificial sulfates"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Usage Directions</label>
                    <textarea
                      rows={2}
                      value={formData.directions || ''}
                      onChange={(e) => setFormData({ ...formData, directions: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Storage & Precautions</label>
                    <textarea
                      rows={2}
                      value={formData.warnings || ''}
                      onChange={(e) => setFormData({ ...formData, warnings: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Imagery & Publication Status */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-stone-900 text-sm pb-1 border-b border-stone-100">
                  4. Media & Publication Controls
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Primary Image URL <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                      placeholder="https://..."
                    />
                    {formData.image && (
                      <div className="mt-2 flex items-center gap-2">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-12 h-12 object-cover rounded-xl border border-stone-200 bg-stone-50"
                        />
                        <span className="text-[10px] text-stone-500">Image thumbnail preview</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Publication State</label>
                    <select
                      value={formData.status || 'published'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as 'draft' | 'published' | 'hidden' | 'archived',
                          isPublished: e.target.value === 'published',
                        })
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                    >
                      <option value="published">Published (Visible in storefront)</option>
                      <option value="draft">Draft (Work in progress)</option>
                      <option value="hidden">Hidden (Accessible only via direct link)</option>
                      <option value="archived">Archived (Retired formulation)</option>
                    </select>

                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isNewRelease"
                        checked={Boolean(formData.isNewRelease)}
                        onChange={(e) => setFormData({ ...formData, isNewRelease: e.target.checked })}
                        className="rounded text-[#244635] focus:ring-[#244635]"
                      />
                      <label htmlFor="isNewRelease" className="text-stone-700 font-medium">
                        Feature in "New Releases" homepage badge
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white font-semibold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <span>Saving Formulation...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
