import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { prismaClient } from "@/lib/prisma";

// ==============================================


export async function GET(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return NextResponse.json({error: "Vous avez besoin d'être connecté afin de récupérer la liste de vos projets"}, {status: 401})
    }

    const projects = await prismaClient.project.findMany({
        where: {
            client: {
                freelanceId: Number(session.user.id)
            }
        }
    })

    return NextResponse.json(projects, {status: 200});
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const body = await request.json();

    if(
        !body.title ||
        !body.description ||
        !body.startDate ||
        !body.endDate ||
        !body.cost ||
        !body.difficulty ||
        !body.clientId
    ){
        return NextResponse.json({error: "Il manque des informations afin de pouvoir ajouter ce projet."}, {status: 400});
    }

    const newProject = await prismaClient.project.create({
        data: {
            ...body,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate)
        }
    });

    return NextResponse.json(newProject, {status: 201});
}
