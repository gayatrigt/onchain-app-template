import { createPublicClient, http, parseAbiItem } from 'viem';
import { baseSepolia, mainnet } from 'viem/chains';
import { contractAbi } from '../contractAbi';

// Define the type for the Invite struct
type Invite = {
    amount: bigint;
    claimed: boolean;
    sender: `0x${string}`;
};
// Function to get invite details
export async function getInviteFromContract(publicKey: string): Promise<Invite> {
    // Create a public client
    const client = createPublicClient({
        chain: baseSepolia,
        transport: http()
    });

    try {
        // Call the getInvite function
        const result = await client.readContract({
            address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as any,
            abi: contractAbi,
            functionName: 'getBhet',
            args: [publicKey]
        });
        console.log("🚀 ~ getInviteFromContract ~ result:", result)

        if (!result) {
            throw new Error('Invite not found');
        }

        const { amount, claimed, sender } = result as any || [];

        // Parse and return the result
        return {
            amount,
            claimed,
            sender,
        };
    } catch (error) {
        console.error('Error fetching invite:', error);
        throw error;
    }
}
