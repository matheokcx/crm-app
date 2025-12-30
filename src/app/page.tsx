"use client"
import HomeSideBar from "@/components/Layout/HomeSideBar";
import styles from "./homepage.module.css";
import KpiCard from "@/components/UI/Cards/KpiCard";
import { useEffect, useState } from "react";
import {Meeting, File, Client, Project} from "@/types";
import MeetingReduceCard from "@/components/UI/Cards/MeetingReduceCard";
import { useSession } from "next-auth/react";
import { getFormattedDate } from "@/utils/utils";
import toast from "react-hot-toast";
import FileCard from "@/components/UI/Cards/FileCard";
import Skeleton from "@/components/UI/Skeleton";

// ==============================================

const HomePage = () => {
    const session = useSession();
    const today: Date = new Date();
    const formattedTodayDate: string = getFormattedDate(today);

    const [meetings, setMeetings] = useState<any[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [processingProjects, setProcessingProjects] = useState<Project[]>([]);
    const [recentFiles, setRecentFiles] = useState<File[]>([]);
    const [dataAreLoading, setDataAreLoading] = useState<boolean>(false);

    useEffect(() => {
        const func = async () => {
            setDataAreLoading(true);
            const responses = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/clients`),
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects?endDate=${formattedTodayDate}`),
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/files`),
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meetings?startHour=${formattedTodayDate}`)
            ]);

            const data = await Promise.all(
                responses.map(async (response) => {
                    const datas = await response.json();
                    if (!response.ok){
                        toast.error(datas.error);
                        return [];
                    }
                    return datas;
                })
            );

            const [clientsData, projectsData, recentFilesData, meetingsData] = data;

            setClients(clientsData);
            setProcessingProjects(projectsData);
            setRecentFiles(recentFilesData);

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

            setMeetings(sortedMeetings);

            setDataAreLoading(false);
            toast.success("Données récupérés avec succès");
        }
        func();
    }, []);

    return (
    <main className={styles.homePage}>
      <HomeSideBar />
      <section className={styles.homePageSection}>
          <h1>Bonjour {session.data?.user?.name} !</h1>
          <div className={styles.homePageSectionRow}>
              <div style={{width: "50%"}} className={styles.comingSoonMeetingsDiv}>
                  {
                      dataAreLoading ? Array.from({length: 3}).map((_, index) => (
                          <div key={index} style={{width: "100%"}}>
                              <Skeleton width="100%" height="30px" />
                              <br/>
                              <Skeleton width="100%" height="100px" />
                          </div>
                      )) : meetings.map((meeting: Meeting | null, index: number) => {
                      const todayDate = new Date();
                      todayDate.setDate(todayDate.getDate() + index);
                      const dateLabel: string = getFormattedDate(todayDate);

                      return <MeetingReduceCard key={index} weekDay={meeting ? meeting.startHour : dateLabel} meetingTitle={meeting?.title}/>
                  })}
              </div>
              <div className={styles.kpisDiv}>
                  {dataAreLoading ? <Skeleton width="100%" height="100%" /> : <KpiCard name="Clients" value={clients.length} />}
                  {dataAreLoading ? <Skeleton width="100%" height="100%" /> : <KpiCard name="Projets en cours" value={processingProjects.length} />}
              </div>
          </div>
          <div className={styles.homePageSectionRow}>
              <div style={{width: "50%"}} className={styles.recentFilesDiv}>
                  <label>Fichiers récents:</label>
                  <div className={styles.filesDiv}>
                      {
                          dataAreLoading ? Array.from({length: 4}).map((_, index) => (
                              <Skeleton key={index} width="100%" height="200px" />
                              )) : recentFiles.map((file: File) => <FileCard key={file.id} file={file} />)
                      }
                  </div>
              </div>
              <div style={{width: "50%"}}></div>
          </div>
      </section>
    </main>
  );
};

export default HomePage;
