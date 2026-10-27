"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Sparkles, Tag, Compass, Clock, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useCurrencyStore } from "@/store/currencyStore";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const formatPrice = useCurrencyStore((state) => state.formatPrice);

  // Fetch products on open if not already loaded
  useEffect(() => {
    if (isOpen) {
      if (products.length === 0) {
        setLoading(true);
        const supabase = createClient();
        supabase
          .from("products")
          .select("id, name, category, price, original_price, image_url, stock_quantity")
          .order("created_at", { ascending: false })
          .then(({ data }) => {
            if (data) setProducts(data);
            setLoading(false);
          });
      }
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, products.length]);

  // Keyboard shortcut: ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter products based on query
  const q = query.trim().toLowerCase();
  const filteredProducts = q
    ? products.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();
        return name.includes(q) || cat.includes(q);
      })
    : [];

  const handleSelectProduct = (id: string) => {
    onClose();
    router.push(`/product/${id}`);
  };

  const handleSelectCategory = (cat: string) => {
    onClose();
    router.push(`/shop?category=${encodeURIComponent(cat)}`);
  };

  const quickCategories = [
    { label: "Top", value: "TOP" },
    { label: "Bottom (Baggy)", value: "BOTTOM" },
    { label: "Watches", value: "WATCHES" },
    { label: "Shoes", value: "SHOES" },
    { label: "Men's Baggy", value: "Men's Baggy" },
    { label: "Women's Baggy", value: "Women's Baggy" },
    { label: "Men's Watches", value: "Men's Watches" },
    { label: "Women's Watches", value: "Women's Watches" },
    { label: "All Products", value: "All" },
  ];

  const popularSearches = [
    "Rolex Datejust",
    "Chronograph",
    "Wide-Leg Jeans",
    "Dark Indigo Baggy",
    "Emerald Crystal",
    "Hublot Tourbillon"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6">
          {/* Frosted Apple Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-2xl"
          />

          {/* Apple Spotlight Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative w-full max-w-2xl bg-[#141416]/95 backdrop-blur-3xl border border-white/15 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden z-10 flex flex-col max-h-[82vh]"
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center gap-3.5 px-5 sm:px-6 py-4.5 border-b border-white/10 bg-white/[0.02]">
              <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search luxury timepieces, baggy pants..."
                className="flex-1 bg-transparent text-white text-base sm:text-lg font-light placeholder:text-white/40 focus:outline-none"
              />

              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded-full text-white/40 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onClose}
                className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 text-white/50 border border-white/10 text-[10px] font-mono uppercase tracking-wider hover:text-white transition-colors"
              >
                ESC
              </button>

              <button
                onClick={onClose}
                className="sm:hidden text-white/50 hover:text-white p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Results */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* When no query is typed: Apple Style Suggestions */}
              {!q && (
                <>
                  {/* Quick Categories */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.2em] uppercase text-[#D4AF37]/90 mb-3">
                      <Compass className="w-3.5 h-3.5" />
                      <span>EXPLORE COLLECTIONS</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {quickCategories.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => handleSelectCategory(c.value)}
                          className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/[0.05] hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/50 text-white/80 hover:text-[#D4AF37] transition-all"
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Popular Searches */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>TRENDING SEARCHES</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-3 py-1 rounded-lg text-xs font-light text-white/70 bg-white/[0.03] hover:bg-white/[0.08] hover:text-white transition-all flex items-center gap-1.5"
                        >
                          <Search className="w-3 h-3 text-[#D4AF37]/70" />
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* When searching and results found */}
              {q && filteredProducts.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold tracking-[0.2em] uppercase text-[#D4AF37]">
                    <span>RESULTS ({filteredProducts.length})</span>
                    <span className="text-[10px] text-white/40 normal-case tracking-normal">Click to view product</span>
                  </div>

                  <div className="space-y-2">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product.id)}
                        className="group flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.07] border border-white/5 hover:border-[#D4AF37]/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0">
                            <Image
                              src={product.image_url || "/images/watch.png"}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-medium text-white group-hover:text-[#D4AF37] transition-colors truncate">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full">
                                {product.category}
                              </span>
                              <span className="text-[10px] text-emerald-400/80 flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" /> In Stock
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pl-3 shrink-0">
                          <span className="text-sm font-bold text-[#D4AF37]">
                            {formatPrice(product.price)}
                          </span>
                          <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* When searching and NO results found */}
              {q && filteredProducts.length === 0 && !loading && (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-white/40">
                    <Search className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-medium text-white">No products found</h4>
                  <p className="text-xs text-white/50 max-w-sm mx-auto">
                    We couldn't find any products matching &ldquo;{query}&rdquo;. Try checking the spelling or browse our full collection.
                  </p>
                  <button
                    onClick={() => handleSelectCategory("All")}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#F3CE72] transition-colors mt-2"
                  >
                    View All Products
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer / Hint */}
            <div className="px-6 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-[11px] text-white/40">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                ORVANO Luxury Search Engine
              </span>
              <span className="hidden sm:inline">Press ESC to dismiss</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
