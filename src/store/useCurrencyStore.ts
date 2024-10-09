import { create } from 'zustand'

interface CurrencyStore {
    currencyAmount: string
    exchangeRates: number
    setCurrencyAmount: (amount: string) => void
    setExchangeRates: (rates: number) => void
}

export const useCurrencyStore = create<CurrencyStore>((set) => ({
    currencyAmount: '1000',
    exchangeRates: 0,
    setCurrencyAmount: (amount) => set({ currencyAmount: amount }),
    setExchangeRates: (rates) => set({ exchangeRates: rates }),
}))