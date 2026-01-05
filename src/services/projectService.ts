import { prismaClient } from "@/lib/prisma";
import { Project, ProjectDifficulty } from "@/types";

// ==============================================

export const getAllUserProjects = async (filters: any, userId: number, onlyProcessingProjects: boolean): Promise<Project[]> => {
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

type ProjectInformationsType = {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    difficulty: ProjectDifficulty;
    cost: number;
    clientId: number;
    parentProjectId?: number;
};

export const addProject = async (projectInformations: ProjectInformationsType, coverFile: File | null): Promise<Project> => {
    return await prismaClient.project.create({
        data: {
            ...projectInformations,
            startDate: new Date(projectInformations.startDate),
            endDate: new Date(projectInformations.endDate),
            cover: coverFile ? `${process.env.FILES_DIRECTORY}/cover_${Date.now()}_${coverFile.name}` : null,
        }
    });
};
