"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Sparkles, Package, ShieldCheck, Box } from "lucide-react";

export default function AboutPage() {
  const [images, setImages] = useState({
    watchPackagingImage: "/images/box-watch.jpeg",
    watchPackagingDesc: "Every ORVANO timepiece is delivered in our custom velvet-lined matte black presentation box with shockproof foam protection and gold foil embossing.",
    pantsPackagingImage: "/images/pants.png",
    pantsPackagingDesc: "Our baggy cargo pants are packaged in custom heavy-duty seal bags with metallic gold hardware details and signature ORVANO collector card."
  });

  useEffect(() => {
    const fetchImages = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('store_settings').select('*').eq('id', 1).single();
      if (data) {
        const pkgEntry = Array.isArray(data.coupons) ? data.coupons.find((c: any) => c._type === '_packaging_images') : null;
        setImages({
          watchPackagingImage: pkgEntry?.watch_packaging_image || data.watch_packaging_image || data.premium_box_image || "/images/box-watch.jpeg",
          watchPackagingDesc: pkgEntry?.watch_packaging_desc || "Every ORVANO timepiece is delivered in our custom velvet-lined matte black presentation box with shockproof foam protection and gold foil embossing.",
          pantsPackagingImage: pkgEntry?.pants_packaging_image || data.pants_packaging_image || data.hero_pants_image || "/images/pants.png",
          pantsPackagingDesc: pkgEntry?.pants_packaging_desc || "Our baggy cargo pants are packaged in custom heavy-duty seal bags with metallic gold hardware details and signature ORVANO collector card."
        });
      }
    };
    fetchImages();
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-[#050507] text-white pt-20">
      <Navbar />

      {/* Page Header */}
      <section className="bg-gradient-to-b from-[#0A0A0E] to-[#050507] border-b border-white/10 py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-6 text-center relative z-10 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs uppercase font-extrabold tracking-[0.25em]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXCLUSIVE UNBOXING EXPERIENCE</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/95 to-[#D4AF37] max-w-4xl mx-auto leading-tight"
          >
            ORVANO Packaging & Craftsmanship
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-sm md:text-lg max-w-2xl mx-auto font-light"
          >
            Discover our two signature packaging experiences crafted for luxury timepieces and avant-garde streetwear.
          </motion.p>
        </div>
      </section>

      {/* SECTION 1: Watch Packaging Showcase */}
      <section className="py-20 md:py-28 bg-[#050507] border-b border-white/10 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Watch Packaging Photo Card (Admin Picture 1) */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 relative w-full aspect-square max-h-[500px] bg-gradient-to-br from-[#121216] via-[#09090C] to-black rounded-3xl border border-[#D4AF37]/40 p-6 sm:p-8 flex items-center justify-center overflow-hidden shadow-[0_0_60px_rgba(212,175,55,0.2)] group"
            >
              {/* Radial Spotlight Effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.25)_0%,transparent_75%)]" />
              
              <div className="relative w-full h-full z-10 flex items-center justify-center">
                <Image
                  src={images.watchPackagingImage}
                  alt="Watch Packaging Box"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-4 filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Tag Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold backdrop-blur-md">
                <Box className="w-3.5 h-3.5" />
                <span>PACKAGING PHOTO 01</span>
              </div>
            </motion.div>

            {/* Watch Packaging Description (Admin Typed Text 1) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="space-y-2">
                <span className="text-[#D4AF37] font-extrabold tracking-[0.25em] text-xs uppercase block">
                  SECTION 01 — TIMEPIECE PRESENTATION
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight leading-tight">
                  Watch Packaging Box
                </h2>
              </div>

              <p className="text-white/80 text-base sm:text-lg md:text-xl font-light leading-relaxed bg-white/[0.02] border border-white/10 p-6 rounded-2xl shadow-inner">
                {images.watchPackagingDesc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <span className="text-xs font-bold uppercase text-white/90">Shockproof Velvet Interior</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <Package className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <span className="text-xs font-bold uppercase text-white/90">Gold Foil Embossed Logo</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 2: Pants Packaging Showcase */}
      <section className="py-20 md:py-28 bg-[#09090C] relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Pants Packaging Description (Admin Typed Text 2) */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 lg:order-1 order-2 space-y-6"
            >
              <div className="space-y-2">
                <span className="text-[#D4AF37] font-extrabold tracking-[0.25em] text-xs uppercase block">
                  SECTION 02 — STREETWEAR PRESENTATION
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight leading-tight">
                  Pants Packaging Presentation
                </h2>
              </div>

              <p className="text-white/80 text-base sm:text-lg md:text-xl font-light leading-relaxed bg-white/[0.02] border border-white/10 p-6 rounded-2xl shadow-inner">
                {images.pantsPackagingDesc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <span className="text-xs font-bold uppercase text-white/90">Heavy-Duty Seal Protection</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <Package className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <span className="text-xs font-bold uppercase text-white/90">Metallic Zipper Details</span>
                </div>
              </div>
            </motion.div>

            {/* Pants Packaging Photo Card (Admin Picture 2) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-6 lg:order-2 order-1 relative w-full aspect-square max-h-[500px] bg-gradient-to-br from-[#121216] via-[#09090C] to-black rounded-3xl border border-[#D4AF37]/40 p-6 sm:p-8 flex items-center justify-center overflow-hidden shadow-[0_0_60px_rgba(212,175,55,0.2)] group"
            >
              {/* Radial Spotlight Effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.25)_0%,transparent_75%)]" />
              
              <div className="relative w-full h-full z-10 flex items-center justify-center">
                <Image
                  src={images.pantsPackagingImage}
                  alt="Pants Packaging Showcase"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-4 filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Tag Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold backdrop-blur-md">
                <Box className="w-3.5 h-3.5" />
                <span>PACKAGING PHOTO 02</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
