import { getMeetings } from "@/services/meetingService";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { Meeting } from "@/types";
import MeetingCard from "@/components/UI/Cards/Meeting/MeetingCard";
import styles from "./meetings-page.module.css";
import {getWeekDay} from "@/utils/utils";

// ==============================================

const MeetingsCalendarPage = async () => {
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return <p>Vous n'êtes pas connecté ...</p>;
    }

    const meetings: Meeting[] = await getMeetings({}, Number(session.user.id));

    return (
        <section className={styles.calendar}>
            {Array.from({ length: 7 }, (_, index) =>(
                <div style={{width: "13%"}}>
                    <p>{getWeekDay(index)}</p>
                </div>
            ))}
            {meetings.map((meeting: Meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)}
        </section>
    );
};

export default MeetingsCalendarPage;
