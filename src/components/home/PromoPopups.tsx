"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Sparkles, ArrowRight, Tag } from "lucide-react";

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

interface PromoPopupsProps {
  initialPopups?: PopupCard[];
}

export function PromoPopups({ initialPopups = [] }: PromoPopupsProps) {
  const activePopups = initialPopups.filter((p) => p.enabled !== false && p.title);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Open popup smoothly on user scroll or natural delay, without blocking initial page paint
  useEffect(() => {
    if (activePopups.length === 0) return;

    // Check if dismissed in this session
    const hasSeen = typeof window !== "undefined" && sessionStorage.getItem("orvano_promo_seen");
    if (hasSeen) return;

    let timeoutId: NodeJS.Timeout;

    const handleUserInteraction = () => {
      setIsOpen(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("orvano_promo_seen", "true");
      }
      window.removeEventListener("scroll", handleUserInteraction);
    };

    // Trigger on scroll or after 4.5 seconds
    window.addEventListener("scroll", handleUserInteraction, { passive: true, once: true });
    timeoutId = setTimeout(() => {
      setIsOpen(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("orvano_promo_seen", "true");
      }
    }, 4500);

    return () => {
      window.removeEventListener("scroll", handleUserInteraction);
      clearTimeout(timeoutId);
    };
  }, [activePopups.length]);

  // Auto slide if 2 popups are active
  useEffect(() => {
    if (!isOpen || activePopups.length <= 1) return;
    const autoSlide = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activePopups.length);
    }, 5000); // 5 seconds per popup card
    return () => clearInterval(autoSlide);
  }, [isOpen, activePopups.length]);

  if (activePopups.length === 0) return null;

  const currentPopup = activePopups[currentIndex] || activePopups[0];

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activePopups.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activePopups.length) % activePopups.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/85 backdrop-blur-xl">
          {/* Click backdrop to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
            onClick={handleClose}
          />

          {/* Main Popup Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 20,
              mass: 0.9
            }}
            className="relative w-full max-w-xl md:max-w-3xl lg:max-w-4xl bg-[#09090B] border border-[#D4AF37]/50 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.35)] z-10 flex flex-col group"
          >
            {/* Ambient Gold Top Border Line & Glow */}
            <div className="h-2 w-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] shadow-[0_0_20px_#D4AF37]" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/80 border border-white/20 hover:border-[#D4AF37] text-white/70 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-md shadow-xl"
              aria-label="Close Promo Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content Body Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden">
              {/* Product Image Section (If Available) */}
              {currentPopup.image ? (
                <div className="md:col-span-5 relative min-h-[250px] md:min-h-[380px] lg:min-h-[420px] bg-gradient-to-br from-[#141418] via-[#0A0A0C] to-black flex items-center justify-center p-6 sm:p-8 border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
                  {/* Radial Spotlight Effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.28)_0%,transparent_75%)]" />

                  {/* Floating Product Image with Motion */}
                  <motion.div
                    key={currentPopup.id || currentIndex}
                    initial={{ opacity: 0, scale: 0.8, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full aspect-square max-w-[220px] md:max-w-[280px] lg:max-w-[320px] z-10"
                  >
                    <Image
                      src={currentPopup.image}
                      alt={currentPopup.title}
                      fill
                      sizes="(max-width: 768px) 250px, (max-width: 1200px) 400px, 500px"
                      className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] filter transition-transform duration-700 hover:scale-110"
                    />
                  </motion.div>
                </div>
              ) : null}

              {/* Text & Call to Action Details */}
              <div className={`${currentPopup.image ? 'md:col-span-7' : 'md:col-span-12'} p-6 sm:p-8 lg:p-12 flex flex-col justify-between space-y-6`}>
                <div className="space-y-4">
                  {/* Badge */}
                  {currentPopup.badge && (
                    <div className="w-fit flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37]/25 to-[#D4AF37]/5 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-extrabold tracking-widest uppercase shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{currentPopup.badge}</span>
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/95 to-[#D4AF37] leading-tight">
                    {currentPopup.title}
                  </h2>

                  {/* Description */}
                  <p className="text-white/80 text-xs sm:text-sm lg:text-base leading-relaxed font-light">
                    {currentPopup.description}
                  </p>
                </div>

                {/* Actions & Buttons */}
                <div className="pt-4 space-y-3.5">
                  <Link
                    href={currentPopup.buttonLink || "/shop"}
                    onClick={handleClose}
                    className="w-full bg-gradient-to-r from-[#D4AF37] via-[#F5D67B] to-[#D4AF37] hover:from-[#F5D67B] hover:to-[#D4AF37] text-black font-extrabold text-xs sm:text-sm uppercase tracking-widest py-4 sm:py-4.5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_4px_30px_rgba(212,175,55,0.45)] hover:shadow-[0_6px_35px_rgba(212,175,55,0.65)] active:scale-95 group/btn"
                  >
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                    <span>{currentPopup.buttonText || "CLAIM THIS OFFER"}</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1.5 transition-transform" />
                  </Link>

                  <button
                    onClick={handleClose}
                    className="w-full text-xs font-semibold uppercase tracking-wider text-white/40 hover:text-white/80 transition-colors py-1.5 text-center"
                  >
                    No Thanks, Continue Browsing
                  </button>
                </div>
              </div>
            </div>

            {/* Multi Popup Carousel Controls Footer (If 2 Popups exist) */}
            {activePopups.length > 1 && (
              <div className="px-6 sm:px-8 py-3.5 bg-[#050507] border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {activePopups.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        idx === currentIndex ? "w-10 bg-[#D4AF37] shadow-[0_0_12px_#D4AF37]" : "w-2.5 bg-white/20 hover:bg-white/40"
                      }`}
                      aria-label={`Go to popup ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-white/50 mr-2">
                    0{currentIndex + 1} / 0{activePopups.length}
                  </span>
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-xl bg-white/5 hover:bg-[#D4AF37]/20 text-white/70 hover:text-[#D4AF37] border border-white/10 hover:border-[#D4AF37]/40 transition-all"
                    aria-label="Previous Popup"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-xl bg-white/5 hover:bg-[#D4AF37]/20 text-white/70 hover:text-[#D4AF37] border border-white/10 hover:border-[#D4AF37]/40 transition-all"
                    aria-label="Next Popup"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
