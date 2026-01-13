import { prismaClient } from "@/lib/prisma";

// ==============================================

export const getClientNotes = async (clientId: number, userId: number) => {
    return await prismaClient.clientNote.findMany({
        where: {
            client: {
                id: clientId,
                freelanceId: userId
            }
        }
    });
};