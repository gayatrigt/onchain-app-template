"use server";
import { prisma } from 'src/lib/prisma';

export const getRecipient = async (publicKey: string) => {
    return prisma.recipient.findFirst({
        where: {
            publicKey
        },
    });

}