import HomeSideBar from "@/components/Layout/HomeSideBar";
import styles from "./homepage.module.css";
import KpiCard from "@/components/UI/Cards/KpiCard";
import { Meeting, File } from "@/types";
import MeetingReduceCard from "@/components/UI/Cards/MeetingReduceCard";
import { useSession } from "next-auth/react";
import { getFormattedDate } from "@/utils/utils";
import FileCard from "@/components/UI/Cards/FileCard";
import { getHomePageData } from "@/app/action";

// ==============================================

const HomePage = async () => {
    //const session = useSession();
    const [clients, processingProjects, recentFiles, meetings] = await getHomePageData();

    return (
        <main className={styles.homePage}>
          <section className={styles.homePageSection}>
              {/*<h1>Bonjour {session.data?.user?.name} !</h1>*/}
              <div className={styles.homePageSectionRow}>
                  <div style={{width: "50%"}} className={styles.comingSoonMeetingsDiv}>
                      { meetings.map((meeting: Meeting | null, index: number) => {
                          const todayDate = new Date();
                          todayDate.setDate(todayDate.getDate() + index);
                          const dateLabel: string = getFormattedDate(todayDate);

                          return <MeetingReduceCard key={index}
                                                    weekDay={meeting ? meeting.startHour : dateLabel}
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
                  <div style={{width: "50%"}} className={styles.recentFilesDiv}>
                      <label>Fichiers récents:</label>
                      <div className={styles.filesDiv}>
                          {recentFiles.map((file: File) => <FileCard key={file.id} file={file} />)}
                      </div>
                  </div>
                  <div style={{width: "50%"}}></div>
              </div>
          </section>
        </main>
    );
};

export default HomePage;
