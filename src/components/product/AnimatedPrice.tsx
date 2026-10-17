"use client";

import { useEffect, useState } from "react";
import { useCurrencyStore } from "@/store/currencyStore";

interface AnimatedPriceProps {
  originalPrice: number;
  salePrice: number;
}

export function AnimatedPrice({ originalPrice, salePrice }: AnimatedPriceProps) {
  const [mounted, setMounted] = useState(false);
  const formatPrice = useCurrencyStore((state) => state.formatPrice);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formattedOriginal = mounted 
    ? formatPrice(originalPrice) 
    : `Rs ${originalPrice.toLocaleString('en-PK', { minimumFractionDigits: 0 })}`;
    
  const formattedSale = mounted 
    ? formatPrice(salePrice) 
    : `Rs ${salePrice.toLocaleString('en-PK', { minimumFractionDigits: 0 })}`;

  const savingsAmount = originalPrice > salePrice ? originalPrice - salePrice : 0;

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4 min-h-[44px]">
      <div className="flex items-center gap-3">
        {/* Sale Price */}
        <div className="text-2xl sm:text-3xl text-[#D4AF37] font-extrabold tracking-wide drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          {formattedSale}
        </div>

        {/* Strikethrough Original Price */}
        {originalPrice > salePrice && (
          <div className="text-white/40 font-bold text-lg sm:text-xl line-through decoration-red-500/80 decoration-2">
            {formattedOriginal}
          </div>
        )}
      </div>

      {/* Discount Savings Tag */}
      {savingsAmount > 0 && (
        <span className="text-[10px] uppercase font-extrabold tracking-widest bg-red-500/15 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full">
          Save {mounted ? formatPrice(savingsAmount) : `Rs ${savingsAmount.toLocaleString('en-PK')}`}
        </span>
      )}
    </div>
  );
}


