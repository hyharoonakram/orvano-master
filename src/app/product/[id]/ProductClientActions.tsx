"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, AlertTriangle, Check, Banknote, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store/cartStore";
import { useCurrencyStore } from "@/store/currencyStore";
import type { Product } from "@/utils/supabase/queries";

export function ProductClientActions({ product }: { product: Product }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [bundleIndex, setBundleIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((state: any) => state.addItem);
  const formatPrice = useCurrencyStore((state: any) => state.formatPrice);

  const isOutOfStock = product.stock_quantity !== undefined && product.stock_quantity !== null && product.stock_quantity <= 0;

  const bundles = [
    { label: "Buy 1", discount: 0, tag: "Standard Price" },
    { label: "Buy 2", discount: 0.1, tag: "10% OFF" }
  ];

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const qty = bundleIndex === 1 ? 2 : quantity;
    const price = bundleIndex === 1 ? product.price * 0.9 : product.price;

    const { addItem } = useCartStore.getState();

    addItem({
      id: product.id,
      name: product.name,
      price: price,
      quantity: qty,
      image_url: product.image_url || "/images/watch.png",
      category: product.category
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1600);
  };

  const handleBuyWithCOD = () => {
    if (isOutOfStock) return;

    const qty = bundleIndex === 1 ? 2 : quantity;
    const price = bundleIndex === 1 ? product.price * 0.9 : product.price;

    const { addItem } = useCartStore.getState();

    addItem({
      id: product.id,
      name: product.name,
      price: price,
      quantity: qty,
      image_url: product.image_url || "/images/watch.png",
      category: product.category
    });

    router.push("/checkout");
  };

  return (
    <>
      {/* Stock Status Badge */}
      {isOutOfStock ? (
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/90 border border-red-500/60 text-red-400 text-xs font-extrabold uppercase tracking-widest shadow-lg animate-pulse">
          <AlertTriangle className="w-4 h-4" />
          <span>OUT OF STOCK</span>
        </div>
      ) : product.stock_quantity && product.stock_quantity <= 5 ? (
        <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <span>Only {product.stock_quantity} Left In Stock</span>
        </div>
      ) : null}

      {/* Quantity Bundles */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="h-px bg-foreground/10 flex-1"></div>
          <span className="px-4 text-foreground/50 text-xs uppercase tracking-widest font-bold">Quantity Bundles</span>
          <div className="h-px bg-foreground/10 flex-1"></div>
        </div>

        <div className="space-y-4">
          {bundles.map((bundle, idx) => (
            <label 
              key={idx}
              className={`flex items-center justify-between border-2 p-4 rounded-sm transition-colors ${
                isOutOfStock
                  ? 'opacity-50 cursor-not-allowed border-foreground/10 bg-surface'
                  : bundleIndex === idx 
                  ? 'border-[#D4AF37] bg-[#D4AF37]/5 cursor-pointer' 
                  : 'border-foreground/10 bg-surface hover:border-foreground/30 cursor-pointer'
              }`}
            >
              <div className="flex items-center">
                <input 
                  type="radio" 
                  name="bundle" 
                  disabled={isOutOfStock}
                  checked={bundleIndex === idx}
                  onChange={() => {
                    if (isOutOfStock) return;
                    setBundleIndex(idx);
                    if (idx === 1) setQuantity(2);
                    else setQuantity(1);
                  }}
                  className="accent-[#D4AF37] w-4 h-4 mr-4" 
                />
                <div>
                  <span className="text-foreground font-medium tracking-wide mr-3">{bundle.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-widest font-bold ${
                    bundle.discount > 0 ? 'bg-[#D4AF37] text-black' : 'bg-foreground/10 text-foreground/60'
                  }`}>
                    {bundle.tag}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className={`${bundleIndex === idx ? 'text-[#D4AF37]' : 'text-foreground'} font-bold`}>
                  {formatPrice(product.price * (idx + 1) * (1 - bundle.discount))}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Quantity Selector */}
        <div className={`flex items-center border border-foreground/20 bg-background h-14 w-full sm:w-1/3 rounded-xl overflow-hidden ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
          <button 
            disabled={isOutOfStock}
            onClick={() => {
              if (quantity > 1) {
                setQuantity(q => q - 1);
                setBundleIndex(0);
              }
            }}
            className="flex-1 h-full text-foreground/60 hover:text-[#D4AF37] transition-colors flex items-center justify-center text-lg font-bold"
          >
            -
          </button>
          <span className="px-4 text-foreground font-bold text-base">{quantity}</span>
          <button 
            disabled={isOutOfStock}
            onClick={() => {
              setQuantity(q => q + 1);
              if (quantity + 1 >= 2) setBundleIndex(1);
            }}
            className="flex-1 h-full text-foreground/60 hover:text-[#D4AF37] transition-colors flex items-center justify-center text-lg font-bold"
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <Button 
          size="lg" 
          disabled={isOutOfStock}
          className={`h-14 w-full sm:flex-1 py-4 text-sm md:text-base font-extrabold uppercase tracking-widest rounded-xl flex items-center justify-center transition-all ${
            isOutOfStock
              ? "bg-zinc-800 text-zinc-500 border border-zinc-700/60 cursor-not-allowed shadow-none"
              : isAdded
              ? "bg-emerald-500 text-black border border-emerald-400 shadow-emerald-500/30"
              : "bg-gradient-to-r from-[#D4AF37] via-[#F5D67B] to-[#AA771C] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transform hover:scale-[1.01]"
          }`} 
          onClick={handleAddToCart}
        >
          {isOutOfStock ? (
            <span>OUT OF STOCK</span>
          ) : isAdded ? (
            <>
              <Check className="w-5 h-5 mr-2 stroke-[3]" />
              <span>ADDED TO CART</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 mr-2 stroke-[2.5]" />
              <span>Add to Cart</span>
            </>
          )}
        </Button>
      </div>

      {/* Buy with Cash on Delivery Button */}
      <button
        type="button"
        disabled={isOutOfStock}
        onClick={handleBuyWithCOD}
        className={`w-full py-4 px-6 mb-8 text-xs md:text-sm font-extrabold uppercase tracking-widest rounded-xl border transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg ${
          isOutOfStock
            ? "bg-zinc-800 text-zinc-500 border-zinc-700/60 cursor-not-allowed shadow-none"
            : "bg-surface hover:bg-[#D4AF37]/10 border-foreground/20 hover:border-[#D4AF37] text-foreground hover:text-[#D4AF37] shadow-md active:scale-95"
        }`}
      >
        <Banknote className="w-5 h-5 text-[#D4AF37]" />
        <span>{isOutOfStock ? "OUT OF STOCK" : "BUY WITH CASH ON DELIVERY"}</span>
      </button>

      {/* Upgraded Sticky Bottom Bar for Mobile Phones (Ref 2nd Image) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0C]/95 backdrop-blur-xl border-t border-[#D4AF37]/40 px-3 py-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.9)] flex items-center justify-between gap-2.5 animate-in slide-in-from-bottom duration-300">
        {/* Left: Thumbnail & Price Info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-zinc-900 border border-white/10 shrink-0">
            <Image
              src={product.image_url || "/images/watch.png"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate max-w-[130px] sm:max-w-[180px]">
              {product.name}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[#D4AF37] text-xs font-extrabold tracking-wide">
                {formatPrice(bundleIndex === 1 ? product.price * 2 * 0.9 : product.price * quantity)}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                COD
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                2-4 Days
              </span>
            </div>
          </div>
        </div>

        {/* Right: Buy Now / Cash on Delivery Button */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleBuyWithCOD}
          className={`py-2 px-3.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center shrink-0 shadow-lg active:scale-95 transition-all ${
            isOutOfStock
              ? "bg-zinc-800 text-zinc-500 border border-zinc-700/60 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-[#F5D67B] via-[#D4AF37] to-[#AA771C] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          }`}
        >
          <div className="flex flex-col items-center leading-tight">
            <span className="flex items-center gap-1 font-black text-[11px] sm:text-xs text-black">
              <Zap className="w-3.5 h-3.5 fill-black text-black" /> BUY NOW
            </span>
            <span className="text-[8px] font-bold text-black/80 tracking-tight">
              Cash on Delivery
            </span>
          </div>
        </button>
      </div>
    </>
  );
}
