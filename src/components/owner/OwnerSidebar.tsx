import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Sparkles,
  IndianRupee,
  Settings,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { OwnerSection } from '../../types';

interface OwnerSidebarProps {
  currentSection: OwnerSection;
  onSelectSection: (section: OwnerSection) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onViewStorefront: () => void;
  onSignOut: () => void;
  pendingOrdersCount?: number;
  lowStockCount?: number;
  activeOffersCount?: number;
}

export const OwnerSidebar: React.FC<OwnerSidebarProps> = ({
  currentSection,
  onSelectSection,
  isCollapsed,
  onToggleCollapse,
  onViewStorefront,
  onSignOut,
  pendingOrdersCount = 0,
  lowStockCount = 0,
  activeOffersCount = 0,
}) => {
  const navItems: {
    id: OwnerSection;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: 'bg-amber-500 text-stone-950',
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'combos',
      label: 'Combo Offers',
      icon: Sparkles,
      badge: activeOffersCount > 0 ? activeOffersCount : undefined,
      badgeColor: 'bg-purple-400 text-stone-950',
    },
    {
      id: 'revenue',
      label: 'Monthly Revenue',
      icon: IndianRupee,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`h-screen bg-[#1c2e1d] text-[#F4F0E5] border-r border-[#2a442c] flex flex-col transition-all duration-300 z-30 select-none flex-shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-[#2a442c] flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d9b98b] to-[#b5802c] flex items-center justify-center text-[#1c2e1d] font-serif font-black text-xl shadow-md flex-shrink-0">
              L
            </div>
            <div className="min-w-0">
              <h1 className="font-serif font-bold text-base text-[#F4F0E5] tracking-tight truncate leading-tight">
                Lumina Soaps
              </h1>
              <p className="text-[11px] font-medium text-[#d9b98b] tracking-wider uppercase truncate">
                R. Niranjana (Owner)
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-10 h-10 rounded-xl bg-gradient-to-br from-[#d9b98b] to-[#b5802c] flex items-center justify-center text-[#1c2e1d] font-serif font-black text-xl shadow-md">
            L
          </div>
        )}
      </div>

      {/* Main Navigation (The 6 exact sections) */}
      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-1.5 custom-scrollbar">
        {!isCollapsed && (
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#D9B98B]/70 mb-2">
            Owner Navigation
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-xs transition-all duration-200 group ${
                isActive
                  ? 'bg-[#244635] text-white shadow-xs font-semibold'
                  : 'text-[#F4F0E5]/80 hover:bg-[#253d27] hover:text-white'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-[#D9B98B]' : 'text-[#F4F0E5]/70'
                }`}
              />
              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
              {!isCollapsed && item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    item.badgeColor || 'bg-[#D9B98B] text-[#1c2e1d]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Actions: Collapse, View Storefront, Sign Out */}
      <div className="p-3 border-t border-[#2a442c] space-y-1 bg-[#182819]/50">
        <button
          onClick={onViewStorefront}
          title="Open Customer Shopping Website"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-[#F4F0E5]/80 hover:bg-[#253d27] hover:text-white transition-colors ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0 text-[#D9B98B]" />
          {!isCollapsed && <span>View Storefront</span>}
        </button>

        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#F4F0E5]/60 hover:bg-[#253d27] hover:text-white transition-colors ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Menu</span>
            </>
          )}
        </button>

        <button
          onClick={onSignOut}
          title="Sign Out of Owner Portal"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
