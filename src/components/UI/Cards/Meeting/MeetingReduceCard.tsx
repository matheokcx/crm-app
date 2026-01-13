import styles from "./meetingReduceCard.module.css"
import { getWeekDay } from "@/utils/utils";

// ==============================================

type MeetingReduceCardProps = {
    weekDay: Date;
    meetingTitle?: string;
};

const MeetingReduceCard = ({weekDay, meetingTitle}: MeetingReduceCardProps) => {
    return (
        <div className={styles.meetingReduceCard}>
            <label>{getWeekDay(weekDay.getDay())}</label>
            {
                meetingTitle ? (
                    <div className={styles.meetingBlock}>
                        <p>{meetingTitle}</p>
                    </div>
                ) : (
                    <div className={styles.noMeetingBlock}>
                        <p>Rien de prévu</p>
                    </div>
                )
            }

        </div>
    );
};

export default MeetingReduceCard;
