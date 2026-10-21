import React, { useState, useEffect } from 'react';
import {
  IndianRupee,
  Calendar,
  Download,
  TrendingUp,
  Receipt,
  RotateCcw,
  ShoppingBag,
  Info,
  ChevronLeft,
  ChevronRight,
  BarChart2,
} from 'lucide-react';
import { MonthlyRevenueReport, formatPriceINR } from '../../../types';

interface MonthlyRevenueSectionProps {
  onExportCSV?: (year: number) => void;
}

export const MonthlyRevenueSection: React.FC<MonthlyRevenueSectionProps> = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [report, setReport] = useState<MonthlyRevenueReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenue = async (year: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('lumina_owner_token') || '';
      const res = await fetch(`/api/owner/revenue?year=${year}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-owner-token': token,
        },
      });
      if (!res.ok) throw new Error('Failed to load revenue data');
      const data = await res.json();
      setReport(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching monthly revenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue(selectedYear);
  }, [selectedYear]);

  const handleDownloadCSV = () => {
    const token = localStorage.getItem('lumina_owner_token') || '';
    window.open(`/api/owner/revenue/export-csv?year=${selectedYear}&token=${encodeURIComponent(token)}`, '_blank');
  };

  const currentMonthData = report?.months.find(
    (m) => m.month === (new Date().getMonth() + 1) && m.year === currentYear
  );

  const maxRevenue = Math.max(1, ...(report?.months.map((m) => m.netCollectedRevenue) || [1]));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Monthly Revenue &amp; Financials
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Authoritative accounting records. Includes qualifying paid orders, refunds, and net collected revenue in Indian Rupees (₹ INR).
          </p>
        </div>

        {/* Year Selector & CSV Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-xl p-1 text-xs">
            <button
              onClick={() => setSelectedYear((y) => y - 1)}
              className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
              title="Previous Year"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold px-2 text-stone-900 font-mono">{selectedYear}</span>
            <button
              onClick={() => setSelectedYear((y) => y + 1)}
              className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
              title="Next Year"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 bg-[#244635] hover:bg-[#1b3427] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Financial Rules Notice */}
      <div className="p-4 rounded-2xl bg-[#FAF7EF] border border-[#ded4bf] flex items-start gap-3 text-xs text-stone-700">
        <Info className="w-4 h-4 text-[#244635] flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Strict Accounting Principles:</strong> Revenue is calculated exclusively from verified captured online payments and completed Cash on Delivery (COD) collections. Unpaid COD orders and failed transactions are excluded from collected revenue. All figures are in INR (₹) according to the Asia/Kolkata timezone.
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider">
            <span>This Month</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-stone-900 font-serif">
            {formatPriceINR(currentMonthData?.netCollectedRevenue || 0)}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Current month net sales</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider">
            <span>Paid Orders ({selectedYear})</span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-stone-900">
            {report?.qualifyingPaidOrders || 0}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Qualifying paid orders</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider">
            <span>Refunds ({selectedYear})</span>
            <RotateCcw className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-700 font-serif">
            {formatPriceINR(report?.refundTotal || 0)}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Total recorded refunds</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-300 bg-emerald-50/40 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-bold uppercase tracking-wider">
            <span>Net Collected ({selectedYear})</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-950 font-serif">
            {formatPriceINR(report?.netCollectedRevenue || 0)}
          </div>
          <p className="text-[11px] text-emerald-700 mt-1">Gross sales minus refunds</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider">
            <span>Average Order Value</span>
            <Receipt className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-stone-900 font-serif">
            {formatPriceINR(report?.averageOrderValue || 0)}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">AOV per qualifying order</p>
        </div>
      </div>

      {/* Visual Monthly Revenue Chart / Bar Overview */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#244635]" />
            <h3 className="font-bold text-sm text-stone-900">
              {selectedYear} Monthly Revenue Visualization
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">12-Month Progression</span>
        </div>

        <div className="grid grid-cols-12 gap-2 h-44 items-end pt-6 px-2">
          {report?.months.map((m) => {
            const heightPercent = maxRevenue > 0 ? Math.round((m.netCollectedRevenue / maxRevenue) * 100) : 0;
            return (
              <div key={m.month} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] text-stone-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {formatPriceINR(m.netCollectedRevenue)}
                </span>
                <div
                  style={{ height: `${Math.max(4, heightPercent)}%` }}
                  className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                    m.netCollectedRevenue > 0
                      ? 'bg-gradient-to-t from-[#244635] to-[#3a6850] group-hover:from-[#1b3427] group-hover:to-[#2d5540]'
                      : 'bg-stone-100'
                  }`}
                />
                <span className="text-[10px] font-bold text-stone-600 uppercase">
                  {m.monthName.slice(0, 3)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete 12-Month History Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-[#FAF7EF] border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-stone-900">
            {selectedYear} Complete 12-Month Financial Statement
          </h3>
          <span className="text-xs text-stone-500 font-mono">Currency: INR (₹)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-800 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Month &amp; Year</th>
                <th className="py-3 px-4 text-center">Qualifying Paid Orders</th>
                <th className="py-3 px-4 text-right">Gross Collected</th>
                <th className="py-3 px-4 text-right">Discounts</th>
                <th className="py-3 px-4 text-right">Refunds</th>
                <th className="py-3 px-4 text-right">Net Revenue</th>
                <th className="py-3 px-4 text-right">Average Order Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {report?.months.map((m) => (
                <tr key={m.month} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-stone-900">
                    {m.monthName}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 font-bold text-[11px]">
                      {m.qualifyingPaidOrders}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-stone-800">
                    {formatPriceINR(m.grossCollectedRevenue)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-stone-500">
                    {m.discounts > 0 ? `-${formatPriceINR(m.discounts)}` : '₹0'}
                  </td>
                  <td className="py-3.5 px-4 text-right text-rose-600">
                    {m.refunds > 0 ? `-${formatPriceINR(m.refunds)}` : '₹0'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-900">
                    {formatPriceINR(m.netCollectedRevenue)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-stone-700">
                    {formatPriceINR(m.averageOrderValue)}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Total Row */}
            <tfoot className="bg-[#FAF7EF] border-t-2 border-stone-300 font-bold text-xs text-stone-900">
              <tr>
                <td className="py-3 px-4">Full Year {selectedYear} Total</td>
                <td className="py-3 px-4 text-center">{report?.qualifyingPaidOrders || 0}</td>
                <td className="py-3 px-4 text-right">
                  {formatPriceINR((report?.netCollectedRevenue || 0) + (report?.refundTotal || 0))}
                </td>
                <td className="py-3 px-4 text-right text-stone-500">
                  {formatPriceINR(report?.months.reduce((sum, m) => sum + m.discounts, 0) || 0)}
                </td>
                <td className="py-3 px-4 text-right text-rose-600">
                  {formatPriceINR(report?.refundTotal || 0)}
                </td>
                <td className="py-3 px-4 text-right text-emerald-950 font-bold text-sm">
                  {formatPriceINR(report?.netCollectedRevenue || 0)}
                </td>
                <td className="py-3 px-4 text-right">{formatPriceINR(report?.averageOrderValue || 0)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
