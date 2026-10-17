"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Eye, Check, Sparkles } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { PriceFormatter } from "@/components/PriceFormatter";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  original_price?: number | null;
  image_url?: string | null;
  image?: string; // Fallback for backwards compatibility
  images?: string[];
  category: string;
  stock_quantity?: number | null;
  glow_color?: string;
  glowColor?: string;
  priority?: boolean;
}

export function ProductCard({
  id,
  name,
  price,
  original_price,
  image,
  image_url,
  images = [],
  category,
  stock_quantity,
  glow_color,
  glowColor,
  priority = false,
}: ProductCardProps) {
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mainImage = image_url || image || (images && images[0]) || "/images/watch.png";
  const hoverImage = (images && images.length > 1) ? images[1] : null;
  const activeGlow = glow_color || glowColor || "rgba(212, 175, 55, 0.18)";

  const isOutOfStock = stock_quantity !== undefined && stock_quantity !== null && stock_quantity <= 0;

  // Instant prefetch on hover or touch before user clicks (Shopify speed secret)
  const handlePrefetch = () => {
    router.prefetch(`/product/${id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    const { addItem } = useCartStore.getState();
    addItem({
      id,
      name,
      price,
      quantity: 1,
      image_url: mainImage,
      category,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1600);
  };

  // Calculate discount percentage if original_price exists
  const discountPercent = original_price && original_price > price
    ? Math.round(((original_price - price) / original_price) * 100)
    : null;

  return (
    <div
      className={`group relative flex flex-col bg-[#0D0D0F]/90 border ${isOutOfStock ? 'border-red-900/40 hover:border-red-600/60' : 'border-white/10 hover:border-[#D4AF37]/50'} rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_12px_35px_rgba(212,175,55,0.18)] hover:-translate-y-1.5 transition-all duration-300 h-full`}
      onMouseEnter={() => {
        setIsHovered(true);
        handlePrefetch();
      }}
      onTouchStart={handlePrefetch}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic Gold Ambient Glow Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />

      {/* Image Container with clickable link */}
      <Link 
        href={`/product/${id}`} 
        prefetch={true}
        className="relative aspect-square p-3.5 sm:p-6 overflow-hidden bg-gradient-to-b from-white/[0.03] to-transparent flex items-center justify-center cursor-pointer block"
      >
        {/* Radial Ambient Backdrop Glow */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none hidden sm:block" 
          style={{
            background: `radial-gradient(circle at center, ${activeGlow} 0%, transparent 75%)`
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10 flex flex-col gap-1 sm:gap-1.5 items-start">
          <div className="flex items-center gap-1 bg-[#050506]/80 border border-[#D4AF37]/40 text-[#D4AF37] text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-wider shadow-md">
            <Sparkles className="w-2.5 h-2.5" />
            <span>{category}</span>
          </div>

          {isOutOfStock ? (
            <span className="bg-red-950/95 text-red-400 border border-red-500/60 text-[9px] sm:text-[10px] font-mono font-extrabold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md uppercase tracking-widest shadow-lg">
              OUT OF STOCK
            </span>
          ) : (
            discountPercent && (
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] sm:text-[10px] font-mono font-extrabold px-1.5 py-0.5 sm:px-2 rounded-md uppercase tracking-wider">
                -{discountPercent}% OFF
              </span>
            )
          )}
        </div>

        {/* Top Right Quick Action Buttons */}
        <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <span
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/70 border border-white/20 hover:border-[#D4AF37] text-white/80 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"
            title="View Details"
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </span>
        </div>

        {/* Product Image */}
        <div className={`relative w-full h-full transform group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300 ease-out ${isOutOfStock ? 'opacity-70 filter grayscale-[25%]' : ''}`}>
          <Image
            src={isHovered && hoverImage ? hoverImage : mainImage}
            alt={name}
            fill
            className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] transition-all duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={65}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />
        </div>
      </Link>

      {/* Product Details Section */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between border-t border-white/5 bg-[#08080A]">
        <div className="space-y-1 sm:space-y-2">
          {/* Product Title */}
          <Link href={`/product/${id}`} prefetch={true} className="block group/title">
            <h3 className="text-white font-extrabold text-xs sm:text-sm md:text-base tracking-wide line-clamp-1 group-hover/title:text-[#D4AF37] transition-colors duration-300">
              {name}
            </h3>
          </Link>

          {/* Pricing Row */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[#D4AF37] font-extrabold text-sm sm:text-base md:text-lg tracking-tight">
              <PriceFormatter value={price} />
            </span>
            {original_price && original_price > price && (
              <span className="text-white/40 text-[10px] sm:text-xs line-through font-mono">
                <PriceFormatter value={original_price} />
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-1.5 sm:gap-2 pt-1 sm:pt-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`py-2 sm:py-2.5 px-1.5 sm:px-3 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-1 sm:gap-1.5 shadow-lg ${
              isOutOfStock
                ? "bg-zinc-800/90 text-zinc-400 border border-zinc-700/60 cursor-not-allowed shadow-none"
                : isAdded
                ? "bg-emerald-500 text-black border border-emerald-400 shadow-emerald-500/30 scale-95"
                : "bg-gradient-to-r from-[#D4AF37] via-[#F5D67B] to-[#D4AF37] text-black hover:shadow-[0_4px_20px_rgba(212,175,55,0.4)] active:scale-95"
            }`}
          >
            {isOutOfStock ? (
              <span>OUT OF STOCK</span>
            ) : isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                <span>ADDED</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                <span>ADD TO CART</span>
              </>
            )}
          </button>

          <Link href={`/product/${id}`} prefetch={true} className="w-full">
            <button
              type="button"
              className="w-full py-2 sm:py-2.5 px-1.5 sm:px-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-white/15 hover:border-[#D4AF37] text-white/90 hover:text-white bg-white/5 hover:bg-[#D4AF37]/10 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center"
            >
              DETAILS
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

