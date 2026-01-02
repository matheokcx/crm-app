import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { prismaClient } from "@/lib/prisma";
import { FILES_DIRECTORY, manageUrlQueryParams } from "@/utils/utils";
import { ProjectDifficulty } from "@/types";
import path from "path";
import { writeFile } from "fs/promises";

// ==============================================


export async function GET(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    const filters = manageUrlQueryParams(
        request.nextUrl.searchParams,
        ["clientId", "difficulty"]
    );
    const endDate: string | null = request.nextUrl.searchParams.get("endDate") as string;

    if(!session?.user){
        return NextResponse.json(
            {error: "Vous avez besoin d'être connecté afin de récupérer la liste de vos projets"},
            {status: 401}
        );
    }

    const projects = await prismaClient.project.findMany({
        where: {
            ...filters,
            client: {
                freelanceId: Number(session.user.id)
            },
            ...(endDate && {
                AND: [
                    {
                        endDate: {gte: new Date(endDate)}
                    },
                    {
                        startDate: {lte: new Date()}
                    }
                ]
            })
        }
    });

    return NextResponse.json(projects, {status: 200});
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const acceptedFileFormat: string[] = ["png", "jpg", "jpeg", "webp"];
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

    if(coverFile && acceptedFileFormat.includes(coverFile.name.split(".")[1])){
        const bytes = await coverFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDirectoryPath: string = path.join(process.cwd(), FILES_DIRECTORY);
        const newFilePath: string = path.join(uploadDirectoryPath, `cover_${Date.now()}_${coverFile.name}`);

        await writeFile(newFilePath, buffer);
    }

    const newProject = await prismaClient.project.create({
        data: {
            ...projectInformations,
            startDate: new Date(projectInformations.startDate),
            endDate: new Date(projectInformations.endDate),
            cover: coverFile ? `${FILES_DIRECTORY}/cover_${Date.now()}_${coverFile.name}` : null,
        }
    });

    return NextResponse.json(newProject, {status: 201});
}
