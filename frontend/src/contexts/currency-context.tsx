'use client';

import { DEFAULT_CURRENCY, type SupportedCurrency } from '@/lib/currency';
import { getFxRates } from '@/lib/fx';
import { createContext, useContext, useEffect, useState } from 'react';

interface CurrencyContextValue {
  currency: SupportedCurrency;
  setCurrency: (c: SupportedCurrency) => void;
  convert: (usdAmount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<SupportedCurrency>(DEFAULT_CURRENCY);
  const [rates, setRates] = useState<{ USD: number; NGN: number }>({
    USD: 1,
    NGN: 1,
  });

  // 🌍 auto-detect location
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (tz.includes('Africa')) {
      setCurrency('NGN');
    } else {
      setCurrency('USD');
    }
  }, []);

  // 💱 load FX rates
  useEffect(() => {
    getFxRates().then(setRates);
  }, []);

  const convert = (usdAmount: number) => {
    return usdAmount * rates[currency];
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used inside CurrencyProvider');
  }
  return ctx;
}
