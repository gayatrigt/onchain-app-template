'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { useAccount } from 'wagmi'; // Assuming you're using wagmi for wallet connection
import SignupButton from './SignupButton';
import LoginButton from './LoginButton';

const SendMoneyPage = () => {
    const [ethAmount, setEthAmount] = useState('');
    const [inrAmount, setInrAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [message, setMessage] = useState('');
    const [inviteLink, setInviteLink] = useState('');
    const router = useRouter();
    const { address } = useAccount();

    useEffect(() => {
        // TODO: Implement real-time currency conversion
        const convertEthToInr = async () => {
            if (ethAmount) {
                // This is a placeholder conversion rate. Replace with actual API call.
                const conversionRate = 150000; // 1 ETH = 150,000 INR
                const inrValue = parseFloat(ethAmount) * conversionRate;
                setInrAmount(inrValue.toFixed(2));
            } else {
                setInrAmount('');
            }
        };

        convertEthToInr();
    }, [ethAmount]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address) {
            alert('Please connect your wallet first.');
            return;
        }
        // TODO: Implement actual sending logic here
        const link = `${window.location.origin}/claim/${Date.now()}`;
        setInviteLink(link);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Claim your ETH',
                text: `${recipientName}, you've received ETH! Click here to claim:`,
                url: inviteLink
            }).catch((error) => console.log('Error sharing', error));
        } else {
            // Fallback for browsers that don't support navigator.share
            alert(`Share this link: ${inviteLink}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Send Money</h1>
            <div className="flex items-center gap-3 mb-6">
                <SignupButton />
                {!address && <LoginButton />}
            </div>
            {address ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="ethAmount" className="block text-sm font-medium text-gray-700">ETH Amount</label>
                        <input
                            type="number"
                            id="ethAmount"
                            value={ethAmount}
                            onChange={(e) => setEthAmount(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            placeholder="0.0"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="inrAmount" className="block text-sm font-medium text-gray-700">INR Equivalent</label>
                        <input
                            type="text"
                            id="inrAmount"
                            value={inrAmount}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
                            readOnly
                        />
                    </div>
                    <div>
                        <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700">Recipient's Name</label>
                        <input
                            type="text"
                            id="recipientName"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message (Optional)</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center"
                    >
                        <Send className="mr-2" size={20} />
                        Send Money
                    </button>
                </form>
            ) : (
                <p className="text-center text-gray-600">Please connect your wallet to send money.</p>
            )}
            {inviteLink && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Invite Link Generated</h2>
                    <p className="mb-2">{inviteLink}</p>
                    <button
                        onClick={handleShare}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Share Invite Link
                    </button>
                </div>
            )}
        </div>
    );
};

export default SendMoneyPage;