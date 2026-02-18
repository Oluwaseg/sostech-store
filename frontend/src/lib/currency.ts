export type SupportedCurrency = 'USD' | 'NGN';

export const CURRENCY_CONFIG: Record<
  SupportedCurrency,
  {
    locale: string;
    symbol: string;
  }
> = {
  USD: {
    locale: 'en-US',
    symbol: '$',
  },
  NGN: {
    locale: 'en-NG',
    symbol: '₦',
  },
};

export const DEFAULT_CURRENCY: SupportedCurrency = 'USD';
