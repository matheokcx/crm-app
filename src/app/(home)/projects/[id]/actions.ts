"use server"
import {getServerSession} from "next-auth/next";
import {Project} from "@/types";
import {deleteProject, editProject} from "@/services/projectService";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/dist/client/components/redirect";

export const removeProject = async (project: Project): Promise<void> => {
    const session = await getServerSession(authOptions);

    if(session?.user?.id){
        await deleteProject(project.id, Number(session.user.id));
        redirect("/projects");
    }
};

export const updateProject = async (data: FormData): Promise<void> => {
    const session = await getServerSession(authOptions);
    const projectId: number = Number(data.get("projectId") as string);

    if(session?.user?.id){
        await editProject(data);
        redirect(`/projects/${projectId}`);
    }
};
