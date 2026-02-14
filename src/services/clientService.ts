import {prismaClient} from "@/lib/prisma";
import {Client, ClientStatus, Gender} from "@/types";
import path from "path";
import {writeFile} from "fs/promises";



export const getAllUserClients = async (filters: any, userId: number): Promise<Client[]> => {
    return await prismaClient.client.findMany({
        where: {
            ...filters,
            freelanceId: userId
        },
        orderBy: [
            {
                firstName: 'asc'
            }
        ],
    });
};

export const addClient = async (clientInfos: any, userId: number): Promise<Client> => {
    const today: number = Date.now();
    const profilePicture: File = clientInfos.get("image") as File;

    if(profilePicture && profilePicture.size > 0){
        const bytes = await profilePicture.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDirectoryPath: string = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files");
        const newFilePath: string = path.join(uploadDirectoryPath, `client_image_${today}_${profilePicture.name}`);

        await writeFile(newFilePath, buffer);
    }

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
            image: profilePicture.size > 0 ? `/files/client_image_${today}_${clientInfos.get('image').name}` : null,
            gender: clientInfos.get('gender'),
            freelanceId: userId
        }
    });
};

export const editClient = async (clientInfos: FormData, userId: number): Promise<Client> => {
    const today: number = Date.now();
    const profilePicture: File = clientInfos.get("image") as File;

    if(profilePicture && profilePicture.size > 0){
        const bytes = await profilePicture.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDirectoryPath: string = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files");
        const newFilePath: string = path.join(uploadDirectoryPath, `client_image_${today}_${profilePicture.name}`);

        await writeFile(newFilePath, buffer);
    }

    return await prismaClient.client.update({
        data: {
            firstName: clientInfos.get('firstName') as string,
            lastName: clientInfos.get('lastName') as string,
            job: clientInfos.get('job') as string,
            status: clientInfos.get('status') as ClientStatus,
            links: [],
            birthdate: clientInfos.get('birthdate') ? new Date(clientInfos.get('birthdate') as string) : null,
            mail: clientInfos.get('mail') as string ?? null,
            phone: clientInfos.get('phone') as string ?? null,
            image: profilePicture.size > 0 ? `/files/client_image_${today}_${(clientInfos.get('image') as File).name}` : null,
            gender: clientInfos.get('gender') as Gender,
            freelanceId: userId
        },
        where: {
            id: Number(clientInfos.get('id')),
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
