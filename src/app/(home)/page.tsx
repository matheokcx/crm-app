import styles from "./homepage.module.css";
import KpiCard from "@/components/UI/Cards/KpiCard";
import { Meeting, File, Project, Client } from "@/types";
import MeetingReduceCard from "@/components/UI/Cards/MeetingReduceCard";
import { getFormattedDate } from "@/utils/utils";
import FileCard from "@/components/UI/Cards/FileCard";
import { getAllClients, getAllProjects, getRecentFiles, getUpComingMeetings } from "@/app/(home)/action";

// ==============================================

const HomePage = async () => {
    const today: Date = new Date();
    const formattedTodayDate: string = getFormattedDate(today);

    const clients: Client[] = await getAllClients({});
    const processingProjects: Project[] = await getAllProjects({}, true);
    const meetings: (Meeting | null)[] = await getUpComingMeetings({startHour: new Date(formattedTodayDate)});
    const recentFiles: File[] = await getRecentFiles();

    return (
        <section className={styles.homePage}>
          <div className={styles.homePageSection}>
              <div className={styles.homePageSectionRow}>
                  <div className={styles.comingSoonMeetingsDiv}>
                      { meetings.map((meeting: Meeting | null, index: number) => {
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
