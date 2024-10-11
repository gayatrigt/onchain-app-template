// src/actions/updateRecipient.ts
'use server'

import { prisma } from "src/lib/prisma";

type UpdateRecipientParams = {
    publicKey: string;
    cancelHash?: string;
}

export async function updateRecipient({
    publicKey,
    cancelHash,
}: UpdateRecipientParams) {
    try {
        const updatedRecipient = await prisma.recipient.update({
            where: { publicKey },
            data: {
                cancelHash,
                cancelledAt: Date.now().toString(),
                bhetTaken: true
            },
        })

        return { success: true, recipient: updatedRecipient }
    } catch (error) {
        console.error('Error updating recipient:', error)
        return { success: false, error: 'Failed to update recipient' }
    }
}