import { prismaClient } from "@/lib/prisma";

// ==============================================

export const getAllUserClients = async (filters: any, userId: number) => {
    return await prismaClient.client.findMany({
        where: {
            ...filters,
            freelanceId: userId
        }
    });
};
