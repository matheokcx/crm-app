"use server"
import { addClient } from "@/services/clientService";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Client } from "@/types";
import { redirect } from "next/dist/client/components/redirect";
import path from "path";
import {writeFile} from "fs/promises";

// ==============================================

export const createClient = async (inputs: FormData): Promise<void> => {
    const session = await getServerSession(authOptions);

    if(session?.user?.id) {
        const newClient: Client = await addClient(inputs, Number(session.user.id))

        if(newClient) {
            redirect(`/clients/${newClient.id}`);
        }
    }
};
