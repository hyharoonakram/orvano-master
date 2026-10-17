"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TESTIMONIALS = [
  {
    text: "The Obsidian Chronograph completely transformed my wardrobe. It's rare to find a brand that understands both high-end horology and the raw energy of streetwear.",
    author: "Marcus T.",
    role: "Verified Client"
  },
  {
    text: "I was skeptical about pairing luxury watches with baggy cargo pants, but ORVANO nailed the aesthetic. The quality is uncompromising and the silhouette is perfect.",
    author: "Sarah J.",
    role: "Fashion Editor"
  },
  {
    text: "Finally, a brand that doesn't make me choose between my love for mechanical watches and my personal street style. Exceptional craftsmanship.",
    author: "David L.",
    role: "Verified Client"
  }
];

export function TestimonialCarousel() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="max-w-4xl mx-auto min-h-[250px] flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTestimonial}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <div className="text-[#D4AF37]/20 text-8xl font-serif absolute -top-8 -left-4 md:left-8 pointer-events-none">"</div>
            
            <p className="text-foreground/90 text-2xl md:text-3xl font-light italic leading-relaxed mb-8 px-8">
              {TESTIMONIALS[activeTestimonial].text}
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-surface border border-[#D4AF37]/30 rounded-full flex items-center justify-center">
                <span className="text-[#D4AF37] font-bold tracking-widest">{TESTIMONIALS[activeTestimonial].author.charAt(0)}</span>
              </div>
              <div className="text-left">
                <p className="text-foreground font-bold tracking-widest uppercase text-sm">{TESTIMONIALS[activeTestimonial].author}</p>
                <p className="text-[#D4AF37] text-xs uppercase tracking-widest">{TESTIMONIALS[activeTestimonial].role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center items-center space-x-3 mt-16">
        {TESTIMONIALS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTestimonial(idx)}
            className={`w-12 h-1 transition-colors duration-300 ${activeTestimonial === idx ? "bg-[#D4AF37]" : "bg-foreground/20 hover:bg-foreground/40"}`}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div>
    </>
  );
}
