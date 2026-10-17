"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    name: "Shahzaib K.",
    tag: "Verified Buyer",
    rating: 5,
    text: "The quality of the chronograph watch exceeded all my expectations. The luxury box presentation and finish are top-tier.",
  },
  {
    id: 2,
    name: "Ameer Hamza",
    tag: "Verified Buyer",
    rating: 5,
    text: "Orvano baggy pants are hands down the most comfortable and stylish pants I own. The fit is perfect and shipping was super fast.",
  },
  {
    id: 3,
    name: "Zainab M.",
    tag: "Verified Buyer",
    rating: 5,
    text: "10/10 experience. The WhatsApp support team answered my questions immediately and the delivery arrived in 2 days.",
  },
];

export function CustomerReviewsSlider() {
  const [mobileIndex, setMobileIndex] = useState(0);

  const handleNext = () => {
    setMobileIndex((prev) => (prev + 1) % REVIEWS.length);
  };

  const handlePrev = () => {
    setMobileIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Mobile Slider (100% Full Width Per Slide, 0 Cut-Off) */}
      <div className="block md:hidden relative w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={mobileIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full bg-zinc-900/90 border border-[#D4AF37]/30 p-6 rounded-2xl flex flex-col justify-between shadow-2xl space-y-6"
          >
            <div>
              <div className="flex text-[#D4AF37] gap-1 mb-3">
                {Array.from({ length: REVIEWS[mobileIndex].rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>
              <p className="text-white/85 font-light text-sm leading-relaxed italic">
                &ldquo;{REVIEWS[mobileIndex].text}&rdquo;
              </p>
            </div>

            <div className="border-t border-white/10 pt-4 flex items-center justify-between">
              <span className="text-white font-bold text-xs uppercase tracking-widest">
                {REVIEWS[mobileIndex].name}
              </span>
              <span className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2.5 py-1 rounded-full">
                {REVIEWS[mobileIndex].tag}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mobile Navigation Controls & Dots */}
        <div className="flex items-center justify-between pt-4 px-2">
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-full bg-zinc-900 border border-white/20 text-white/80 hover:text-white flex items-center justify-center active:scale-95 transition-all shadow-md"
            aria-label="Previous Review"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {REVIEWS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setMobileIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === mobileIndex ? "w-6 bg-[#D4AF37]" : "w-2 bg-white/20"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-full bg-zinc-900 border border-white/20 text-white/80 hover:text-white flex items-center justify-center active:scale-95 transition-all shadow-md"
            aria-label="Next Review"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Desktop Grid Layout */}
      <div className="hidden md:grid grid-cols-3 gap-8">
        {REVIEWS.map((review) => (
          <div
            key={review.id}
            className="bg-zinc-900/80 border border-white/10 p-8 rounded-2xl flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all duration-300 shadow-xl"
          >
            <div>
              <div className="flex text-[#D4AF37] gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>
              <p className="text-white/80 font-light text-sm leading-relaxed mb-6 italic">
                &ldquo;{review.text}&rdquo;
              </p>
            </div>
            <div className="border-t border-white/10 pt-4 flex items-center justify-between">
              <span className="text-white font-bold text-xs uppercase tracking-widest">{review.name}</span>
              <span className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2.5 py-1 rounded-full">
                {review.tag}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
