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
    <div className="flex justify-between items-center py-2 border-b last:border-b-0 last:pb-0">
      <div className="flex-1">
        <p className="font-medium text-lg">{transaction.recipientName}</p>
        <p className="text-sm text-gray-500">
          {transaction.amount} ETH
        </p>
      </div>

      {!transaction.claimed && !transaction.bhetTaken && (
        <>
          <Transaction
            chainId={baseSepolia.id}
            contracts={contracts}
            onError={console.log}
            onStatus={handleOnStatus}
            className="!w-fit"
          >
            <TransactionButton
              className="bg-brand/20 border border-brand/10 hover:bg-transparent [&_span]:text-brand [&_span]:font-medium [&_span]:text-xs  px-3 py-1 rounded-md text-sm"
              text='Revert'
            />
            {/* <TransactionSponsor /> */}
            {/* <TransactionStatus>
              <TransactionStatusLabel />
              <TransactionStatusAction />
            </TransactionStatus> */}
          </Transaction>
        </>
      )}
      {transaction.claimed && (
        <span
          className="bg-green-700/20 border border-green-700/10 hover:bg-transparent text-green-700 font-medium text-xs  px-3 py-1 rounded-md"
        >
          Claimed </span>
      )}
      {transaction.cancelHash && (
        <span
          className="bg-brand/20 border border-brand/10 hover:bg-transparent text-brand font-medium text-xs  px-3 py-1 rounded-md"
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
          <div className="mx-4">
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