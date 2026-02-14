import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prismaClient } from "@/lib/prisma";
import path from "path";
import fs from 'fs/promises';




export async function DELETE(request: NextRequest, { params }: { params: Promise<{id: string}>}): Promise<NextResponse> {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    let deletedFile;

    if(!session?.user){
        return NextResponse.json({error: "Vous devez être connecté afin de pouvoir effectuer cette action"}, {status: 401});
    }

    try{
        deletedFile = await prismaClient.file.delete({
            where: {
                id: Number(id),
                project: {
                    client: {
                        freelanceId: Number(session.user.id)
                    }
                }
            }
        });
    }
    catch(error){
        return NextResponse.json(
            {error: "Vous ne pouvez pas supprimer un fichier d'un projet de client qui n'est pas le vôtre"},
            {status: 401}
        );
    }

    try{
        const absoluteFilePath: string = path.join(process.cwd(), deletedFile.path);
        await fs.access(absoluteFilePath);
        await fs.unlink(absoluteFilePath);

        return NextResponse.json("Fichier supprimer avec succès", {status: 200});
    }
    catch(error){
        return NextResponse.json({error: "Ce fichier n'a pas pu être supprimé"}, {status: 500});
    }
}
