import { getFormattedDate } from "@/utils/utils";
import { Meeting } from "@/types";
import { headers } from "next/headers";
import { getAllUserClients } from "@/services/clientService";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import {getAllUserProjects} from "@/services/projectService";
import {getMeetings} from "@/services/meetingService";
import {getFiles} from "@/services/fileService";

// ==============================================

export const getAllClients = async (filters: any) => {
    const session = await getServerSession(authOptions);

    if(!session?.user?.id){
        return [];
    }

    return await getAllUserClients(filters, Number(session.user.id));
};

export const getAllProjects = async (filters: any, onlyProcessingProjects: boolean) => {
    const session = await getServerSession(authOptions);

    if(!session?.user?.id){
        return [];
    }

    return await getAllUserProjects(filters, Number(session.user.id), onlyProcessingProjects);
};

export const getUpComingMeetings = async (filters: any) => {
    const session = await getServerSession(authOptions);

    if(!session?.user?.id){
        return [];
    }

    const daysPrevisualisationNumber: number = 3;
    const nextThreeDays: string[] = Array.from({ length: daysPrevisualisationNumber }, (_, index) => {
        const todayDate: Date = new Date();
        todayDate.setDate(todayDate.getDate() + index);
        return getFormattedDate(todayDate);
    });

    const meetings = await getMeetings(filters, Number(session.user.id));

    const sortedMeetings: any[] = nextThreeDays.map((dateStr: string) => {
        const meetingFound = meetings.find((meeting: any) => meeting.startHour.toISOString().startsWith(dateStr));
        return meetingFound || null;
    });

    return sortedMeetings;
};

export const getRecentFiles = async (filters: any) => {
    const session = await getServerSession(authOptions);

    if(!session?.user?.id){
        return [];
    }

    return await getFiles(filters, Number(session.user.id));
};
