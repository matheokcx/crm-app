import {prismaClient} from "@/lib/prisma";
import {Client, ClientStatus, Gender} from "@/types";
import path from "path";
import {unlink, writeFile} from "fs/promises";

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

export const getClient = async (clientId: number, userId: number): Promise<Client | null> => {
    return await prismaClient.client.findUnique({
        where: {
            id: clientId,
            freelanceId: userId
        }
    });
};

export const addClient = async (clientInfos: FormData, userId: number): Promise<Client> => {
    const today: number = Date.now();
    const profilePicture: File | null = clientInfos.get("image") as File | null;
    const clientImageUpload: boolean = profilePicture !== null && profilePicture.size > 0;

    if(profilePicture && clientImageUpload){
        const bytes = await profilePicture.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDirectoryPath: string = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files");
        const newFilePath: string = path.join(uploadDirectoryPath, `client_image_${today}_${profilePicture.name}`);

        await writeFile(newFilePath, buffer);
    }

    return await prismaClient.client.create({
        data: {
            firstName: clientInfos.get('firstName') as string,
            lastName: clientInfos.get('lastName') as string,
            job: clientInfos.get('job') as string,
            status: clientInfos.get('status') as ClientStatus,
            links: [],
            birthdate: clientInfos.get('birthdate') ? new Date(clientInfos.get('birthdate') as string) : null,
            mail: (clientInfos.get('mail') as string | undefined) ?? null,
            phone: (clientInfos.get('phone') as string | undefined) ?? null,
            image: clientImageUpload ? `/files/client_image_${today}_${(clientInfos.get('image') as File).name}` : null,
            gender: clientInfos.get('gender') as Gender,
            freelanceId: userId
        }
    });
};

export const editClient = async (clientInfos: any, clientId: number, userId: number): Promise<Client> => {
    const today: number = Date.now();
    const profilePicture: File | undefined = clientInfos.image;
    let imagePath: string | null | undefined;

    if(profilePicture && profilePicture.size > 0){
        const existingClient = await prismaClient.client.findUnique({ where: { id: clientId }, select: { image: true } });

        if(existingClient?.image){
            const oldFilePath: string = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files", path.basename(existingClient.image));
            await unlink(oldFilePath);
        }

        const bytes = await profilePicture.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDirectoryPath: string = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files");
        const newFilePath: string = path.join(uploadDirectoryPath, `client_image_${today}_${profilePicture.name}`);

        await writeFile(newFilePath, buffer);
        imagePath = `/files/project_cover_${today}_${profilePicture.name}`;
    }

    return await prismaClient.client.update({
        data: {
            firstName: clientInfos.firstName,
            lastName: clientInfos.lastName,
            job: clientInfos.job,
            status: clientInfos.status,
            links: [],
            birthdate: clientInfos.birthdate ? new Date(clientInfos.birthdate) : null,
            mail: clientInfos.mail,
            phone: clientInfos.phone,
            ...(imagePath !== undefined && { image: imagePath }),
            gender: clientInfos.gender,
            freelanceId: userId
        },
        where: {
            id: clientId,
            freelanceId: userId
        }
    });
};

export const deleteClient = async (clientId: number, userId: number): Promise<void> => {
    const deletedClient: Client = await prismaClient.client.delete({
        where: {
            id: clientId,
            freelanceId: userId
        }
    });

    if(deletedClient.image){
        const oldFilePath: string = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files", path.basename(deletedClient.image));
        await unlink(oldFilePath);
    }
};
