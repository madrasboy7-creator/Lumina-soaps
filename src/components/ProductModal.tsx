import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Star,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  Leaf,
  Clock,
  Sparkles,
  Plus,
  Minus,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductReview, formatPriceINR } from '../types';

export const ProductModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    wishlist,
    toggleWishlist,
    initiateCheckout,
    currentUser,
    setProducts,
    showNotification,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Add review form state
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  if (!selectedProduct) return null;

  const isWishlisted = wishlist.includes(selectedProduct.id);
  const galleryImages = selectedProduct.gallery && selectedProduct.gallery.length > 0
    ? selectedProduct.gallery
    : [selectedProduct.image];

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewTitle.trim() || !newReviewComment.trim()) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      userName: currentUser ? currentUser.name : 'Soap Enthusiast',
      rating: newReviewRating,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: newReviewTitle,
      comment: newReviewComment,
      verifiedPurchase: Boolean(currentUser),
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === selectedProduct.id) {
          const updatedReviews = [newRev, ...p.reviews];
          const newAvg = Number(
            (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
          );
          return {
            ...p,
            reviews: updatedReviews,
            rating: newAvg,
            reviewCount: updatedReviews.length,
          };
        }
        return p;
      })
    );

    setSelectedProduct({
      ...selectedProduct,
      reviews: [newRev, ...selectedProduct.reviews],
      reviewCount: selectedProduct.reviewCount + 1,
    });

    setNewReviewTitle('');
    setNewReviewComment('');
    setShowAddReview(false);
    showNotification('Thank you! Your verified review has been posted.', 'success');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#e5dfd3] max-h-[92vh] flex flex-col my-auto"
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedProduct(null)}
            className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-md flex items-center justify-center transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Modal Content */}
          <div className="overflow-y-auto p-4 sm:p-8 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column: Gallery & Curing Tag */}
              <div className="flex flex-col gap-3">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#faf7ef] border border-[#ebd8b7]">
                  <img
                    src={galleryImages[activeImageIndex] || selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {selectedProduct.isNewRelease && (
                    <div className="absolute top-3 left-3 bg-amber-500 text-[#192b17] text-xs font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 fill-[#192b17]" />
                      <span>New Artisan Release</span>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {galleryImages.length > 1 && (
                  <div className="flex gap-2">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === activeImageIndex ? 'border-[#2d4d2b] scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Cold process credentials */}
                <div className="mt-2 bg-[#f8f6f0] p-4 rounded-xl border border-[#e4ded0] space-y-2 text-xs text-[#30452f]">
                  <div className="flex items-center gap-2 font-bold text-[#1f371e]">
                    <Leaf className="w-4 h-4 text-[#396437]" />
                    <span>Traditional Cold-Process Method</span>
                  </div>
                  <p className="leading-relaxed text-gray-700">
                    {selectedProduct.coldProcessDescription}
                  </p>
                  <div className="pt-2 border-t border-[#ded6c5] flex justify-between font-mono text-[11px] text-gray-600">
                    <span>Batch ID: {selectedProduct.batchNumber}</span>
                    <span>Weight: {selectedProduct.weight}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Information & Purchase */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#4f6f4d] font-semibold">
                    <span>{selectedProduct.category}</span>
                    <span className="bg-[#e4ece2] px-2 py-0.5 rounded text-[#2c4e2a] font-mono">
                      {selectedProduct.cureDate}
                    </span>
                  </div>

                  <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1a2d19] mt-1 leading-tight">
                    {selectedProduct.name}
                  </h2>

                  <p className="text-sm text-gray-600 italic mt-1">
                    {selectedProduct.tagline}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(selectedProduct.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-sm text-gray-800">{selectedProduct.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">({selectedProduct.reviewCount} customer reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 mt-4">
                    <span className="text-3xl font-black text-[#1c351b]">
                      {formatPriceINR(selectedProduct.price)}
                    </span>
                    {selectedProduct.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPriceINR(selectedProduct.originalPrice)}
                      </span>
                    )}
                    <span className="text-xs text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded">
                      In Stock ({selectedProduct.stock} bars)
                    </span>
                  </div>

                  {/* Scent & Skin Suitability */}
                  <div className="mt-4 space-y-2">
                    <div>
                      <span className="text-xs font-bold text-gray-700">Aroma Profile: </span>
                      <span className="text-xs text-gray-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                        {selectedProduct.scentProfile}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-gray-700">Best For: </span>
                      {selectedProduct.skinTypes.map((st) => (
                        <span key={st} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <div className="mt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Artisan Benefits
                    </h4>
                    <ul className="space-y-1 text-xs text-gray-700">
                      {selectedProduct.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* All Pure Ingredients List */}
                  <div className="mt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Full Botanical Ingredients
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed bg-[#faf8f4] p-2.5 rounded-lg border border-[#eee9dc]">
                      {selectedProduct.ingredients.join(' • ')}
                    </p>
                  </div>
                </div>

                {/* Purchase Area */}
                <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-3">
                    {/* Quantity Picker */}
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 font-bold text-sm">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(selectedProduct.stock, q + 1))}
                        className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Add to Basket */}
                    <button
                      onClick={() => {
                        addToCart(selectedProduct, quantity);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 py-2.5 px-4 bg-[#c8923a] hover:bg-[#b5802c] text-[#1a2d18] font-bold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-98"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add {quantity} to Basket</span>
                    </button>

                    {/* Wishlist */}
                    <button
                      onClick={() => toggleWishlist(selectedProduct.id)}
                      className={`p-2.5 rounded-lg border transition-colors ${
                        isWishlisted
                          ? 'border-rose-300 bg-rose-50 text-rose-600'
                          : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                      }`}
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Fast Buy Now Button (Account Enforced) */}
                  <button
                    onClick={() => {
                      addToCart(selectedProduct, quantity);
                      setSelectedProduct(null);
                      initiateCheckout();
                    }}
                    className="w-full py-2.5 bg-[#2d4d2b] hover:bg-[#233d22] text-white font-bold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Instant Checkout & Place Order Request</span>
                  </button>

                  <div className="flex items-center justify-around text-[11px] text-gray-500 pt-2">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#3a6038]" /> Fast Safe Packaging
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#3a6038]" /> Sole Proprietor Guarantee
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1b2f1c]">Customer Reviews</h3>
                  <p className="text-xs text-gray-500">Verified artisan feedback from handmade soap lovers</p>
                </div>
                <button
                  onClick={() => setShowAddReview(!showAddReview)}
                  className="text-xs bg-[#f4f7f3] hover:bg-[#e6efe4] text-[#2c4e2a] font-bold px-3 py-1.5 rounded-lg border border-[#cfdfcd] transition-colors"
                >
                  {showAddReview ? 'Cancel Review' : '+ Write a Review'}
                </button>
              </div>

              {/* Add Review Form */}
              {showAddReview && (
                <form onSubmit={handleAddReview} className="mb-6 p-4 bg-[#faf8f3] rounded-xl border border-[#ebd8b7] space-y-3">
                  <h4 className="font-bold text-sm text-[#1f371e]">Write your review for {selectedProduct.name}</h4>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 text-amber-500 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Review Headline</label>
                    <input
                      type="text"
                      required
                      value={newReviewTitle}
                      onChange={(e) => setNewReviewTitle(e.target.value)}
                      placeholder="e.g., Incredible scent and moisturizing lather!"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#2d4d2b]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Your Detailed Experience</label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="How does it feel on your skin? How is the scent and hardness?"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#2d4d2b]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2 px-4 bg-[#2d4d2b] text-white rounded-lg text-xs font-bold hover:bg-[#20361f]"
                  >
                    Submit Verified Review
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {selectedProduct.reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#395d38] text-white flex items-center justify-center font-bold text-[10px]">
                          {rev.userName[0]}
                        </div>
                        <span className="font-bold text-gray-900">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-gray-400 text-[11px]">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 mt-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>

                    <p className="font-bold text-gray-800 mt-1">{rev.title}</p>
                    <p className="text-gray-600 mt-1 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
