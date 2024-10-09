'use client';
import { Recipient } from "@prisma/client";
import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { getRecipients } from "src/actions/getRecipients";
import CurrencyInput from 'src/components/CurrencyInput';
import InviteButton from 'src/components/InviteButtont';
import NavbarCta from 'src/components/NavbarCta';
import { useAccount } from "wagmi";


const HomeScreen = () => {
  const { address } = useAccount();
  const [recipients, setRecipients] = useState<Recipient[]>([])
  console.log("🚀 ~ HomeScreen ~ recipients:", recipients)

  useEffect(() => {

    if (address) {
      getRecipients(address).then(setRecipients);
    }

  }, [address])

  return (
    <div className="flex h-[100dvh] max-w-screen flex-col px-1  md:w-[1008px]">
      <section className="mt-6 mb-6 flex w-full flex-col md:flex-row px-4">
        <div className="flex w-full flex-row items-center justify-between gap-2 md:gap-0">
          <h2 className='text-2`xl font-bold'>Bhet</h2>
          <div className="flex items-center gap-3">
            <NavbarCta />
          </div>
        </div>
      </section>

      <CurrencyInput />


      {/* <button className='w-full bg-brand text-white py-4 rounded-lg font-medium tracking-wider'>
            Send Invite
          </button> */}

      <InviteButton />

    </div >
  );
};

export default HomeScreen;
