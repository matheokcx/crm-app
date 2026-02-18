"use server"
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth/next";
import {deleteClient, editClient} from "@/services/clientService";
import {redirect} from "next/dist/client/components/redirect";

export const updateClient = async (data: FormData): Promise<void> => {
    const session = await getServerSession(authOptions);
    const clientId: number = Number(data.get("clientId") as string)

    if(session?.user?.id){
        await editClient(data, Number(session.user.id));
        redirect(`/clients/${clientId}`);
    }
};

export const removeClient = async (clientId: number): Promise<void> => {
    const session = await getServerSession(authOptions);

    if(session?.user?.id){
        await deleteClient(clientId, Number(session.user.id));
        redirect("/clients");
    }
};
