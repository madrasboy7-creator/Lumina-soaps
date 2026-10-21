import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  Check,
  Globe,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { BrandPageContent } from '../../../types';
import { cmsApi } from '../ownerApi';

export const BrandContentManager: React.FC = () => {
  const { showNotification } = useStore();
  const [pages, setPages] = useState<BrandPageContent[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('about-us');
  const [currentPage, setCurrentPage] = useState<BrandPageContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadPages = async () => {
    try {
      setLoading(true);
      const res = await cmsApi.getPages();
      const list = Array.isArray(res) ? res : (res as any)?.data || [];
      if (list.length > 0) {
        setPages(list);
        const current = list.find((p: BrandPageContent) => p.slug === selectedSlug) || list[0];
        if (current) {
          setSelectedSlug(current.slug);
          setCurrentPage(current);
        }
      }
    } catch (err) {
      console.error('Failed to load brand pages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleSelectPage = (slug: string) => {
    setSelectedSlug(slug);
    const p = pages.find((item) => item.slug === slug);
    if (p) setCurrentPage(p);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPage) return;
    setSaving(true);
    try {
      await cmsApi.updatePage(currentPage.slug, currentPage);
      showNotification(`Page "${currentPage.title}" updated successfully`, 'success');
      await loadPages();
    } catch (err: any) {
      showNotification(err.message || 'Failed to save page', 'alert');
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
            <span className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              CMS • Brand Story & Policies
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">Brand Content & Policies</h1>
          <p className="text-xs text-stone-500">
            Publish authentic disclosures on cold process saponification, owner background, returns, and terms.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar: Pages List */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-4 shadow-xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider px-3 py-1 mb-1">
            Storefront Pages
          </div>
          {pages.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPage(p.slug)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                selectedSlug === p.slug
                  ? 'bg-[#244635] text-white shadow-xs'
                  : 'hover:bg-stone-50 text-stone-700'
              }`}
            >
              <div className="truncate">
                <div>{p.title}</div>
                <div
                  className={`text-[10px] font-mono ${
                    selectedSlug === p.slug ? 'text-emerald-200' : 'text-stone-400'
                  }`}
                >
                  /{p.slug}
                </div>
              </div>
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  p.isPublished ? 'bg-emerald-400' : 'bg-stone-400'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Right Editor Area */}
        <div className="md:col-span-3 bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs">
          {currentPage ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-base">
                    Editing: {currentPage.title}
                  </h3>
                  <p className="text-[11px] text-stone-400 font-mono">
                    Public Path: https://luminasoaps.com/pages/{currentPage.slug}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pagePub"
                    checked={currentPage.isPublished}
                    onChange={(e) =>
                      setCurrentPage({ ...currentPage, isPublished: e.target.checked })
                    }
                    className="rounded text-[#244635] focus:ring-[#244635]"
                  />
                  <label htmlFor="pagePub" className="text-xs font-bold text-stone-800">
                    Published Live
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Page Title</label>
                <input
                  type="text"
                  required
                  value={currentPage.title}
                  onChange={(e) => setCurrentPage({ ...currentPage, title: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635] text-stone-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Page Content (Markdown / Structured Text)
                </label>
                <textarea
                  rows={14}
                  required
                  value={currentPage.content}
                  onChange={(e) => setCurrentPage({ ...currentPage, content: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-1 focus:ring-[#244635] text-stone-800 font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  Last updated: {new Date(currentPage.lastUpdated).toLocaleDateString()}
                </span>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white font-semibold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Page Content'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="py-12 text-center text-stone-400 text-xs">Select a page to edit</div>
          )}
        </div>
      </div>
    </div>
  );
};
