import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

// ==============================================


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return NextResponse.json({ error: "Vous avez besoin d'être connecté afin de pouvoir récupérer un client." }, {status: 401});
    }

    const client = await prismaClient.client.findUnique({
        where:{
            id: Number(id),
            freelanceId: Number(session.user.id)
        }
    });

    if(!client){
        return NextResponse.json({error: "Ce client n'a pas pu être trouvé"}, {status: 404})
    }

    return NextResponse.json(client, {status: 200});
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const body = await request.json();

    if(!session?.user){
        return NextResponse.json({ error: "Vous avez besoin d'être connecté afin de pouvoir récupérer un client." }, {status: 401});
    }

    try {
        const updatedClient = await prismaClient.client.update({
            where: {
                id: Number(id),
                freelanceId: Number(session.user.id),
            },
            data: {
                ...body
            }
        });

        return NextResponse.json(updatedClient, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: "Client introuvable ou non autorisé." }, { status: 404 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return NextResponse.json({ error: "Vous avez besoin d'être connecté afin de pouvoir récupérer un client." }, {status: 401});
    }

    try {
        await prismaClient.client.delete({
            where: {
                id: Number(id),
                freelanceId: Number(session.user.id)
            }
        });

        return NextResponse.json("Client supprimé avec succès", { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: "Client introuvable ou non autorisé." }, { status: 404 });
    }
}
