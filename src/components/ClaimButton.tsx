"use client";
import { LifecycleStatus, Transaction, TransactionButton } from '@coinbase/onchainkit/transaction';
import { Call } from 'node_modules/@coinbase/onchainkit/esm/transaction/types';
import { contractAbi } from 'src/lib/contractAbi';
import { encodeFunctionData } from 'viem';
import { baseSepolia } from 'viem/chains';
import { useAccount } from 'wagmi';
import WalletWrapper from './WalletWrapper';
import { motion, AnimatePresence } from "framer-motion";
import { recordClaim } from 'src/actions/recordClaim';

interface ClaimButtonProps {
    publicKey: string
    privateKey: string
}

const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        transition: {
            duration: 0.2,
            ease: "easeIn"
        }
    }
};

const ClaimButton: React.FC<ClaimButtonProps> = ({ privateKey, publicKey }) => {
    const { address } = useAccount()

    const encodedData = encodeFunctionData({
        abi: contractAbi,
        functionName: 'claimBhet',
        args: [publicKey, privateKey],
    });

    const calls: Call[] = [
        {
            to: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as any,
            data: encodedData,
        },
    ];

    const handleOnStatus = async (status: LifecycleStatus) => {
        if (status.statusName === 'success' && status.statusData.transactionReceipts) {
            try {
                // Store recipient information in the database
                await recordClaim(publicKey, status.statusData.transactionReceipts[0].transactionHash)
            } catch (error) {
                console.error('Error storing recipient:', error);
            }
        }
    }

    console.log("🚀 ~ address:", address)

    return (
        <AnimatePresence mode="wait">
            {!address ? (
                <motion.div
                    key="wallet-wrapper"
                    variants={buttonVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <WalletWrapper
                        className="ockConnectWallet_Container w-full bg-brand [&_span]:text-white py-4 rounded-lg font-medium tracking-wider text-xl hover:bg-brand/80 focus:bg-brand/80 flex items-center justify-center space-x-2"
                        text="खाता बनाएं"
                    />
                </motion.div>
            ) : (
                <motion.div
                    key="transaction-button"
                    variants={buttonVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Transaction
                        chainId={baseSepolia.id}
                        calls={calls}
                        onStatus={handleOnStatus}
                    >
                        <TransactionButton
                            className='w-full bg-brand text-white py-4 rounded-lg font-medium tracking-wider text-xl hover:bg-brand/80 focus:bg-brand/80 flex items-center justify-center space-x-2'
                            text='अपना धन प्राप्त करें'
                        />
                    </Transaction>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ClaimButton;