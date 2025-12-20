import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import {prismaClient} from "@/lib/prisma";

// ==============================================


export async function GET(request: NextRequest, { params }: { params: Promise<{id: string}>}): Promise<NextResponse> {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return NextResponse.json({ error: "Vous devez être connecté afin de pouvoir récupérer une note client" }, {status: 401});
    }

    const clientNote = await prismaClient.clientNote.findUnique({
        where: {
            id: Number(id),
            client: {
                freelanceId: Number(session.user.id)
            }
        }
    });

    if(!clientNote) {
        return NextResponse.json({error: "Cette note n'a pas pu être trouvée"}, {status: 404});
    }

    return NextResponse.json(clientNote, {status: 200});
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{id: string}>}): Promise<NextResponse> {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const body = await request.json();

    if(!session?.user){
        return NextResponse.json({ error: "Vous devez être connecté afin de pouvoir modifier une note client" }, {status: 401});
    }

    try{
        const newClientNoteVersion = await prismaClient.clientNote.update({
            where: {
                id: Number(id),
                client: {
                    freelanceId: Number(session.user.id)
                }
            },
            data: {
                ...body
            }
        });

        return NextResponse.json(newClientNoteVersion, {status: 200});
    }
    catch(error) {
        return NextResponse.json({error: "Cette note n'a pas pu être modifiée"}, {status: 404});
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{id: string}>}): Promise<NextResponse> {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return NextResponse.json({ error: "Vous devez être connecté afin de pouvoir supprimer une note client" }, {status: 401});
    }

    try{
        await prismaClient.clientNote.delete({
            where: {
                id: Number(id),
                client: {
                    freelanceId: Number(session.user.id)
                }
            }
        });

        return NextResponse.json("Note supprimée avec succès", {status: 200});
    }
    catch(error) {
        return NextResponse.json({error: "Cette note n'a pas pu être supprimée"}, {status: 404});
    }
}