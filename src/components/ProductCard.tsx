import React from 'react';
import { motion } from 'motion/react';
import { Star, Heart, ShoppingCart, Sparkles, Check, Clock } from 'lucide-react';
import { SoapProduct, formatPriceINR } from '../types';
import { useStore } from '../context/StoreContext';

export const ProductCard: React.FC<{ product: SoapProduct; isListView?: boolean }> = ({
  product,
  isListView = false,
}) => {
  const { setSelectedProduct, addToCart, wishlist, toggleWishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  if (isListView) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl border border-[#e4ded2] shadow-xs hover:shadow-md p-4 flex flex-col sm:flex-row items-center gap-4 transition-all"
      >
        <div
          className="relative w-full sm:w-36 h-36 rounded-lg overflow-hidden bg-[#faf8f4] flex-shrink-0 cursor-pointer"
          onClick={() => setSelectedProduct(product)}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {product.isNewRelease && (
            <span className="absolute top-2 left-2 bg-amber-500 text-[#182a17] text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
              ✨ NEW
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-[#5e775d] font-semibold mb-1">
            <span>{product.category}</span>
            <span>•</span>
            <span>{product.weight}</span>
          </div>

          <h3
            onClick={() => setSelectedProduct(product)}
            className="font-bold text-base text-[#1c2e1b] hover:text-[#385e35] cursor-pointer"
          >
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 italic">{product.scentProfile}</p>

          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-700">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({product.reviewCount} reviews)</span>
          </div>

          <p className="text-xs text-gray-600 mt-2 line-clamp-2">{product.tagline || product.description}</p>
        </div>

        <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
          <div>
            <span className="text-xl font-black text-[#192f18]">₹{product.price}</span>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 block mt-0.5">
              Free Delivery ₹799+
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isWishlisted ? 'bg-rose-50 text-rose-600 border-rose-200' : 'text-gray-400 hover:text-rose-500 border-gray-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={() => addToCart(product, 1)}
              disabled={product.stock <= 0}
              className="px-4 py-2 bg-[#8b5a2b] hover:bg-[#6f451f] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Basket</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={product.isNewRelease ? { y: -6 } : { y: -3 }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-white rounded-xl border transition-all duration-300 flex flex-col overflow-hidden ${
        product.isNewRelease
          ? 'border-amber-300/80 shadow-md hover:shadow-xl ring-1 ring-amber-200/50'
          : 'border-[#e4ded2] shadow-sm hover:shadow-md'
      }`}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square overflow-hidden bg-[#fbf9f4] cursor-pointer" onClick={() => setSelectedProduct(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Floating / Levitation badge for New Releases */}
        {product.isNewRelease && (
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
            className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 bg-amber-500/95 backdrop-blur-sm text-[#182a17] text-[10px] font-black tracking-wider uppercase px-2 py-1 rounded-full shadow-md border border-amber-300"
          >
            <Sparkles className="w-3 h-3 fill-[#182a17]" />
            <span>New Release</span>
          </motion.div>
        )}

        {/* Regular Badge */}
        {!product.isNewRelease && product.badge && (
          <span className="absolute top-2.5 left-2.5 z-10 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow-sm bg-[#2e4c2c] text-white">
            {product.badge}
          </span>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label="Save to Wishlist"
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-md scale-110'
              : 'bg-white/80 backdrop-blur-sm text-gray-500 hover:text-rose-500 hover:bg-white shadow'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Batch Number tag on bottom of photo */}
        <div className="absolute bottom-2 left-2 z-10 bg-black/55 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 text-amber-300" />
          <span>{product.batchNumber}</span>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Scent & Category */}
          <div className="flex items-center justify-between gap-1 text-[11px] text-[#5e775d] font-semibold mb-1">
            <span className="truncate">{product.category}</span>
            <span className="text-gray-400">•</span>
            <span className="truncate">{product.weight}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className="font-bold text-sm sm:text-base text-[#1c2e1b] hover:text-[#385e35] cursor-pointer line-clamp-2 leading-snug transition-colors"
          >
            {product.name}
          </h3>

          {/* Scent Profile Tagline */}
          <p className="text-xs text-gray-500 mt-1 italic line-clamp-1">
            {product.scentProfile}
          </p>

          {/* Star Rating Breakdown (Amazon style) */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-[#1f301e]">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>

          {/* Skin Type tags */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {product.skinTypes.slice(0, 2).map((st) => (
              <span
                key={st}
                className="text-[10px] bg-[#f2f0e8] text-[#3e563b] font-medium px-2 py-0.5 rounded-full"
              >
                {st}
              </span>
            ))}
            {product.skinTypes.length > 2 && (
              <span className="text-[10px] text-gray-400 self-center">
                +{product.skinTypes.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Pricing, Free delivery perk & Add to Basket Button */}
        <div className="mt-4 pt-3 border-t border-[#f0ece2]">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-[#192f18]">
              {formatPriceINR(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPriceINR(product.originalPrice)}
              </span>
            )}
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 ml-auto">
              Free ship on ₹799+
            </span>
          </div>

          {/* Stock urgency alert */}
          <div className="mt-1 text-[11px]">
            {product.stock <= 5 ? (
              <span className="text-rose-600 font-bold">
                ⚠️ Only {product.stock} left in this cured batch!
              </span>
            ) : product.stock <= 10 ? (
              <span className="text-amber-700 font-medium">
                Only {product.stock} bars remaining
              </span>
            ) : (
              <span className="text-[#3c6139] flex items-center gap-1 font-medium">
                <Check className="w-3 h-3 text-emerald-600" /> In stock • Ready to pack
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => setSelectedProduct(product)}
              className="py-2 px-3 border border-[#375a36] text-[#375a36] hover:bg-[#f3f7f2] rounded-lg text-xs font-bold transition-colors"
            >
              Details
            </button>
            <button
              id={`add-to-cart-${product.id}`}
              onClick={() => addToCart(product, 1)}
              disabled={product.stock <= 0}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                product.stock <= 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#c8923a] hover:bg-[#b5802c] active:scale-95 text-[#182b17]'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Basket'}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
