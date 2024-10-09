'use client';
import { Transaction, TransactionButton, TransactionSponsor, TransactionStatus, TransactionStatusAction, TransactionStatusLabel } from '@coinbase/onchainkit/transaction';
import { useRouter } from 'next/navigation';
import { IoChevronDown } from "react-icons/io5";
import CurrencyInput from 'src/components/CurrencyInput';
import { sepolia } from 'viem/chains';
import { useAccount } from 'wagmi';
import LoginButton from '../components/LoginButton';
import SignupButton from '../components/SignupButton';

const abi = [
  "function submitAmount(bytes32 publicKey) external payable",
  "function claimAmount(bytes32 publicKey, bytes32 privateKey) external"
];

const HomeScreen = () => {
  const { address } = useAccount();
  const router = useRouter();

  const contracts = [
    {
      address: "",
      abi,
      functionName: 'submitAmount',
      args: [],
    },
  ]

  const fetchRecipients = () => {

  }


  const handleSendMoney = () => {
    router.push('/sendmoney');
  };

  return (
    <div className="flex h-[100dvh] max-w-full flex-col px-1 md:w-[1008px]">
      <section className="mt-6 mb-6 flex w-full flex-col md:flex-row px-4">
        <div className="flex w-full flex-row items-center justify-between gap-2 md:gap-0">
          <h2 className='text-2`xl font-bold'>Bhet</h2>
          <div className="flex items-center gap-3">
            <SignupButton />
            {!address && <LoginButton />}
          </div>
        </div>
      </section>

      <CurrencyInput />

      <section className='w-full'>
        <div className=' py-6 px-4 grid gap-4'>
          <label className='flex flex-col'>
            <span className='font-semibold text-slate-400'>I am sending this to</span>
            <div className="relative">
              <input className='py-4 w-full mt-1 px-4 text-lg focus:outline-none bg-slate-200 rounded-lg' placeholder='Mom, Dad, etc' type="text" />
              <button className=' absolute right-0 top-0 h-full aspect-square text-brand flex items-center justify-center'>
                <IoChevronDown className='h-8 w-8' />
              </button>
            </div>
          </label>
          {/* <button className='w-full bg-brand text-white py-4 rounded-lg font-medium tracking-wider'>
            Send Invite
          </button> */}

          <Transaction
            chainId={sepolia.id}
          // contracts={contracts}
          // onStatus={handleOnStatus}
          >
            <TransactionButton />
            <TransactionSponsor />
            <TransactionStatus>
              <TransactionStatusLabel />
              <TransactionStatusAction />
            </TransactionStatus>
          </Transaction>
        </div>
      </section >
    </div >
  );
};

export default HomeScreen;
