import { prismaClient } from "@/lib/prisma";

// ==============================================

export const getFiles = async (userId: number) => {
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
