"use client";
import React from 'react'
import { useAccount } from 'wagmi';
import LoginButton from './LoginButton';
import SignupButton from './SignupButton';

const NavbarCta = () => {
    const { address } = useAccount();
    return (
        <>
            <SignupButton />
            {!address && <LoginButton />}
        </>
    )
}

export default NavbarCta