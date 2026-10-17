"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Package, Clock, Compass } from "lucide-react";

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
    <section className="relative w-full min-h-[95vh] md:h-screen max-h-[1150px] bg-black overflow-hidden flex flex-col justify-between select-none pt-16 sm:pt-20">
      {/* 50/50 Split-Screen Grid */}
      <div className="relative w-full flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* ========================================================= */}
        {/* LEFT PANEL: BAGGY PANTS                                  */}
        {/* ========================================================= */}
        <Link
          href="/pants"
          className="group relative flex flex-col justify-end p-6 sm:p-10 md:p-12 lg:p-16 h-[50vh] md:h-full overflow-hidden cursor-pointer border-b md:border-b-0 md:border-r border-white/10"
        >
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-baggy-pants-v4.jpg"
              alt="ORVANO Luxury Baggy Pants"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={95}
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Harmonized Gradient Overlays so boots, pants and floor blend seamlessly */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-500 group-hover:opacity-85" />
            <div className="absolute inset-0 bg-radial from-[#D4AF37]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Subtle Vignette Borders */}
            <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.6)] pointer-events-none" />
          </div>

          {/* Left Content Area */}
          <div className="relative z-10 max-w-xl space-y-4">
            {/* Mini Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] sm:text-xs uppercase font-bold tracking-[0.25em] backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>COLLECTION 01 • STREETWEAR</span>
            </motion.div>

            {/* Main Category Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-2"
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-heading leading-none drop-shadow-2xl">
                BAGGY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8DC] to-[#AA771C]">PANTS</span>
              </h2>
              {/* Dynamic Gold Accent Bar */}
              <div className="w-12 h-[2.5px] bg-[#D4AF37] group-hover:w-24 group-hover:bg-[#F5D67B] transition-all duration-500 rounded-full" />
            </motion.div>

            {/* Short Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/85 text-sm sm:text-base font-light tracking-wide max-w-md drop-shadow-md"
            >
              Wear Confidence.
            </motion.p>

            {/* Premium CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-2"
            >
              <span className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-extrabold text-[11px] sm:text-xs uppercase tracking-[0.2em] shadow-[0_0_25px_rgba(212,175,55,0.35)] group-hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] group-hover:scale-105 transition-all duration-300">
                <span>SHOP BOTTOMS</span>
                <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </motion.div>
          </div>
        </Link>

        {/* ========================================================= */}
        {/* RIGHT PANEL: WATCHES                                     */}
        {/* ========================================================= */}
        <Link
          href="/watches"
          className="group relative flex flex-col justify-end p-6 sm:p-10 md:p-12 lg:p-16 h-[50vh] md:h-full overflow-hidden cursor-pointer"
        >
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-watches-v3.jpg"
              alt="ORVANO Luxury Timepieces"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={95}
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Harmonized Gradient Overlays matching Left Panel */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-500 group-hover:opacity-85" />
            <div className="absolute inset-0 bg-radial from-[#D4AF37]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Subtle Vignette Borders */}
            <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.6)] pointer-events-none" />
          </div>

          {/* Right Content Area */}
          <div className="relative z-10 max-w-xl space-y-4">
            {/* Mini Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] sm:text-xs uppercase font-bold tracking-[0.25em] backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>COLLECTION 02 • PRECISION HOROLOGY</span>
            </motion.div>

            {/* Main Category Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-2"
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-heading leading-none drop-shadow-2xl">
                TIMEPIECE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8DC] to-[#AA771C]">WATCHES</span>
              </h2>
              {/* Dynamic Gold Accent Bar */}
              <div className="w-12 h-[2.5px] bg-[#D4AF37] group-hover:w-24 group-hover:bg-[#F5D67B] transition-all duration-500 rounded-full" />
            </motion.div>

            {/* Short Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/85 text-sm sm:text-base font-light tracking-wide max-w-md drop-shadow-md"
            >
              Timeless, Yours.
            </motion.p>

            {/* Premium CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-2"
            >
              <span className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-extrabold text-[11px] sm:text-xs uppercase tracking-[0.2em] shadow-[0_0_25px_rgba(212,175,55,0.35)] group-hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] group-hover:scale-105 transition-all duration-300">
                <span>SHOP WATCHES</span>
                <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </motion.div>
          </div>
        </Link>

        {/* ========================================================= */}
        {/* CENTER LUXURY VERTICAL DIVIDER (Desktop Only)             */}
        {/* ========================================================= */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent" />
      </div>

      {/* ========================================================= */}
      {/* BOTTOM LUXURY TRUST FEATURES RIBBON                       */}
      {/* ========================================================= */}
      <div className="relative z-30 w-full border-t border-white/10 bg-black/85 backdrop-blur-md py-3.5 px-4 sm:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-0 md:divide-x md:divide-white/10 text-center items-center">
            
            {/* Feature 1 */}
            <div className="flex items-center gap-2.5 sm:gap-3 px-2 sm:px-4 text-left justify-start sm:justify-center">
              <Compass className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <div>
                <h3 className="text-[10px] sm:text-xs font-bold tracking-wider text-white uppercase mb-0.5">
                  PREMIUM COTTON
                </h3>
                <p className="text-[9px] text-white/50 font-light leading-tight">
                  480GSM Japanese weave
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-2.5 sm:gap-3 px-2 sm:px-4 text-left justify-start sm:justify-center">
              <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <div>
                <h3 className="text-[10px] sm:text-xs font-bold tracking-wider text-white uppercase mb-0.5">
                  SWISS CALIBER
                </h3>
                <p className="text-[9px] text-white/50 font-light leading-tight">
                  Precision horology
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-2.5 sm:gap-3 px-2 sm:px-4 text-left justify-start sm:justify-center">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <div>
                <h3 className="text-[10px] sm:text-xs font-bold tracking-wider text-white uppercase mb-0.5">
                  AUTHENTIC SEAL
                </h3>
                <p className="text-[9px] text-white/50 font-light leading-tight">
                  100% verified ORVANO
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-2.5 sm:gap-3 px-2 sm:px-4 text-left justify-start sm:justify-center">
              <Package className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <div>
                <h3 className="text-[10px] sm:text-xs font-bold tracking-wider text-white uppercase mb-0.5">
                  EXPRESS DISPATCH
                </h3>
                <p className="text-[9px] text-white/50 font-light leading-tight">
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
