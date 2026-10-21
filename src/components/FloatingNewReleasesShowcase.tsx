import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShoppingCart, Eye, Star, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPriceINR, SoapProduct } from '../types';

export const FloatingNewReleasesShowcase: React.FC = () => {
  const { products, setSelectedProduct, addToCart, setFilters } = useStore();

  const newReleases = products.filter((p) => p.isNewRelease);

  if (newReleases.length === 0) return null;

  return (
    <div className="bg-gradient-to-b from-[#1b311c] via-[#233d24] to-[#1a2e1b] text-[#f7f5ec] py-8 sm:py-10 px-4 sm:px-6 relative overflow-hidden border-b border-[#355333] shadow-inner">
      {/* Botanical ambient floating particles */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
          className="absolute -top-10 left-1/4 w-72 h-72 rounded-full bg-amber-400 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
          className="absolute -bottom-10 right-1/4 w-80 h-80 rounded-full bg-emerald-500 blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with badge */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>LUMINA ARTISAN LAB • NEWLY UNCURED & READY</span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-white">
              Newly Released Soap Formulations
            </h2>
            <p className="text-xs sm:text-sm text-[#b8d6b5] mt-1 max-w-xl">
              Freshly released from our cedar curing racks by Sole Proprietor Thiru Kailash. Hover over any bar to inspect ingredients, batch stamp, and botanical saponification.
            </p>
          </div>

          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, newReleasesOnly: true }));
              window.scrollTo({ top: 450, behavior: 'smooth' });
            }}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all cursor-pointer"
          >
            <span>Filter All {newReleases.length} New Releases</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Floating cards grid with staggered floating bobbing animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {newReleases.slice(0, 4).map((product: SoapProduct, index: number) => {
            // Stagger animation timing and offsets for natural floating organic motion
            const floatDuration = 3.8 + (index % 3) * 0.7;
            const floatOffset = index % 2 === 0 ? -10 : 10;

            return (
              <motion.div
                key={product.id}
                animate={{
                  y: [0, floatOffset, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: floatDuration,
                  ease: 'easeInOut',
                }}
                whileHover={{
                  y: -14,
                  scale: 1.02,
                  transition: { duration: 0.25 },
                }}
                className="group relative bg-[#faf8f3] text-[#20331f] rounded-2xl p-4 shadow-xl border border-amber-400/30 flex flex-col justify-between transition-shadow hover:shadow-2xl"
              >
                {/* Floating indicator badge */}
                <div className="absolute -top-2.5 left-4 z-20">
                  <span className="bg-[#c8923a] text-[#1a2d1a] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-amber-300">
                    <Sparkles className="w-3 h-3 text-white" />
                    New Batch Release
                  </span>
                </div>

                <div>
                  {/* Soap image with zoom container */}
                  <div
                    onClick={() => setSelectedProduct(product)}
                    className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-100 cursor-pointer mb-3 group/img"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-108"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-2.5">
                      <span className="text-[11px] text-white font-bold flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Quick View Recipe
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      {product.batchNumber}
                    </div>
                  </div>

                  {/* Scent & Category */}
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                    <span className="font-semibold text-[#2f552c]">{product.category}</span>
                    <div className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-gray-400 font-normal">({product.reviewCount})</span>
                    </div>
                  </div>

                  {/* Product Title */}
                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className="font-serif font-bold text-base text-[#193218] hover:text-[#2d5729] cursor-pointer line-clamp-1 leading-snug"
                  >
                    {product.name}
                  </h3>

                  {/* Tagline */}
                  <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed">
                    {product.tagline}
                  </p>

                  {/* Botanical curing tag */}
                  <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-gray-500 font-mono bg-white p-1.5 rounded-lg border border-gray-200">
                    <Clock className="w-3 h-3 text-[#2f552c]" />
                    <span className="truncate">{product.cureDate}</span>
                  </div>
                </div>

                {/* Price & Add to Cart button */}
                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="text-base font-black text-[#1b341c]">
                      {formatPriceINR(product.price)}
                    </div>
                    {product.originalPrice && (
                      <div className="text-[11px] text-gray-400 line-through">
                        {formatPriceINR(product.originalPrice)}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(product, 1)}
                    className="py-2 px-3.5 bg-[#2d4d2b] hover:bg-[#1f371d] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
