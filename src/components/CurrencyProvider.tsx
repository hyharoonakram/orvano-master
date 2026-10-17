"use client";

import { useEffect } from 'react';
import { useCurrencyStore } from '@/store/currencyStore';

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const initializeCurrency = useCurrencyStore((state) => state.initializeCurrency);

  useEffect(() => {
    initializeCurrency();
  }, [initializeCurrency]);

  return <>{children}</>;
}
