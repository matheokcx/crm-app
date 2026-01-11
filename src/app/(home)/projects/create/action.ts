"use server"
import { addProject } from "@/services/projectService";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/dist/client/components/redirect";
import { Project } from "@/types";

// ==============================================

export const createProject = async (data: FormData): Promise<void> => {
    const session = await getServerSession(authOptions);

    if(session?.user?.id){
        const newProject: Project = await addProject(data, null);
        if(newProject){
            redirect(`/projects/${newProject.id}`);
        }
    }
};
