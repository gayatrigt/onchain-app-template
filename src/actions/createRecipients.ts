// app/actions/createRecipient.ts

'use server'

import { PrismaClient } from '@prisma/client'
import { prisma } from 'src/lib/prisma'

interface CreateRecipientParams {
    senderAddress: string
    recipientName: string
    publicKey: string
    amount: string
    submissionTxHash: string
}

export async function createRecipient({
    senderAddress,
    recipientName,
    publicKey,
    amount,
    submissionTxHash
}: CreateRecipientParams) {
    try {
        const recipient = await prisma.recipient.create({
            data: {
                senderAddress,
                recipientName,
                publicKey,
                amount,
                submissionTxHash,
            },
        })

        const claimLink = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/claim?id=${recipient.id}`

        return { success: true, recipient, claimLink }
    } catch (error) {
        console.error('Error creating recipient:', error)
        return { success: false, error: 'Failed to create recipient' }
    }
}