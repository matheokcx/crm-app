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
    birthdate?: Date;
    mail?: string | null;
    phone?: string | null;
    image?: string | null;
    gender: Gender;
    freelance: User;
    projects: Project[];
    notes: ClientNote[];
};

export type Project = {
    id: number;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    cost: number;
    cover?: string | null;
    difficulty: ProjectDifficulty;
    parentProject?: Project | null;
    subProjects: Project[];
    client: Client;
    meetings: Meeting[];
    files: File[];
};

export type Meeting = {
    id: number;
    title: string;
    description?: string | null;
    startHour: string;
    endHour: string;
    project: Project;
};

export type File = {
    id: number;
    name: string;
    path: string;
    type: string;
    project: Project;
};

export type ClientNote = {
    id: number;
    text: string;
    createdAt: Date;
    client: Client;
};
