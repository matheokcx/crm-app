import { getMeetings } from "@/services/meetingService";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { Meeting } from "@/types";
import MeetingCard from "@/components/UI/Cards/Meeting/MeetingCard";

// ==============================================

const MeetingsCalendarPage = async () => {
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return <p>Vous n'êtes pas connecté ...</p>;
    }

    const meetings: Meeting[] = await getMeetings({}, Number(session.user.id));

    return (
        <section style={{ width: "80%", display: "flex", flexWrap: "wrap", gap: "50px 30px" }}>
            {meetings.map((meeting: Meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)}
        </section>
    );
};

export default MeetingsCalendarPage;
