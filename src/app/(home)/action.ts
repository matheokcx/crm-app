"use server"
import { getFormattedDate } from "@/utils/utils";
import {Client, Meeting, Project, File, ClientStatus, Gender, ProjectDifficulty} from "@/types";
import { getAllUserClients } from "@/services/clientService";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { getAllUserProjects } from "@/services/projectService";
import { getMeetings } from "@/services/meetingService";
import { getFiles } from "@/services/fileService";

// ==============================================

type getAllClientsFilters = {
    status?: ClientStatus;
    gender?: Gender;
};

type getAllProjectsFilters = {
    clientId?: number;
    difficulty?: ProjectDifficulty;
};

type getUpComingMeetingsFilters = {
    projectId?: number;
    startHour?: Date;
};

export const getAllClients = async (filters: getAllClientsFilters): Promise<Client[]> => {
    const session = await getServerSession(authOptions);

    if(!session?.user?.id){
        return [];
    }

    return await getAllUserClients(filters, Number(session.user.id));
};

export const getAllProjects = async (filters: getAllProjectsFilters, onlyProcessingProjects: boolean): Promise<Project[]> => {
    const session = await getServerSession(authOptions);

    if(!session?.user?.id){
        return [];
    }

    return await getAllUserProjects(filters, Number(session.user.id), onlyProcessingProjects);
};

export const getUpComingMeetings = async (filters: getUpComingMeetingsFilters): Promise<Array<Meeting | null>> => {
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

    return nextThreeDays.map((dateStr: string) => {
        const meetingFound = meetings.find((meeting: Meeting) => meeting.startHour.toISOString().startsWith(dateStr));
        return meetingFound || null;
    });
};

export const getRecentFiles = async (): Promise<File[]> => {
    const session = await getServerSession(authOptions);

    if(!session?.user?.id){
        return [];
    }

    return await getFiles(Number(session.user.id));
};
