import { useEvent } from "@/hooks/useEvent";
import { useParams } from "react-router-dom";
import { WeekDayTimeCalendar } from "../calendar/WeekDayTimeCalendar/WeekDayTimeCalendar";
import { useTimeSlot } from "@/hooks/useTimeSlot";
import { loadTimeSlotToCalendar } from "@/lib/timeslot";
import { useState } from "react";
import { type TimeSlotEvent } from "@/lib/calendar";
import { type User } from "@/lib/user";
import { EditRoot } from "../calendar/EditCalendar/EditRoot";
import { TimeSlotInfo } from "./TimeSlotInfo";
import { UserInfo } from "../user/UserInfo";
import { CopyLinkButton } from "../ui/CopyLinkButton";
import { DayTimeCalendar } from "../calendar/DayTimeCalendar/DayTimeCalendar";
import { DayCalendar } from "../calendar/DayCalendar/DayCalendar";
import { BaseCalendar } from "../calendar/BaseCalendar";

export function Event() {
  const [timeSlot, setTimeSlot] = useState<TimeSlotEvent | null>(null); // Time slot hovered
  const [editUser, setEditUser] = useState<User | null>(null);
  const { urlAlias } = useParams();
  const { data: event, isLoading, error } = useEvent(urlAlias);

  const { data: timeSlots } = useTimeSlot(event);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!event) return <p>No event</p>;

  const getCalendarType = () => {
    if (!timeSlots || !event) return null;
    switch (event.type) {
      case "weekdayTime":
        return WeekDayTimeCalendar;
      case "dayTime":
        return DayTimeCalendar;
      case "day":
        return DayCalendar;
      default:
        return BaseCalendar;
    }
  };

  const getCalendar = () => {
    const CalendarComponent = getCalendarType();
    if (!CalendarComponent || !timeSlots) return;
    return (
      <CalendarComponent
        event={event}
        timeSlots={loadTimeSlotToCalendar(timeSlots)}
        setTimeSlot={setTimeSlot}
        calendarProps={{}}
      />
    );
  };

  const calendarType = getCalendarType();

  const timeSlotInfo = timeSlot && (
    <TimeSlotInfo timeSlot={timeSlot} event={event} />
  );

  const eventUrl = `${import.meta.env.VITE_BASE_URL}/${event.urlAlias}`;

  return (
    <div className="flex flex-col h-screen pt-10">
      <div className="text-center flex flex-col gap-2">
        <h1 className="text-[30px] font-bold text-center">{event.name}</h1>
        <p className="text-sm text-gray-500">
          Invite others to join using the link &nbsp;
          <CopyLinkButton url={eventUrl} />
        </p>
      </div>
      {editUser && calendarType && (
        <EditRoot
          Calendar={calendarType}
          event={event}
          user={editUser}
          setEditUser={setEditUser}
        />
      )}

      {!editUser && (
        <div className="grid grid-cols-3 gap-4 text-center p-10">
          <div className="col-span-2">{getCalendar()}</div>
          <div className="col-span-1">
            {timeSlot ? (
              timeSlotInfo
            ) : (
              <UserInfo
                event={event}
                users={event.userIds}
                setEditUser={setEditUser}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
