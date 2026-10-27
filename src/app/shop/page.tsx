"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { createClient } from "@/utils/supabase/client";

import { SortDropdown } from "@/components/ui/SortDropdown";
import { STORE_CATEGORIES, normalizeProductData, isProductInCategory } from "@/utils/productCatalog";

const CATEGORIES = [...STORE_CATEGORIES];

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState(categoryParam || "All");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");

  // Keep activeCategory synced with URL search params whenever header link is clicked
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory("All");
    }
  }, [categoryParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (data) setProducts(data.map(normalizeProductData));
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Filter categories so only those with >0 items are shown (except "All")
  const availableCategories = CATEGORIES.filter((category) => {
    if (category === "All") return true;
    return products.some((product) => isProductInCategory(product, category));
  });

  const filteredProducts = products.filter((product) =>
    isProductInCategory(product, activeCategory)
  );

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
            className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-foreground uppercase mb-4"
          >
            The Collection
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-foreground/60 max-w-2xl mx-auto tracking-wide"
          >
            Explore our curated selection of premium timepieces and avant-garde streetwear. Every piece tells a story of luxury and rebellion.
          </motion.p>
        </div>
      </section>

      {/* Shop Content */}
      <section className="flex-1 container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar / Filters */}
          <div className="w-full md:w-64 shrink-0">
            <h3 className="text-[#D4AF37] font-bold tracking-widest uppercase text-sm mb-6 border-b border-foreground/10 pb-4">
              Categories
            </h3>
            <ul className="space-y-4">
              {availableCategories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => setActiveCategory(category)}
                    className={`text-sm tracking-wider uppercase transition-colors ${
                      activeCategory === category 
                        ? "text-foreground font-bold" 
                        : "text-foreground/50 hover:text-[#D4AF37]"
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort Dropdown & Count Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <span className="text-xs uppercase tracking-widest text-white/50 font-medium">
                Showing {sortedProducts.length} Product{sortedProducts.length === 1 ? "" : "s"} ({activeCategory})
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
              <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/10">
                <p className="text-white/60 text-sm font-semibold uppercase tracking-wider">
                  No products found in category &quot;{activeCategory}&quot;.
                </p>
                <button
                  onClick={() => setActiveCategory("All")}
                  className="mt-4 text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:underline"
                >
                  View All Products
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
