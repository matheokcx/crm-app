"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import {Meeting} from "@/types";



type MeetingsCalendarProps = {
    meetings: Meeting[];
};

const MeetingsCalendar = ({ meetings }: MeetingsCalendarProps) => {
    return (
        <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={meetings.map((meeting) => ({
                title: meeting.title,
                date: new Date(meeting.startHour).toISOString().split("T")[0]
            }))}
            locale={document.cookie
                .split('; ')
                .find(row => row.startsWith('locale='))
                ?.split('=')[1]}
        />
    );
};

export default MeetingsCalendar;