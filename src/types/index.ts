export type Gender = "MALE" | "FEMALE";

export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    phoneNumber: string | null;
    birthdate: Date;
    gender: Gender;
    country: string;
    createdAt: Date;
    updatedAt: Date | null;
    emailVerified: Date | null;
    image?: string | null;
};

export type ProjectDifficulty = "EASY" | "MEDIUM" | "HARD" | "EXPERT";

export type ClientStatus = "LEAD" | "SIGNED" | "LOST" | "ARCHIVED";

export type Client = {
    id: number;
    firstName: string;
    lastName: string;
    job: string;
    status: ClientStatus;
    links: string[];
    birthdate: Date | null;
    mail: string | null;
    phone: string | null;
    image: string | null;
    gender: Gender;
    freelanceId: number;
};

export type Project = {
    id: number;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    cost: number;
    cover: string | null;
    difficulty: ProjectDifficulty;
    parentProjectId: number | null;
    clientId: number;
};

export type Meeting = {
    id: number;
    title: string;
    description: string | null;
    startHour: Date;
    endHour: Date;
    projectId: number;
};

export type File = {
    id: number;
    name: string;
    path: string;
    type: string;
    projectId: number;
};

export type ClientNote = {
    id: number;
    text: string;
    createdAt: Date;
    clientId: number;
};
