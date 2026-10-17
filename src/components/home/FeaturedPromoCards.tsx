"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Tag, ShieldCheck, Zap } from "lucide-react";

interface PopupCard {
  id: string;
  badge?: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
  enabled?: boolean;
}

export function FeaturedPromoCards({ popups = [] }: { popups: PopupCard[] }) {
  const activePopups = popups.filter((p) => p.enabled !== false && p.title);

  if (activePopups.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-[#050507] border-t border-b border-white/10 relative overflow-hidden">
      {/* Background Gold Ambient Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-extrabold tracking-[0.25em] uppercase shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>EXECUTIVE PROMO SPOTLIGHT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight leading-tight">
            Curated Limited Drops
          </h2>
          <p className="text-white/50 text-xs sm:text-sm font-light max-w-md mx-auto">
            Discover our featured flagship timepieces and high-fashion drops available for immediate dispatch.
          </p>
        </div>

        {/* Dynamic Showcase Grid */}
        <div className={`grid grid-cols-1 ${activePopups.length > 1 ? 'lg:grid-cols-2' : 'max-w-3xl mx-auto'} gap-8 lg:gap-12 items-stretch`}>
          {activePopups.map((popup, idx) => (
            <div
              key={popup.id || idx}
              className="bg-gradient-to-b from-[#101015] via-[#0A0A0E] to-[#060608] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-10 flex flex-col justify-between space-y-6 sm:space-y-8 shadow-[0_0_60px_rgba(212,175,55,0.15)] hover:border-[#D4AF37] hover:shadow-[0_0_80px_rgba(212,175,55,0.25)] transition-all duration-300 group relative overflow-hidden"
            >
              {/* Gold Shimmer Top Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_20px_#D4AF37]" />
              
              {/* Background Radial Glow inside Card */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.12)_0%,transparent_75%)] pointer-events-none" />

              <div className="space-y-6 relative z-10">
                {/* Header Tag Badge */}
                {popup.badge && (
                  <div className="w-fit flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-extrabold tracking-widest uppercase md:backdrop-blur-md">
                    <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{popup.badge}</span>
                  </div>
                )}

                {/* Floating Unboxed Product Showcase */}
                {popup.image && (
                  <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[240px] sm:max-h-[300px] flex items-center justify-center py-4 my-2">
                    {/* Radial Product Halo */}
                    <div className="absolute w-[220px] h-[220px] bg-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none group-hover:bg-[#D4AF37]/35 transition-all duration-500" />
                    
                    <div className="relative w-full h-full z-10 flex items-center justify-center">
                      <Image
                        src={popup.image}
                        alt={popup.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        quality={65}
                        className="object-contain filter drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                )}

                {/* Product Title & Details */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
                    {popup.title}
                  </h3>
                  <p className="text-white/75 font-light text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {popup.description}
                  </p>
                </div>

                {/* Feature Micro-Badges */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/60">
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Authentic Guarantee</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                    <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Immediate Dispatch</span>
                  </div>
                </div>
              </div>

              {/* Action CTA Button */}
              <div className="pt-4 relative z-10">
                <Link
                  href={popup.buttonLink || "/shop"}
                  className="w-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] hover:from-[#FFF3B0] hover:to-[#D4AF37] text-black font-extrabold text-xs sm:text-sm uppercase tracking-widest py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_4px_30px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_40px_rgba(212,175,55,0.6)] active:scale-95 group/btn"
                >
                  <span>{popup.buttonText || "EXPLORE PRODUCT"}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform stroke-[2.5]" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
