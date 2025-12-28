"use client"
import HomeSideBar from "@/components/Layout/HomeSideBar";
import styles from "./homepage.module.css";
import KpiCard from "@/components/UI/Cards/KpiCard";
import { useEffect, useState } from "react";
import { Meeting } from "@/types";
import MeetingReduceCard from "@/components/UI/Cards/MeetingReduceCard";
import { useSession } from "next-auth/react";
import {getFormattedDate} from "@/utils/utils";

// ==============================================

const HomePage = () => {
    const session = useSession();
    const [meetings, setMeetings] = useState<Meeting[]>([]);

    useEffect(() => {
        const func = async () => {
            const today: Date = new Date();
            const formattedTodayDate: string = getFormattedDate(today);
            const daysPrevisualisationNumber: number = 3;

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meetings?startHour=${formattedTodayDate}`);
            if(response.ok){
                let datas = await response.json();

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
                  <KpiCard name="Clients" value={12} />
                  <KpiCard name="Projets en cours" value={3} />
              </div>
          </div>
      </section>
    </main>
  );
};

export default HomePage;
