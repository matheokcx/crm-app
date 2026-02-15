import { prismaClient } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";



export async function GET (request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return NextResponse.json({error: "Vous devez être connecté afin de pouvoir récupérer tous vos fichiers"}, {status: 401});
    }

    const files = await prismaClient.file.findMany({
        where: {
            project: {
                client: {
                    freelanceId: Number(session?.user?.id)
                }
            }
        }
    });

    return NextResponse.json(files, {status: 200});
}
