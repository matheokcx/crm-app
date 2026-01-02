import { prismaClient } from "@/lib/prisma";
import { FILES_DIRECTORY } from "@/utils/utils";
import { Client, ClientStatus, Gender } from "@/types";

// ==============================================

export const getAllUserClients = async (filters: any, userId: number): Promise<Client[]> => {
    return await prismaClient.client.findMany({
        where: {
            ...filters,
            freelanceId: userId
        }
    });
};

export type ClientInfosType = {
    firstName: string;
    lastName: string;
    job: string;
    status: ClientStatus;
    birthdate?: Date;
    mail?: string;
    phone?: string;
    image?: File;
    gender: Gender;
};

export const addClient = async (clientInfos: ClientInfosType, userId: number): Promise<Client> => {
    return await prismaClient.client.create({
        data: {
            firstName: clientInfos.firstName,
            lastName: clientInfos.lastName,
            job: clientInfos.job,
            status: clientInfos.status,
            links: [],
            birthdate: clientInfos.birthdate ? new Date(clientInfos.birthdate) : null,
            mail: clientInfos.mail ?? null,
            phone: clientInfos.phone ?? null,
            image: clientInfos.image ? `${FILES_DIRECTORY}/client_image_${Date.now()}_${clientInfos.image.name}` : null,
            gender: clientInfos.gender,
            freelanceId: userId
        }
    });
};
