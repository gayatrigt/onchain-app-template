import { useEffect, useMemo } from "react";
import { getRecipient } from "src/actions/getRecipient";
import { ModeOfPayment } from "src/components/CurrencyInput";
import Navbar from "src/components/Navbar";
import NavbarCta from "src/components/NavbarCta";
import { useCurrencyStore } from "src/store/useCurrencyStore";

// Create a memoized formatter for INR
const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})




const ClaimPage = async (ctx: { params: { publicKey: string } }) => {
    const publicKey = ctx.params.publicKey;
    console.log("🚀 ~ ClaimPage ~ publicKey:", publicKey)
    const recipient = await getRecipient(publicKey);
    console.log("🚀 ~ ClaimPage ~ recipient:", recipient)

    if (!recipient) {
        return <div>Recipient not found</div>
    }

    const exchangeRates: Record<ModeOfPayment, number> = await fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=INR")
        .then(res => res.json());

    console.log("🚀 ~ ClaimPage ~ parseFloat(recipient.amount):", parseFloat(recipient.amount))
    const amountInInr = (parseFloat(recipient.amount) * exchangeRates.INR).toPrecision(2)
    console.log("🚀 ~ ClaimPage ~ amountInEth:", amountInInr)

    // Format the amount in INR
    const formattedAmountInr = inrFormatter.format(parseFloat(amountInInr));


    return (
        <div className="flex h-[100dvh] max-w-screen flex-col px-1 w-screen ">
            <Navbar />
            <section className="flex-1 flex items-center justify-center">
                <h2 className="text-6xl font-bold">{formattedAmountInr}</h2>
            </section>
            <section className="py-4 px-4">
                <button className='w-full bg-brand text-white py-3 rounded-lg font-medium tracking-wider hover:bg-brand/80 focus:bg-brand/80'>
                    Claim
                </button>
            </section>
        </div >
    );
};

export default ClaimPage;
