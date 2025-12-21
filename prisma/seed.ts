import {prismaClient} from "@/lib/prisma";
import bcrypt from "bcrypt";

async function main(): Promise<void> {
    console.log("=== Démarrage du seeding de la base de données ===");

    console.log("-- Ajout des utilisateurs --");
    await prismaClient.user.create({
        data: {
            name: "Cheam Nathan",
            email: "nathan.cheam@gmail.com",
            password: await bcrypt.hash("test12345678", 10),
            birthdate: new Date(),
            gender: "MALE"
        }
    });
}

main();
