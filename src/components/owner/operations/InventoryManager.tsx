import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  History,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowUpDown,
  X,
  Check,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { SoapProduct, GiftItem } from '../../../types';

export const InventoryManager: React.FC = () => {
  const {
    products,
    giftItems,
    adjustInventory,
    refreshProducts,
    showNotification,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low_stock' | 'out_of_stock' | 'healthy'>('all');

  // Stock Adjustment Modal
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [adjustChange, setAdjustChange] = useState<number>(12);
  const [adjustType, setAdjustType] = useState<'restock' | 'damage' | 'waste' | 'manual_adjustment'>('restock');
  const [adjustReason, setAdjustReason] = useState('Finished 42-day curing on cedar racks');
  const [isAdjusting, setIsAdjusting] = useState(false);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q));

      const threshold = p.lowStockThreshold || 5;
      const matchesFilter =
        filterType === 'all' ||
        (filterType === 'low_stock' && p.stock > 0 && p.stock <= threshold) ||
        (filterType === 'out_of_stock' && p.stock === 0) ||
        (filterType === 'healthy' && p.stock > threshold);

      return matchesSearch && matchesFilter;
    });
  }, [products, searchQuery, filterType]);

  const handleOpenAdjust = (productId?: string) => {
    setSelectedProductId(productId || products[0]?.id || '');
    setAdjustChange(12);
    setAdjustType('restock');
    setAdjustReason('Finished 42-day curing on cedar racks');
    setIsAdjustOpen(true);
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    if (adjustChange === 0) {
      showNotification('Adjustment quantity cannot be 0', 'alert');
      return;
    }

    setIsAdjusting(true);
    try {
      const delta = adjustType === 'damage' || adjustType === 'waste' ? -Math.abs(adjustChange) : adjustChange;
      await adjustInventory({
        soapId: selectedProductId,
        quantityChange: delta,
        movementType: adjustType,
        reason: adjustReason,
      });
      showNotification(`Adjusted inventory by ${delta > 0 ? `+${delta}` : delta} bars`, 'success');
      setIsAdjustOpen(false);
      await refreshProducts();
    } catch (err: any) {
      showNotification(err.message || 'Failed to adjust inventory', 'alert');
    } finally {
      setIsAdjusting(false);
    }
  };

  const lowStockCount = products.filter((p) => p.stock <= (p.lowStockThreshold || 5)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-amber-800 uppercase bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              Operations • Inventory Control
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Artisan Soap Inventory
          </h1>
          <p className="text-xs text-stone-500">
            Authoritative stock levels, low-inventory threshold triggers, and recorded cedar rack stock releases.
          </p>
        </div>

        <button
          onClick={() => handleOpenAdjust()}
          className="px-4 py-2.5 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Adjust Soap Stock</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Total Soap Catalog</div>
          <div className="text-2xl font-bold font-serif text-stone-900 mt-1">{products.length}</div>
          <div className="text-[11px] text-stone-500 font-medium mt-1">Formulations tracked</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Total Available Bars</div>
          <div className="text-2xl font-bold font-serif text-[#244635] mt-1">
            {products.reduce((sum, p) => sum + p.stock, 0)}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Ready for sale</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Low Stock Alerts</div>
          <div className={`text-2xl font-bold font-serif mt-1 ${lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
            {lowStockCount}
          </div>
          <div className="text-[11px] text-stone-500 font-medium mt-1">At or below threshold</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Free Gift Items</div>
          <div className="text-2xl font-bold font-serif text-stone-900 mt-1">
            {giftItems.reduce((sum, g) => sum + g.stockQuantity, 0)}
          </div>
          <div className="text-[11px] text-stone-500 font-medium mt-1">Dishes & soap savers</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search stock by soap name, category, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#244635] text-stone-800"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:ring-1 focus:ring-[#244635]"
        >
          <option value="all">All Inventory States</option>
          <option value="low_stock">Low Stock (≤ Threshold)</option>
          <option value="out_of_stock">Out of Stock (0 bars)</option>
          <option value="healthy">Healthy Stock</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50/70 border-b border-stone-200/80 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Artisan Soap Product</th>
                <th className="py-3 px-4">SKU / Batch Ref</th>
                <th className="py-3 px-4">Available Bars</th>
                <th className="py-3 px-4">Low Stock Trigger</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => {
                const threshold = p.lowStockThreshold || 5;
                const isOutOfStock = p.stock === 0;
                const isLow = p.stock <= threshold;

                return (
                  <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image || '/logo.svg'}
                          alt={p.name}
                          className="w-9 h-9 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-stone-900 text-xs">{p.name}</div>
                          <div className="text-[10px] text-stone-400">{p.category}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-stone-600 text-[11px]">
                      {p.sku || p.batchNumber || 'LUM-SOAP'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 text-sm font-serif">{p.stock}</span>
                      <span className="text-stone-500 text-[11px] ml-1">bars</span>
                    </td>

                    <td className="py-3.5 px-4 text-stone-600">
                      ≤ {threshold} bars
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isOutOfStock
                            ? 'bg-rose-100 text-rose-900'
                            : isLow
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {isOutOfStock ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenAdjust(p.id)}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#244635] hover:text-white text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Adjust Stock &gt;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {isAdjustOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#244635]" />
                <h3 className="font-serif font-bold text-stone-900 text-base">
                  Record Stock Adjustment
                </h3>
              </div>
              <button
                onClick={() => setIsAdjustOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Select Formulation *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Current Stock: {p.stock} bars)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Adjustment Type</label>
                  <select
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  >
                    <option value="restock">Restock (Cedar Cured Release)</option>
                    <option value="damage">Damaged in Studio</option>
                    <option value="waste">Sample / Waste</option>
                    <option value="manual_adjustment">Manual Adjustment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Quantity of Bars</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={adjustChange}
                    onChange={(e) => setAdjustChange(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Reason / Batch Reference *</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Batch LUM-BATCH-2026-10 finished 42-day cure"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdjustOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdjusting}
                  className="px-5 py-2 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isAdjusting ? 'Recording...' : 'Save Stock Adjustment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
