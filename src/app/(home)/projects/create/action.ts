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
            title: z.string("Cette variable doit être de type texte"),
            description: z.string("Cette variable doit être de type texte"),
            difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT"], "La difficulté doit être parmi les choix"),
            cost: z.number("Cette variable doit être de type entier").nonnegative("Le coup du projet ne peut pas être négatif"),
            clientId: z.number("Cette variable doit être de type entier").nonnegative("L'id du client ne peut pas être négatif"),
            parentProjectId: z.number().nullable(),
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
            console.error("No project created");
            console.error(dataValide);
        }
    }
};
