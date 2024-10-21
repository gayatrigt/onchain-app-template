'use client';
import { LifecycleStatus, Transaction, TransactionButton, TransactionSponsor, TransactionStatus, TransactionStatusAction, TransactionStatusLabel } from "@coinbase/onchainkit/transaction";
import { Recipient } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getTransactions } from "src/actions/getTransactions";
import { updateRecipient } from "src/actions/updateRecipient";
import Navbar from "src/components/Navbar";
import { contractAbi } from "src/lib/contractAbi";
import { useAccount } from "wagmi";
import { baseSepolia } from "wagmi/chains";

interface TransactionItemProps {
  transaction: Recipient;
}

const NFTAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {

  const publicKey = transaction.publicKey

  const contracts = [
    {
      address: NFTAddress as any,
      abi: contractAbi as any,
      functionName: 'cancelBhet',
      args: [publicKey],
    },
  ];

  console.log("🚀 ~ contracts:", contracts)

  const handleOnStatus = useCallback(async (status: LifecycleStatus) => {
    console.log("🚀 ~ handleOnStatus ~ status:", status)

    if (status.statusName === 'success' && status.statusData.transactionReceipts) {
      try {
        // Store recipient information in the database

        const update = await updateRecipient({
          publicKey,
          cancelHash: status.statusData.transactionReceipts[0].transactionHash
        }
        )

        console.log("🚀 ~ handleOnStatus ~ claimLink:", update)


      } catch (error) {
        console.error('Error storing recipient:', error);
      }
    }
  }, []);


  return (
    <div className="flex justify-between items-center py-2 border-b">
      <div>
        <p className="font-medium">{transaction.recipientName}</p>
        <p className="text-sm text-gray-500">
          {transaction.claimed ? 'Claimed' : 'Sent'}: {transaction.amount} ETH
        </p>
      </div>
      {!transaction.claimed && !transaction.bhetTaken && (
        <>
          <Transaction
            chainId={baseSepolia.id}
            contracts={contracts}
            onError={console.log}
            onStatus={handleOnStatus}
          >
            <TransactionButton
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
              text='Cancel Bhet'
            />
            <TransactionSponsor />
            <TransactionStatus>
              <TransactionStatusLabel />
              <TransactionStatusAction />
            </TransactionStatus>
          </Transaction>
        </>
      )}
      {transaction.claimed && (
        <span
          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
        >
          Claimed </span>
      )}
      {transaction.bhetTaken && (
        <span
          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
        >
          Cancelled </span>
      )}
    </div>
  );
};

const HomeScreen = () => {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Recipient[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (address) {
      getTransactions(address).then(res => setTransactions(res as any)).catch(console.error);
    }
  }, [address]);

  console.log("data:", transactions)

  const handleClaimBack = (id: number) => {
    // Implement claim back logic here
    console.log('Claiming back transaction:', id);
  };

  const handleSupportButton = () => {
    router.push('/sendmoney');
  };

  return (
    <div className="flex min-h-[100dvh] max-w-screen flex-col md:w-[1008px] w-screen">
      <Navbar />

      <div className="flex-1">
        {address && transactions.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Your Transactions</h2>
            <div className="bg-white shadow rounded-lg p-4">
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bottom-6 sticky px-6 z-10">
        <button
          onClick={handleSupportButton}
          // className='bg-blue-600 text-white py-2 w-full rounded-md'
          className='w-full bg-brand hover:bg-brand/80 h-full text-white rounded-lg font-medium tracking-wider py-3'
        >
          Send Money
        </button>
      </div>



    </div>
  );
};

export default HomeScreen;