"use server"
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";
import {ClientStatus, GENDER} from "@/generated/prisma";
import {addClient, deleteClient, editClient} from "@/services/clientService";
import {redirect} from "next/dist/client/components/redirect";
import {Client} from "@/types";
import z from "zod";

export const createClient = async (inputs: FormData): Promise<void> => {
    const session = await getServerSession(authOptions);

    if(session?.user?.id) {
        const ClientSchema = z.object({
            firstName: z.string()
                .min(2, "Le prénom doit avoir au minimum une longueur de 2")
                .max(100, "Le prénom doit avoir au maximum une longueur de 100"),
            lastName: z.string()
                .min(2, "Le nom doit avoir au minimum une longueur de 2")
                .max(100, "Le nom doit avoir au maximum une longueur de 100"),
            job: z.string()
                .max(100, "Le poste doit avoir au maximum une longueur de 100"),
            status: z.enum(Object.values(ClientStatus)),
            birthdate: z.union([
                z.literal('').transform(() => null),
                z.coerce.date(),
            ]).nullable(),
            mail: z.union([
                z.literal('').transform(() => null),
                z.string().email(),
            ]).nullable(),
            phone: z.union([
                z.literal('').transform(() => null),
                z.string(),
            ]).nullable(),
            image: z.union([
                z.file()
                    .mime(["image/png", "image/jpeg", "image/webp"])
                    .max(5_000_000),
                z.file().refine((file) => file.size === 0).transform(() => null),
            ]),
            gender: z.enum(Object.values(GENDER))
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

export const updateClient = async (data: FormData): Promise<void> => {
    const session = await getServerSession(authOptions);
    const clientId: number = Number(data.get("clientId") as string);

    const clientUpdateSchema = z.object({
        firstName: z.string()
            .min(2, "Le prénom doit avoir au minimum une longueur de 2")
            .max(100, "Le prénom doit avoir au maximum une longueur de 100"),
        lastName: z.string()
            .min(2, "Le nom doit avoir au minimum une longueur de 2")
            .max(100, "Le nom doit avoir au maximum une longueur de 100"),
        job: z.string()
            .max(100, "Le poste doit avoir au maximum une longueur de 100"),
        status: z.enum(Object.values(ClientStatus)),
        birthdate: z.union([
            z.literal('').transform(() => null),
            z.coerce.date(),
        ]).nullable(),
        mail: z.union([
            z.literal('').transform(() => null),
            z.string().email(),
        ]).nullable(),
        phone: z.union([
            z.literal('').transform(() => null),
            z.string(),
        ]).nullable(),
        image: z.union([
            z.file()
                .mime(["image/png", "image/jpeg", "image/webp"])
                .max(5_000_000),
            z.file().refine((file) => file.size === 0).transform(() => null),
        ]),
        gender: z.enum(Object.values(GENDER))
    });
    const formDataObject = Object.fromEntries(data);
    const isValid = clientUpdateSchema.safeParse(formDataObject);

    if(session?.user?.id){
        if(isValid.success){
            await editClient(isValid.data, clientId, Number(session.user.id));
            redirect(`/clients/${clientId}`);
        }
        else {
            console.error(isValid.error.issues);
        }
    }
};

export const removeClient = async (clientId: number): Promise<void> => {
    const session = await getServerSession(authOptions);

    if(session?.user?.id){
        await deleteClient(clientId, Number(session.user.id));
        redirect("/clients");
    }
};
