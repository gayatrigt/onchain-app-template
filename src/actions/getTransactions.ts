// src/actions/getTransactions.ts
'use server'

import { prisma } from "src/lib/prisma"

export async function getTransactions(address: string) {
    try {
        const transactions = await prisma.recipient.findMany({
            where: {
                senderAddress: address,
            },
            select: {
                id: true,
                recipientName: true,
                amount: true,
                claimed: true,
                claimedAt: true,
                submissionTxHash: true,
                claimTxHash: true,
                publicKey: true,
                bhetTaken: true,
                cancelledAt: true
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return transactions.map(tx => ({
            ...tx,
            amount: tx.amount,
            claimedAt: tx.claimedAt?.toISOString() ?? '',
            submissionTxHash: tx.submissionTxHash ?? '',
            claimTxHash: tx.claimTxHash ?? '',
            publicKey: tx.publicKey ?? '',
            bhetTaken: tx.bhetTaken ?? '',
            cancelledAt: tx.cancelledAt ?? ''
        }))
    } catch (error) {
        console.error('Error fetching transactions:', error)
        throw new Error('Failed to fetch transactions')
    }
}