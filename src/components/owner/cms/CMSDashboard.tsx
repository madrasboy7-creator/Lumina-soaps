import React, { useMemo } from 'react';
import {
  Sparkles,
  Layers,
  Image as ImageIcon,
  FileText,
  HelpCircle,
  Search,
  Plus,
  Eye,
  CheckCircle,
  AlertCircle,
  Sliders,
  Globe,
  Tag,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { CMSView } from '../../../types';

interface CMSDashboardProps {
  onNavigateCMS: (view: CMSView) => void;
  onOpenNewProduct: () => void;
}

export const CMSDashboard: React.FC<CMSDashboardProps> = ({
  onNavigateCMS,
  onOpenNewProduct,
}) => {
  const { products, collections, homepageConfig, setCurrentView } = useStore();

  const publishedCount = products.filter((p) => p.status === 'published' || p.isPublished !== false).length;
  const draftCount = products.filter((p) => p.status === 'draft').length;
  const hiddenCount = products.filter((p) => p.status === 'hidden' || p.status === 'archived').length;

  // Real data checks
  const productsMissingImages = products.filter((p) => !p.image || p.image.trim() === '');
  const productsMissingSEO = products.filter((p) => !p.seoTitle && !p.tagline);
  const productsMissingDescription = products.filter((p) => !p.ingredients || p.ingredients.length === 0);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products]);

  return (
    <div className="space-y-6">
      {/* CMS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              Content Management System
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">CMS Overview</h1>
          <p className="text-xs text-stone-500">
            Authoritative source for storefront visuals, product storytelling, categories, and public page content.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentView('shop')}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Storefront Shop</span>
          </button>
          <button
            onClick={onOpenNewProduct}
            className="px-4 py-2 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Soap Product</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Published Products</div>
          <div className="text-2xl font-bold font-serif text-[#244635] mt-1">{publishedCount}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Visible to customers</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Drafts & In-Progress</div>
          <div className="text-2xl font-bold font-serif text-amber-700 mt-1">{draftCount}</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">
            Unpublished formulations
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Soap Categories</div>
          <div className="text-2xl font-bold font-serif text-stone-900 mt-1">{categories.length}</div>
          <div className="text-[11px] text-stone-500 font-medium mt-1">
            Active navigation filters
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Featured Collections</div>
          <div className="text-2xl font-bold font-serif text-stone-900 mt-1">{collections?.length || 4}</div>
          <div className="text-[11px] text-stone-500 font-medium mt-1">
            Bestsellers & Gift Sets
          </div>
        </div>
      </div>

      {/* Content Quality Health Warnings */}
      {(productsMissingImages.length > 0 || productsMissingSEO.length > 0) && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-semibold text-amber-900">Content Audit Attention Items</h4>
            <ul className="text-amber-800 list-disc list-inside space-y-0.5">
              {productsMissingImages.length > 0 && (
                <li>{productsMissingImages.length} product(s) missing main gallery imagery.</li>
              )}
              {productsMissingSEO.length > 0 && (
                <li>{productsMissingSEO.length} product(s) without custom SEO metadata or short tagline.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Quick CMS Action Modules */}
      <div>
        <h3 className="font-serif font-bold text-stone-900 text-base mb-3">Quick CMS Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigateCMS('homepage')}
            className="p-4 bg-white rounded-2xl border border-stone-200/80 hover:border-[#244635] text-left transition-all hover:shadow-xs group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:bg-[#244635] group-hover:text-white transition-colors">
              <Sliders className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#244635]">Homepage Builder</h4>
            <p className="text-[11px] text-stone-500 mt-1">
              Customize hero headings, seasonal promos, featured categories, and brand pillars.
            </p>
          </button>

          <button
            onClick={() => onNavigateCMS('categories')}
            className="p-4 bg-white rounded-2xl border border-stone-200/80 hover:border-[#244635] text-left transition-all hover:shadow-xs group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3 group-hover:bg-[#244635] group-hover:text-white transition-colors">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#244635]">Category Manager</h4>
            <p className="text-[11px] text-stone-500 mt-1">
              Organize soaps into botanical, exfoliating, sensitive care, and gift collections.
            </p>
          </button>

          <button
            onClick={() => onNavigateCMS('banners')}
            className="p-4 bg-white rounded-2xl border border-stone-200/80 hover:border-[#244635] text-left transition-all hover:shadow-xs group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center mb-3 group-hover:bg-[#244635] group-hover:text-white transition-colors">
              <Tag className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#244635]">Banners & Promotions</h4>
            <p className="text-[11px] text-stone-500 mt-1">
              Configure top announcement bar, festival coupons, and free shipping triggers.
            </p>
          </button>

          <button
            onClick={() => onNavigateCMS('brand')}
            className="p-4 bg-white rounded-2xl border border-stone-200/80 hover:border-[#244635] text-left transition-all hover:shadow-xs group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center mb-3 group-hover:bg-[#244635] group-hover:text-white transition-colors">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#244635]">Brand Story & Policies</h4>
            <p className="text-[11px] text-stone-500 mt-1">
              Edit the artisan cold process story, shipping policies, returns, and terms.
            </p>
          </button>

          <button
            onClick={() => onNavigateCMS('faqs')}
            className="p-4 bg-white rounded-2xl border border-stone-200/80 hover:border-[#244635] text-left transition-all hover:shadow-xs group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mb-3 group-hover:bg-[#244635] group-hover:text-white transition-colors">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#244635]">FAQ Management</h4>
            <p className="text-[11px] text-stone-500 mt-1">
              Answer customer questions on curing time, natural lye, sensitive skin, and longevity.
            </p>
          </button>

          <button
            onClick={() => onNavigateCMS('seo')}
            className="p-4 bg-white rounded-2xl border border-stone-200/80 hover:border-[#244635] text-left transition-all hover:shadow-xs group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-800 flex items-center justify-center mb-3 group-hover:bg-[#244635] group-hover:text-white transition-colors">
              <Globe className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#244635]">SEO Metadata</h4>
            <p className="text-[11px] text-stone-500 mt-1">
              Manage Google SERP snippets, Open Graph cards, canonical tags, and search indexing.
            </p>
          </button>
        </div>
      </div>

      {/* Recently Modified Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-sm">Product Catalog Overview</h3>
            <p className="text-xs text-stone-500">Live products and publishing state</p>
          </div>
          <button
            onClick={() => onNavigateCMS('products')}
            className="text-xs font-semibold text-[#244635] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Manage All Products ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5">Product</th>
                <th className="py-2.5">Category</th>
                <th className="py-2.5">Price</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.slice(0, 6).map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/60">
                  <td className="py-2.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image || '/logo.svg'}
                        alt={p.name}
                        className="w-8 h-8 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-stone-900">{p.name}</div>
                        <div className="text-[10px] text-stone-400">{p.scentProfile || p.tagline}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 text-stone-600">{p.category}</td>
                  <td className="py-2.5 font-semibold text-stone-900">₹{p.price}</td>
                  <td className="py-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.status === 'draft'
                          ? 'bg-amber-100 text-amber-800'
                          : p.status === 'hidden'
                          ? 'bg-stone-100 text-stone-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {p.status || 'published'}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => onNavigateCMS('products')}
                      className="text-stone-500 hover:text-stone-900 font-medium text-xs cursor-pointer"
                    >
                      Edit Content &gt;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
