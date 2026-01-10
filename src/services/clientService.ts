import { prismaClient } from "@/lib/prisma";
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

export const addClient = async (clientInfos: any, userId: number): Promise<Client> => {
    return await prismaClient.client.create({
        data: {
            firstName: clientInfos.get('firstName'),
            lastName: clientInfos.get('lastName'),
            job: clientInfos.get('job'),
            status: clientInfos.get('status'),
            links: [],
            birthdate: clientInfos.get('birthdate') ? new Date(clientInfos.get('birthdate')) : null,
            mail: clientInfos.get('mail') ?? null,
            phone: clientInfos.get('phone') ?? null,
            image: clientInfos.get('image').size > 0 ? `${process.env.FILES_DIRECTORY}/client_image_${Date.now()}_${clientInfos.get('image').name}` : null,
            gender: clientInfos.get('gender'),
            freelanceId: userId
        }
    });
};

export const getClient = async (clientId: number, userId: number): Promise<Client | null> => {
    return await prismaClient.client.findUnique({
        where: {
            id: clientId,
            freelanceId: userId
        }
    });
};
