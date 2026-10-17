import { ProductCard } from "@/components/product/ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  original_price?: number;
  image?: string;
  image_url?: string;
  category?: string;
  description?: string;
}

export function RecommendedMarquee({ products }: { products: any[] }) {
  if (!products || products.length === 0) return null;

  // Duplicate products for CSS infinite marquee loop
  const duplicatedProducts = [...products, ...products];

  return (
    <div className="w-full relative">
      {/* 1. Mobile Touch Carousel: Native, zero-CPU touch scroll with snap points */}
      <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-4 px-6 no-scrollbar pb-4">
        {products.map((product, idx) => (
          <div key={`${product.id}-mobile-${idx}`} className="w-[240px] shrink-0 snap-start">
            <ProductCard {...product} priority={idx < 2} />
          </div>
        ))}
      </div>

      {/* 2. Desktop CSS Hardware-Accelerated Continuous Marquee */}
      <div className="hidden md:block w-full overflow-hidden relative">
        {/* Gradient masks for fading edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-css gap-8 px-4">
          {duplicatedProducts.map((product, idx) => (
            <div key={`${product.id}-desk-${idx}`} className="w-[280px] shrink-0">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

