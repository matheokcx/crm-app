import { prismaClient } from "@/lib/prisma";
import {Client, Project, ProjectDifficulty} from "@/types";

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

export const addProject = async (projectInformations: FormData, coverFile: File | null): Promise<Project> => {
    return await prismaClient.project.create({
        data: {
            title: projectInformations.get("title") as string,
            description: projectInformations.get("description") as string,
            difficulty: projectInformations.get("difficulty") as ProjectDifficulty,
            cost: Number(projectInformations.get("cost") as string),
            clientId: Number(projectInformations.get("clientId") as string),
            parentProjectId: Number(projectInformations.get("parentProjectId") as string) ?? null,
            startDate: new Date(projectInformations.get("startDate") as string),
            endDate: new Date(projectInformations.get("endDate") as string),
            cover: coverFile ? `${process.env.FILES_DIRECTORY}/cover_${Date.now()}_${coverFile.name}` : null,
        }
    });
};

export const getProject = async (projectId: number, userId: number): Promise<Project | null> => {
    return await prismaClient.project.findUnique({
        where: {
            id: projectId,
            client: {
                freelanceId: userId
            }
        }
    });
};
