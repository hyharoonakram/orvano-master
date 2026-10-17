"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-black pt-20">
      <Navbar />

      {/* Page Header */}
      <section className="bg-[#050505] border-b border-white/5 py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading text-white uppercase tracking-widest mb-4"
          >
            Terms of Service
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-xs tracking-widest uppercase"
          >
            Effective Date: October 2026
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 py-16 md:py-24 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-widest prose-a:text-[#D4AF37] max-w-none space-y-12"
        >
          <div>
            <h2 className="text-2xl text-white border-b border-white/10 pb-4 mb-6">1. Agreement to Terms</h2>
            <p className="text-white/70 font-light leading-relaxed">
              By accessing our website at ORVANO, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-white border-b border-white/10 pb-4 mb-6">2. Use License</h2>
            <p className="text-white/70 font-light leading-relaxed">
              Permission is granted to temporarily download one copy of the materials (information or software) on ORVANO&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose, or for any public display (commercial or non-commercial).
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-white border-b border-white/10 pb-4 mb-6">3. Disclaimer</h2>
            <p className="text-white/70 font-light leading-relaxed">
              The materials on ORVANO&apos;s website are provided on an &apos;as is&apos; basis. ORVANO makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-white border-b border-white/10 pb-4 mb-6">4. Limitations</h2>
            <p className="text-white/70 font-light leading-relaxed">
              In no event shall ORVANO or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ORVANO&apos;s website, even if ORVANO or an ORVANO authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-white border-b border-white/10 pb-4 mb-6">5. Revisions and Errata</h2>
            <p className="text-white/70 font-light leading-relaxed">
              The materials appearing on ORVANO&apos;s website could include technical, typographical, or photographic errors. ORVANO does not warrant that any of the materials on its website are accurate, complete or current. ORVANO may make changes to the materials contained on its website at any time without notice.
            </p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
