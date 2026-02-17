"use server"
import {getServerSession} from "next-auth/next";
import {getClient} from "@/services/clientService";
import {Project} from "@/types";
import {deleteProject} from "@/services/projectService";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/dist/client/components/redirect";

export const removeProject = async (project: Project): Promise<void> => {
    const session = await getServerSession(authOptions);

    if(session?.user?.id){
        const projectClient = await getClient(project.clientId, Number(session.user.id));
        if(projectClient){
            await deleteProject(project.id, Number(session.user.id));
            redirect("/projects");
        }
    }
};
