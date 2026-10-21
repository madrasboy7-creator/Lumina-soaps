import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { FAQItem } from '../../../types';
import { cmsApi } from '../ownerApi';

export const FAQManager: React.FC = () => {
  const { showNotification } = useStore();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);

  const [formData, setFormData] = useState<Partial<FAQItem>>({
    question: '',
    answer: '',
    category: 'Ingredients & Quality',
    displayOrder: 1,
    isPublished: true,
  });

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const res = await cmsApi.getFAQs();
      const list = Array.isArray(res) ? res : (res as any)?.data || [];
      setFaqs(list);
    } catch (err) {
      console.error('Failed to load FAQs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFAQs();
  }, []);

  const handleOpenModal = (faq?: FAQItem) => {
    if (faq) {
      setEditingFAQ(faq);
      setFormData(faq);
    } else {
      setEditingFAQ(null);
      setFormData({
        question: '',
        answer: '',
        category: 'Ingredients & Quality',
        displayOrder: faqs.length + 1,
        isPublished: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question?.trim() || !formData.answer?.trim()) {
      showNotification('Question and answer are required', 'alert');
      return;
    }

    try {
      if (editingFAQ) {
        await cmsApi.updateFAQ(editingFAQ.id, formData);
        showNotification('FAQ item updated', 'success');
      } else {
        await cmsApi.createFAQ(formData);
        showNotification('New FAQ item created', 'success');
      }
      setIsModalOpen(false);
      await loadFAQs();
    } catch (err: any) {
      showNotification(err.message || 'Failed to save FAQ', 'alert');
    }
  };

  const handleDelete = async (faq: FAQItem) => {
    if (window.confirm(`Delete question: "${faq.question}"?`)) {
      try {
        await cmsApi.deleteFAQ(faq.id);
        showNotification('FAQ deleted', 'info');
        await loadFAQs();
      } catch (err: any) {
        showNotification(err.message || 'Failed to delete FAQ', 'alert');
      }
    }
  };

  const filteredFaqs = faqs.filter((f) => {
    const matchesSearch =
      !searchQuery.trim() ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-blue-800 uppercase bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
              CMS • Customer Knowledge
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">FAQ Manager</h1>
          <p className="text-xs text-stone-500">
            Provide transparent answers on natural saponification, 42-day cedar curing, neem benefits, and soap longevity.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search questions or answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#244635] text-stone-800"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:ring-1 focus:ring-[#244635]"
        >
          <option value="all">All FAQ Topics</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-xs transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                    {faq.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      faq.isPublished ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {faq.isPublished ? 'Published' : 'Hidden'}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-sm">{faq.question}</h3>
                <p className="text-xs text-stone-600 leading-relaxed pt-1">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleOpenModal(faq)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer"
                  title="Edit FAQ"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(faq)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                {editingFAQ ? 'Edit FAQ Item' : 'Create FAQ Item'}
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
                <label className="block text-stone-700 font-semibold mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={formData.question || ''}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Category / Topic</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  placeholder="e.g. Ingredients & Quality"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Detailed Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer || ''}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="faqPub"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded text-[#244635] focus:ring-[#244635]"
                  />
                  <label htmlFor="faqPub" className="text-stone-700 font-medium">
                    Published Live
                  </label>
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
                  <span>Save FAQ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
