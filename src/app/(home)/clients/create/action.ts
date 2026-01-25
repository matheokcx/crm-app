"use server"
import {addClient} from "@/services/clientService";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";
import {Client} from "@/types";
import {redirect} from "next/dist/client/components/redirect";
import * as z from "zod";

// ==============================================

export const createClient = async (inputs: FormData): Promise<void> => {
    const session = await getServerSession(authOptions);

    if(session?.user?.id) {
        const ClientSchema = z.object({
            firstName: z.string("Ça doit être du texte")
                .min(2, "Le prénom doit avoir au minimum une longueur de 2")
                .max(100, "Le prénom doit avoir au maximum une longueur de 100"),
            lastName: z.string("Ça doit être du texte")
                .min(2, "Le nom doit avoir au minimum une longueur de 2")
                .max(100, "Le nom doit avoir au maximum une longueur de 100"),
            job: z.string("Ça doit être du texte")
                .max(100, "Le poste doit avoir au maximum une longueur de 100"),
            status: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT"]),
            birthdate: z.coerce.date().nullable(),
            mail: z.email().nullable(),
            phone: z.string().nullable(),
            image: z.union([
                z.file()
                    .mime(["image/png", "image/jpeg", "image/webp"])
                    .max(5_000_000),
                z.file().refine((file) => file.size === 0).transform(() => null),
            ]),
            gender: z.enum(["MALE", "FEMALE"])
        });

        const formDataObject = Object.fromEntries(inputs);
        const dataValide = ClientSchema.safeParse(formDataObject);

        if(dataValide.success) {
            const newClient: Client = await addClient(inputs, Number(session.user.id))

            if(newClient) {
                redirect(`/clients/${newClient.id}`);
            }
        }
        else {
            console.error("No client created");
            console.error(dataValide);
        }
    }
};
