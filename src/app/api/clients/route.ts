import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

// ==============================================


export async function GET (request: NextRequest): Promise<NextResponse> {
    const clients = await prismaClient.client.findMany();
    return NextResponse.json(clients, { status: 200 });
}

export async function POST (request: NextRequest): Promise<NextResponse> {
    const { firstName, lastName, job, status, birthdate } = await request.body;

    if(!firstName || !lastName ||  !job ||  !status ||  !birthdate){
        return NextResponse.json({error: "Il manque des champs afin de créer le client"}, {status: 400});
    }

    const [newClient] = await Promise.all([prismaClient.client.create({
        data: {
            firstName: firstName,
            lastName: lastName,
            job: job,
            status: status,
            links: [],
            birthdate: new Date(birthdate)
        }
    })]);

    return NextResponse.json(newClient, {status: 201});
}