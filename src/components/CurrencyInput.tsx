"use client";
import React, { useEffect, useState } from 'react'
import CurrencyInput from 'react-currency-input-field';
import { useCurrencyStore } from 'src/store/useCurrencyStore';

type ModeOfPayment = "ETH" | "INR"

const CurrencyInputSection = () => {
    // const [currencyAmount, setCurrencyAmount] = useState<string>('100')
    // const [exchangeRates, setExchangeRates] = useState<number>(0)

    const { currencyAmount, setCurrencyAmount, exchangeRates, setExchangeRates } = useCurrencyStore()

    const getExchangeRates = async () => {
        // get usd to eth rate
        const data: Record<ModeOfPayment, number> = await fetch("https://min-api.cryptocompare.com/data/price?fsym=INR&tsyms=ETH")
            .then(res => res.json());

        setExchangeRates(data.ETH)
    }

    useEffect(() => {
        getExchangeRates()
    }, [])

    const amountInEth = parseFloat(currencyAmount) * exchangeRates

    return (
        <section className='flex-1 flex items-center justify-center px-4'>
            <div className='flex flex-col text-center w-screen'>
                <CurrencyInput
                    id="currency-input"
                    name="currency-input"
                    placeholder="Enter amount"
                    defaultValue={currencyAmount}
                    decimalsLimit={2}
                    onValueChange={(value) => setCurrencyAmount(value || '')}
                    prefix="₹"
                    groupSeparator=","
                    decimalSeparator="."
                    className='text-5xl text-center focus:outline-none font-semibold'
                />
                {currencyAmount && <div className='mt-2 font-bold text-base text-slate-400'>~ {amountInEth.toFixed(3)} ETH</div>}
            </div>
        </section>
    )
}

export default CurrencyInputSection;