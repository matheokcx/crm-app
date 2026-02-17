"use server"

import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth/next";
import {deleteClient} from "@/services/clientService";
import {redirect} from "next/dist/client/components/redirect";

export const removeClient = async (clientId: number): Promise<void> => {
    const session = await getServerSession(authOptions);

    if(session?.user?.id){
        await deleteClient(clientId, Number(session.user.id));
        redirect("/clients");
    }
};
