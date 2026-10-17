"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

import { SortDropdown } from "@/components/ui/SortDropdown";

const WATCH_TABS = ["All", "Men's Watches", "Women's Watches"];

export default function WatchesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();
      // Fetch all products with watch in category (covers "Men's Watches", "Women's Watches", "Watches")
      const { data } = await supabase
        .from("products")
        .select("*")
        .ilike("category", "%watch%")
        .order("created_at", { ascending: false });
        
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (activeTab === "All") return true;
    const cat = (p.category || "").toLowerCase();
    if (activeTab === "Men's Watches") return cat.includes("men") && !cat.includes("women");
    if (activeTab === "Women's Watches") return cat.includes("women");
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    const orderA = a.display_order ?? a.sort_order ?? 999;
    const orderB = b.display_order ?? b.sort_order ?? 999;
    return orderA - orderB;
  });

  return (
    <main className="flex min-h-screen flex-col bg-background pt-20">
      <Navbar />

      {/* Page Header */}
      <section className="bg-background border-b border-foreground/5 py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-heading text-foreground mb-6 uppercase tracking-wider"
          >
            Luxury Watches
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-foreground/60 max-w-2xl mx-auto tracking-wide mb-8"
          >
            Discover our exclusive collection of meticulously crafted timepieces, where classic horology meets modern design.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/shop" className="text-[#D4AF37] hover:text-[#F5D67B] text-sm uppercase tracking-widest font-bold border-b border-[#D4AF37] pb-1 transition-colors">
              View All Products
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 container mx-auto px-6 py-16">
        {/* Filter and Sort Toolbar */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-foreground/10 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {WATCH_TABS.map((tab) => {
              const count = tab === "All" 
                ? products.length 
                : tab === "Men's Watches"
                ? products.filter(p => (p.category || "").toLowerCase().includes("men") && !(p.category || "").toLowerCase().includes("women")).length
                : products.filter(p => (p.category || "").toLowerCase().includes("women")).length;

              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-200 border ${
                    isActive
                      ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                      : "bg-white/5 text-white/70 border-white/10 hover:border-[#D4AF37]/50 hover:text-white"
                  }`}
                >
                  {tab === "All" ? "All Watches" : tab} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            <span className="text-foreground/70 text-xs tracking-widest uppercase font-semibold">
              Showing {sortedProducts.length} Results
            </span>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {sortedProducts.map((product, index) => (
            <ProductCard key={product.id} {...product} priority={index < 4} />
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-foreground/50 animate-pulse">
            Loading watches...
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20 text-foreground/50">
            No watches found in this category.
          </div>
        ) : null}
      </section>

      <Footer />
    </main>
  );
}
