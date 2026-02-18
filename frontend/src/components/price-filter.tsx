'use client';

import { useCurrency } from '@/contexts/currency-context';
import { formatPriceRange } from '@/lib/format-price';

interface PriceFilterProps {
  min: number; // USD (base currency)
  max: number; // USD (base currency)
}

export function PriceFilter({ min, max }: PriceFilterProps) {
  const { currency, convert } = useCurrency();

  return (
    <div className='space-y-2'>
      <h4 className='text-sm font-semibold'>Price range</h4>

      <div className='text-sm text-foreground/70'>
        {formatPriceRange(convert(min), convert(max), currency)}
      </div>

      {/* slider / inputs go here later */}
    </div>
  );
}
