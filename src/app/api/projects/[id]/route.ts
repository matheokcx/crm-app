import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { prismaClient } from "@/lib/prisma";

// ==============================================


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return NextResponse.json({error: "Vous devez être connecté afin de pouvoir récupérer un projet"}, {status: 401});
    }

    const project = await prismaClient.project.findUnique({
        where: {
            id: Number(id),
            client: {
                freelanceId: Number(session.user.id),
            }
        }
    });

    if(!project) {
        return NextResponse.json({error: "Ce project n'a pas pu être trouvé"}, {status: 404});
    }

    return NextResponse.json(project, {status: 200});
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    let body = await request.json();

    if(!session?.user){
        return NextResponse.json({error: "Vous devez être connecté afin de pouvoir modifier un projet"}, {status: 401});
    }

    try{
        const project = await prismaClient.project.update({
            where: {
                id: Number(id),
                client: {
                    freelanceId: Number(session.user.id),
                }
            },
            data: {
                ...body,
                ...(body.startDate && { startDate: new Date(body.startDate) }),
                ...(body.endDate && { endDate: new Date(body.endDate) })
            }
        });

        return NextResponse.json(project, {status: 200});
    }
    catch (error) {
        return NextResponse.json({error: "Ce project n'a pas pu être trouvé"}, {status: 404});
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return NextResponse.json({error: "Vous devez être connecté afin de pouvoir modifier un projet"}, {status: 401});
    }

    try{
        await prismaClient.project.delete({
            where: {
                id: Number(id),
                client: {
                    freelanceId: Number(session.user.id)
                }
            }
        });

        return NextResponse.json("Project supprimé avec succès", {status: 200});
    }
    catch (error) {
        return NextResponse.json({error: "Ce project n'a pas pu être trouvé"}, {status: 404});
    }
}
