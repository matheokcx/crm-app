import styles from "./coming-meetings-widget.module.css";
import {Meeting} from "@/types";
import {getFormattedDate} from "@/utils/utils";
import MeetingReduceCard from "@/components/UI/Cards/Meeting/MeetingReduceCard";
import {useTranslations} from "next-intl";

type ComingMeetingsWidgetProps = {
    comingMeetings: (Meeting | null)[];
};

const ComingMeetingsWidget = ({ comingMeetings }: ComingMeetingsWidgetProps) => {
    const t = useTranslations();

    return (
        <div className={styles.comingSoonMeetingsWidget}>
            <h3>{t("meetings.shortcutSectionTitle")}:</h3>
            <div className={styles.comingSoonMeetingsDiv}>
                {comingMeetings.map((meeting: Meeting | null, index: number) => {
                    const todayDate: Date = new Date();
                    todayDate.setDate(todayDate.getDate() + index);
                    const dateLabel: string = getFormattedDate(todayDate);

                    return <MeetingReduceCard key={index}
                                              weekDay={meeting ? meeting.startHour : new Date(dateLabel)}
                                              meetingTitle={meeting?.title}
                    />
                })}
            </div>
        </div>
    );
};

export default ComingMeetingsWidget;
