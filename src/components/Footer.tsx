import React from 'react';
import { ShieldCheck, Truck, Sparkles, Leaf, Heart, Mail } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setCurrentView, storeSettings } = useStore();

  const brandName = storeSettings?.storeName || 'Lumina Soaps';
  const ownerName = storeSettings?.ownerName || 'R. Niranjana';
  const tagline = storeSettings?.brandTagline || 'Nature in Every Lather.';
  const email = storeSettings?.contactEmail || 'niranjana@luminasoaps.com';
  const address = storeSettings?.studioAddress || 'Coimbatore, Tamil Nadu, India';

  return (
    <footer className="bg-[#172a18] text-[#edf4ec] border-t border-[#2a472c] mt-16">
      {/* 4 Brand Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-b border-[#254228]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#264528] text-amber-300 flex items-center justify-center flex-shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Traditional Cold Process</h4>
              <p className="text-[11px] text-[#9ebf9a] mt-0.5">Naturally cured for 6+ weeks on cedar drying racks</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#264528] text-amber-300 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Pure Botanicals</h4>
              <p className="text-[11px] text-[#9ebf9a] mt-0.5">Cold-pressed coconut oil, neem, pure honey & essential oils</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#264528] text-amber-300 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Direct Studio Shipping</h4>
              <p className="text-[11px] text-[#9ebf9a] mt-0.5">Dispatched directly from our studio in {address}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#264528] text-amber-300 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Sole Proprietor Care</h4>
              <p className="text-[11px] text-[#9ebf9a] mt-0.5">Every single bar hand-crafted & packed by {ownerName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        {/* Brand Col */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#faf7ef] p-0.5 border border-[#3e663f] flex items-center justify-center">
              <img src="/logo.svg" alt="Lumina Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-white tracking-wider block">
                {brandName.toUpperCase()}
              </span>
              <span className="text-[10px] text-amber-300 italic block">{tagline}</span>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed text-[11px]">
            A handcrafted artisanal soapery run as an authentic sole proprietorship. We formulate pure, nutrient-dense cold-process bars infused with plant oils, herbal powders, and steam-distilled essential oils.
          </p>
          <div className="pt-2 text-[11px] text-[#a4c5a2] space-y-0.5">
            <div>Sole Proprietor: <strong>{ownerName}</strong></div>
            <div>Direct Contact: <strong>{email}</strong></div>
            <div>Workshop Studio: {address}</div>
          </div>
        </div>

        {/* Quick Collections */}
        <div>
          <h4 className="font-bold text-xs text-amber-300 uppercase tracking-wider mb-3">
            Botanical Collections
          </h4>
          <ul className="space-y-2 text-[#cadfca]">
            <li>Herbal & Botanical Formulations</li>
            <li>Raw Honey & Goat Milk Formula</li>
            <li>Dead Sea Salt & Walnut Shell Scrubs</li>
            <li>Calming Aromatherapy Essential Oil Bars</li>
            <li>Fragrance-Free Castile for Sensitive Skin</li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="font-bold text-xs text-amber-300 uppercase tracking-wider mb-3">
            Customer Care & Orders
          </h4>
          <ul className="space-y-2 text-[#cadfca]">
            <li>
              <button onClick={() => setCurrentView('orders')} className="hover:underline cursor-pointer">
                Track My Order
              </button>
            </li>
            <li>Small-Batch Cold Process Guarantee</li>
            <li>Skin Type & Allergy Guide</li>
            <li>Plastic-Free Biodegradable Packaging</li>
            <li>Pan-India Courier & Speed Post (₹ INR)</li>
          </ul>
        </div>

        {/* Sole Proprietor Portal Switch */}
        <div className="bg-[#203721] p-4 rounded-xl border border-[#2d4d2e] space-y-2.5">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Owner Portal</span>
          </div>
          <p className="text-[11px] text-[#b0ceaf] leading-relaxed">
            Manage product catalogue, incoming customer orders, combo offers, and monthly revenue.
          </p>
          <button
            onClick={() => setCurrentView('owner')}
            className="w-full py-2 px-3 bg-amber-400 hover:bg-amber-300 text-[#172b17] font-bold rounded-lg text-xs transition-colors shadow-xs cursor-pointer"
          >
            Access Owner Portal
          </button>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[#101e11] py-4 text-center text-[11px] text-[#7d9c7b] border-t border-[#1e3420]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} {brandName}. Sole Proprietorship • Owned & Operated by {ownerName}.
          </span>
          <span className="flex items-center gap-1 text-[11px]">
            Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for pure botanical wellness
          </span>
        </div>
      </div>
    </footer>
  );
};
