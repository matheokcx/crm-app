"use client"
import dynamic from "next/dynamic";
import { Meeting } from "@/types";

// ==============================================

const MeetingsCalendar = dynamic(
    () => import("@/components/Layout/Meeting/MeetingsCalendar"),
    { ssr: false }
);

// ==============================================

type MeetingsCalendarWrapperProps = {
    meetings: Meeting[];
};

const MeetingsCalendarWrapper = ({ meetings }: MeetingsCalendarWrapperProps) => {
    return <MeetingsCalendar meetings={meetings} />
};

export default MeetingsCalendarWrapper;
