"use client";
import { LifecycleStatus, Transaction, TransactionButton } from '@coinbase/onchainkit/transaction';
import { Call } from 'node_modules/@coinbase/onchainkit/esm/transaction/types';
import { contractAbi } from 'src/lib/contractAbi';
import { encodeFunctionData } from 'viem';
import { baseSepolia } from 'viem/chains';

interface ClaimButtonProps {
    tokenId: number
    privateKey: string
}
const ClaimButton: React.FC<ClaimButtonProps> = ({ privateKey, tokenId }) => {
    // return (
    //     <button className='w-full bg-brand text-white py-4 rounded-lg font-medium tracking-wider text-xl hover:bg-brand/80 focus:bg-brand/80 flex items-center justify-center space-x-2'>
    //         <span>अपना धन प्राप्त करें</span>
    //     </button>
    // )

    const encodedData = encodeFunctionData({
        abi: contractAbi,
        functionName: 'claimAmount',
        args: [tokenId, privateKey],
    });

    const calls: Call[] = [
        {
            // base sepolia
            to: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as any,

            // base mainnet
            // to: "0xdFaebb66DFeef3b7EfE3e1C6Be0e1d5448E5Ff7d",

            data: encodedData,
        },
    ];

    const handleOnStatus = async (status: LifecycleStatus) => {
        console.log("🚀 ~ handleOnStatus ~ status:", status)

        if (status.statusName === 'success' && status.statusData.transactionReceipts) {
            try {

                // Store recipient information in the database

            } catch (error) {
                console.error('Error storing recipient:', error);
            }
        }
    }

    return <Transaction
        chainId={baseSepolia.id}
        calls={calls}
        onStatus={handleOnStatus}
    >
        <TransactionButton
            className='w-full bg-brand text-white py-4 rounded-lg font-medium tracking-wider text-xl hover:bg-brand/80 focus:bg-brand/80 flex items-center justify-center space-x-2' text='अपना धन प्राप्त करें'
        />
    </Transaction>
}

export default ClaimButton
