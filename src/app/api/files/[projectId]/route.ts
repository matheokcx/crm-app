import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getMimeType } from "@/utils/utils";
import path from 'path';
import fs, {writeFile} from 'fs/promises';

// ==============================================

export const FILES_DIRECTORY: string = "public/files";
export const FILE_LIMIT_SIZE: number = 5242880;


export async function GET(request: NextRequest, { params }: { params: Promise<{projectId: string}>}): Promise<NextResponse> {
    const { projectId } = await params;
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return NextResponse.json(
            {error: "Vous avez besoin d'être connecté afin de pouvoir récupérer les fichiers d'un projet"},
            {status: 401}
        );
    }

    const files = await prismaClient.file.findMany({
        where: {
            projectId: Number(projectId),
            project: {
                client: {
                    freelanceId: Number(session.user.id),
                }
            }
        }
    });

    try{
        const filesData = await Promise.all(files.map(async (file) => {
            const filePath: string = path.join(process.cwd(), file.path);

            try {
                const fileBuffer = await fs.readFile(filePath);
                const base64Content: string = fileBuffer.toString('base64');

                return {
                    id: file.id,
                    name: path.basename(file.path),
                    mimeType: getMimeType(file.path),
                    content: base64Content,
                    size: fileBuffer.length
                };
            }
            catch (error) {
                console.error(`Erreur lecture fichier ${file.path}`, error);
                return null;
            }
        }));

        const validFiles = filesData.filter((file) => file !== null);
        return NextResponse.json(validFiles, { status: 200 });
    }
    catch (error){
        return NextResponse.json({ error: "Fichier(s) non trouvé(s)" }, { status: 404 });
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{projectId: string}>}): Promise<NextResponse> {
    const { projectId } = await params;
    const formData: FormData = await request.formData();
    const file = formData.get("file") as File;
    const acceptedFileFormats: string[] = ["png", "jpg", "jpeg", "webp", "pdf", "csv", "txt"];

    if(!file){
        return NextResponse.json({error: "Fichier non récupéré"}, {status: 400});
    }

    if(!acceptedFileFormats.includes(file.name.split(".")[1])){
        return NextResponse.json({error: "Format de fichier non-conforme"}, {status: 400});
    }

    if(file.size > FILE_LIMIT_SIZE){
        return NextResponse.json({error: "Fichier trop volumineux"}, {status: 400});
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDirectoryPath: string = path.join(process.cwd(), FILES_DIRECTORY);
    const newFilePath: string = path.join(uploadDirectoryPath, file.name);

    await writeFile(newFilePath, buffer);

    await prismaClient.file.create({
        data: {
            name: file.name.split(".")[0],
            path: `${FILES_DIRECTORY}/${file.name}`,
            type: file.name.split(".")[1],
            projectId: Number(projectId)
        }
    });

    return NextResponse.json("Fichier(s) envoyé(s) avec succès", { status: 201 });
}

