import React, { useState, useCallback, use, useEffect } from 'react';
import { LifecycleStatus, Transaction, TransactionButton, TransactionSponsor, TransactionStatus, TransactionStatusAction, TransactionStatusLabel } from '@coinbase/onchainkit/transaction';
import { parseAbi, encodeAbiParameters, parseAbiParameters, keccak256, toBytes, bytesToHex, encodeFunctionData, parseEther, formatEther } from 'viem';
import { baseSepolia, sepolia } from 'viem/chains';
import { PrismaClient } from '@prisma/client';
import { contractAbi } from 'src/lib/contractAbi';
import { useAccount } from 'wagmi';
import { useCurrencyStore } from 'src/store/useCurrencyStore';
import { createRecipient } from 'src/actions/createRecipients';
import { getHost } from 'src/lib/getHost';
import { CopyIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const prisma = new PrismaClient();

interface KeyPair {
    privateKey: `0x${string}`;
    publicKey: `0x${string}`;
}

interface Call {
    to: `0x${string}`;
    data: `0x${string}`;
    value: bigint;
}

const InviteButton: React.FC = () => {
    const { currencyAmount, exchangeRates } = useCurrencyStore()
    const amountInEth = parseEther(String(parseFloat(currencyAmount) * exchangeRates))

    const { address: senderAddress } = useAccount()
    const [recipientName, setRecipientName] = useState<string>('');
    const [calls, setCalls] = useState<Call[]>([]);
    const [claimLink, setClaimLink] = useState<string>()

    const generateKeyPair = useCallback((): KeyPair => {
        const privateKey = bytesToHex(crypto.getRandomValues(new Uint8Array(32))) as `0x${string}`;
        const publicKey = keccak256(toBytes(privateKey));
        return { privateKey, publicKey };
    }, []);

    const generateInvite = useCallback(() => {
        const { publicKey } = generateKeyPair();

        const encodedData = encodeFunctionData({
            abi: contractAbi,
            functionName: 'submitAmount',
            args: [publicKey],
        });

        const newCalls: Call[] = [
            {
                // base sepolia
                to: "0x9D4d4f60eA2bc88811685a98290473548Ca1Ae60",

                // base mainnet
                // to: "0xdFaebb66DFeef3b7EfE3e1C6Be0e1d5448E5Ff7d",

                data: encodedData,
                value: amountInEth
            },
        ];

        setCalls(newCalls);
    }, [currencyAmount, generateKeyPair]);

    const handleOnStatus = useCallback(async (status: LifecycleStatus) => {
        console.log("🚀 ~ handleOnStatus ~ status:", status)

        if (status.statusName === 'success' && status.statusData.transactionReceipts) {
            try {
                const { publicKey, privateKey } = generateKeyPair();

                // Store recipient information in the database
                const recipient = await createRecipient({
                    senderAddress: senderAddress as string,
                    recipientName,
                    publicKey,
                    amount: Number(formatEther(amountInEth)),
                    submissionTxHash: status.statusData.transactionReceipts[0].transactionHash,
                });

                console.log("🚀 ~ handleOnStatus ~ recipient:", recipient)

                console.log(`Recipient stored in database with ID: ${recipient.recipient?.id}`);

                // Generate claim link
                const claimLink = `${getHost()}/claim/${publicKey}?key=${privateKey}`;

                console.log("🚀 ~ handleOnStatus ~ claimLink:", claimLink)
                // You might want to display this link to the user or send it via email
                setClaimLink(claimLink)


            } catch (error) {
                console.error('Error storing recipient:', error);
            }
        }
    }, [currencyAmount, generateKeyPair, recipientName, senderAddress]);

    const handleCopy = async () => {
        if (claimLink) {
            await navigator.clipboard.writeText(claimLink)
            toast.success('The claim link is copied to your clipboard')
        }
    }

    useEffect(() => {
        generateInvite()
    }, [senderAddress, currencyAmount])


    return (
        <section className='w-full'>
            <div className='py-6 px-4 grid gap-4'>
                <label className='flex flex-col'>
                    <span className='font-medium text-sm text-slate-600'>I am sending this to</span>
                    <div className="relative">
                        <input
                            className='py-3 w-full mt-1 px-4 text-md focus:outline-none bg-slate-200 rounded-lg'
                            placeholder='Mom, Dad, etc'
                            type="text"
                            value={recipientName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecipientName(e.target.value)}
                        />
                    </div>
                </label>

                {!claimLink && <Transaction
                    chainId={baseSepolia.id}
                    calls={calls}
                    onStatus={handleOnStatus}
                >
                    <TransactionButton
                        className='w-full bg-brand hover:bg-brand/80 h-full text-white rounded-lg font-medium tracking-wider py-3'
                        text='Send Invite'
                        disabled={!recipientName.length}
                    />
                    {/* <TransactionSponsor /> */}
                    {/* <TransactionStatus className='justify-center'>
                        <TransactionStatusLabel />
                        <TransactionStatusAction />
                    </TransactionStatus> */}
                </Transaction>}

                {!!claimLink &&
                    <div className='bg-slate-200 text-slate-700 rounded-lg flex items-center space-x-4'>
                        <span className='truncate text-ellipsis flex-1 w-[75vw] items-center pl-4'>
                            {claimLink}
                        </span>
                        <button
                            onClick={handleCopy}
                            className='h-full aspect-square p-4 flex items-center justify-center bg-brand text-white rounded-r-lg hover:bg-brand/80 focus:bg-brand/80 '>
                            <CopyIcon size={24} />
                        </button>
                    </div>
                }
            </div>
        </section>
    );
};

export default InviteButton;