import { prismaClient } from "@/lib/prisma";

// ==============================================

export const getAllUserProjects = async (filters: any, userId: number, onlyProcessingProjects: boolean) => {
    return await prismaClient.project.findMany({
        where: {
            ...filters,
            client: {
                freelanceId: userId
            },
            ...(onlyProcessingProjects && {
                AND: [
                    {
                        endDate: {gte: new Date()}
                    },
                    {
                        startDate: {lte: new Date()}
                    }
                ]
            })
        }
    });
};