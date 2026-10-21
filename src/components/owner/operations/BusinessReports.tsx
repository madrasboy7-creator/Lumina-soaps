import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  IndianRupee,
  ShoppingBag,
  Package,
  Clock,
  RotateCcw,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useStore } from '../../../context/StoreContext';
import { RevenueSummary, formatPriceINR } from '../../../types';

export const BusinessReports: React.FC = () => {
  const {
    orders,
    products,
    getRevenueSummary,
    getRevenueMonthlyReport,
    exportRevenueCSV,
    showNotification,
  } = useStore();

  const [revenueSummary, setRevenueSummary] = useState<RevenueSummary | null>(null);
  const [reportYear, setReportYear] = useState<number>(new Date().getFullYear());
  const [reportMonth, setReportMonth] = useState<number>(new Date().getMonth() + 1);
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const summary = await getRevenueSummary();
      setRevenueSummary(summary);
      const monthly = await getRevenueMonthlyReport(reportYear, reportMonth);
      setMonthlyData(monthly);
    } catch (e) {
      console.error('Failed to load revenue reports', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [reportYear, reportMonth]);

  const handleExportCSV = async () => {
    try {
      exportRevenueCSV(String(reportYear), String(reportMonth));
      showNotification('Exported revenue CSV report successfully', 'success');
    } catch (err: any) {
      showNotification(err.message || 'Failed to export CSV', 'alert');
    }
  };

  // Real collected revenue strictly calculated
  const { totalRevenue, pendingAmount, refundedAmount, deliveredOrdersCount } = useMemo(() => {
    let rev = 0;
    let pending = 0;
    let refunded = 0;
    let delivered = 0;

    orders.forEach((o) => {
      const isPaid =
        o.paymentStatus === 'SUCCESS' ||
        o.paymentStatus === 'captured' ||
        (o.paymentMethod.toLowerCase() === 'cod' && o.orderStatus === 'Delivered');

      if (isPaid) {
        rev += o.total;
      } else if (o.paymentStatus === 'refunded') {
        refunded += o.total;
      } else if (o.orderStatus !== 'Cancelled') {
        pending += o.total;
      }

      if (o.orderStatus === 'Delivered') {
        delivered += 1;
      }
    });

    return {
      totalRevenue: rev,
      pendingAmount: pending,
      refundedAmount: refunded,
      deliveredOrdersCount: delivered,
    };
  }, [orders]);

  // Daily chart data for the past 7 days
  const dailyChartData = useMemo(() => {
    const days: { [key: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      days[key] = 0;
    }

    orders.forEach((o) => {
      const isPaid =
        o.paymentStatus === 'SUCCESS' ||
        o.paymentStatus === 'captured' ||
        (o.paymentMethod.toLowerCase() === 'cod' && o.orderStatus === 'Delivered');

      if (isPaid) {
        const d = new Date(o.createdAt || o.date);
        const key = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
        if (days[key] !== undefined) {
          days[key] += o.total;
        }
      }
    });

    return Object.keys(days).map((day) => ({ day, sales: days[day] }));
  }, [orders]);

  // Product sales breakdown
  const productSales = useMemo(() => {
    const map = new Map<string, { name: string; qty: number; revenue: number }>();
    orders.forEach((o) => {
      const isPaid =
        o.paymentStatus === 'SUCCESS' ||
        o.paymentStatus === 'captured' ||
        (o.paymentMethod.toLowerCase() === 'cod' && o.orderStatus === 'Delivered');

      if (isPaid) {
        o.items.forEach((item) => {
          const id = item.productId || item.productName;
          const existing = map.get(id) || {
            name: item.productName,
            qty: 0,
            revenue: 0,
          };
          existing.qty += item.quantity;
          existing.revenue += item.price * item.quantity;
          map.set(id, existing);
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-amber-800 uppercase bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              Operations • Business Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Revenue Analytics & Financial Reports
          </h1>
          <p className="text-xs text-stone-500">
            Real confirmed collected revenue (excluding unpaid or cancelled orders), monthly turnover, and formulation sales.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Monthly CSV</span>
        </button>
      </div>

      {/* KPI Revenue Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Net Collected Revenue</div>
          <div className="text-2xl font-bold font-serif text-[#244635] mt-1">
            {formatPriceINR(totalRevenue)}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Confirmed payments only</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Average Order Value</div>
          <div className="text-2xl font-bold font-serif text-stone-900 mt-1">
            {orders.length > 0 ? formatPriceINR(Math.round(totalRevenue / orders.length)) : '₹0'}
          </div>
          <div className="text-[11px] text-stone-500 font-medium mt-1">
            Across {orders.length} total orders
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Pending Payments</div>
          <div className="text-2xl font-bold font-serif text-amber-700 mt-1">
            {formatPriceINR(pendingAmount)}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">Uncaptured or COD pending</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="text-[11px] text-stone-500 font-semibold uppercase">Delivered Orders</div>
          <div className="text-2xl font-bold font-serif text-stone-800 mt-1">
            {deliveredOrdersCount}
          </div>
          <div className="text-[11px] text-stone-500 font-medium mt-1">Completed shipments</div>
        </div>
      </div>

      {/* Chart: 7-Day Revenue Trend */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-base">
              Recent 7-Day Revenue Trend (INR)
            </h3>
            <p className="text-xs text-stone-500">Collected sales per day</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#244635] bg-emerald-50 px-2.5 py-1 rounded-xl">
            Live Payment Log
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ece6" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8c827a' }} />
              <YAxis tick={{ fontSize: 11, fill: '#8c827a' }} tickFormatter={(val) => `₹${val}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e7e0d6',
                  fontSize: '11px',
                }}
                formatter={(value: any) => [`₹${value}`, 'Collected Sales']}
              />
              <Bar dataKey="sales" fill="#244635" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Revenue Breakdown Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="font-serif font-bold text-stone-900 text-base">
            Sales Performance by Soap Formulation
          </h3>
          <span className="text-xs text-stone-400">Ranked by revenue</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5">Soap Formulation</th>
                <th className="py-2.5">Bars Sold</th>
                <th className="py-2.5 text-right">Collected Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {productSales.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-stone-400">
                    No confirmed sales recorded yet.
                  </td>
                </tr>
              ) : (
                productSales.map((ps, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/60">
                    <td className="py-3 font-semibold text-stone-900">{ps.name}</td>
                    <td className="py-3 text-stone-700 font-medium">{ps.qty} bars</td>
                    <td className="py-3 text-right font-serif font-bold text-[#244635]">
                      {formatPriceINR(ps.revenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
