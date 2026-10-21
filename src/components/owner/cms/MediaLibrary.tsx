import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Trash2,
  Copy,
  ExternalLink,
  Check,
  X,
  FileCheck,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { MediaItem } from '../../../types';
import { cmsApi } from '../ownerApi';

export const MediaLibrary: React.FC = () => {
  const { showNotification } = useStore();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    altText: '',
    fileType: 'image/jpeg',
    sizeKb: 120,
    dimensions: '800x800',
  });

  const loadMedia = async () => {
    try {
      setLoading(true);
      const res = await cmsApi.getMedia();
      const list = Array.isArray(res) ? res : (res as any)?.data || [];
      setMedia(list);
    } catch (err) {
      console.error('Failed to load media', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showNotification('Image URL copied to clipboard!', 'info');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url.trim() || !formData.title.trim()) {
      showNotification('Title and URL are required', 'alert');
      return;
    }

    try {
      await cmsApi.uploadMedia({
        title: formData.title,
        url: formData.url,
        altText: formData.altText || formData.title,
        fileType: formData.fileType,
        sizeKb: Number(formData.sizeKb || 120),
        dimensions: formData.dimensions || '800x800',
      });
      showNotification('Media asset added to library', 'success');
      setIsModalOpen(false);
      await loadMedia();
    } catch (err: any) {
      showNotification(err.message || 'Failed to add media', 'alert');
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (window.confirm(`Delete media item "${item.title || item.filename}"?`)) {
      try {
        await cmsApi.deleteMedia(item.id);
        showNotification('Media asset removed', 'info');
        if (selectedItem?.id === item.id) setSelectedItem(null);
        await loadMedia();
      } catch (err: any) {
        showNotification(err.message || 'Failed to delete media', 'alert');
      }
    }
  };

  const filteredMedia = media.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      (m.title || m.filename || '').toLowerCase().includes(q) ||
      m.altText.toLowerCase().includes(q) ||
      m.url.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              CMS • Asset Library
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">Media Library</h1>
          <p className="text-xs text-stone-500">
            Repository of high-resolution soap photography, workshop textures, cedar rack curing visuals, and icons.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              title: '',
              url: '',
              altText: '',
              fileType: 'image/jpeg',
              sizeKb: 140,
              dimensions: '800x800',
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media Asset</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search images by title, alt text, or filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#244635] text-stone-800"
          />
        </div>
        <span className="text-xs font-medium text-stone-500 shrink-0">
          {filteredMedia.length} assets
        </span>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className={`group bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
              selectedItem?.id === item.id ? 'border-[#244635] ring-2 ring-[#244635]/20' : 'border-stone-200/80'
            }`}
          >
            <div className="relative aspect-square bg-stone-100 overflow-hidden">
              <img
                src={item.url}
                alt={item.altText || item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/50 p-1 rounded-lg backdrop-blur-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyUrl(item.url);
                  }}
                  className="p-1 text-white hover:text-amber-300 transition-colors"
                  title="Copy URL"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item);
                  }}
                  className="p-1 text-rose-300 hover:text-rose-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3">
              <div className="font-semibold text-xs text-stone-900 truncate">{item.title}</div>
              <div className="flex items-center justify-between text-[10px] text-stone-400 mt-0.5">
                <span>{item.dimensions || '800x800'}</span>
                <span>{item.sizeKb || 120} KB</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Item Drawer/Modal */}
      {selectedItem && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs flex flex-col md:flex-row items-center gap-6">
          <img
            src={selectedItem.url}
            alt={selectedItem.altText}
            className="w-32 h-32 rounded-2xl object-cover border border-stone-200 bg-stone-50 shrink-0"
          />
          <div className="space-y-1.5 flex-1 text-xs">
            <h4 className="font-serif font-bold text-stone-900 text-sm">{selectedItem.title}</h4>
            <p className="text-stone-500 font-mono text-[11px] truncate max-w-xl">{selectedItem.url}</p>
            <p className="text-stone-600">Alt text: <span className="italic">{selectedItem.altText}</span></p>
            <div className="text-[10px] text-stone-400">
              Format: {selectedItem.fileType} • Dimensions: {selectedItem.dimensions} • Size: {selectedItem.sizeKb} KB
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopyUrl(selectedItem.url)}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>
            <button
              onClick={() => handleDelete(selectedItem)}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
            <button
              onClick={() => setSelectedItem(null)}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-xl"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add Media Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-stone-900 text-base">Add Media Asset</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Asset Name / Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  placeholder="e.g. Cedar Rack Curing Batch Close-up"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Accessibility Alt Text</label>
                <input
                  type="text"
                  value={formData.altText}
                  onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  placeholder="Describe image content for SEO and screen readers"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                    placeholder="800x800"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Size (KB)</label>
                  <input
                    type="number"
                    value={formData.sizeKb}
                    onChange={(e) => setFormData({ ...formData, sizeKb: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  />
                </div>
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
                  <span>Add to Media Library</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
