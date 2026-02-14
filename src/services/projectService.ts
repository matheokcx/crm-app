import {prismaClient} from "@/lib/prisma";
import {Project, ProjectDifficulty} from "@/types";
import path from "path";
import {writeFile} from "fs/promises";



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

export const addProject = async (projectInformations: FormData): Promise<Project> => {
    const parentProjectId: number | null = projectInformations.get("parentProjectId") ? Number(projectInformations.get("parentProjectId") as string) : null;
    const coverFile: File | null = projectInformations.get("cover") ? projectInformations.get("cover") as File : null;
    const today: number = Date.now();

    if(coverFile && coverFile.size > 0){
        const bytes = await coverFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDirectoryPath: string = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files");
        const newFilePath: string = path.join(uploadDirectoryPath, `project_cover_${today}_${coverFile.name}`);

        await writeFile(newFilePath, buffer);
    }

    return await prismaClient.project.create({
        data: {
            title: projectInformations.get("title") as string,
            description: projectInformations.get("description") as string,
            difficulty: projectInformations.get("difficulty") as ProjectDifficulty,
            cost: Number(projectInformations.get("cost") as string),
            clientId: Number(projectInformations.get("clientId") as string),
            parentProjectId: parentProjectId,
            startDate: new Date(projectInformations.get("startDate") as string),
            endDate: new Date(projectInformations.get("endDate") as string),
            cover: coverFile ? `/files/project_cover_${today}_${coverFile.name}` : null,
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
