"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { Sparkles, Package, ShieldCheck, Box, Tag } from "lucide-react";

export function LuxuryPackagingShowcase() {
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
    <section className="py-20 md:py-28 bg-[#050507] border-t border-b border-white/10 relative overflow-hidden cv-auto">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37]/5 rounded-full hidden md:block blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10 space-y-24">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs uppercase font-extrabold tracking-[0.25em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>UNBOXING CRAFTSMANSHIP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
            SIGNATURE LUXURY PACKAGING
          </h2>
          <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed max-w-xl mx-auto">
            Experience our two bespoke unboxing standards engineered to protect your timepieces and elevate streetwear delivery.
          </p>
        </div>

        {/* SECTION 1: Watch Packaging Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Packaging Photo Card 1 */}
          <div
            className="lg:col-span-6 relative w-full aspect-square max-h-[420px] bg-gradient-to-br from-[#121216] via-[#09090C] to-black rounded-3xl border border-[#D4AF37]/40 p-4 sm:p-8 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)] group"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.25)_0%,transparent_75%)]" />
            
            <div className="relative w-full h-full z-10 flex items-center justify-center">
              <Image
                src={images.watchPackagingImage}
                alt="Watch Packaging Box"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={65}
                className="object-contain p-2 filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] sm:text-xs font-mono font-bold md:backdrop-blur-md">
              <Box className="w-3.5 h-3.5" />
              <span>TIMEPIECE BOX</span>
            </div>
          </div>

          {/* Packaging Description 1 */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-[#D4AF37] font-extrabold tracking-[0.25em] text-xs uppercase block">
                01 • HOROLOGY PRESENTATION
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white tracking-tight leading-tight">
                Watch Presentation Box
              </h3>
            </div>

            <p className="text-white/80 text-sm sm:text-base font-light leading-relaxed bg-white/[0.02] border border-white/10 p-5 sm:p-6 rounded-2xl shadow-inner">
              {images.watchPackagingDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-xs font-bold uppercase text-white/90">Velvet Interior Protection</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                <Package className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-xs font-bold uppercase text-white/90">Gold Embossed Authentication</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Baggy Cargo Pants Packaging */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Packaging Description 2 */}
          <div className="lg:col-span-6 lg:order-1 order-2 space-y-6">
            <div className="space-y-2">
              <span className="text-[#D4AF37] font-extrabold tracking-[0.25em] text-xs uppercase block">
                02 • STREETWEAR PRESENTATION
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white tracking-tight leading-tight">
                Baggy Cargo Packaging
              </h3>
            </div>

            <p className="text-white/80 text-sm sm:text-base font-light leading-relaxed bg-white/[0.02] border border-white/10 p-5 sm:p-6 rounded-2xl shadow-inner">
              {images.pantsPackagingDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                <Tag className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-xs font-bold uppercase text-white/90">Heavy-Duty Sealed Bag</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-xs font-bold uppercase text-white/90">Signature Collector Card</span>
              </div>
            </div>
          </div>

          {/* Packaging Photo Card 2 */}
          <div className="lg:col-span-6 lg:order-2 order-1 relative w-full aspect-square max-h-[420px] bg-gradient-to-br from-[#121216] via-[#09090C] to-black rounded-3xl border border-[#D4AF37]/40 p-4 sm:p-8 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)] group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.25)_0%,transparent_75%)]" />
            
            <div className="relative w-full h-full z-10 flex items-center justify-center">
              <Image
                src={images.pantsPackagingImage}
                alt="Pants Packaging Bag"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={65}
                className="object-contain p-2 filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] sm:text-xs font-mono font-bold md:backdrop-blur-md">
              <Box className="w-3.5 h-3.5" />
              <span>STREETWEAR BAG</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
