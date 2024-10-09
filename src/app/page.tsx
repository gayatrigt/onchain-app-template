'use client';
import { Recipient } from "@prisma/client";
import { useEffect, useState } from "react";
import { getRecipients } from "src/actions/getRecipients";
import CurrencyInput from 'src/components/CurrencyInput';
import InviteButton from 'src/components/InviteButtont';
import Navbar from "src/components/Navbar";
import NavbarCta from 'src/components/NavbarCta';
import { useAccount } from "wagmi";


const HomeScreen = () => {
  const { address } = useAccount();
  const [recipients, setRecipients] = useState<Recipient[]>([])



  useEffect(() => {

    if (address) {
      getRecipients(address).then(setRecipients);
    }

  }, [address])

  return (
    <div className="flex h-[100dvh] max-w-screen flex-col px-1  md:w-[1008px]">
      <Navbar />

      <CurrencyInput />


      {/* <button className='w-full bg-brand text-white py-4 rounded-lg font-medium tracking-wider'>
            Send Invite
          </button> */}

      <InviteButton />

    </div >
  );
};

export default HomeScreen;
