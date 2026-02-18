'use client';

import { useCurrency } from '@/contexts/currency-context';

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as any)}
      className='border rounded px-2 py-1 text-sm'
    >
      <option value='USD'>USD ($)</option>
      <option value='NGN'>NGN (₦)</option>
    </select>
  );
}
