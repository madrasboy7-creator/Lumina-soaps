import React, { useState } from 'react';
import {
  Clock,
  Plus,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Sparkles,
  Layers,
  ArrowRight,
  X,
  Check,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { CuringBatch } from '../../../types';

export const CuringRackManager: React.FC = () => {
  const {
    curingBatches,
    products,
    addCuringBatch,
    updateCuringBatchStatus,
    showNotification,
  } = useStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [batchSoapName, setBatchSoapName] = useState(products[0]?.name || 'Pure Wild Neem Bar');
  const [batchNumber, setBatchNumber] = useState(
    `LUM-BATCH-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  );
  const [batchBarCount, setBatchBarCount] = useState<number>(36);
  const [batchOils, setBatchOils] = useState('Cold-Pressed Neem Oil & Raw Wild Honey');
  const [rackLocation, setRackLocation] = useState('Cedar Rack A-1');

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchSoapName.trim() || !batchNumber.trim()) {
      showNotification('Soap name and batch number are required', 'alert');
      return;
    }

    try {
      const pourDate = new Date();
      // 42 days cold process cure
      const cureEndDate = new Date(pourDate.getTime() + 42 * 24 * 60 * 60 * 1000);

      await addCuringBatch({
        soapName: batchSoapName,
        batchNumber: batchNumber.trim(),
        barCount: Number(batchBarCount),
        essentialOilsUsed: batchOils,
        pourDate: pourDate.toISOString(),
        expectedCureDate: cureEndDate.toISOString(),
        status: 'Curing on Racks',
      });

      showNotification(`Curing batch ${batchNumber} added to cedar drying racks`, 'success');
      setIsAddModalOpen(false);
    } catch (err: any) {
      showNotification(err.message || 'Failed to add curing batch', 'alert');
    }
  };

  const handleUpdateStatus = async (batchId: string, newStatus: 'Curing on Racks' | 'Ready for Sale') => {
    try {
      await updateCuringBatchStatus(batchId, newStatus);
      showNotification(
        newStatus === 'Ready for Sale'
          ? 'Batch marked as Ready for Sale! Stock can now be released.'
          : 'Batch returned to Curing on Racks',
        'success'
      );
    } catch (err: any) {
      showNotification(err.message || 'Failed to update batch status', 'alert');
    }
  };

  const curingBatchesCount = curingBatches.filter((b) => b.status === 'Curing on Racks').length;
  const readyBatchesCount = curingBatches.filter((b) => b.status === 'Ready for Sale').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-amber-800 uppercase bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              Operations • Cold Process Curing Floor
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Cedar Curing Rack Management
          </h1>
          <p className="text-xs text-stone-500">
            Mandatory 42-day aging timeline. Moisture evaporates and saponification cures completely before bars become purchasable.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Poured Batch</span>
        </button>
      </div>

      {/* Rack Overview Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Batches Curing</div>
          <div className="text-2xl font-bold font-serif text-amber-800 mt-1">{curingBatchesCount}</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">On cedar racks</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Ready For Packaging</div>
          <div className="text-2xl font-bold font-serif text-[#244635] mt-1">{readyBatchesCount}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Met 42-day readiness</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Total Bars on Racks</div>
          <div className="text-2xl font-bold font-serif text-stone-900 mt-1">
            {curingBatches.reduce((sum, b) => sum + b.barCount, 0)}
          </div>
          <div className="text-[11px] text-stone-500 font-medium mt-1">Handmade cold process</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Standard Cure Window</div>
          <div className="text-2xl font-bold font-serif text-stone-900 mt-1">42 Days</div>
          <div className="text-[11px] text-stone-500 font-medium mt-1">Strict quality standard</div>
        </div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {curingBatches.map((batch) => {
          const daysLeft = Math.max(
            0,
            Math.ceil((new Date(batch.expectedCureDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          );
          const isReady = batch.status === 'Ready for Sale' || daysLeft === 0;

          return (
            <div
              key={batch.id}
              className={`p-6 bg-white rounded-3xl border shadow-xs flex flex-col justify-between hover:shadow-md transition-all ${
                isReady ? 'border-emerald-300' : 'border-amber-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                  <span className="font-mono text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                    {batch.batchNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      isReady
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {batch.status === 'Ready for Sale' ? 'Ready for Sale' : `${daysLeft} Days Remaining`}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-stone-900 text-base">{batch.soapName}</h3>
                <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                  {batch.essentialOilsUsed || 'Cold-pressed oils and therapeutic botanicals'}
                </p>

                <div className="mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Bars Poured:</span>
                    <span className="font-bold text-stone-900">{batch.barCount} bars</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Pour Date:</span>
                    <span className="font-mono text-stone-700">
                      {new Date(batch.pourDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Ready Date:</span>
                    <span className="font-mono font-bold text-stone-800">
                      {new Date(batch.expectedCureDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between">
                {batch.status !== 'Ready for Sale' ? (
                  <button
                    onClick={() => handleUpdateStatus(batch.id, 'Ready for Sale')}
                    className="w-full py-2 px-3 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Mark Curing Complete</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(batch.id, 'Curing on Racks')}
                    className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Return to Curing Racks</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Batch Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif font-bold text-stone-900 text-base">
                  Log New Cold Process Batch
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Soap Formulation *</label>
                <select
                  value={batchSoapName}
                  onChange={(e) => setBatchSoapName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Batch Number *</label>
                  <input
                    type="text"
                    required
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Bars Poured Count</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={batchBarCount}
                    onChange={(e) => setBatchBarCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Cedar Rack Location</label>
                <input
                  type="text"
                  value={rackLocation}
                  onChange={(e) => setRackLocation(e.target.value)}
                  placeholder="e.g. Cedar Rack A-2 (Top Shelf)"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Oils & Botanical Notes</label>
                <input
                  type="text"
                  value={batchOils}
                  onChange={(e) => setBatchOils(e.target.value)}
                  placeholder="e.g. Saponified Coconut Oil, Cold-Pressed Neem, Pure Sesame Oil"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 text-[11px] text-amber-900">
                Rule: Curing duration is automatically set to 42 days from today on cedar racks.
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Log Batch to Racks</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
