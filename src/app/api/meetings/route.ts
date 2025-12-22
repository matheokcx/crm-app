import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prismaClient } from "@/lib/prisma";

// ==============================================


export async function GET(request: NextRequest): Promise<NextResponse>{
    const session = await getServerSession(authOptions);
    const projectId: string | null = request.nextUrl.searchParams.get("projectId");

    if(!session?.user){
        return NextResponse.json({error: "Vous avez besoin d'être connecté afin de pouvoir récupérer la liste de vos réunions"}, {status: 401})
    }

    const meetings = await prismaClient.meeting.findMany({
        where: {
            project: {
                client: {
                    freelanceId: Number(session.user.id)
                },
                ...(projectId && {id: Number(projectId)}),
            }
        }
    });

    return NextResponse.json(meetings, {status: 200});
}

export async function POST(request: NextRequest): Promise<NextResponse>{
    const body = await request.json();

    if(!body.title || !body.startHour || !body.endHour || !body.projectId){
        return NextResponse.json({error: "Il manque des champs afin de pouvoir ajouter une réunion"});
    }

    const newMeeting = await prismaClient.meeting.create({
        data: {
            ...body,
            startHour: new Date(body.startHour),
            endHour: new Date(body.endHour)
        }
    });

    return NextResponse.json(newMeeting, {status: 201});
}
