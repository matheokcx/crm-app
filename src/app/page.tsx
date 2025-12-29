"use client"
import HomeSideBar from "@/components/Layout/HomeSideBar";
import styles from "./homepage.module.css";
import KpiCard from "@/components/UI/Cards/KpiCard";
import { useEffect, useState } from "react";
import { Meeting, File} from "@/types";
import MeetingReduceCard from "@/components/UI/Cards/MeetingReduceCard";
import { useSession } from "next-auth/react";
import { getFormattedDate } from "@/utils/utils";
import toast from "react-hot-toast";
import FileCard from "@/components/UI/Cards/FileCard";

// ==============================================

const HomePage = () => {
    const session = useSession();
    const today: Date = new Date();
    const formattedTodayDate: string = getFormattedDate(today);const [meetings, setMeetings] = useState<any[]>([]);

    const [clientsNumber, setClientsNumber] = useState<number>(0);
    const [processingProjectNumber, setProcessingProjectNumber] = useState<number>(0);
    const [recentFiles, setRecentFiles] = useState<File[]>([]);

    useEffect(() => {
        const func = async () => {
            const clientsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/clients`);
            if(clientsResponse.ok){
                const clients = await clientsResponse.json();
                setClientsNumber(clients.length);
            }
            else{
                const errorMessage = await clientsResponse.json();
                toast.error(errorMessage.error);
            }

            const projectsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects?endDate=${formattedTodayDate}`);
            if(projectsResponse.ok){
                const projects = await projectsResponse.json();
                setProcessingProjectNumber(projects.length);
            }
            else{
                const errorMessage = await projectsResponse.json();
                toast.error(errorMessage.error);
            }

            if(clientsResponse.ok && projectsResponse.ok){
                toast.success("Récupération des KPIs terminée");
            }
        };
        func();
    }, []);

    useEffect(() => {
        const func = async () => {
            const daysPrevisualisationNumber: number = 3;
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meetings?startHour=${formattedTodayDate}`);
            let datas = await response.json();

            if(response.ok){
                const nextThreeDays: string[] = Array.from({ length: daysPrevisualisationNumber }, (_, index) => {
                    const todayDate: Date = new Date();
                    todayDate.setDate(todayDate.getDate() + index);
                    return getFormattedDate(todayDate);
                });

                const sortedMeetings: Meeting[] = nextThreeDays.map((dateStr: string) => {
                    const meetingFound: Meeting = datas.find((meeting: Meeting) => meeting.startHour.startsWith(dateStr));
                    return meetingFound || null;
                });

                setMeetings(sortedMeetings);
                toast.success("Réunion proches récupérées");
            }
            else{
                setMeetings([null, null, null]);
                toast.error(datas.error);
            }
        };
        func();
    }, []);

    useEffect(() => {
        const func = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/files`);

            if(response.ok){
                let datas = await response.json();
                setRecentFiles(datas);
                toast.success("Fichiers récents récupérés");
            }
            else{
                const errorMessage = await response.json();
                toast.error(errorMessage.error);
            }
        };
        func();
    }, []);

    return (
    <main className={styles.homePage}>
      <HomeSideBar />
      <section className={styles.homePageSection}>
          <h1>Bonjour {session.data?.user?.name} !</h1>
          <div className={styles.homePageSectionRow}>
              <div style={{width: "50%"}} className={styles.comingSoonMeetingsDiv}>
                  {meetings.map((meeting: Meeting | null, index: number) => {
                      const todayDate = new Date();
                      todayDate.setDate(todayDate.getDate() + index);
                      const dateLabel: string = getFormattedDate(todayDate);

                      return <MeetingReduceCard key={index} weekDay={meeting ? meeting.startHour : dateLabel} meetingTitle={meeting?.title}/>
                  })}
              </div>
              <div className={styles.kpisDiv}>
                  <KpiCard name="Clients" value={clientsNumber} />
                  <KpiCard name="Projets en cours" value={processingProjectNumber} />
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
