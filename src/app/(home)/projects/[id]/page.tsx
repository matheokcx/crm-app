import { getProject } from "@/services/projectService";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Client, Meeting, Project, ProjectDifficulty, File } from "@/types";
import Image from "next/image";
import styles from "./project-details-page.module.css";
import Separator from "@/components/UI/Separator";
import { ArrowRight, CalendarCheck, CalendarDot, CellSignalFull, CellSignalHigh, CellSignalLow, CellSignalMedium, Envelope, Money, Phone } from "@phosphor-icons/react/ssr";
import { JSX } from "react";
import { getClient } from "@/services/clientService";
import Avatar from "@/components/UI/Avatar";
import {getMeetings} from "@/services/meetingService";
import { getFilesByProject } from "@/services/fileService";
import FileCard from "@/components/UI/Cards/FileCard";
import BackButton from "@/components/UI/Buttons/BackButton";
import MeetingReduceCard from "@/components/UI/Cards/MeetingReduceCard";

// ==============================================

const ProjectDetailPage = async ({params}: {params: Promise<{id: string}>}) => {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const project: Project | null = await getProject(Number(id), Number(session?.user?.id));

    if(!project){
        return <p>Ce projet n'a pas pu être retrouvé...</p>;
    }

    const client: Client | null = await getClient(project.clientId, Number(session?.user?.id));
    const projectMeetings: Meeting[] = await getMeetings({projectId: project.id}, Number(session?.user?.id))
    const files: File[] = await getFilesByProject(Number(project.id), Number(session?.user?.id));
    const getDifficultyIcon = (projectDifficulty: ProjectDifficulty): JSX.Element => {
        switch(projectDifficulty){
            case "EASY":
                return <CellSignalLow size={32} color="#22c55e" />;
            case "MEDIUM":
                return <CellSignalMedium size={32} color="#eab308" />;
            case "HARD":
                return <CellSignalHigh size={32} color="#f97316" />;
            case "EXPERT":
                return <CellSignalFull size={32} color="#ef4444" />;
        }
    };

    return (
        <section className={styles.projectDetailsPage}>
            <div className={styles.backButtonContainer}>
                <BackButton />
            </div>
            {project.cover && <Image src={project.cover}
                                     alt="Project cover"
                                     width={100}
                                     height={20}
                                     className={styles.projectCover}
            />}
            <div className={styles.pageBody}>
                <h1>{project.title}</h1>
                <div className={styles.deadline}>
                    <CalendarDot size={24} />
                    <p>{project.startDate.toISOString().split("T")[0]}</p>
                    <ArrowRight />
                    <CalendarCheck size={24} />
                    <p>{project.endDate.toISOString().split("T")[0]}</p>
                </div>
                <Separator widthPercent={100} />
                <div className={styles.projectInformation}>
                    <div className={styles.projectDetails}>
                        <p>{project.description}</p>
                        <div>
                            <div className={styles.earnedMoneyLine}>
                                <Money size={24} />
                                <u>Gain total: </u>
                                <b>{project.cost}€</b>
                            </div>
                            <div className={styles.earnedMoneyLine}>
                                <div>{getDifficultyIcon(project.difficulty)}</div>
                                <p>{project.difficulty.toLowerCase()}</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.projectRelationInformation}>
                        {client && (
                            <div className={styles.projectRelationPart} style={{width: "30%"}}>
                                <Avatar firstName={client.firstName} lastName={client.lastName} image={client.image} />
                                <h3>{client.firstName} {client.firstName}</h3>
                                <p>{client.job}</p>
                                <div style={{marginTop: "10px"}}>
                                    {client.mail && (
                                        <span className={styles.contactLine}>
                                            <Envelope size={24} />
                                            <a href={`mailto:${client.mail}`}>{client.mail}</a>
                                        </span>
                                    )}
                                    {client.phone && (
                                        <span className={styles.contactLine}>
                                            <Phone size={24} />
                                            <a href={`tel:${client.phone}`}>{client.phone}</a>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className={styles.projectRelationPart}>
                            <h2>Réunions associées</h2>
                            {projectMeetings.map((meeting: Meeting, index: number) => (
                                <MeetingReduceCard key={index} meetingTitle={meeting.title} weekDay={meeting.startHour} />
                            ))}
                        </div>
                    </div>
                    <div className={styles.projectFilesSection}>
                        {files.map((file: File) => <FileCard key={file.id} file={file} />)}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectDetailPage;
