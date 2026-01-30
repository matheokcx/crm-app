"use server"
import {addProject} from "@/services/projectService";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/dist/client/components/redirect";
import {Project} from "@/types";
import * as z from "zod";

// ==============================================

export const createProject = async (data: FormData): Promise<void> => {
    const session = await getServerSession(authOptions);

    if(session?.user?.id){
        const projectSchema = z.object({
            title: z.string("Cette variable doit être de type texte")
                .min(3, "La longueur minimale du titre est de 3")
                .max(150, "La longueur maximale du titre est de 150"),
            description: z.string("Cette variable doit être de type texte")
                .min(3, "La longueur minimale de la description est de 3")
                .max(250, "La longueur maximale de la description est de 250"),
            difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT"], "La difficulté doit être parmi les choix"),
            cost: z.coerce.number("Cette variable doit être de type entier")
                .nonnegative("Le coup du projet ne peut pas être négatif"),
            clientId: z.coerce.number("Cette variable doit être de type entier")
                .nonnegative("L'id du client ne peut pas être négatif"),
            parentProjectId: z.coerce.number().nullable(),
            startDate: z.coerce.date(),
            endDate: z.coerce.date(),
            cover: z.union([
                z.file()
                    .mime(["image/png", "image/jpeg", "image/webp"])
                    .max(5_000_000),
                z.file().refine((file) => file.size === 0).transform(() => null),
            ]),
        });

        const formDataObject = Object.fromEntries(data);
        const dataValide = projectSchema.safeParse(formDataObject);

        if(dataValide.success) {
            const newProject: Project = await addProject(data, null);

            if(newProject){
                redirect(`/projects/${newProject.id}`);
            }
        }
        else{
            console.error(dataValide.error.issues);
        }
    }
};
