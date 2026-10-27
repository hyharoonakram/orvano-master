"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { createClient } from "@/utils/supabase/client";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { 
  classifyProduct, 
  isProductMatchingFilter, 
  parseCategoryParam,
  BROAD_CATEGORIES,
  BroadCategory 
} from "@/utils/categories";

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const genderParam = searchParams.get("gender");

  const [products, setProducts] = useState<any[]>([]);
  const [selectedBroad, setSelectedBroad] = useState<string>("All");
  const [selectedGender, setSelectedGender] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");

  // Keep filters synced with URL search params
  useEffect(() => {
    if (categoryParam) {
      const parsed = parseCategoryParam(categoryParam);
      setSelectedBroad(parsed.broad);
      if (genderParam) {
        setSelectedGender(genderParam.toUpperCase());
      } else {
        setSelectedGender(parsed.gender);
      }
    } else if (genderParam) {
      setSelectedBroad("All");
      setSelectedGender(genderParam.toUpperCase());
    } else {
      setSelectedBroad("All");
      setSelectedGender(genderParam ? genderParam.toUpperCase() : "All");
    }
  }, [categoryParam, genderParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    isProductMatchingFilter(product, selectedBroad, selectedGender)
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    const orderA = a.display_order ?? a.sort_order ?? 999;
    const orderB = b.display_order ?? b.sort_order ?? 999;
    return orderA - orderB;
  });

  // Calculate live counts for each broad and subcategory
  const counts: Record<string, { all: number; men: number; women: number }> = {
    TOP: {
      all: products.filter(p => isProductMatchingFilter(p, "TOP", "All")).length,
      men: products.filter(p => isProductMatchingFilter(p, "TOP", "MEN")).length,
      women: products.filter(p => isProductMatchingFilter(p, "TOP", "WOMEN")).length,
    },
    BOTTOM: {
      all: products.filter(p => isProductMatchingFilter(p, "BOTTOM", "All")).length,
      men: products.filter(p => isProductMatchingFilter(p, "BOTTOM", "MEN")).length,
      women: products.filter(p => isProductMatchingFilter(p, "BOTTOM", "WOMEN")).length,
    },
    WATCHES: {
      all: products.filter(p => isProductMatchingFilter(p, "WATCHES", "All")).length,
      men: products.filter(p => isProductMatchingFilter(p, "WATCHES", "MEN")).length,
      women: products.filter(p => isProductMatchingFilter(p, "WATCHES", "WOMEN")).length,
    },
    SHOES: {
      all: products.filter(p => isProductMatchingFilter(p, "SHOES", "All")).length,
      men: products.filter(p => isProductMatchingFilter(p, "SHOES", "MEN")).length,
      women: products.filter(p => isProductMatchingFilter(p, "SHOES", "WOMEN")).length,
    },
  };

  const totalProductsCount = products.length;

  const getActiveFilterTitle = () => {
    const broadTitle = selectedBroad === "All" ? "All Collections" : selectedBroad;
    const genderTitle = selectedGender === "All" ? "" : selectedGender === "WOMEN" ? " • Women's" : " • Men's";
    return `${broadTitle}${genderTitle}`;
  };

  return (
    <main className="flex min-h-screen flex-col bg-background pt-20">
      <Navbar />

      {/* Page Header */}
      <section className="bg-background border-b border-foreground/5 py-16 sm:py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight text-foreground uppercase mb-4"
          >
            The Collection
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-foreground/60 max-w-2xl mx-auto tracking-wide text-sm sm:text-base"
          >
            Explore our curated 4 core categories: <span className="text-[#D4AF37] font-semibold">Top</span>, <span className="text-[#D4AF37] font-semibold">Bottom</span>, <span className="text-[#D4AF37] font-semibold">Watches</span>, and <span className="text-[#D4AF37] font-semibold">Shoes</span> across Male and Female collections.
          </motion.p>
        </div>
      </section>

      {/* Shop Content */}
      <section className="flex-1 container mx-auto px-4 sm:px-6 py-12">
        {/* Quick Top Broad Category Bar */}
        <div className="mb-8 p-3 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Broad Category Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => { setSelectedBroad("All"); }}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition-all whitespace-nowrap ${
                selectedBroad.toUpperCase() === "ALL"
                  ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              All ({totalProductsCount})
            </button>
            {BROAD_CATEGORIES.map((cat) => {
              const count = counts[cat.id]?.all ?? 0;
              const isActive = selectedBroad.toUpperCase() === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedBroad(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? "bg-black/20 text-black" : "bg-white/10 text-white/60"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Subcategory (Gender: Men / Women) Filter */}
          <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-xl border border-white/10 w-full md:w-auto justify-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 px-2 font-mono hidden sm:inline">
              Gender:
            </span>
            {[
              { id: "All", label: "All" },
              { id: "MEN", label: "Men (Male)" },
              { id: "WOMEN", label: "Women (Female)" }
            ].map((sub) => {
              const isActive = selectedGender.toUpperCase() === sub.id.toUpperCase();
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedGender(sub.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-white text-black shadow-md"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Structured Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-6">
            <div className="bg-[#0A0A0C] p-5 rounded-2xl border border-white/10 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-[#D4AF37] font-bold tracking-widest uppercase text-xs">
                  Collections By Category
                </h3>
                {(selectedBroad !== "All" || selectedGender !== "All") && (
                  <button 
                    onClick={() => { setSelectedBroad("All"); setSelectedGender("All"); }}
                    className="text-[10px] text-white/50 hover:text-[#D4AF37] uppercase tracking-wider underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* 4 Broad Category Blocks with Subcategories */}
              <div className="space-y-4">
                {/* BOTTOM */}
                <div className="space-y-1.5">
                  <button
                    onClick={() => { setSelectedBroad("BOTTOM"); setSelectedGender("All"); }}
                    className={`w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider py-1 px-2 rounded-lg transition-colors ${
                      selectedBroad === "BOTTOM" && selectedGender === "All"
                        ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                        : "text-white/90 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>👖 BOTTOM (Baggy Pants)</span>
                    <span className="text-[10px] text-white/40 font-mono">({counts.BOTTOM.all})</span>
                  </button>
                  <div className="pl-6 space-y-1">
                    <button
                      onClick={() => { setSelectedBroad("BOTTOM"); setSelectedGender("MEN"); }}
                      className={`w-full flex items-center justify-between text-[11px] py-1 px-2 rounded-md transition-colors ${
                        selectedBroad === "BOTTOM" && selectedGender === "MEN"
                          ? "bg-white text-black font-bold"
                          : "text-white/60 hover:text-[#D4AF37]"
                      }`}
                    >
                      <span>Men's Baggy Pants</span>
                      <span className="text-[10px] opacity-60 font-mono">({counts.BOTTOM.men})</span>
                    </button>
                    <button
                      onClick={() => { setSelectedBroad("BOTTOM"); setSelectedGender("WOMEN"); }}
                      className={`w-full flex items-center justify-between text-[11px] py-1 px-2 rounded-md transition-colors ${
                        selectedBroad === "BOTTOM" && selectedGender === "WOMEN"
                          ? "bg-white text-black font-bold"
                          : "text-white/60 hover:text-[#D4AF37]"
                      }`}
                    >
                      <span>Women's Baggy Pants</span>
                      <span className="text-[10px] opacity-60 font-mono">({counts.BOTTOM.women})</span>
                    </button>
                  </div>
                </div>

                {/* WATCHES */}
                <div className="space-y-1.5 border-t border-white/5 pt-3">
                  <button
                    onClick={() => { setSelectedBroad("WATCHES"); setSelectedGender("All"); }}
                    className={`w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider py-1 px-2 rounded-lg transition-colors ${
                      selectedBroad === "WATCHES" && selectedGender === "All"
                        ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                        : "text-white/90 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>⌚ WATCHES</span>
                    <span className="text-[10px] text-white/40 font-mono">({counts.WATCHES.all})</span>
                  </button>
                  <div className="pl-6 space-y-1">
                    <button
                      onClick={() => { setSelectedBroad("WATCHES"); setSelectedGender("MEN"); }}
                      className={`w-full flex items-center justify-between text-[11px] py-1 px-2 rounded-md transition-colors ${
                        selectedBroad === "WATCHES" && selectedGender === "MEN"
                          ? "bg-white text-black font-bold"
                          : "text-white/60 hover:text-[#D4AF37]"
                      }`}
                    >
                      <span>Men's Watches</span>
                      <span className="text-[10px] opacity-60 font-mono">({counts.WATCHES.men})</span>
                    </button>
                    <button
                      onClick={() => { setSelectedBroad("WATCHES"); setSelectedGender("WOMEN"); }}
                      className={`w-full flex items-center justify-between text-[11px] py-1 px-2 rounded-md transition-colors ${
                        selectedBroad === "WATCHES" && selectedGender === "WOMEN"
                          ? "bg-white text-black font-bold"
                          : "text-white/60 hover:text-[#D4AF37]"
                      }`}
                    >
                      <span>Women's Watches</span>
                      <span className="text-[10px] opacity-60 font-mono">({counts.WATCHES.women})</span>
                    </button>
                  </div>
                </div>

                {/* TOP */}
                <div className="space-y-1.5 border-t border-white/5 pt-3">
                  <button
                    onClick={() => { setSelectedBroad("TOP"); setSelectedGender("All"); }}
                    className={`w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider py-1 px-2 rounded-lg transition-colors ${
                      selectedBroad === "TOP" && selectedGender === "All"
                        ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                        : "text-white/90 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>👕 TOP (Shirts & Tees)</span>
                    <span className="text-[10px] text-white/40 font-mono">({counts.TOP.all})</span>
                  </button>
                  <div className="pl-6 space-y-1">
                    <button
                      onClick={() => { setSelectedBroad("TOP"); setSelectedGender("MEN"); }}
                      className={`w-full flex items-center justify-between text-[11px] py-1 px-2 rounded-md transition-colors ${
                        selectedBroad === "TOP" && selectedGender === "MEN"
                          ? "bg-white text-black font-bold"
                          : "text-white/60 hover:text-[#D4AF37]"
                      }`}
                    >
                      <span>Men's Tops</span>
                      <span className="text-[10px] opacity-60 font-mono">({counts.TOP.men})</span>
                    </button>
                    <button
                      onClick={() => { setSelectedBroad("TOP"); setSelectedGender("WOMEN"); }}
                      className={`w-full flex items-center justify-between text-[11px] py-1 px-2 rounded-md transition-colors ${
                        selectedBroad === "TOP" && selectedGender === "WOMEN"
                          ? "bg-white text-black font-bold"
                          : "text-white/60 hover:text-[#D4AF37]"
                      }`}
                    >
                      <span>Women's Tops</span>
                      <span className="text-[10px] opacity-60 font-mono">({counts.TOP.women})</span>
                    </button>
                  </div>
                </div>

                {/* SHOES */}
                <div className="space-y-1.5 border-t border-white/5 pt-3">
                  <button
                    onClick={() => { setSelectedBroad("SHOES"); setSelectedGender("All"); }}
                    className={`w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider py-1 px-2 rounded-lg transition-colors ${
                      selectedBroad === "SHOES" && selectedGender === "All"
                        ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                        : "text-white/90 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>👟 SHOES</span>
                    <span className="text-[10px] text-white/40 font-mono">({counts.SHOES.all})</span>
                  </button>
                  <div className="pl-6 space-y-1">
                    <button
                      onClick={() => { setSelectedBroad("SHOES"); setSelectedGender("MEN"); }}
                      className={`w-full flex items-center justify-between text-[11px] py-1 px-2 rounded-md transition-colors ${
                        selectedBroad === "SHOES" && selectedGender === "MEN"
                          ? "bg-white text-black font-bold"
                          : "text-white/60 hover:text-[#D4AF37]"
                      }`}
                    >
                      <span>Men's Shoes</span>
                      <span className="text-[10px] opacity-60 font-mono">({counts.SHOES.men})</span>
                    </button>
                    <button
                      onClick={() => { setSelectedBroad("SHOES"); setSelectedGender("WOMEN"); }}
                      className={`w-full flex items-center justify-between text-[11px] py-1 px-2 rounded-md transition-colors ${
                        selectedBroad === "SHOES" && selectedGender === "WOMEN"
                          ? "bg-white text-black font-bold"
                          : "text-white/60 hover:text-[#D4AF37]"
                      }`}
                    >
                      <span>Women's Shoes</span>
                      <span className="text-[10px] opacity-60 font-mono">({counts.SHOES.women})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort Dropdown & Count Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <span className="text-xs uppercase tracking-widest text-white/60 font-medium">
                Showing <strong className="text-white">{sortedProducts.length}</strong> Product{sortedProducts.length === 1 ? "" : "s"} &bull; <span className="text-[#D4AF37]">{getActiveFilterTitle()}</span>
              </span>
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-2xl border border-white/10" />
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/10 p-8">
                <p className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-2">
                  No products found in {getActiveFilterTitle()}.
                </p>
                <p className="text-xs text-white/40 max-w-sm mx-auto mb-6">
                  Try clearing the gender or category filters to explore more items.
                </p>
                <button
                  onClick={() => { setSelectedBroad("All"); setSelectedGender("All"); }}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-widest hover:bg-[#F5D67B] transition-colors"
                >
                  View All Products ({totalProductsCount})
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
