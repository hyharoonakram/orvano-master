"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";

// Showing a subset to represent "New Arrivals"
const NEW_PRODUCTS = [
  { id: "5", name: "Celestial Moonphase", price: 18200.00, image: "/images/watch.png", category: "Watches" },
  { id: "6", name: "Tactical Techwear Pants", price: 520.00, image: "/images/pants.png", category: "Pants" },
];

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
        
      if (data) setProducts(data);
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
            New Arrivals
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#D4AF37] max-w-2xl mx-auto tracking-widest uppercase text-sm mb-8 font-bold"
          >
            The Latest Drops
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/shop" className="text-foreground hover:text-[#D4AF37] text-sm uppercase tracking-widest font-bold border-b border-foreground/20 hover:border-[#D4AF37] pb-1 transition-colors">
              Explore Entire Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 container mx-auto px-6 py-16">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-foreground/10 pb-4">
          <span className="text-foreground/70 text-xs md:text-sm tracking-widest uppercase font-semibold">
            Showing {sortedProducts.length} Results
          </span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto bg-[#0A0A0C] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-white text-xs md:text-sm px-4 py-2.5 rounded-xl outline-none transition-all shadow-md cursor-pointer font-medium"
          >
            <option value="newest" className="bg-[#0A0A0C] text-white py-2">Sort by: Newest</option>
            <option value="price-low" className="bg-[#0A0A0C] text-white py-2">Price: Low to High</option>
            <option value="price-high" className="bg-[#0A0A0C] text-white py-2">Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {sortedProducts.map((product, index) => (
            <ProductCard key={product.id} {...product} priority={index < 4} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
