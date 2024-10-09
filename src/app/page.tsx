'use client';
import { useRouter } from 'next/navigation';
import { IoChevronDown } from "react-icons/io5";
import CurrencyInput from 'src/components/CurrencyInput';
import { useAccount } from 'wagmi';
import LoginButton from '../components/LoginButton';
import SignupButton from '../components/SignupButton';

const transactions = [
  { id: 1, type: 'sent', amount: '0.5 ETH', status: 'Completed', date: '2024-10-07', address: '0x1234...5678' },
  { id: 2, type: 'claimed', amount: '0.3 ETH', status: 'Claimed', date: '2024-10-06', address: '0xabcd...efgh' },
  { id: 3, type: 'sent', amount: '0.2 ETH', status: 'Pending', date: '2024-10-05', address: '0x9876...5432' },
];

const HomeScreen = () => {
  const { address } = useAccount();
  const router = useRouter();


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
        <div className='border-t-2 border-brand/40 py-6 px-4 grid gap-4'>
          <label className='flex flex-col'>
            <span className='font-semibold text-slate-400'>I am sending this to</span>
            <div className="relative">
              <input className='py-4 w-full mt-1 px-4 text-lg focus:outline-none bg-slate-200 rounded-lg' placeholder='Mom, Dad, etc' type="text" />
              <button className=' absolute right-0 top-0 h-full aspect-square text-brand flex items-center justify-center'>
                <IoChevronDown className='h-8 w-8' />
              </button>
            </div>
          </label>
          <button className='w-full bg-brand text-white py-4 rounded-lg font-medium tracking-wider'>
            Send Invite
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
