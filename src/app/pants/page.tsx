"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

import { SortDropdown } from "@/components/ui/SortDropdown";

export default function PantsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (data) {
        const pantsList = data.filter((p: any) => {
          const c = (p.category || "").toLowerCase();
          const n = (p.name || "").toLowerCase();
          return c.includes("pant") || c.includes("baggy") || c.includes("trouser") || c.includes("cargo") || n.includes("pant") || n.includes("jean") || n.includes("baggy");
        });
        setProducts(pantsList.length > 0 ? pantsList : data);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
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
            Baggy Pants
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-foreground/60 max-w-2xl mx-auto tracking-wide mb-8"
          >
            Elevate your streetwear with our premium selection of oversized, perfectly tailored baggy trousers.
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
        <div className="mb-8 flex justify-between items-center border-b border-foreground/10 pb-4">
          <span className="text-foreground/70 text-xs md:text-sm tracking-widest uppercase font-semibold">
            Showing {sortedProducts.length} Results
          </span>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {sortedProducts.map((product, index) => (
            <ProductCard key={product.id} {...product} priority={index < 4} />
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-foreground/50 animate-pulse">
            Loading pants...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-foreground/50">
            No pants found in the database.
          </div>
        ) : null}
      </section>

      <Footer />
    </main>
  );
}
