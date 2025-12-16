import { NextRequest, NextResponse } from "next/server";
import { User } from "@/generated/prisma";
import { prismaClient } from "@/lib/prisma";
import bcrypt from 'bcrypt';

// ==============================================


export async function POST(request: NextRequest) {
    try {
        const { email, password, name, birthdate, gender, country } = await request.json();

        if (!email || !password || !name || !birthdate) {
            return NextResponse.json({ error: "Des informations sont manquantes pour finaliser l'inscription." }, { status: 400 });
        }

        const existingUser = await prismaClient.user.findUnique({ where: { email: email } });

        if (existingUser) {
            return NextResponse.json({ error: "Cette email est déjà utilisé par un autre utilisateur" }, { status: 409 });
        }

        if(password.length < 12){
            return NextResponse.json({ error: "Le mot de passe doit contenir au moins 12 caractères." }, { status: 400 });
        }

        const user: User = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: await bcrypt.hash(password, 10),
                birthdate: new Date(birthdate),
                gender: gender,
                country: country
            }
        });

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
    }
    catch (error: any) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        return NextResponse.json({ error: "Une erreur est survenue lors de la création du compte.", details: error.message }, { status: 500 });
    }
}
