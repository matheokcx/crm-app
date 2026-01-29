import styles from "./meetingReduceCard.module.css"
import {getWeekDay} from "@/utils/utils";
import {useTranslations} from "next-intl";

// ==============================================

type MeetingReduceCardProps = {
    weekDay: Date;
    meetingTitle?: string;
};

const MeetingReduceCard = ({weekDay, meetingTitle}: MeetingReduceCardProps) => {
    const t = useTranslations();

    return (
        <div className={styles.meetingReduceCard}>
            <label>{t(`daysOfWeek.${getWeekDay(weekDay.getDay())}`)}</label>
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
