import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Currency = {
  code: string;
  symbol: string;
  rate: number;
};

const API_KEY = 'c420d2d7cb5754112a15f4ea';
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/INR`;



// Common currency symbols mapping
const SYMBOLS: Record<string, string> = {
  USD: '$', INR: '₹', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', CAD: 'C$',
  CHF: 'Fr', CNY: '¥', HKD: 'HK$', NZD: 'NZ$', SGD: 'S$', BRL: 'R$',
  MXN: '$', RUB: '₽', ZAR: 'R', TRY: '₺', KRW: '₩',
};

interface CurrencyState {
  currency: Currency;
  availableCurrencies: Currency[];
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
  fetchRates: () => Promise<void>;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: { code: 'INR', symbol: '₹', rate: 1 },
      availableCurrencies: [{ code: 'INR', symbol: '₹', rate: 1 }],
      setCurrency: (currency) => set({ currency }),
      formatAmount: (amount) => {
        const { currency } = get();
        const converted = amount * (currency.rate || 1);
        return `${currency.symbol}${converted.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      },
      fetchRates: async () => {
        try {
          const response = await fetch(API_URL);
          const data = await response.json();
          if (data.result === 'success') {
            const rates = data.conversion_rates;

            const dynamicCurrencies: Currency[] = Object.keys(rates).map((code) => ({
              code,
              symbol: SYMBOLS[code] || code,
              rate: rates[code],
            })).sort((a, b) => a.code.localeCompare(b.code));

            const currentCurrency = get().currency;
            const liveRate = rates[currentCurrency.code] || currentCurrency.rate;

            set({
              availableCurrencies: dynamicCurrencies,
              currency: { ...currentCurrency, rate: liveRate }
            });
          }
        } catch (error) {
          console.error('Failed to fetch exchange rates:', error);
        }
      },
    }),
    {
      name: 'currency-storage',
    }
  )
);
