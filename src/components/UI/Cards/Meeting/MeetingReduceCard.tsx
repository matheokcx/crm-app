import styles from "./meetingReduceCard.module.css"
import {getWeekDay} from "@/utils/utils";
import {useTranslations} from "next-intl";



type MeetingReduceCardProps = {
    weekDay: Date;
    meetingTitle?: string;
};

const MeetingReduceCard = ({weekDay, meetingTitle}: MeetingReduceCardProps) => {
    const t = useTranslations();
    const isToday: boolean = weekDay.getDay() === (new Date()).getDay();
    const style = {
        color: isToday ? "var(--main-text" : "var(--secondary-text)",
        fontWeight: isToday ? 700 : 400,
    };

    return (
        <div className={styles.meetingReduceCard}>
            <label style={style}>{t(`daysOfWeek.${getWeekDay(weekDay.getDay())}`)}</label>
            {
                meetingTitle ? (
                    <div className={styles.meetingBlock}>
                        <p>{meetingTitle}</p>
                    </div>
                ) : (
                    <div className={styles.noMeetingBlock}>
                        <p>{t("nothingSchedule")}</p>
                    </div>
                )
            }
        </div>
    );
};

export default MeetingReduceCard;
