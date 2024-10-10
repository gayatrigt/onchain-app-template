import { Gift } from "lucide-react";
import ClaimButton from "src/components/ClaimButton";
import { ModeOfPayment } from "src/components/CurrencyInput";
import Navbar from "src/components/Navbar";
import { getInviteFromContract } from "src/lib/contract/getInviteFromContract";
import { formatEther } from "viem";

// Create a memoized formatter for INR
const inrFormatter = new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const ClaimPage = async (ctx: {
    params: { tokenId: string },
    searchParams: { key: string },
}) => {
    const tokenId = ctx.params.tokenId;
    console.log("🚀 ~ tokenId:", tokenId)
    const privateKey = ctx.searchParams.key;
    console.log("🚀 ~ privateKey:", privateKey)
    const recipient = await getInviteFromContract(Number(tokenId));
    console.log("🚀 ~ recipient:", recipient)

    if (!recipient) {
        return <div className="text-center text-2xl font-bold mt-10">प्राप्तकर्ता नहीं मिला</div>
    }

    const exchangeRates: Record<ModeOfPayment, number> = await fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=INR")
        .then(res => res.json());

    const amountInInr = (parseFloat(formatEther(recipient.amount)) * exchangeRates.INR).toPrecision(2);
    const formattedAmountInr = inrFormatter.format(parseFloat(amountInInr));

    return (
        <div className="flex h-[100dvh] max-w-screen flex-col px-4 w-screen bg-white">
            <Navbar />
            <section className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="bg-brand/20 border-2 border-brand/10 rounded-lg z-10 flex flex-col items-center justify-center h-[50vh] p-8 gap-4 backdrop-blur-lg">
                    <Gift size={60} className="text-slate-700" />
                    <h1 className="text-2xl font-bold text-center text-slate-700">आपका धन आपकी प्रतीक्षा कर रहा है!</h1>
                    <h2 className="text-5xl font-bold text-brand">{formattedAmountInr}</h2>
                    <p className="text-base text-center text-gray-700">यह राशि आपके लिए उपलब्ध है। कृपया नीचे दिए गए बटन पर क्लिक करें।</p>
                </div>
            </section>
            <section className="py-6">
                <ClaimButton
                    tokenId={Number(tokenId)}
                    privateKey={privateKey}
                />
            </section>
        </div>
    );
};

export default ClaimPage;