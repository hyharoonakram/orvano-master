"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
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
            Privacy Policy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-xs tracking-widest uppercase"
          >
            Last Updated: October 2026
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
            <h2 className="text-2xl text-white border-b border-white/10 pb-4 mb-6">1. Information We Collect</h2>
            <p className="text-white/70 font-light leading-relaxed">
              At ORVANO, we collect information to provide better services to all our users. We collect information in the following ways: information you give us directly (such as when creating an account or making a purchase), and information we get from your use of our services (such as device information and log data).
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-white border-b border-white/10 pb-4 mb-6">2. How We Use Your Information</h2>
            <p className="text-white/70 font-light leading-relaxed">
              We use the information we collect from all of our services to provide, maintain, protect, and improve them, to develop new ones, and to protect ORVANO and our users. We also use this information to offer you tailored content – like giving you more relevant search results and ads.
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-white border-b border-white/10 pb-4 mb-6">3. Information Sharing</h2>
            <p className="text-white/70 font-light leading-relaxed">
              We do not share personal information with companies, organizations, and individuals outside of ORVANO unless one of the following circumstances applies: with your consent, for external processing, or for legal reasons. We take your privacy seriously and employ industry-standard security measures to protect your data.
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-white border-b border-white/10 pb-4 mb-6">4. Data Security</h2>
            <p className="text-white/70 font-light leading-relaxed">
              We work hard to protect ORVANO and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. In particular: we encrypt many of our services using SSL, we review our information collection, storage, and processing practices, and we restrict access to personal information to ORVANO employees.
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-white border-b border-white/10 pb-4 mb-6">5. Contact Us</h2>
            <p className="text-white/70 font-light leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at privacy@orvano.com or via our Contact Us page.
            </p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
