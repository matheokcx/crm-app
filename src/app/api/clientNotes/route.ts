import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prismaClient } from "@/lib/prisma";

// ==============================================


export async function GET(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return NextResponse.json({error: "Vous devez être connecté afin de pouvoir consulter les notes de client"}, {status: 401});
    }

    const clientNotes = await prismaClient.clientNote.findMany({
        where: {
            client: {
                freelanceId: Number(session.user.id)
            }
        }
    });

    return NextResponse.json(clientNotes, {status: 200});
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const body = await request.json();
    const session = await getServerSession(authOptions);

    if(!body.text || !body.clientId){
        return NextResponse.json({error: "Il manque des champs afins de pouvoir ajouter cette note de client"}, {status: 400});
    }

    if(!session?.user){
        return NextResponse.json({error: "Vous devez être connecté pour faire cette action"}, {status: 401});
    }

    const client = await prismaClient.client.findUnique({
        where: {
            id: Number(body.clientId),
            freelanceId: Number(session.user.id)
        }
    });

    if(!client){
        return NextResponse.json({error: "Vous ne pouvez pas ajouter de note à un client qui n'est pas le vôtre"}, {status: 401});
    }

    const newClientNote = await prismaClient.clientNote.create({
        data: {
            ...body
        }
    });

    return NextResponse.json(newClientNote, {status: 201});
}
