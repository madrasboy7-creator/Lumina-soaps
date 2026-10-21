import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { FilterSidebar } from './FilterSidebar';
import { ProductCard } from './ProductCard';
import { FloatingNewReleases } from './FloatingNewReleases';
import { SortOption } from '../types';
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
  PackageOpen,
} from 'lucide-react';

export const ShopView: React.FC = () => {
  const {
    products,
    filteredProducts,
    filters,
    setFilters,
    resetFilters,
    setCurrentView,
  } = useStore();

  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Active filter tags for quick removal
  const activeTags: { label: string; onRemove: () => void }[] = [];

  filters.selectedCategories.forEach((cat) => {
    activeTags.push({
      label: `Category: ${cat}`,
      onRemove: () =>
        setFilters((f) => ({
          ...f,
          selectedCategories: f.selectedCategories.filter((c) => c !== cat),
        })),
    });
  });

  filters.selectedScents.forEach((scent) => {
    activeTags.push({
      label: `Scent: ${scent}`,
      onRemove: () =>
        setFilters((f) => ({
          ...f,
          selectedScents: f.selectedScents.filter((s) => s !== scent),
        })),
    });
  });

  filters.selectedSkinTypes.forEach((st) => {
    activeTags.push({
      label: `Skin: ${st}`,
      onRemove: () =>
        setFilters((f) => ({
          ...f,
          selectedSkinTypes: f.selectedSkinTypes.filter((s) => s !== st),
        })),
    });
  });

  if (filters.minRating > 0) {
    activeTags.push({
      label: `${filters.minRating}★ & Up`,
      onRemove: () => setFilters((f) => ({ ...f, minRating: 0 })),
    });
  }

  if (filters.inStockOnly) {
    activeTags.push({
      label: 'In Stock Only',
      onRemove: () => setFilters((f) => ({ ...f, inStockOnly: false })),
    });
  }

  if (filters.newReleasesOnly) {
    activeTags.push({
      label: 'New Releases Only',
      onRemove: () => setFilters((f) => ({ ...f, newReleasesOnly: false })),
    });
  }

  if (filters.searchQuery) {
    activeTags.push({
      label: `Search: "${filters.searchQuery}"`,
      onRemove: () => setFilters((f) => ({ ...f, searchQuery: '' })),
    });
  }

  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1500) {
    activeTags.push({
      label: `₹${filters.priceRange[0]} - ₹${filters.priceRange[1]}`,
      onRemove: () => setFilters((f) => ({ ...f, priceRange: [0, 1500] })),
    });
  }

  if (products.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="bg-[#faf7ef] border-2 border-[#e7e1d3] rounded-3xl p-8 sm:p-14 shadow-xs flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#e8f1e7] text-[#2c4e2c] flex items-center justify-center mb-5 shadow-inner">
            <PackageOpen className="w-8 h-8 sm:w-10 sm:h-10 text-[#2c4e2c]" />
          </div>
          <span className="text-xs font-bold text-amber-700 tracking-wider uppercase mb-2">Artisanal Soapery Catalogue</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a2e1b] mb-4">
            Our soap collection is getting ready. Please check back soon.
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed mb-8">
            Each batch of Lumina handcrafted soaps is formulated with cold-pressed botanical oils and cured naturally on cedar drying racks. New small-batch releases will appear here the moment they are published.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setCurrentView('combos')}
              className="px-5 py-2.5 bg-[#244225] hover:bg-[#1a331b] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Browse Combo Offers
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="px-5 py-2.5 bg-white hover:bg-[#f1eee4] text-[#1e341f] border border-[#d5cfbe] text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 animate-fade-in">
      {/* Floating New Release Banner widget */}
      <FloatingNewReleases />

      {/* Main Shop Layout */}
      <div className="flex gap-6 mt-6">
        {/* Amazon-like Filter Sidebar */}
        <FilterSidebar
          isMobileOpen={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        {/* Products Results Pane */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Controls Bar (Results Count, Sorting, Layout) */}
          <div className="bg-white border border-[#e5e1d5] rounded-xl p-3.5 sm:p-4 mb-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[#f1eee4] text-[#1c2e1d] font-bold text-xs rounded-lg border border-[#dfdbcf]"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters ({activeTags.length})</span>
              </button>

              <div className="text-xs sm:text-sm text-[#243725]">
                Showing <span className="font-bold text-[#1c2e1d]">{filteredProducts.length}</span> of{' '}
                <span className="font-bold">{products.length}</span> artisanal soaps
                {filters.searchQuery && (
                  <span className="ml-1 text-gray-500">
                    for "<span className="font-semibold text-[#1c2e1d]">{filters.searchQuery}</span>"
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs font-semibold text-gray-600 hidden sm:inline">Sort:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value as SortOption,
                    }))
                  }
                  className="bg-[#f7f5ed] border border-[#dcd7cb] text-xs font-semibold text-[#1c2e1d] py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="relevance">Featured & Relevance</option>
                  <option value="price-low">Price: Low to High (₹)</option>
                  <option value="price-high">Price: High to Low (₹)</option>
                  <option value="rating">Highest Customer Rating</option>
                  <option value="newest">New Releases First</option>
                  <option value="bestselling">Best Sellers</option>
                </select>
              </div>

              {/* Grid / List View Toggle */}
              <div className="flex items-center border border-[#dcd7cb] rounded-lg overflow-hidden bg-[#f7f5ed]">
                <button
                  aria-label="Grid layout"
                  onClick={() => setViewLayout('grid')}
                  className={`p-1.5 transition-colors ${
                    viewLayout === 'grid'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'text-[#485e47] hover:bg-gray-200'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  aria-label="List layout"
                  onClick={() => setViewLayout('list')}
                  className={`p-1.5 transition-colors ${
                    viewLayout === 'list'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'text-[#485e47] hover:bg-gray-200'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Tags */}
          {activeTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4 bg-[#f2efe4] p-2.5 rounded-xl border border-[#ded9cb]">
              <span className="text-xs font-bold text-[#1b2f1c] mr-1">Active Filters:</span>
              {activeTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-white text-[#1c2e1d] border border-[#d6cfbe] font-medium shadow-2xs"
                >
                  <span>{tag.label}</span>
                  <button
                    onClick={tag.onRemove}
                    className="hover:text-red-600 p-0.5"
                    aria-label={`Remove filter ${tag.label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={resetFilters}
                className="text-xs text-[#8b5a2b] hover:text-[#6f451f] font-bold underline ml-auto cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Products Display */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-[#e5e1d5] rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <PackageOpen className="w-14 h-14 text-gray-300 mb-3" />
              <h3 className="text-lg font-serif font-bold text-[#1c2e1d]">No Botanical Soaps Match</h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mt-1 mb-4">
                We couldn't find any artisanal bars matching your current filter criteria. Try clearing some filters or searching for ingredients like "Lavender", "Neem", or "Goat Milk".
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-[#8b5a2b] hover:bg-[#6f451f] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div
              className={
                viewLayout === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                  : 'flex flex-col gap-4'
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} isListView={viewLayout === 'list'} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
