import { CURRENCY_CONFIG, type SupportedCurrency } from './currency';

export function formatPrice(
  amount: number,
  currency: SupportedCurrency
): string {
  const { locale } = CURRENCY_CONFIG[currency];

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatPriceRange(
  min: number,
  max: number,
  currency: SupportedCurrency
): string {
  return `${formatPrice(min, currency)} – ${formatPrice(max, currency)}`;
}
