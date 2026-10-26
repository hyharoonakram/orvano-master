"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  Star,
  Gem,
  Cog,
  Clock,
  ShieldCheck,
  Truck,
  Compass,
  SlidersVertical,
} from "lucide-react";

export function HeroSection({
  pantsImage,
  pantsProductId,
  initialSlides,
}: {
  pantsImage?: string;
  pantsProductId?: string;
  initialSlides?: any[];
}) {
  return (
    <section className="relative w-full min-h-[92vh] lg:min-h-[96vh] bg-black overflow-hidden flex flex-col justify-between select-none pt-[96px] sm:pt-[104px]">
      {/* 50/50 Split-Screen Grid */}
      <div className="relative w-full flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden min-h-[680px] lg:min-h-[720px]">
        {/* ========================================================= */}
        {/* LEFT PANEL: BAGGY PANTS                                  */}
        {/* ========================================================= */}
        <div className="relative flex flex-col justify-end p-6 sm:p-10 md:p-12 lg:p-16 min-h-[460px] lg:min-h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 group">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-cargo-pants-lux.png"
              alt="ORVANO Luxury Streetwear Baggy Pants"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={95}
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Gradient Overlays for High Legibility and Rich Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent hidden lg:block" />
            <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.7)] pointer-events-none" />
          </div>

          {/* Floating Left Circular Arrow Button */}
          <button
            type="button"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-black/50 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all shadow-lg hover:scale-110"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Left Content Area */}
          <div className="relative z-10 max-w-xl space-y-3 sm:space-y-4">
            {/* Collection 01 Tag */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]"
            >
              <span>COLLECTION 01</span>
              <span className="text-[#D4AF37]">&#8212;</span>
            </motion.div>

            {/* Main Category Heading (Serif style matching mock) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-serif uppercase tracking-tight text-white leading-[0.98] drop-shadow-2xl">
                BAGGY
                <br />
                <span className="text-[#D4AF37] font-serif">PANTS</span>
              </h1>
            </motion.div>

            {/* Short Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/85 text-xs sm:text-sm md:text-base font-light tracking-wide max-w-md"
            >
              Modern Fit. Everyday Confidence.
            </motion.p>

            {/* 3 Feature Badges in horizontal row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="grid grid-cols-3 gap-2 sm:gap-3 py-2.5 max-w-md border-y border-white/10 my-2"
            >
              {/* Feature 1: Relaxed Fit */}
              <div className="flex flex-col items-start text-left">
                <SlidersVertical className="w-4 h-4 text-[#D4AF37] mb-1" />
                <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">
                  Relaxed
                </span>
                <span className="text-[9px] sm:text-[10px] text-white/50">Fit</span>
              </div>

              {/* Feature 2: Premium Fabric */}
              <div className="flex flex-col items-start text-left border-x border-white/10 px-2 sm:px-3">
                <Layers className="w-4 h-4 text-[#D4AF37] mb-1" />
                <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">
                  Premium
                </span>
                <span className="text-[9px] sm:text-[10px] text-white/50">Fabric</span>
              </div>

              {/* Feature 3: Everyday Style */}
              <div className="flex flex-col items-start text-left pl-1 sm:pl-2">
                <Star className="w-4 h-4 text-[#D4AF37] mb-1" />
                <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">
                  Everyday
                </span>
                <span className="text-[9px] sm:text-[10px] text-white/50">Style</span>
              </div>
            </motion.div>

            {/* Premium Gold CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-1"
            >
              <Link
                href="/pants"
                className="inline-flex items-center gap-2.5 px-7 sm:px-9 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#E5C158] via-[#D4AF37] to-[#B8860B] text-black font-extrabold text-[11px] sm:text-xs uppercase tracking-[0.2em] shadow-[0_4px_25px_rgba(212,175,55,0.45)] hover:shadow-[0_6px_35px_rgba(212,175,55,0.7)] hover:scale-105 transition-all duration-300"
              >
                <span>SHOP BOTTOMS</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANEL: WATCHES                                     */}
        {/* ========================================================= */}
        <div className="relative flex flex-col justify-end p-6 sm:p-10 md:p-12 lg:p-16 min-h-[460px] lg:min-h-full overflow-hidden group">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-watches-marble.png"
              alt="ORVANO Luxury Chronograph Watch on Marble"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={95}
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Gradient Overlays for High Legibility and Warm Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-transparent to-transparent hidden lg:block" />
            <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.7)] pointer-events-none" />
          </div>

          {/* Floating Right Circular Arrow Button */}
          <button
            type="button"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-black/50 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all shadow-lg hover:scale-110"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Right Content Area */}
          <div className="relative z-10 max-w-xl space-y-3 sm:space-y-4">
            {/* Collection 02 Tag */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]"
            >
              <span>COLLECTION 02</span>
              <span className="text-[#D4AF37]">&#8212;</span>
            </motion.div>

            {/* Main Category Heading (Serif style matching mock) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-serif uppercase tracking-tight text-white leading-[0.98] drop-shadow-2xl">
                TIMEPIECE
                <br />
                <span className="text-[#D4AF37] font-serif">WATCHES</span>
              </h1>
            </motion.div>

            {/* Short Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/85 text-xs sm:text-sm md:text-base font-light tracking-wide max-w-md"
            >
              Precision. Elegance. Always Yours.
            </motion.p>

            {/* 3 Feature Badges in horizontal row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="grid grid-cols-3 gap-2 sm:gap-3 py-2.5 max-w-md border-y border-white/10 my-2"
            >
              {/* Feature 1: Premium Craftsmanship */}
              <div className="flex flex-col items-start text-left">
                <Gem className="w-4 h-4 text-[#D4AF37] mb-1" />
                <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">
                  Premium
                </span>
                <span className="text-[9px] sm:text-[10px] text-white/50">Craftsmanship</span>
              </div>

              {/* Feature 2: Swiss Caliber */}
              <div className="flex flex-col items-start text-left border-x border-white/10 px-2 sm:px-3">
                <Cog className="w-4 h-4 text-[#D4AF37] mb-1" />
                <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">
                  Swiss
                </span>
                <span className="text-[9px] sm:text-[10px] text-white/50">Caliber</span>
              </div>

              {/* Feature 3: Timeless Design */}
              <div className="flex flex-col items-start text-left pl-1 sm:pl-2">
                <Clock className="w-4 h-4 text-[#D4AF37] mb-1" />
                <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">
                  Timeless
                </span>
                <span className="text-[9px] sm:text-[10px] text-white/50">Design</span>
              </div>
            </motion.div>

            {/* Premium Gold CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-1"
            >
              <Link
                href="/watches"
                className="inline-flex items-center gap-2.5 px-7 sm:px-9 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#E5C158] via-[#D4AF37] to-[#B8860B] text-black font-extrabold text-[11px] sm:text-xs uppercase tracking-[0.2em] shadow-[0_4px_25px_rgba(212,175,55,0.45)] hover:shadow-[0_6px_40px_rgba(212,175,55,0.7)] hover:scale-105 transition-all duration-300"
              >
                <span>SHOP WATCHES</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Center Vertical Divider (Desktop Only) */}
        <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent" />
      </div>

      {/* ========================================================= */}
      {/* BOTTOM LUXURY TRUST FEATURES RIBBON (Exact Mock Match)     */}
      {/* ========================================================= */}
      <div className="relative z-30 w-full border-t border-white/10 bg-black/95 backdrop-blur-md py-4 px-4 sm:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x lg:divide-white/10 items-center">
            {/* Feature 1 */}
            <div className="flex items-center gap-3 px-2 sm:px-6 justify-start lg:justify-center">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div>
                <h3 className="text-[11px] sm:text-xs font-bold tracking-[0.15em] text-white uppercase">
                  PREMIUM COTTON
                </h3>
                <p className="text-[9.5px] sm:text-[10px] text-white/50 font-light">
                  480GSM Japanese Weave
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3 px-2 sm:px-6 justify-start lg:justify-center">
              <Clock className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div>
                <h3 className="text-[11px] sm:text-xs font-bold tracking-[0.15em] text-white uppercase">
                  SWISS CALIBER
                </h3>
                <p className="text-[9.5px] sm:text-[10px] text-white/50 font-light">
                  Precision Horology
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3 px-2 sm:px-6 justify-start lg:justify-center">
              <Gem className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div>
                <h3 className="text-[11px] sm:text-xs font-bold tracking-[0.15em] text-white uppercase">
                  AUTHENTIC SEAL
                </h3>
                <p className="text-[9.5px] sm:text-[10px] text-white/50 font-light">
                  100% Verified ORVANO
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-3 px-2 sm:px-6 justify-start lg:justify-center">
              <Truck className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div>
                <h3 className="text-[11px] sm:text-xs font-bold tracking-[0.15em] text-white uppercase">
                  EXPRESS DISPATCH
                </h3>
                <p className="text-[9.5px] sm:text-[10px] text-white/50 font-light">
                  Dispatched within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
