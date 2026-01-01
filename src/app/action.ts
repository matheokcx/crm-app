import { getFormattedDate } from "@/utils/utils";
import { Meeting } from "@/types";
import { headers } from "next/headers";
import { getAllUserClients } from "@/services/clientService";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import {getAllUserProjects} from "@/services/projectService";
import {getMeetings} from "@/services/meetingService";

// ==============================================

export const getHomePageData = async (): Promise<any[]> => {
    const headersList = await headers();
    const today: Date = new Date();
    const formattedTodayDate: string = getFormattedDate(today);

    const responses = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/clients`, {headers: headersList}),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects?endDate=${formattedTodayDate}`, {headers: headersList}),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/files`, {headers: headersList}),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meetings?startHour=${formattedTodayDate}`, {headers: headersList})
    ]);

    const data = await Promise.all(
        responses.map(async (response) => {
            const datas = await response.json();
            if (!response.ok){
                //toast.error(datas.error);
                return [];
            }
            return datas;
        })
    );

    const [clientsData, projectsData, recentFilesData, meetingsData] = data;

    const daysPrevisualisationNumber: number = 3;

    const nextThreeDays: string[] = Array.from({ length: daysPrevisualisationNumber }, (_, index) => {
        const todayDate: Date = new Date();
        todayDate.setDate(todayDate.getDate() + index);
        return getFormattedDate(todayDate);
    });

    const sortedMeetings: Meeting[] = nextThreeDays.map((dateStr: string) => {
        const meetingFound: Meeting = meetingsData.find((meeting: Meeting) => meeting.startHour.startsWith(dateStr));
        return meetingFound || null;
    });

    //toast.success("Données récupérés avec succès");
    return [clientsData, projectsData, recentFilesData, sortedMeetings];
}

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
        const meetingFound = meetings.find((meeting: any) => String(meeting.startHour).startsWith(dateStr));
        return meetingFound || null;
    });

    return sortedMeetings;
};