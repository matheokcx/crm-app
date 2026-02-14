"use server";
import {editClient} from "@/services/clientService";
import {getServerSession} from "next-auth/next";

export const updateClient = async (data: FormData): Promise<void> => {
    const session = await getServerSession();

    if(session?.user?.id){
        console.log(data);
        editClient(data, Number(session.user.id));
    }
};
