"use server"
import {getServerSession} from "next-auth/next";
import {Project} from "@/types";
import {deleteProject, editProject} from "@/services/projectService";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/dist/client/components/redirect";
import {z} from "zod";

export const updateProject = async (data: FormData): Promise<void> => {
    const session = await getServerSession(authOptions);
    const projectId: number = Number(data.get("projectId") as string);

    console.log(data);

    const updateProjectValidationSchema = z.object({
        title: z.string()
            .min(3, "La longueur minimale du titre est de 3")
            .max(150, "La longueur maximale du titre est de 150"),
        description: z.string()
            .min(3, "La longueur minimale de la description est de 3")
            .max(250, "La longueur maximale de la description est de 250"),
        difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT"], "La difficulté doit être parmi les choix"),
        cost: z.coerce.number("Cette variable doit être de type entier")
            .nonnegative("Le coup du projet ne peut pas être négatif"),
        clientId: z.coerce.number("Cette variable doit être de type entier")
            .nonnegative("L'id du client ne peut pas être négatif"),
        parentProjectId: z.coerce.number().refine((value: number) => value === 0).transform(() => null).nullable(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        cover: z.union([
            z.file()
                .mime(["image/png", "image/jpeg", "image/webp"])
                .max(5_000_000),
            z.file().refine((file) => file.size === 0).transform(() => null)
        ])
    });
    const formDataObject = Object.fromEntries(data);
    const validate = updateProjectValidationSchema.safeParse(formDataObject);

    if(session?.user?.id){
        if(validate.success){
            await editProject(validate.data, projectId);
            redirect(`/projects/${projectId}`);
        }
        else {
            console.error(validate.error.issues);
        }
    }
};

export const removeProject = async (project: Project): Promise<void> => {
    const session = await getServerSession(authOptions);

    if(session?.user?.id){
        await deleteProject(project.id, Number(session.user.id));
        redirect("/projects");
    }
};
