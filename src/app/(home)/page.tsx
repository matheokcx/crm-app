import styles from "./homepage.module.css";
import KpiCard from "@/components/UI/Cards/KpiCard";
import { Meeting, File, Project, Client } from "@/types";
import MeetingReduceCard from "@/components/UI/Cards/Meeting/MeetingReduceCard";
import { getFormattedDate } from "@/utils/utils";
import FileCard from "@/components/UI/Cards/File/FileCard";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAllUserClients } from "@/services/clientService";
import { getAllUserProjects } from "@/services/projectService";
import { getFiles } from "@/services/fileService";
import { getMeetings } from "@/services/meetingService";

// ==============================================

const HomePage = async () => {
    const session = await getServerSession(authOptions);
    const today: Date = new Date();
    const formattedTodayDate: string = getFormattedDate(today);

    if(!session?.user?.id){
        return <p>Vous n'êtes pas connecté ...</p>;
    }

    const clients: Client[] = await getAllUserClients({}, Number(session.user.id));
    const processingProjects: Project[] = await getAllUserProjects({}, Number(session.user.id), true);
    const recentFiles: File[] = await getFiles(Number(session.user.id));

    const daysPrevisualisationNumber: number = 3;
    const nextThreeDays: string[] = Array.from({ length: daysPrevisualisationNumber }, (_, index: number) => {
        const todayDate: Date = new Date();
        todayDate.setDate(todayDate.getDate() + index);
        return getFormattedDate(todayDate);
    });
    const meetings: Meeting[] = await getMeetings({startHour: new Date(formattedTodayDate)}, Number(session.user.id));

    const comingMeetings: (Meeting | null)[] = nextThreeDays.map((dateStr: string) => {
        const meetingFound: Meeting | undefined = meetings.find((meeting: Meeting) => meeting.startHour.toISOString().startsWith(dateStr));
        return meetingFound || null;
    });

    return (
        <section className={styles.homePage}>
          <div className={styles.homePageSection}>
              <div className={styles.homePageSectionRow}>
                  <div className={styles.comingSoonMeetingsDiv}>
                      {comingMeetings.map((meeting: Meeting | null, index: number) => {
                          const todayDate = new Date();
                          todayDate.setDate(todayDate.getDate() + index);
                          const dateLabel: string = getFormattedDate(todayDate);

                          return <MeetingReduceCard key={index}
                                                    weekDay={meeting ? meeting.startHour : new Date(dateLabel)}
                                                    meetingTitle={meeting?.title}
                          />
                      })}
                  </div>
                  <div className={styles.kpisDiv}>
                      <KpiCard name="Clients" value={clients.length} />
                      <KpiCard name="Projets en cours" value={processingProjects.length} />
                  </div>
              </div>
              <div className={styles.homePageSectionRow}>
                  <div className={styles.recentFilesDiv}>
                      <label>Fichiers récents:</label>
                      <div className={styles.filesDiv}>
                          {recentFiles.map((file: File) => <FileCard key={file.id} file={file} />)}
                      </div>
                  </div>
                  <div style={{width: "50%"}}></div>
              </div>
          </div>
        </section>
    );
};

export default HomePage;
