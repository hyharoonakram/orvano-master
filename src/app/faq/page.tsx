"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    category: "Orders & Shipping",
    items: [
      {
        question: "Do you ship internationally?",
        answer: "Yes, ORVANO offers complimentary insured shipping worldwide via our premium courier partners. All international shipments are fully tracked and require a signature upon delivery to ensure your luxury items arrive safely."
      },
      {
        question: "How long will my order take to arrive?",
        answer: "Domestic orders typically arrive within 2-3 business days. International deliveries take 5-7 business days depending on customs processing in your destination country. Bespoke orders and engraved timepieces require an additional 14 days."
      }
    ]
  },
  {
    category: "Returns & Warranty",
    items: [
      {
        question: "What is your return policy?",
        answer: "We offer a 14-day return window from the date of delivery. Items must be unworn, in flawless condition, and returned in their original packaging with all documentation. Due to hygiene and bespoke nature, custom-fitted garments cannot be returned."
      },
      {
        question: "Do your watches come with a warranty?",
        answer: "Every ORVANO timepiece is accompanied by a 5-year international warranty covering manufacturing defects. This warranty does not cover normal wear and tear, water damage beyond the stated depth rating, or unauthorized modifications."
      }
    ]
  },
  {
    category: "Product & Care",
    items: [
      {
        question: "How should I care for my ORVANO baggy pants?",
        answer: "To maintain the premium fabric and structural integrity, we recommend dry cleaning only. Do not tumble dry. Detailed care instructions are sewn into the inner seam of every garment."
      },
      {
        question: "Are the watches water-resistant?",
        answer: "Yes, our luxury chronographs are water-resistant up to 100 meters (10 ATM). However, we strongly advise against exposing leather straps to water to preserve their finish."
      }
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <main className="flex min-h-screen flex-col bg-background pt-20">
      <Navbar />

      {/* Page Header */}
      <section className="bg-background border-b border-foreground/5 py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-heading text-foreground mb-6 uppercase tracking-wider"
          >
            Client Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-foreground/60 max-w-2xl mx-auto tracking-wide mb-8"
          >
            Find answers to frequently asked questions about our products, shipping, and luxury services.
          </motion.p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="flex-1 container mx-auto px-6 py-24 max-w-4xl">
        <div className="space-y-16">
          {FAQS.map((section, sIdx) => (
            <div key={sIdx}>
              <h3 className="text-[#D4AF37] font-bold tracking-widest uppercase text-sm mb-8 border-b border-foreground/10 pb-4">
                {section.category}
              </h3>
              
              <div className="space-y-4">
                {section.items.map((item, iIdx) => {
                  const id = `${sIdx}-${iIdx}`;
                  const isOpen = openIndex === id;

                  return (
                    <div key={iIdx} className="bg-surface border border-foreground/5 overflow-hidden">
                      <button
                        onClick={() => toggleAccordion(id)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                      >
                        <span className="text-foreground font-medium tracking-wide pr-8">
                          {item.question}
                        </span>
                        <div className={`transition-colors duration-300 ${isOpen ? "text-[#D4AF37]" : "text-foreground/40"}`}>
                          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="px-6 pb-6 pt-2 text-foreground/60 font-light leading-relaxed">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
