import React, { useState, useEffect } from 'react';
import {
  Globe,
  Save,
  Check,
  Search,
  CheckCircle,
  AlertCircle,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { SEOMetadata } from '../../../types';
import { cmsApi } from '../ownerApi';

export const SEOManager: React.FC = () => {
  const { showNotification } = useStore();
  const [seo, setSeo] = useState<SEOMetadata>({
    pageId: 'home',
    pageTitle: 'Lumina Homemade Soaps | Artisan Cold Process Soaps in India',
    metaDescription: 'Handcrafted cold process artisan soaps made with pure coconut oil, raw forest honey, and therapeutic botanicals. Cured for 42 days on cedar racks.',
    canonicalUrl: 'https://luminasoaps.com',
    ogTitle: 'Lumina Homemade Soaps — Pure Cold Process Artisan Soaps',
    ogDescription: 'Experience nature in every lather. Small-batch artisan soaps cured 6 weeks on cedar racks in India.',
    ogImage: 'https://images.unsplash.com/photo-1607006314597-9e7960787e95?auto=format&fit=crop&w=1200&q=80',
    indexing: true,
    lastUpdated: new Date().toISOString(),
  });

  const [saving, setSaving] = useState(false);

  const loadSEO = async () => {
    try {
      const res = await cmsApi.getSEO();
      if (res) {
        if (Array.isArray(res) && res.length > 0) {
          setSeo(res[0]);
        } else if (!Array.isArray(res)) {
          setSeo((res as any).data || res);
        }
      }
    } catch (err) {
      console.error('Failed to load SEO', err);
    }
  };

  useEffect(() => {
    loadSEO();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await cmsApi.updateSEO(seo);
      showNotification('SEO settings saved and published', 'success');
    } catch (err: any) {
      showNotification(err.message || 'Failed to save SEO', 'alert');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-orange-800 uppercase bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200/60">
              CMS • Search & Social Meta
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">SEO & Social Sharing</h1>
          <p className="text-xs text-stone-500">
            Control Google search snippets, social Open Graph preview cards, and indexing directives.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2.5 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Meta Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Form Settings */}
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4 text-xs">
          <h3 className="font-serif font-bold text-stone-900 text-sm pb-2 border-b border-stone-100">
            Global Storefront Meta Tags
          </h3>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-stone-700 font-semibold">Page Title Tag (Recommended &lt; 60 chars)</label>
              <span className={`text-[10px] font-mono ${seo.pageTitle.length > 60 ? 'text-amber-600 font-bold' : 'text-stone-400'}`}>
                {seo.pageTitle.length} / 60
              </span>
            </div>
            <input
              type="text"
              required
              value={seo.pageTitle}
              onChange={(e) => setSeo({ ...seo, pageTitle: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-stone-700 font-semibold">Meta Description (Recommended &lt; 160 chars)</label>
              <span className={`text-[10px] font-mono ${seo.metaDescription.length > 160 ? 'text-amber-600 font-bold' : 'text-stone-400'}`}>
                {seo.metaDescription.length} / 160
              </span>
            </div>
            <textarea
              rows={3}
              required
              value={seo.metaDescription}
              onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Canonical Storefront URL</label>
            <input
              type="url"
              value={seo.canonicalUrl}
              onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
            />
          </div>

          <div className="pt-3 border-t border-stone-100 space-y-3">
            <h4 className="font-serif font-bold text-stone-900 text-xs">Open Graph Social Card (WhatsApp / Instagram / Twitter)</h4>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">OG Title</label>
              <input
                type="text"
                value={seo.ogTitle}
                onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">OG Description</label>
              <input
                type="text"
                value={seo.ogDescription}
                onChange={(e) => setSeo({ ...seo, ogDescription: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">OG Image URL</label>
              <input
                type="url"
                value={seo.ogImage}
                onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="indexingCheck"
              checked={seo.indexing}
              onChange={(e) => setSeo({ ...seo, indexing: e.target.checked })}
              className="rounded text-[#244635] focus:ring-[#244635]"
            />
            <label htmlFor="indexingCheck" className="text-stone-700 font-medium">
              Allow search engine indexing (robots meta: index, follow)
            </label>
          </div>
        </form>

        {/* Right Column: Google Search SERP & Social Preview */}
        <div className="space-y-6">
          {/* Google Preview */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-xs font-bold text-stone-900 font-serif">Google Search Snippet Preview</span>
              <span className="text-[10px] text-stone-400 font-mono">Desktop Result</span>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 font-sans space-y-1">
              <div className="flex items-center gap-2 text-[11px] text-stone-600">
                <span className="font-semibold text-stone-900">Lumina Homemade Soaps</span>
                <span>•</span>
                <span className="text-stone-400 truncate">{seo.canonicalUrl}</span>
              </div>
              <h4 className="text-blue-700 hover:underline text-sm font-medium leading-snug cursor-pointer">
                {seo.pageTitle || 'Lumina Homemade Soaps'}
              </h4>
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {seo.metaDescription || 'Artisan cold process soaps handcrafted in India.'}
              </p>
            </div>
          </div>

          {/* Social Card Preview */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-xs font-bold text-stone-900 font-serif">Social Share Card Preview</span>
              <span className="text-[10px] text-stone-400 font-mono">WhatsApp & Link Previews</span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
              {seo.ogImage && (
                <div className="h-40 bg-stone-200 overflow-hidden">
                  <img src={seo.ogImage} alt="OG Card" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-3.5 space-y-1">
                <div className="text-[10px] uppercase font-bold text-stone-400">luminasoaps.com</div>
                <div className="font-bold text-xs text-stone-900 truncate">{seo.ogTitle || seo.pageTitle}</div>
                <p className="text-[11px] text-stone-500 line-clamp-2">{seo.ogDescription || seo.metaDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
