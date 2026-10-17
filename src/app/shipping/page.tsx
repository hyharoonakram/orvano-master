"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Truck, RotateCcw, Clock, ShieldCheck } from "lucide-react";

export default function ShippingReturnsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-background border-b border-foreground/5 py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-heading text-foreground mb-6 uppercase tracking-wider"
          >
            Shipping & Returns
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-foreground/60 max-w-2xl mx-auto tracking-wide text-lg"
          >
            Everything you need to know about getting your ORVANO pieces and our uncompromising return policy.
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-4xl space-y-16">
          
          {/* Shipping Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-start"
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Truck className="w-8 h-8 text-[#D4AF37]" />
                <h2 className="text-3xl font-heading uppercase tracking-wide">Shipping Policy</h2>
              </div>
              <p className="text-foreground/70 leading-relaxed font-light mb-6">
                We offer premium shipping worldwide. All our timepieces and garments are carefully packaged in our signature ORVANO premium boxes to ensure they arrive in immaculate condition.
              </p>
              <ul className="space-y-4 text-foreground/70 font-light">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                  <span><strong>Domestic Shipping:</strong> 2-4 business days (Complimentary)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                  <span><strong>International Express:</strong> 4-7 business days (Calculated at checkout)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                  <span>All shipments are fully insured and require a direct signature upon delivery.</span>
                </li>
              </ul>
            </div>
            <div className="bg-surface border border-foreground/5 p-8 rounded-sm">
              <Clock className="w-6 h-6 text-[#D4AF37] mb-4" />
              <h3 className="text-lg font-bold tracking-widest uppercase mb-2">Order Processing</h3>
              <p className="text-foreground/60 font-light text-sm leading-relaxed">
                Orders are processed within 24-48 hours. Orders placed on weekends or holidays will be processed the following business day. You will receive a tracking link via email once your order has been dispatched.
              </p>
            </div>
          </motion.div>

          <hr className="border-foreground/5" />

          {/* Returns Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-start"
          >
            <div className="md:order-2">
              <div className="flex items-center gap-4 mb-6">
                <RotateCcw className="w-8 h-8 text-[#D4AF37]" />
                <h2 className="text-3xl font-heading uppercase tracking-wide">Returns & Exchanges</h2>
              </div>
              <p className="text-foreground/70 leading-relaxed font-light mb-6">
                We hold our products to the highest standards. If you are not entirely satisfied with your purchase, we offer a 14-day return window from the date of delivery for a full refund or exchange.
              </p>
              <ul className="space-y-4 text-foreground/70 font-light">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                  <span>Items must be unworn, unwashed, and in their original packaging with all tags attached.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                  <span>Watches must retain their protective seals and show no signs of wear on the strap or casing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                  <span>Return shipping costs are the responsibility of the customer unless the item arrived damaged or defective.</span>
                </li>
              </ul>
            </div>
            <div className="bg-surface border border-foreground/5 p-8 rounded-sm md:order-1">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37] mb-4" />
              <h3 className="text-lg font-bold tracking-widest uppercase mb-2">How to Return</h3>
              <p className="text-foreground/60 font-light text-sm leading-relaxed mb-4">
                To initiate a return, please contact our support team at <strong>support@orvano.com</strong> with your order number. We will provide you with a Return Authorization (RA) number and detailed shipping instructions.
              </p>
              <p className="text-foreground/60 font-light text-sm leading-relaxed">
                Refunds are processed to the original payment method within 5-7 business days after we receive and inspect the returned item.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
