export interface FxRates {
  USD: number;
  NGN: number;
}

// fallback if API fails
const FALLBACK_RATES: FxRates = {
  USD: 1,
  NGN: 1500, // realistic baseline
};

let cachedRates: FxRates | null = null;
let lastFetch = 0;

export async function getFxRates(): Promise<FxRates> {
  const now = Date.now();

  // cache for 1 hour
  if (cachedRates && now - lastFetch < 1000 * 60 * 60) {
    return cachedRates;
  }

  try {
    const res = await fetch(
      'https://api.exchangerate.host/latest?base=USD&symbols=USD,NGN'
    );

    const data = await res.json();

    cachedRates = {
      USD: 1,
      NGN: data.rates.NGN,
    };

    lastFetch = now;
    return cachedRates;
  } catch {
    return FALLBACK_RATES;
  }
}
