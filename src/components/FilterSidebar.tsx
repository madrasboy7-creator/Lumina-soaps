import React from 'react';
import { Star, RotateCcw, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SoapCategory, SkinType, ScentProfile, formatPriceINR } from '../types';

const CATEGORIES: SoapCategory[] = [
  'Herbal & Botanical',
  'Goat Milk & Honey',
  'Exfoliating Scrub',
  'Aromatherapy & Calming',
  'Sensitive & Baby Care',
  'Artisan Swirl Gift Sets',
];

const SKIN_TYPES: SkinType[] = [
  'All Skin Types',
  'Dry & Sensitive',
  'Oily & Acne-Prone',
  'Eczema & Psoriasis Prone',
  'Mature & Nourishing',
];

const SCENTS: ScentProfile[] = [
  'French Lavender & Sage',
  'Raw Honey & Toasted Almond',
  'Activated Charcoal & Tea Tree',
  'Eucalyptus & Peppermint',
  'Wild Rose & Geranium',
  'Sweet Orange & Lemongrass',
  'Unscented Pure Castile',
];

export const FilterSidebar: React.FC<{ isMobileOpen?: boolean; onCloseMobile?: () => void }> = ({
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { filters, setFilters, resetFilters, activeFilterCount, products } = useStore();

  const handleCategoryToggle = (cat: SoapCategory) => {
    setFilters((prev) => {
      const exists = prev.selectedCategories.includes(cat);
      return {
        ...prev,
        selectedCategories: exists
          ? prev.selectedCategories.filter((c) => c !== cat)
          : [...prev.selectedCategories, cat],
      };
    });
  };

  const handleSkinTypeToggle = (st: SkinType) => {
    setFilters((prev) => {
      const exists = prev.selectedSkinTypes.includes(st);
      return {
        ...prev,
        selectedSkinTypes: exists
          ? prev.selectedSkinTypes.filter((s) => s !== st)
          : [...prev.selectedSkinTypes, st],
      };
    });
  };

  const handleScentToggle = (sc: ScentProfile) => {
    setFilters((prev) => {
      const exists = prev.selectedScents.includes(sc);
      return {
        ...prev,
        selectedScents: exists
          ? prev.selectedScents.filter((s) => s !== sc)
          : [...prev.selectedScents, sc],
      };
    });
  };

  const getCategoryCount = (cat: SoapCategory) =>
    products.filter((p) => p.category === cat).length;

  return (
    <aside
      className={`bg-white border-r border-[#e5dfd3] p-5 w-72 flex-shrink-0 flex flex-col gap-6 text-[#202f1f] text-sm overflow-y-auto ${
        isMobileOpen
          ? 'fixed inset-y-0 left-0 z-50 shadow-2xl block w-80'
          : 'hidden lg:flex'
      }`}
    >
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e5dfd3]">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-base text-[#1b2f1c]">Amazon-Style Filters</h2>
          {activeFilterCount > 0 && (
            <span className="bg-[#e4ede2] text-[#2c4e2a] text-xs px-2 py-0.5 rounded-full font-bold">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs text-[#a0681a] hover:text-[#7d4f10] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Special Highlights: New Releases & In Stock */}
      <div className="space-y-2.5 pb-4 border-b border-[#e5dfd3]">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[#637762]">
          Special Releases
        </h3>
        <label className="flex items-center gap-2.5 cursor-pointer select-none group">
          <input
            type="checkbox"
            checked={filters.newReleasesOnly}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, newReleasesOnly: e.target.checked }))
            }
            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-gray-300 cursor-pointer"
          />
          <span className="text-sm font-semibold flex items-center gap-1.5 text-amber-900 group-hover:text-amber-700">
            <Sparkles className="w-4 h-4 text-amber-500" />
            ✨ Floating New Releases Only
          </span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer select-none group">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
            }
            className="w-4 h-4 rounded text-[#2d4d2b] focus:ring-[#2d4d2b] border-gray-300 cursor-pointer"
          />
          <span className="text-sm text-[#273a26] group-hover:text-[#182a17]">
            In Stock (Cured & Ready)
          </span>
        </label>
      </div>

      {/* Categories */}
      <div className="space-y-2.5 pb-4 border-b border-[#e5dfd3]">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[#637762]">
          Soap Category
        </h3>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat);
            const isChecked = filters.selectedCategories.includes(cat);
            return (
              <label
                key={cat}
                className="flex items-center justify-between cursor-pointer select-none group text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCategoryToggle(cat)}
                    className="w-4 h-4 rounded text-[#2d4d2b] focus:ring-[#2d4d2b] border-gray-300 cursor-pointer"
                  />
                  <span
                    className={`${
                      isChecked ? 'font-bold text-[#1a2d19]' : 'text-gray-700'
                    } group-hover:text-[#182a17]`}
                  >
                    {cat}
                  </span>
                </div>
                <span className="text-xs text-gray-400 font-mono">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Skin Type Focus */}
      <div className="space-y-2.5 pb-4 border-b border-[#e5dfd3]">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[#637762]">
          Skin Type & Concern
        </h3>
        <div className="space-y-1.5">
          {SKIN_TYPES.map((st) => {
            const isChecked = filters.selectedSkinTypes.includes(st);
            return (
              <label
                key={st}
                className="flex items-center gap-2 cursor-pointer select-none group text-xs sm:text-sm"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleSkinTypeToggle(st)}
                  className="w-4 h-4 rounded text-[#2d4d2b] focus:ring-[#2d4d2b] border-gray-300 cursor-pointer"
                />
                <span
                  className={`${
                    isChecked ? 'font-bold text-[#1a2d19]' : 'text-gray-700'
                  } group-hover:text-[#182a17]`}
                >
                  {st}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Scent Profiles */}
      <div className="space-y-2.5 pb-4 border-b border-[#e5dfd3]">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[#637762]">
          Aromatherapy & Scents
        </h3>
        <div className="space-y-1.5">
          {SCENTS.map((sc) => {
            const isChecked = filters.selectedScents.includes(sc);
            return (
              <label
                key={sc}
                className="flex items-center gap-2 cursor-pointer select-none group text-xs sm:text-sm"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleScentToggle(sc)}
                  className="w-4 h-4 rounded text-[#2d4d2b] focus:ring-[#2d4d2b] border-gray-300 cursor-pointer"
                />
                <span
                  className={`${
                    isChecked ? 'font-bold text-[#1a2d19]' : 'text-gray-700'
                  } group-hover:text-[#182a17]`}
                >
                  {sc}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter in INR */}
      <div className="space-y-3 pb-4 border-b border-[#e5dfd3]">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#637762]">
            Price Range (₹ INR)
          </h3>
          <span className="text-xs font-mono font-bold text-[#2d4d2b]">
            {formatPriceINR(filters.priceRange[0])} - {formatPriceINR(filters.priceRange[1])}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1500"
          step="25"
          value={filters.priceRange[1]}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              priceRange: [prev.priceRange[0], Number(e.target.value)],
            }))
          }
          className="w-full accent-[#2d4d2b] cursor-pointer"
        />
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center bg-[#f7f5ed] border border-[#d6d0c2] rounded px-2 py-1 w-24">
            <span className="text-gray-400 mr-1">₹</span>
            <input
              type="number"
              min="0"
              max={filters.priceRange[1]}
              value={filters.priceRange[0]}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: [Number(e.target.value), prev.priceRange[1]],
                }))
              }
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
          <span className="text-gray-400">to</span>
          <div className="flex items-center bg-[#f7f5ed] border border-[#d6d0c2] rounded px-2 py-1 w-24">
            <span className="text-gray-400 mr-1">₹</span>
            <input
              type="number"
              min={filters.priceRange[0]}
              max="2000"
              value={filters.priceRange[1]}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], Number(e.target.value)],
                }))
              }
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Customer Reviews Star Rating Filter */}
      <div className="space-y-2.5 pb-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[#637762]">
          Customer Reviews
        </h3>
        <div className="space-y-1">
          {[4, 3].map((star) => (
            <button
              key={star}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  minRating: prev.minRating === star ? 0 : star,
                }))
              }
              className={`w-full text-left py-1 px-1.5 rounded flex items-center gap-2 text-xs transition-colors cursor-pointer ${
                filters.minRating === star
                  ? 'bg-[#e7eee5] font-bold text-[#192f18]'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>

      {onCloseMobile && (
        <button
          onClick={onCloseMobile}
          className="mt-auto py-2.5 bg-[#2d4d2b] text-white rounded-lg font-bold text-sm cursor-pointer"
        >
          View Filtered Results
        </button>
      )}
    </aside>
  );
};
