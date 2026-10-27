import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { RecommendedMarquee } from "@/components/product/RecommendedMarquee";
import { AnimatedPrice } from "@/components/product/AnimatedPrice";
import { ProductGallery } from "@/components/product/ProductGallery";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Truck, ShoppingCart, Banknote, Star } from "lucide-react";

import { getProductById, getProducts, getStoreSettings } from "@/utils/supabase/queries";
import { ProductClientActions } from "./ProductClientActions";

export const revalidate = 60; // Instant Edge/CDN cache for 60 seconds

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    return (
      <main className="flex min-h-screen flex-col bg-background pt-20">
        <Navbar />
        <section className="flex-1 flex flex-col items-center justify-center py-32 text-center">
          <h1 className="text-4xl font-heading text-foreground mb-6 uppercase">Product Not Found</h1>
          <Link href="/shop" className="text-[#D4AF37] border-b border-[#D4AF37] pb-1 uppercase tracking-widest text-sm font-bold">
            Return to Shop
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  // Fetch category & fallback products in parallel for blazing-fast loading
  const [categoryProducts, allProducts, storeSettings] = await Promise.all([
    getProducts(product.category),
    getProducts(),
    getStoreSettings(),
  ]);

  let whatsappNumber = (storeSettings?.whatsapp_number || "923000138707").replace(/[^0-9]/g, "");
  if (whatsappNumber.startsWith("0")) {
    whatsappNumber = "92" + whatsappNumber.slice(1);
  }
  if (!whatsappNumber) whatsappNumber = "923000138707";

  const relatedProducts = categoryProducts.filter((p) => p.id !== product.id);
  const allProductsFallback = relatedProducts.length > 0 ? relatedProducts : allProducts.filter((p) => p.id !== product.id);
  const viewers = 120 + (product.name.length % 50); // Dummy viewer count

  const getCategoryHref = (cat: string) => {
<<<<<<< HEAD
    const normalized = (cat || "").toLowerCase().trim();
    if (normalized === "pants" || normalized.includes("baggy") || normalized.includes("bottom")) return "/pants";
    if (normalized.includes("watch")) return "/watches";
    if (normalized === "top" || normalized.includes("shirt")) return "/shop?category=TOP";
    if (normalized === "shoes" || normalized.includes("shoe")) return "/shop?category=SHOES";
=======
>>>>>>> 7831bb0cf53aa95ee2ddfae316e653727c4774c4
    return `/shop?category=${encodeURIComponent(cat)}`;
  };

  return (
    <main className="flex min-h-screen flex-col bg-background pt-20">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="bg-background border-b border-foreground/5 py-6">
        <div className="container mx-auto px-6 flex items-center text-xs uppercase tracking-widest font-medium text-foreground/50">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 mx-2" />
          <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3 mx-2" />
          <Link href={getCategoryHref(product.category)} className="hover:text-foreground transition-colors">{product.category}</Link>
          <ChevronRight className="w-3 h-3 mx-2" />
          <span className="text-[#D4AF37] line-clamp-1">{product.name}</span>
        </div>
      </div>

      <section className="container mx-auto px-6 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Column: Image Gallery */}
          <ProductGallery 
            images={product.images && product.images.length > 0 ? product.images : [product.image_url || "/images/watch.png"]} 
            productName={product.name} 
            glowColor={(product as any).glow_color || (product as any).glowColor} 
          />

          {/* Right Column: Product Details */}
          <div className="lg:w-1/2 flex flex-col">
            {/* Top Badge */}
            <div className="mb-4">
              <span className="bg-[#D4AF37] text-black px-2 py-1 text-xs font-bold uppercase tracking-widest rounded-sm">
                -20% OFF
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-heading text-foreground mb-4 uppercase tracking-wide leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Social Proof */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="flex text-[#D4AF37]">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="text-foreground/90 font-bold text-sm tracking-wide">4.8</span>
              <span className="text-foreground/50 text-xs tracking-wide">({1200 + (product.name.length * 17 % 500)} reviews)</span>
              <span className="text-foreground/30">•</span>
              <span className="text-[#D4AF37] font-semibold text-xs tracking-wide">5,800+ sold</span>
            </div>

            {/* Trust Badges Row (Ref 2nd Image) */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold tracking-wide">
                ✓ Verified Seller
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-semibold tracking-wide">
                🏬 Registered Brand
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-semibold tracking-wide">
                💰 Cash on Delivery
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-semibold tracking-wide">
                ⭐ 100% Authentic
              </span>
            </div>

            {/* Price */}
            <AnimatedPrice originalPrice={product.original_price || product.price * 1.2} salePrice={product.price} />

            {/* Live Viewers Banner */}
            <div className="flex items-center text-xs text-foreground/60 bg-surface border border-foreground/10 px-4 py-2 w-fit mb-6 rounded-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div> 
              <span className="font-medium tracking-wide">{viewers} people are viewing this right now</span>
            </div>

            {/* Sale Banner */}
            <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#0A0A0A] border border-[#D4AF37]/30 py-3 text-center text-[#D4AF37] text-sm tracking-[0.2em] uppercase font-bold mb-8 rounded-sm flex items-center justify-center">
              <span className="mr-2">✨</span> SALE • UP TO 30% OFF <span className="ml-2">✨</span>
            </div>

            {/* High-Converting Delivery & Policy Box (Ref 2nd Image) */}
            <div className="rounded-xl border border-[#D4AF37]/30 bg-gradient-to-b from-[#141416]/90 to-[#0A0A0C]/90 p-4 sm:p-5 mb-8 space-y-3.5 shadow-xl">
              <div className="flex items-start gap-3">
                <span className="text-base">💰</span>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white tracking-wide">
                    Cash on Delivery <span className="text-white/60 font-normal">— No Advance Payment</span>
                  </p>
                </div>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-start gap-3">
                <span className="text-base">🚚</span>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white tracking-wide">
                    Free Delivery <span className="text-white/60 font-normal">— Express Courier Across Pakistan</span>
                  </p>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=Hi%2C%20I%20want%20to%20order%20or%20pay%20via%20JazzCash%2FEasyPaisa`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold underline mt-0.5 transition-colors"
                  >
                    <span>JazzCash / EasyPaisa par WhatsApp Karen</span>
                  </a>
                </div>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-start gap-3">
                <span className="text-base">📦</span>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white tracking-wide">
                    Delivery Time <span className="text-white/60 font-normal">— 2-4 Working Days</span>
                  </p>
                </div>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-start gap-3">
                <span className="text-base">🔄</span>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white tracking-wide">
                    Exchange Policy <span className="text-white/60 font-normal">— 7 Days (Easy Exchange)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-foreground/70 leading-relaxed font-light text-sm mb-10">
              {product.description}
            </p>

            {/* Actions (Client Component) */}
            <ProductClientActions product={product} />

            {/* Trust Badges */}
            <div className="border-t border-foreground/10 pt-8 space-y-4">
              <div className="flex items-center text-foreground/60">
                <ShieldCheck className="w-4 h-4 mr-4 text-[#D4AF37]" />
                <span className="text-xs uppercase tracking-widest font-medium">5-Year International Warranty</span>
              </div>
              <div className="flex items-center text-foreground/60">
                <Truck className="w-4 h-4 mr-4 text-[#D4AF37]" />
                <span className="text-xs uppercase tracking-widest font-medium">Complimentary Insured Shipping</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="bg-background border-t border-foreground/5 py-24 overflow-hidden">
        <div className="container mx-auto px-6 mb-16 text-center">
          <h2 className="text-[#D4AF37] font-bold tracking-[0.2em] text-sm uppercase mb-2">Curated For You</h2>
          <h3 className="text-3xl md:text-4xl font-heading text-foreground">You May Also Like</h3>
        </div>

        <RecommendedMarquee products={relatedProducts.length > 0 ? relatedProducts : allProductsFallback} />
      </section>

      <Footer />
    </main>
  );
}
