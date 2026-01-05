import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { ProjectDifficulty } from "@/types";
import path from "path";
import { writeFile } from "fs/promises";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { verifyStringLength } from "@/utils/verifications";

// ==============================================

export async function POST(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    const acceptedFileFormat: string[] = ["image/png", "image/jpeg", "image/webp"];
    const formData: FormData = await request.formData();
    const projectInformations = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        startDate: formData.get("startDate") as string,
        endDate: formData.get("endDate") as string,
        difficulty: formData.get("difficulty") as ProjectDifficulty,
        cost: Number(formData.get("cost") as string),
        clientId: Number(formData.get("clientId") as string)
    };
    const today: number = Date.now();
    const coverFile = formData.get("cover") as File | null

    if(
        !projectInformations.title ||
        !projectInformations.description ||
        !projectInformations.startDate ||
        !projectInformations.endDate ||
        !projectInformations.cost ||
        !projectInformations.difficulty ||
        !projectInformations.clientId
    ){
        return NextResponse.json({error: "Il manque des informations afin de pouvoir ajouter ce projet."}, {status: 400});
    }

    if(!session?.user){
        return NextResponse.json({error: "Vous devez être connecté afin de pouvoir ajouter un projet"}, {status: 401});
    }

    const client = await prismaClient.client.findUnique({
        where: {
            id: Number(projectInformations.clientId),
            freelanceId: Number(session.user.id)
        }
    });

    if(!client){
        return NextResponse.json({error: "Vous ne pouvez pas créer un projet associé à un client qui n'est pas le vôtre"}, {status: 401});
    }

    if(!verifyStringLength(0, 255, projectInformations.title, projectInformations.description)){
        return NextResponse.json({error: "Le titre et la description ne doivent pas dépassés 255 caractères"}, {status: 400});
    }

    if(coverFile && acceptedFileFormat.includes(coverFile.type)){
        const bytes = await coverFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDirectoryPath: string = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files");
        const newFilePath: string = path.join(uploadDirectoryPath, `cover_${today}_${coverFile.name}`);

        await writeFile(newFilePath, buffer);
    }

    const newProject = await prismaClient.project.create({
        data: {
            ...projectInformations,
            startDate: new Date(projectInformations.startDate),
            endDate: new Date(projectInformations.endDate),
            cover: coverFile ? `${process.env.FILES_DIRECTORY}/cover_${today}_${coverFile.name}` : null,
        }
    });

    return NextResponse.json(newProject, {status: 201});
}
