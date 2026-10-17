"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  glowColor?: string;
}

interface GlowTheme {
  glow: string;
  surrounding: string;
  baseBg: string;
}

function getGlowTheme(name: string, customColor?: string): GlowTheme {
  // If custom color is explicitly passed (from DB or Admin selection), ALWAYS use customColor directly!
  if (customColor && customColor.trim().length > 0) {
    const col = customColor.trim();

    let surrounding = "rgba(12, 26, 48, 0.92)";
    let baseBg = "#060d17";

    if (col.includes("175, 30") || col.includes("red")) {
      surrounding = "rgba(45, 8, 14, 0.92)";
      baseBg = "#120407";
    } else if (col.includes("16, 125") || col.includes("green")) {
      surrounding = "rgba(6, 35, 18, 0.92)";
      baseBg = "#031008";
    } else if (col.includes("195, 145") || col.includes("gold") || col.includes("amber")) {
      surrounding = "rgba(35, 25, 6, 0.92)";
      baseBg = "#100b02";
    } else if (col.includes("185, 80") || col.includes("pink") || col.includes("rose")) {
      surrounding = "rgba(38, 12, 20, 0.92)";
      baseBg = "#120509";
    } else if (col.includes("75, 85") || col.includes("black") || col.includes("slate")) {
      surrounding = "rgba(20, 22, 28, 0.92)";
      baseBg = "#090a0d";
    } else if (col.includes("130, 45") || col.includes("purple") || col.includes("violet")) {
      surrounding = "rgba(25, 8, 45, 0.92)";
      baseBg = "#0a0312";
    } else if (col.includes("14, 185") || col.includes("cyan") || col.includes("teal")) {
      surrounding = "rgba(5, 30, 35, 0.92)";
      baseBg = "#020f12";
    } else if (col.includes("225, 95") || col.includes("orange")) {
      surrounding = "rgba(35, 15, 5, 0.92)";
      baseBg = "#120802";
    }

    return {
      glow: col,
      surrounding,
      baseBg
    };
  }

  // Fallback to name matching ONLY if customColor is completely missing
  const lower = name.toLowerCase();

  const isRed = lower.includes("red") || lower.includes("ruby") || lower.includes("crimson") || lower.includes("burgundy") || lower.includes("maroon");
  if (isRed) {
    return {
      glow: "rgba(185, 25, 45, 0.75)",
      surrounding: "rgba(45, 8, 14, 0.92)",
      baseBg: "#120407"
    };
  }

  const isGreen = lower.includes("green") || lower.includes("emerald");
  if (isGreen) {
    return {
      glow: "rgba(16, 135, 75, 0.75)",
      surrounding: "rgba(6, 35, 18, 0.92)",
      baseBg: "#031008"
    };
  }

  const isGold = lower.includes("gold") || lower.includes("amber") || lower.includes("yellow") || lower.includes("bronze");
  if (isGold) {
    return {
      glow: "rgba(205, 155, 30, 0.75)",
      surrounding: "rgba(35, 25, 6, 0.92)",
      baseBg: "#100b02"
    };
  }

  const isRose = lower.includes("rose") || lower.includes("pink");
  if (isRose) {
    return {
      glow: "rgba(195, 75, 115, 0.75)",
      surrounding: "rgba(38, 12, 20, 0.92)",
      baseBg: "#120509"
    };
  }

  const isBlack = lower.includes("black") || lower.includes("onyx") || lower.includes("carbon");
  if (isBlack) {
    return {
      glow: "rgba(85, 95, 115, 0.70)",
      surrounding: "rgba(20, 22, 28, 0.92)",
      baseBg: "#090a0d"
    };
  }

  const isSilver = lower.includes("silver") || lower.includes("steel");
  if (isSilver) {
    return {
      glow: "rgba(60, 130, 190, 0.65)",
      surrounding: "rgba(12, 26, 42, 0.92)",
      baseBg: "#050d17"
    };
  }

  // Default Ocean Blue
  return {
    glow: "rgba(35, 95, 175, 0.70)",
    surrounding: "rgba(12, 26, 48, 0.92)",
    baseBg: "#060d17"
  };
}

export function ProductGallery({ images, productName, glowColor }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const theme = getGlowTheme(productName, glowColor);

  // Auto-slideshow timer (change image every 3 seconds)


  return (
    <div className="w-full lg:w-1/2 flex flex-col md:flex-row-reverse gap-6 self-start lg:sticky lg:top-28">
      {/* Hidden Preloader for all gallery images so switching is instant 0ms */}
      <div className="hidden aria-hidden pointer-events-none">
        {images.map((imgUrl, idx) => (
          <Image
            key={`preload-${idx}`}
            src={imgUrl}
            alt="preloader"
            width={800}
            height={800}
            priority
          />
        ))}
      </div>

      {/* Thumbnails (Hidden on mobile screens, visible on desktop) */}
      <div className="hidden md:flex md:flex-col gap-4 overflow-y-auto md:w-24 shrink-0 no-scrollbar">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`relative w-20 h-20 md:w-24 md:h-24 shrink-0 bg-white/5 backdrop-blur-xl border ${
              i === activeIndex ? "border-[#D4AF37]" : "border-white/10"
            } p-2 cursor-pointer flex items-center justify-center hover:border-white/30 transition-all duration-300 rounded-lg overflow-hidden`}
          >
            <Image
              src={img}
              alt={`${productName} thumbnail ${i + 1}`}
              fill
              sizes="96px"
              priority={i < 4}
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image Container (Only big single picture shown on mobile) */}
      <div 
        className="flex-1 aspect-square w-full backdrop-blur-xl border border-white/10 flex items-center justify-center relative group rounded-2xl overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] transition-colors duration-700"
        style={{ backgroundColor: theme.baseBg }}
      >
        {/* Dynamic / Atmospheric Radial Glow Background */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-700 ease-in-out"
          style={{
            background: `radial-gradient(circle at 50% 48%, rgba(255, 255, 255, 0.28) 0%, ${theme.glow} 36%, ${theme.surrounding} 72%, ${theme.baseBg} 100%)`
          }}
        />

        {/* Ambient lighting highlight */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070c15]/60 via-transparent to-transparent pointer-events-none z-10" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] z-10"
          >
            <Image
              src={images[activeIndex]}
              alt={productName}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover w-full h-full"
              priority
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>

        {/* Sleek Pagination Dots (Indicator for 3-second auto-slideshow) */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center items-center gap-2 pointer-events-auto">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === activeIndex 
                    ? "w-6 h-2 bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.9)]" 
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
