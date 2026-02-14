import { NextRequest, NextResponse} from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prismaClient } from "@/lib/prisma";




export async function GET(request: NextRequest, { params } : { params: Promise<{id: string}>}): Promise<NextResponse> {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return NextResponse.json({error: "Vous devez être connecté afin de pouvoir récupérer les détails d'une réunion"}, {status: 401});
    }

    const meeting = await prismaClient.meeting.findUnique({
        where: {
            id: Number(id),
            project: {
                client: {
                    freelanceId: Number(session.user.id)
                }
            }
        }
    });

    if(!meeting){
        return NextResponse.json({error: "Cette réunion n'a pas pu être trouver"}, {status: 404});
    }

    return NextResponse.json(meeting, {status: 200});
}

export async function PATCH(request: NextRequest, { params } : { params: Promise<{id: string}>}): Promise<NextResponse>{
    const { id } = await params;
    const body = await request.json();
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return NextResponse.json({error: "Vous devez être connecté afin de pouvoir récupérer les détails d'une réunion"}, {status: 401});
    }

    try{
        const newMeetingVersion = await prismaClient.meeting.update({
            where: {
                id: Number(id),
                project: {
                    client: {
                        freelanceId: Number(session.user.id)
                    }
                }
            },
            data: {
                ...body,
                ...(body.startHour && { startHour: new Date(body.startHour) }),
                ...(body.endHour && { endHour: new Date(body.endHour) })
            }
        });

        return NextResponse.json(newMeetingVersion, {status: 200});
    }
    catch(error){
        return NextResponse.json({error: "Cette réunion n'a pas pu être modifié"}, {status: 404});
    }
}

export async function DELETE(request: NextRequest, { params } : { params: Promise<{id: string}>}): Promise<NextResponse>{
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return NextResponse.json({error: "Vous devez être connecté afin de pouvoir récupérer les détails d'une réunion"}, {status: 401});
    }

    try{
        await prismaClient.meeting.delete({
            where: {
                id: Number(id),
                project: {
                    client: {
                        freelanceId: Number(session.user.id)
                    }
                }
            }
        });

        return NextResponse.json("Réunion supprimée avec succès", {status: 200});
    }
    catch(exception){
        return NextResponse.json({error: "Cette réunion n'a pas pu être supprimé"}, {status: 404});
    }
}
