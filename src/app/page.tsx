import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { 
  ShieldCheck, 
  Truck, 
  Lock, 
  Headphones, 
  ArrowRight
} from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryCards } from "@/components/home/CategoryCards";
import { PromoPopups } from "@/components/home/PromoPopups";
import { FeaturedPromoCards } from "@/components/home/FeaturedPromoCards";
import { LuxuryPackagingShowcase } from "@/components/home/LuxuryPackagingShowcase";
import { CustomerReviewsSlider } from "@/components/home/CustomerReviewsSlider";
import { getProducts, getStoreSettings } from "@/utils/supabase/queries";
import ReactDOM from "react-dom";

export const revalidate = 10; // High-performance edge cache: revalidates every 10 seconds

export default async function Home() {
  const products = await getProducts();
  const settings = await getStoreSettings();
  
  // Find the baggy pants product dynamically
  const baggyPantsProduct = products.find(
    (p) => 
      p.name.toLowerCase().includes("baggy") || 
      p.category.toLowerCase().includes("pants")
  );
  
  const pantsProductId = baggyPantsProduct?.id || "c8ca2563-0951-4e9e-9ad9-9f0b6f8e3e8e";
  const pantsImage = baggyPantsProduct?.image_url || "/images/pants.png";

  // Preload Hero LCP images into the initial streaming HTML head
  ReactDOM.preload("/images/hero-baggy-pants-v4.jpg", { as: "image", fetchPriority: "high" });
  ReactDOM.preload("/images/hero-watches-v3.jpg", { as: "image", fetchPriority: "high" });

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <PromoPopups initialPopups={settings?.popup_cards || []} />
      <Navbar />

      {/* 1. Hero Carousel Section */}
      <HeroSection pantsImage={pantsImage} pantsProductId={pantsProductId} initialSlides={settings?.hero_slides || []} />

      {/* 2. Featured Promo Spotlight Section (Pop-up Offers Showcase) */}
      <FeaturedPromoCards popups={settings?.popup_cards || []} />

      {/* 3. ORVANO Collection Section (Category Cards) */}
      <section className="py-24 bg-zinc-950/40 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-[#D4AF37] font-semibold tracking-[0.2em] text-xs uppercase mb-2">
                ORVANO COLLECTION
              </h2>
            </div>
            <Link 
              href="/shop" 
              className="text-white hover:text-[#D4AF37] tracking-widest uppercase text-[10px] sm:text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              VIEW ALL <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <CategoryCards initialProducts={products} />
        </div>
      </section>

      {/* 4. Luxury Signature Packaging Showcase (2 Sections: Watch & Pants) */}
      <LuxuryPackagingShowcase />

      {/* Customer Reviews Section */}
      <section className="py-24 bg-zinc-950/60 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#D4AF37] font-semibold tracking-[0.25em] text-xs uppercase block">
              VERIFIED FEEDBACK
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading text-white uppercase tracking-tight">
              What our customers says
            </h2>
            <div className="flex justify-center text-[#D4AF37] pt-2">
              {"★".repeat(5)}
            </div>
          </div>

          {/* Dedicated Responsive Reviews Slider */}
          <CustomerReviewsSlider />
        </div>
      </section>

      {/* Bottom Features Trust Ribbon */}
      <section className="border-t border-white/10 bg-black py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
            {/* Free Shipping */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4 text-[#D4AF37] bg-zinc-950">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="text-white font-bold tracking-widest text-xs uppercase mb-1">
                FREE SHIPPING
              </h4>
              <p className="text-white/60 text-[10px] sm:text-xs font-light">On all orders</p>
            </div>

            {/* Premium Quality */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4 text-[#D4AF37] bg-zinc-950">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-white font-bold tracking-widest text-xs uppercase mb-1">
                PREMIUM QUALITY
              </h4>
              <p className="text-white/60 text-[10px] sm:text-xs font-light">Crafted to last</p>
            </div>

            {/* Secure Payment */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4 text-[#D4AF37] bg-zinc-950">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-white font-bold tracking-widest text-xs uppercase mb-1">
                SECURE PAYMENT
              </h4>
              <p className="text-white/60 text-[10px] sm:text-xs font-light">100% Safe &amp; Secure</p>
            </div>

            {/* Customer Support */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4 text-[#D4AF37] bg-zinc-950">
                <Headphones className="w-5 h-5" />
              </div>
              <h4 className="text-white font-bold tracking-widest text-xs uppercase mb-1">
                24/7 SUPPORT
              </h4>
              <p className="text-white/60 text-[10px] sm:text-xs font-light">We&apos;re here to help</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
