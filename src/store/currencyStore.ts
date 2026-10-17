import { create } from 'zustand';

type CurrencyState = {
  currencyCode: string;
  currencySymbol: string;
  exchangeRate: number;
  rates: Record<string, number>;
  setCurrency: (code: string) => void;
  setRates: (rates: Record<string, number>) => void;
  initializeCurrency: () => Promise<void>;
  formatPrice: (price: number) => string;
};

export const useCurrencyStore = create<CurrencyState>()(
  (set, get) => ({
    currencyCode: 'PKR',
    currencySymbol: 'Rs ',
    exchangeRate: 1,
    rates: {},
    
    setCurrency: (code: string) => {
      // Disabled since currency is locked to PKR
    },

    setRates: (newRates: Record<string, number>) => {
      // Disabled
    },

    initializeCurrency: async () => {
      // Disabled: Currency is fully locked to PKR
    },

    formatPrice: (price: number) => {
      const { currencySymbol } = get();
      
      // Format with commas and 2 decimal places
      const formatted = price.toLocaleString('en-PK', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
      });
      
      return `${currencySymbol}${formatted}`;
    }
  })
);
