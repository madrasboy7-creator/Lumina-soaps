import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ShoppingCart, ChevronRight, Eye, Flame } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SoapProduct, formatPriceINR } from '../types';

export const FloatingNewReleases: React.FC = () => {
  const { products, setSelectedProduct, addToCart } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const newReleases = products.filter((p) => p.isNewRelease);

  if (newReleases.length === 0) return null;

  const currentProduct: SoapProduct = newReleases[activeIndex] || newReleases[0];

  return (
    <div className="fixed bottom-6 right-6 z-30 pointer-events-none">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* Floating Orb / Floating Pill Badge with floating bobbing animation */
          <motion.div
            key="collapsed-pill"
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{
              opacity: 1,
              y: [0, -12, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              y: {
                repeat: Infinity,
                duration: 3.2,
                ease: 'easeInOut',
              },
              scale: {
                repeat: Infinity,
                duration: 3.2,
                ease: 'easeInOut',
              },
              opacity: { duration: 0.4 },
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="pointer-events-auto"
          >
            <button
              id="floating-new-releases-trigger"
              onClick={() => setIsExpanded(true)}
              className="group relative flex items-center gap-3 bg-[#1e341f] text-white pl-2 pr-4 py-2 rounded-full shadow-2xl border-2 border-amber-400/80 hover:bg-[#254227] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              {/* Pulsing ring indicator */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500" />
              </span>

              {/* Mini thumbnail with rotation */}
              <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-300 shadow-inner flex-shrink-0 relative">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>New Release Alert</span>
                </div>
                <span className="text-xs font-semibold text-white truncate max-w-[140px]">
                  {currentProduct.name}
                </span>
              </div>

              <span className="text-xs font-bold text-amber-300 bg-black/20 px-2 py-0.5 rounded-full">
                {formatPriceINR(currentProduct.price)}
              </span>

              <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        ) : (
          /* Expanded Floating Showcase Modal Card */
          <motion.div
            key="expanded-card"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: [0, -6, 0],
              scale: 1,
            }}
            transition={{
              y: {
                repeat: Infinity,
                duration: 4,
                ease: 'easeInOut',
              },
              opacity: { duration: 0.3 },
            }}
            exit={{ opacity: 0, y: 30, scale: 0.85 }}
            className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-[#395c37] p-4 w-80 sm:w-96 text-[#223522] overflow-hidden relative"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2d4d2b] uppercase tracking-wider">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>New Release Batch Showcase</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                aria-label="Close Showcase"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Product Card */}
            <div className="mt-3 flex gap-3.5 items-center">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-amber-200 shadow-md flex-shrink-0 group">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-1 left-1 bg-amber-500 text-[#1a2d1b] text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">
                  NEW
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono text-[#5f7a5d] font-semibold">
                  {currentProduct.batchNumber}
                </div>
                <h4 className="text-sm font-bold text-[#1a2d19] leading-tight line-clamp-2">
                  {currentProduct.name}
                </h4>
                <p className="text-xs text-gray-500 italic mt-0.5 line-clamp-1">
                  {currentProduct.scentProfile}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-base font-bold text-[#1b341c]">
                    {formatPriceINR(currentProduct.price)}
                  </span>
                  {currentProduct.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPriceINR(currentProduct.originalPrice)}
                    </span>
                  )}
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                    {currentProduct.stock} bars in stock
                  </span>
                </div>
              </div>
            </div>

            {/* Cure details note */}
            <div className="mt-3 bg-[#faf7ef] rounded-lg p-2 text-[11px] text-[#4f674e] flex items-center justify-between border border-[#ebd8b7]">
              <span>⏱️ {currentProduct.cureDate}</span>
              <span className="font-semibold">{currentProduct.weight}</span>
            </div>

            {/* Actions */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedProduct(currentProduct);
                  setIsExpanded(false);
                }}
                className="flex-1 py-2 px-3 bg-white border border-[#2d4d2b] text-[#2d4d2b] hover:bg-[#f1f6f0] rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                Quick Details
              </button>
              <button
                onClick={() => {
                  addToCart(currentProduct, 1);
                }}
                className="flex-1 py-2 px-3 bg-[#c8923a] hover:bg-[#b5802c] text-[#1a2e1b] rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to Basket
              </button>
            </div>

            {/* Pagination between new releases */}
            {newReleases.length > 1 && (
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>
                  Release {activeIndex + 1} of {newReleases.length}
                </span>
                <div className="flex items-center gap-1">
                  {newReleases.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        idx === activeIndex ? 'w-5 bg-amber-500' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`View release ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
