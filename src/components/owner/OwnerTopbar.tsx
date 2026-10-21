import React from 'react';
import {
  Menu,
  ExternalLink,
  LogOut,
  ShieldCheck,
  User,
  Store,
} from 'lucide-react';
import { OwnerSection } from '../../types';

interface OwnerTopbarProps {
  currentSection: OwnerSection;
  onOpenMobileMenu: () => void;
  onViewStorefront: () => void;
  onSignOut: () => void;
  ownerName?: string;
  storeName?: string;
}

export const OwnerTopbar: React.FC<OwnerTopbarProps> = ({
  currentSection,
  onOpenMobileMenu,
  onViewStorefront,
  onSignOut,
  ownerName = 'R. Niranjana',
  storeName = 'Lumina Soaps',
}) => {
  const getSectionTitle = (sec: OwnerSection): string => {
    switch (sec) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'orders':
        return 'Orders & Fulfilment';
      case 'products':
        return 'Products & Inventory';
      case 'combos':
        return 'Combo Offers & Bundles';
      case 'revenue':
        return 'Monthly Revenue Reports';
      case 'settings':
        return 'Store & Maker Settings';
      default:
        return 'Owner Portal';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-stone-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 select-none shadow-xs">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-medium">
            <span>{storeName}</span>
            <span>/</span>
            <span className="capitalize text-stone-600 font-semibold">{currentSection}</span>
          </div>
          <h1 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-tight">
            {getSectionTitle(currentSection)}
          </h1>
        </div>
      </div>

      {/* Right: Owner Badge, View Storefront, Sign Out */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Sole Proprietor Identity Tag */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#FAF7EF] border border-[#ded4bf] rounded-xl text-xs text-stone-800">
          <ShieldCheck className="w-4 h-4 text-[#244635]" />
          <div className="text-left leading-tight">
            <span className="font-bold text-stone-900 block">{ownerName}</span>
            <span className="text-[10px] text-stone-500 font-medium uppercase tracking-wider">Sole Proprietor</span>
          </div>
        </div>

        {/* View Storefront Button (Opens in New Tab) */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#244635] bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
          title="Open Live Customer Storefront in New Tab"
        >
          <Store className="w-3.5 h-3.5 text-[#244635]" />
          <span className="hidden md:inline">Live Store</span>
          <ExternalLink className="w-3 h-3 text-stone-400" />
        </a>

        {/* Sign Out Button */}
        <button
          onClick={onSignOut}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
          title="Sign out of Owner Portal"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};
