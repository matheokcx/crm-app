"use client"
import HomeSideBar from "@/components/Layout/HomeSideBar";
import styles from "./homepage.module.css";
import KpiCard from "@/components/UI/Cards/KpiCard";
import { useEffect, useState } from "react";
import { Meeting } from "@/types";
import MeetingReduceCard from "@/components/UI/Cards/MeetingReduceCard";
import { useSession } from "next-auth/react";

// ==============================================

const HomePage = () => {
    const session = useSession();
    const today: string = new Date().toLocaleDateString().split("T")[0];

    const [meetings, setMeetings] = useState<Meeting[]>([]);

    useEffect(() => {
        const func = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meetings?startHour=${today}`);
            if(response.ok){
                let datas = await response.json();
                datas = datas.slice(0, 3);
                setMeetings(datas);
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
                  {meetings.map((meeting: Meeting | null, index: number) => <MeetingReduceCard key={index} weekDay={meeting?.startHour ?? ""} meetingTitle={meeting?.title} />)}
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
