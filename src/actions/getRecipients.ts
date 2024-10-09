"use server";
import { prisma } from 'src/lib/prisma';

export const getRecipients = async (address: string) => {
    return prisma.recipient.findMany({
        where: {
            senderAddress: address,
        },
    });

}