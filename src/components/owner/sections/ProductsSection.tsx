import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  EyeOff,
  AlertTriangle,
  Upload,
  X,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import { SoapProduct, CategoryItem, formatPriceINR } from '../../../types';

interface ProductsSectionProps {
  products: SoapProduct[];
  categories: CategoryItem[];
  onCreateProduct: (data: Partial<SoapProduct>) => Promise<SoapProduct>;
  onUpdateProduct: (id: string, data: Partial<SoapProduct>) => Promise<SoapProduct>;
  onDeleteProduct: (id: string) => Promise<void>;
  onTogglePublish: (id: string, isPublished: boolean) => Promise<void>;
  onRefresh: () => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  categories,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onTogglePublish,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'name'>('newest');

  // Modal State: null = closed, 'create' = new product, SoapProduct = edit
  const [editingProduct, setEditingProduct] = useState<Partial<SoapProduct> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Herbal & Botanical');
  const [price, setPrice] = useState<number>(299);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [weight, setWeight] = useState('120g (4.2 oz)');
  const [stock, setStock] = useState<number>(20);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [ingredientsText, setIngredientsText] = useState('');
  const [usageInstructions, setUsageInstructions] = useState('Lather with warm water on wet skin, then rinse thoroughly.');
  const [precautions, setPrecautions] = useState('For external use only. Discontinue use if irritation occurs.');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('published');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          p.name.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          p.ingredients.some((ing) => ing.toLowerCase().includes(q));

        const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;

        const isPub = p.isPublished !== false && p.status !== 'draft' && p.status !== 'archived';
        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'published' && isPub) ||
          (statusFilter === 'draft' && (p.status === 'draft' || p.isPublished === false)) ||
          (statusFilter === 'archived' && p.status === 'archived');

        return matchesSearch && matchesCat && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // Default order
      });
  }, [products, searchQuery, categoryFilter, statusFilter, sortBy]);

  const handleOpenCreate = () => {
    setEditingProduct({});
    setName('');
    setSlug('');
    setSku(`LUM-${Date.now().toString().slice(-6)}`);
    setDescription('');
    setCategory(categories[0]?.name || 'Herbal & Botanical');
    setPrice(299);
    setOriginalPrice(undefined);
    setWeight('120g (4.2 oz)');
    setStock(25);
    setLowStockThreshold(5);
    setIngredientsText('Saponified Extra Virgin Olive Oil, Coconut Oil, Unrefined Shea Butter, Essential Oils');
    setUsageInstructions('Lather gently with warm water, massage onto skin and rinse thoroughly.');
    setPrecautions('For external use only. Avoid direct eye contact.');
    setImage('');
    setStatus('published');
    setFormError(null);
  };

  const handleOpenEdit = (p: SoapProduct) => {
    setEditingProduct(p);
    setName(p.name);
    setSlug(p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    setSku(p.sku || '');
    setDescription(p.description || p.tagline || '');
    setCategory(p.category);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice);
    setWeight(p.weight || '120g');
    setStock(p.stock);
    setLowStockThreshold(p.lowStockThreshold || 5);
    setIngredientsText(p.ingredients?.join(', ') || '');
    setUsageInstructions(p.usageInstructions || '');
    setPrecautions(p.precautions || p.warnings || '');
    setImage(p.image || '');
    const mappedStatus = p.status === 'hidden' ? 'draft' : (p.status || (p.isPublished === false ? 'draft' : 'published'));
    setStatus(mappedStatus);
    setFormError(null);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingProduct?.id) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Product Name is required.');
      return;
    }
    if (!sku.trim()) {
      setFormError('Product SKU is required.');
      return;
    }
    if (price <= 0) {
      setFormError('Selling price must be greater than ₹0.');
      return;
    }

    // Check duplicate SKU in existing products
    const existingSku = products.find(
      (p) => p.sku?.toLowerCase() === sku.trim().toLowerCase() && p.id !== editingProduct?.id
    );
    if (existingSku) {
      setFormError(`SKU "${sku}" is already in use by "${existingSku.name}". Each soap must have a unique SKU.`);
      return;
    }

    const ingredientsList = ingredientsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Partial<SoapProduct> = {
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: sku.trim().toUpperCase(),
      description: description.trim(),
      tagline: description.slice(0, 100),
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      weight: weight.trim(),
      stock: Number(stock),
      lowStockThreshold: Number(lowStockThreshold),
      ingredients: ingredientsList,
      benefits: ['Handcrafted Cold-Process Soap', 'Zero synthetic detergents', 'Cedar rack cured'],
      usageInstructions: usageInstructions.trim(),
      precautions: precautions.trim(),
      image: image.trim() || '/logo.svg',
      gallery: image.trim() ? [image.trim()] : ['/logo.svg'],
      isPublished: status === 'published',
      status,
      scentProfile: 'Natural Botanical Scent',
      skinTypes: ['All Skin Types'],
      batchNumber: `LUM-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
      cureDate: 'Cured on solid cedar racks',
      isNewRelease: true,
      reviews: editingProduct?.reviews || [],
      rating: editingProduct?.rating || 5.0,
      reviewCount: editingProduct?.reviewCount || 0,
    };

    setIsSaving(true);
    try {
      if (editingProduct?.id) {
        await onUpdateProduct(editingProduct.id, payload);
      } else {
        await onCreateProduct(payload);
      }
      setEditingProduct(null);
      onRefresh();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (prod: SoapProduct) => {
    if (!window.confirm(`Are you sure you want to delete "${prod.name}"? If it has historical order records, it will be safely archived instead.`)) {
      return;
    }
    try {
      await onDeleteProduct(prod.id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Products &amp; Inventory
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Authoritative product catalogue for Lumina Soaps. Add, publish, update pricing, and manage bar stock.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-[#244635] hover:bg-[#1b3427] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Soap</span>
        </button>
      </div>

      {/* Search, Category & Status Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by soap name, SKU, or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#244635] bg-stone-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="py-1.5 px-2.5 border border-stone-300 rounded-lg bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-2.5 border border-stone-300 rounded-lg bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published (Live)</option>
            <option value="draft">Drafts (Unpublished)</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="py-1.5 px-2.5 border border-stone-300 rounded-lg bg-white"
          >
            <option value="newest">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-[#FAF7EF] border-b border-stone-200 text-stone-800 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Soap</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Weight</th>
                  <th className="py-3 px-4 text-right">Price (INR)</th>
                  <th className="py-3 px-4 text-center">Available Stock</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.map((p) => {
                  const isPub = p.isPublished !== false && p.status !== 'draft' && p.status !== 'archived';
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image || '/logo.svg'}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-lg border border-stone-200"
                          />
                          <div>
                            <span className="font-bold text-stone-900 block">{p.name}</span>
                            <span className="text-[10px] text-stone-400 font-mono">/{p.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-stone-600">
                        {p.sku || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-stone-700">
                        {p.category}
                      </td>
                      <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                        {p.weight || '120g'}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-stone-900 whitespace-nowrap">
                        {formatPriceINR(p.price)}
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="line-through text-stone-400 text-[10px] ml-1.5 font-normal">
                            {formatPriceINR(p.originalPrice)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          p.stock <= (p.lowStockThreshold || 5)
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {p.stock} bars
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                          isPub
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : p.status === 'archived'
                            ? 'bg-stone-200 text-stone-700 border-stone-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {isPub ? 'Published' : p.status === 'archived' ? 'Archived' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onTogglePublish(p.id, !isPub)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isPub
                                ? 'text-amber-700 border-amber-200 hover:bg-amber-50'
                                : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                            }`}
                            title={isPub ? 'Unpublish from store' : 'Publish to store'}
                          >
                            {isPub ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-stone-600 border border-stone-200 hover:bg-stone-100 rounded-lg transition-colors"
                            title="Edit Soap Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="p-1.5 text-rose-600 border border-rose-200 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete / Archive Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-3">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-800 text-base">No products found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
              {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'No soaps matched your search filter. Try clearing filters.'
                : 'Our soap collection is getting ready. Click "Add New Soap" to list your first cold-process bath bar.'}
            </p>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 bg-[#244635] hover:bg-[#1b3427] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Soap</span>
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {editingProduct !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="bg-[#FAF7EF] px-6 py-4 border-b border-stone-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#244635] text-white rounded-xl">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    {editingProduct.id ? `Edit Soap: ${editingProduct.name}` : 'Add New Artisan Soap'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Fill in formulation details, pricing, and stock count.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pure Kasturi Turmeric & Honey Bar"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#244635]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. kasturi-turmeric-honey-bar"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-xl font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">SKU (Stock Keeping Unit) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LUM-TUR01-S"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-xl font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-xl bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    <option value="General Artisan">General Artisan</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Selling Price (₹ INR) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-xl font-bold text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Compare-at Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="Optional original price"
                    value={originalPrice || ''}
                    onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full p-2 border border-stone-300 rounded-xl text-stone-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Bar Weight</label>
                  <input
                    type="text"
                    placeholder="e.g. 120g (4.2 oz)"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Stock & Low Stock Threshold */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Available Stock (Bars) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Low Stock Alert Threshold</label>
                  <input
                    type="number"
                    min={1}
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Publication Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2 border border-stone-300 rounded-xl bg-white font-medium"
                  >
                    <option value="published">Published (Live on website)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Product Description</label>
                <textarea
                  rows={3}
                  placeholder="Artisan soap description, lather qualities, and skin feel..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-xl"
                />
              </div>

              {/* Ingredients */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Ingredients (Separate with commas)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Cold-Pressed Virgin Olive Oil, Coconut Oil, Unrefined Shea Butter, Kasturi Manjal"
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-xl"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Product Image URL</label>
                <input
                  type="text"
                  placeholder="https://... or /logo.svg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-xl font-mono text-[11px]"
                />
                <p className="text-[10px] text-stone-400 mt-0.5">
                  Enter an image URL or leave empty to use the default Lumina emblem.
                </p>
              </div>

              {/* Usage & Precautions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Usage Instructions</label>
                  <input
                    type="text"
                    value={usageInstructions}
                    onChange={(e) => setUsageInstructions(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Precautions</label>
                  <input
                    type="text"
                    value={precautions}
                    onChange={(e) => setPrecautions(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 hover:bg-stone-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#244635] hover:bg-[#1b3427] text-white rounded-xl font-semibold shadow-xs disabled:opacity-50"
                >
                  {isSaving ? 'Saving Soap...' : editingProduct.id ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
