import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { ClientStatus, Gender } from "@/types";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";
import {FILES_DIRECTORY, manageUrlQueryParams} from "@/utils/utils";

// ==============================================

export async function GET (request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    const filters = manageUrlQueryParams(
        request.nextUrl.searchParams,
        ["status", "gender"]
    );

    if(!session?.user){
        return NextResponse.json({error: "Vous avez besoin d'être connecté afin de récupérer la liste de vos clients."}, {status: 401});
    }

    const clients = await prismaClient.client.findMany({
        where: {
            ...filters,
            freelanceId: Number(session.user.id)
        }
    });

    return NextResponse.json(clients, { status: 200 });
}

export async function POST (request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    const formData: FormData = await request.formData();
    const acceptedFileFormat: string[] = ["png", "jpg", "jpeg", "webp"];
    const clientInfos = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        job: formData.get("job") as string,
        status: formData.get("status") as ClientStatus,
        birthdate: formData.get("birthdate") as string | null,
        mail: formData.get("mail") as string | null,
        phone: formData.get("phone") as string | null,
        gender: formData.get("gender") as Gender,
        image: formData.get("file") as File | null
    };

    if(!clientInfos.firstName || !clientInfos.lastName ||  !clientInfos.job ||  !clientInfos.status ||  !clientInfos.gender){
        return NextResponse.json({error: "Il manque des champs afin de créer le client"}, {status: 400});
    }

    if(!session?.user){
        return NextResponse.json({error: "Vous devez être connecté pour ajouter un client"}, {status: 401});
    }

    if(clientInfos.image && acceptedFileFormat.includes(clientInfos.image.name.split(".")[1])){
        const bytes = await clientInfos.image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDirectoryPath: string = path.join(process.cwd(), FILES_DIRECTORY);
        const newFilePath: string = path.join(uploadDirectoryPath, `client_image_${Date.now()}_${clientInfos.image.name}`);

        await writeFile(newFilePath, buffer);
    }

    const newClient = await prismaClient.client.create({
        data: {
            firstName: clientInfos.firstName,
            lastName: clientInfos.lastName,
            job: clientInfos.job,
            status: clientInfos.status,
            links: [],
            birthdate: new Date(clientInfos.birthdate ?? ""),
            mail: clientInfos.mail,
            phone: clientInfos.phone,
            image: clientInfos.image ? `${FILES_DIRECTORY}/client_image_${Date.now()}_${clientInfos.image.name}` : null,
            gender: clientInfos.gender,
            freelanceId: Number(session.user.id)
        }
    });

    return NextResponse.json(newClient, {status: 201});
}