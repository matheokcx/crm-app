import { prismaClient } from "@/lib/prisma";

// ==============================================

export const getFiles = async (filters: any, userId: number) => {
    return await prismaClient.file.findMany({
        where: {
            project: {
                client: {
                    freelanceId: userId
                }
            }
        }
    });
};
