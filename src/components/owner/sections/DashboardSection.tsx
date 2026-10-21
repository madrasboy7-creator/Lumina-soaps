import React from 'react';
import {
  Package,
  CheckCircle,
  Clock,
  ShoppingBag,
  IndianRupee,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { OwnerSection, formatPriceINR } from '../../../types';

interface DashboardSectionProps {
  stats: {
    totalProducts: number;
    publishedProducts: number;
    ordersAwaitingProcessing: number;
    totalOrders: number;
    currentMonthRevenue: number;
    activeComboOffers: number;
    lowStockProducts: number;
    recentOrders?: any[];
    pendingOrders?: any[];
    lowStockAlerts?: any[];
    monthlyRevenueOverview?: {
      currentMonthRevenue: number;
      netCollectedRevenue: number;
      qualifyingPaidOrders: number;
    };
  };
  onNavigate: (section: OwnerSection) => void;
  onAddProduct: () => void;
  onCreateOffer: () => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  stats,
  onNavigate,
  onAddProduct,
  onCreateOffer,
}) => {
  const cards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      sub: `${stats.publishedProducts} published`,
      icon: Package,
      section: 'products' as OwnerSection,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconColor: 'text-emerald-700',
    },
    {
      title: 'Published Soaps',
      value: stats.publishedProducts,
      sub: stats.publishedProducts === 0 ? 'Catalogue is getting ready' : 'Live on storefront',
      icon: CheckCircle,
      section: 'products' as OwnerSection,
      color: 'bg-teal-50 text-teal-800 border-teal-200',
      iconColor: 'text-teal-700',
    },
    {
      title: 'Awaiting Processing',
      value: stats.ordersAwaitingProcessing,
      sub: 'Need packaging / dispatch',
      icon: Clock,
      section: 'orders' as OwnerSection,
      color: stats.ordersAwaitingProcessing > 0 ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-stone-50 text-stone-700 border-stone-200',
      iconColor: 'text-amber-700',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      sub: 'All-time orders placed',
      icon: ShoppingBag,
      section: 'orders' as OwnerSection,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      iconColor: 'text-blue-700',
    },
    {
      title: "This Month's Revenue",
      value: formatPriceINR(stats.currentMonthRevenue),
      sub: 'Collected paid sales only',
      icon: IndianRupee,
      section: 'revenue' as OwnerSection,
      color: 'bg-emerald-50 text-emerald-900 border-emerald-300 font-serif',
      iconColor: 'text-emerald-700',
    },
    {
      title: 'Active Combo Offers',
      value: stats.activeComboOffers,
      sub: 'Bundles & gift promotions',
      icon: Sparkles,
      section: 'combos' as OwnerSection,
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      iconColor: 'text-purple-700',
    },
    {
      title: 'Low-Stock Alerts',
      value: stats.lowStockProducts,
      sub: stats.lowStockProducts > 0 ? 'Needs soapcraft restocking' : 'Stock levels healthy',
      icon: AlertTriangle,
      section: 'products' as OwnerSection,
      color: stats.lowStockProducts > 0 ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-stone-50 text-stone-600 border-stone-200',
      iconColor: 'text-rose-600',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-[#244635] via-[#1c382a] to-[#162e22] text-[#F4F0E5] rounded-2xl p-6 sm:p-8 shadow-md border border-[#2a4d3b] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D9B98B] bg-[#172d22] px-2.5 py-1 rounded-full border border-[#2a4d3b]">
            Sole Proprietor Studio
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2">
            Welcome back, R. Niranjana
          </h2>
          <p className="text-sm text-stone-300 mt-1 max-w-xl">
            Lumina Soaps overview. Real-time product inventory, order fulfilment, active combo offers, and verified revenue reports.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onAddProduct}
            className="flex items-center gap-2 bg-[#D9B98B] hover:bg-[#c9a775] text-[#1a3327] font-semibold px-4 py-2.5 rounded-xl shadow transition-colors text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Soap</span>
          </button>
          <button
            onClick={onCreateOffer}
            className="flex items-center gap-2 bg-[#2d5540] hover:bg-[#35634b] text-[#F4F0E5] font-semibold px-4 py-2.5 rounded-xl border border-[#3f7055] transition-colors text-sm"
          >
            <Sparkles className="w-4 h-4 text-[#D9B98B]" />
            <span>Create Combo</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <button
              key={idx}
              onClick={() => onNavigate(card.section)}
              className={`text-left p-5 rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group ${card.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl bg-white/70 shadow-xs ${card.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                {card.value}
              </div>
              <div className="mt-1 flex items-center justify-between text-xs opacity-75">
                <span>{card.sub}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Two Column Section: Recent Orders & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent / Pending Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-800">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">Recent Customer Orders</h3>
                  <p className="text-xs text-stone-500">Orders placed by customers awaiting fulfilment</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('orders')}
                className="text-xs font-semibold text-[#244635] hover:text-[#183024] flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="divide-y divide-stone-100 mt-2">
                {stats.recentOrders.map((ord: any) => (
                  <div
                    key={ord.id}
                    onClick={() => onNavigate('orders')}
                    className="py-3.5 flex items-center justify-between hover:bg-stone-50 px-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900 font-mono">
                          {ord.orderNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.orderStatus === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {ord.customerName} • {new Date(ord.createdAt || ord.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm text-stone-900">
                        {formatPriceINR(ord.total)}
                      </span>
                      <p className="text-[11px] text-stone-500 uppercase">{ord.paymentMethod}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-3">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-stone-800 text-sm">No orders placed yet</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                  Once customers place orders on your store, they will appear here with live packaging and dispatch tracking.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Status updates instantly reflect in customer tracking</span>
            <button
              onClick={() => onNavigate('orders')}
              className="text-[#244635] font-semibold hover:underline"
            >
              Manage Orders &rarr;
            </button>
          </div>
        </div>

        {/* Right: Low Stock Alerts & Quick Actions (1 col) */}
        <div className="space-y-6">
          {/* Low Stock Box */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h3 className="font-bold text-sm text-stone-900">Low-Stock Soaps</h3>
            </div>
            {stats.lowStockAlerts && stats.lowStockAlerts.length > 0 ? (
              <div className="divide-y divide-stone-100 mt-2">
                {stats.lowStockAlerts.map((prod: any) => (
                  <div key={prod.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-medium text-stone-800">{prod.name}</span>
                      <p className="text-stone-400 text-[10px] font-mono">{prod.sku || 'NO-SKU'}</p>
                    </div>
                    <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                      {prod.stock} bars left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-stone-600 font-medium">All soap inventory levels are sufficient.</p>
              </div>
            )}
            <button
              onClick={() => onNavigate('products')}
              className="w-full mt-3 py-2 text-xs font-semibold text-[#244635] hover:bg-stone-50 rounded-lg border border-stone-200 transition-colors"
            >
              View Inventory
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-[#FAF7EF] rounded-2xl border border-[#e4dccb] p-5">
            <h4 className="font-serif font-bold text-stone-900 text-sm mb-3">
              Quick Shortcuts
            </h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => onNavigate('products')}
                className="w-full text-left p-2.5 rounded-lg bg-white border border-[#ded4bf] hover:border-[#c2b295] flex items-center justify-between text-stone-800 font-medium transition-colors"
              >
                <span>Add / Update Soap Products</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>
              <button
                onClick={() => onNavigate('combos')}
                className="w-full text-left p-2.5 rounded-lg bg-white border border-[#ded4bf] hover:border-[#c2b295] flex items-center justify-between text-stone-800 font-medium transition-colors"
              >
                <span>Manage Combo Offers</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>
              <button
                onClick={() => onNavigate('revenue')}
                className="w-full text-left p-2.5 rounded-lg bg-white border border-[#ded4bf] hover:border-[#c2b295] flex items-center justify-between text-stone-800 font-medium transition-colors"
              >
                <span>View Monthly Revenue & CSV</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>
              <button
                onClick={() => onNavigate('settings')}
                className="w-full text-left p-2.5 rounded-lg bg-white border border-[#ded4bf] hover:border-[#c2b295] flex items-center justify-between text-stone-800 font-medium transition-colors"
              >
                <span>Store & Maker Settings</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
