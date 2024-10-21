// File: app/actions/recordClaim.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function recordClaim(publicKey: string, claimTxHash: string) {
    try {
        const updatedRecipient = await prisma.recipient.update({
            where: { publicKey: publicKey },
            data: {
                claimed: true,
                claimedAt: new Date(),
                claimTxHash: claimTxHash,
                bhetTaken: true,
            },
        })

        // Revalidate the path where this data is used
        revalidatePath('/') // Adjust this path as needed

        return { success: true, data: updatedRecipient }
    } catch (error) {
        console.error('Error recording claim:', error)
        return { success: false, error: 'Failed to record claim' }
    } finally {
        await prisma.$disconnect()
    }
}