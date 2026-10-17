"use client";

import { useCurrencyStore } from "@/store/currencyStore";
import { useEffect, useState } from "react";

export function PriceFormatter({ value }: { value: number }) {
  const formatPrice = useCurrencyStore((state) => state.formatPrice);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <span>Rs {value.toLocaleString('en-PK', { minimumFractionDigits: 0 })}</span>;
  }
  
  return <span>{formatPrice(value)}</span>;
}
