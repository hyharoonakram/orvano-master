"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { isProductMatchingFilter } from "@/utils/categories";

const PANTS_TABS = [
  { id: "ALL", label: "All Baggy Pants" },
  { id: "MEN", label: "Men's Baggy Pants" },
  { id: "WOMEN", label: "Women's Baggy Pants" },
];

import { normalizeProductData, isProductInCategory } from "@/utils/productCatalog";

export default function PantsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (data) {
<<<<<<< HEAD
        // Strictly filter to broad category BOTTOM
        const bottomList = data.filter((p: any) => isProductMatchingFilter(p, "BOTTOM", "ALL"));
        setProducts(bottomList);
=======
        const normalized = data.map(normalizeProductData);
        const pantsList = normalized.filter((p: any) => isProductInCategory(p, "bottom"));
        setProducts(pantsList);
>>>>>>> 7831bb0cf53aa95ee2ddfae316e653727c4774c4
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (activeTab === "ALL") return true;
    return isProductMatchingFilter(p, "BOTTOM", activeTab);
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    const orderA = a.display_order ?? a.sort_order ?? 999;
    const orderB = b.display_order ?? b.sort_order ?? 999;
    return orderA - orderB;
  });

  const allCount = products.length;
  const menCount = products.filter(p => isProductMatchingFilter(p, "BOTTOM", "MEN")).length;
  const womenCount = products.filter(p => isProductMatchingFilter(p, "BOTTOM", "WOMEN")).length;

  return (
    <main className="flex min-h-screen flex-col bg-background pt-20">
      <Navbar />

      {/* Page Header */}
      <section className="bg-background border-b border-foreground/5 py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block mb-3 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest font-mono"
          >
            Core Broad Category &bull; Bottom
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
            className="text-4xl sm:text-5xl md:text-6xl font-heading text-foreground mb-4 uppercase tracking-wider font-black"
=======
            className="text-4xl md:text-5xl font-heading text-foreground mb-4 uppercase tracking-wider font-extrabold"
>>>>>>> 7831bb0cf53aa95ee2ddfae316e653727c4774c4
          >
            Baggy Pants &amp; Jeans
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
<<<<<<< HEAD
            className="text-foreground/60 max-w-2xl mx-auto tracking-wide mb-6 text-sm sm:text-base"
          >
            Elevate your streetwear with our premium selection of oversized denim and relaxed baggy trousers for Men and Women.
=======
            className="text-foreground/60 max-w-2xl mx-auto tracking-wide mb-8 text-sm sm:text-base"
          >
            Elevate your streetwear with our premium collection of oversized, perfectly tailored baggy pants and jeans.
>>>>>>> 7831bb0cf53aa95ee2ddfae316e653727c4774c4
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/shop" className="text-[#D4AF37] hover:text-[#F5D67B] text-xs uppercase tracking-widest font-bold border-b border-[#D4AF37] pb-1 transition-colors">
              View Entire Collection &rarr;
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 container mx-auto px-4 sm:px-6 py-12">
        {/* Tab & Sort Toolbar */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
          {/* Subcategory (Gender) Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {PANTS_TABS.map((tab) => {
              const count = tab.id === "ALL" ? allCount : tab.id === "MEN" ? menCount : womenCount;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      : "bg-white/5 text-white/60 hover:text-white border border-white/10"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? "bg-black/20 text-black" : "bg-white/10 text-white/50"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
            <span className="text-white/50 text-xs tracking-widest uppercase font-semibold">
              Showing {sortedProducts.length} Results
            </span>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {sortedProducts.map((product, index) => (
            <ProductCard key={product.id} {...product} priority={index < 4} />
          ))}
        </div>

        {loading && (
          <div className="text-center py-20 text-foreground/50 animate-pulse text-sm uppercase tracking-widest">
            Loading baggy pants...
          </div>
        )}

        {!loading && sortedProducts.length === 0 && (
          <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/10 p-8">
            <p className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-4">
              No baggy pants found in this selection.
            </p>
            <button
              onClick={() => setActiveTab("ALL")}
              className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-widest"
            >
              View All Baggy Pants ({allCount})
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
