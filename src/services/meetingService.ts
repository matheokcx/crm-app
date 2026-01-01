import { prismaClient } from "@/lib/prisma";

// ==============================================

export const getMeetings = async (filters: any, userId: number) => {
    return await prismaClient.meeting.findMany({
        where: {
            project: {
                client: {
                    freelanceId: userId
                },
                ...(filters.projectId && {id: Number(filters.projectId)})
            },
            ...(filters.startHour && {
                startHour: {
                    gte: new Date(filters?.startHour ?? "")
                }
            })
        },
        orderBy: {
            startHour: "asc"
        }
    });
};