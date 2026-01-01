import { getFormattedDate } from "@/utils/utils";
import { Meeting } from "@/types";
import { headers } from "next/headers"; // Import nécessaire

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