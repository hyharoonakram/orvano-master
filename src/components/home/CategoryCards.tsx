"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

const FOUR_CATEGORIES = [
  {
    name: "WATCHES",
    image: "/images/category-watch-v2.jpg",
    link: "/watches",
  },
  {
    name: "SHOES",
    image: "/images/shoes.jpg",
    link: "/shop?category=Shoes",
  },
  {
    name: "TOP",
    image: "/images/top.jpg",
    link: "/shop?category=Top",
  },
  {
    name: "BOTTOM",
    image: "/images/category-bottom-v2.jpg",
    link: "/pants",
  },
];

function computeCategories(products: any[]) {
  // Use the curated HD images for WATCHES and BOTTOM as requested by the user,
  // while linking directly to full collection listings
  return FOUR_CATEGORIES.map((cat) => {
    return {
      ...cat,
      image: cat.image,
    };
  });
}

export function CategoryCards({ initialProducts = [] }: { initialProducts?: any[] }) {
  const [activeCategories, setActiveCategories] = useState<any[]>(() => computeCategories(initialProducts));

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setActiveCategories(computeCategories(initialProducts));
    }
  }, [initialProducts]);

  return (
    <div className="space-y-8">
      {/* 4 Boxes - 1 by 1 aspect ratio (1:1) in a balanced 4-column grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {activeCategories.map((category) => (
          <Link href={category.link} key={category.name} className="group">
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="border border-white/10 hover:border-[#D4AF37]/50 bg-zinc-950/60 hover:bg-zinc-900/50 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-between aspect-square relative overflow-hidden transition-all duration-300 shadow-xl group"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-radial from-[#D4AF37]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Centered Image (1 by 1 square container) */}
              <div className="relative w-full h-[76%] flex items-center justify-center p-2">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                  quality={90}
                  className="object-contain filter drop-shadow-[0_8px_25px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-300 rounded-lg"
                />
              </div>
              
              {/* Label */}
              <div className="relative z-10 w-full text-center pb-1">
                <span className="text-white text-xs sm:text-sm font-bold tracking-[0.2em] uppercase group-hover:text-[#D4AF37] transition-colors duration-300">
                  {category.name}
                </span>
                <span className="block text-[8.5px] text-white/40 group-hover:text-white/70 uppercase tracking-widest font-mono mt-0.5">
                  Men &bull; Women
                </span>
                <div className="w-6 h-[1.5px] bg-[#D4AF37]/40 mx-auto mt-1 group-hover:w-12 group-hover:bg-[#D4AF37] transition-all duration-300" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Social Follow Callout under Baggy Pants and Watches */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-center pt-4"
      >
        <a 
          href="https://instagram.com/wearorvano" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-zinc-900/80 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.15)] group"
        >
          <svg className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span className="text-xs font-bold tracking-widest uppercase">
            Plz Follow | <span className="text-[#D4AF37]">@wearorvano</span>
          </span>
        </a>
      </motion.div>
    </div>
  );
}
