import { useEvent } from "@/hooks/useEvent";
import { useParams } from "react-router-dom";
import { WeekDayTimeCalendar } from "../calendar/WeekDayTimeCalendar/WeekDayTimeCalendar";
import { useTimeSlot, useUsersByWeekDayTime } from "@/hooks/useTimeSlot";
import { loadTimeSlotToCalendar } from "@/lib/timeslot";
import { useState } from "react";
import {
  dateToTimeString,
  dateToWeekDay,
  DAYS_OF_WEEK,
  formatTime,
  type TimeSlotEvent,
} from "@/lib/calendar";
import moment from "moment";
import { getAllUsersFromId, type User } from "@/lib/user";
import { EditCalendar } from "../calendar/EditCalendar/EditCalendar";
import { EditRoot } from "../calendar/EditCalendar/EditRoot";
import { TimeSlotInfo } from "./TimeSlotInfo";
import { UserInfo } from "../user/UserInfo";

export function Event() {
  const [timeSlot, setTimeSlot] = useState<TimeSlotEvent | null>(null); // Time slot hovered
  const [editUser, setEditUser] = useState<User | null>(null);
  const { urlAlias } = useParams();
  const { data: event, isLoading, error } = useEvent(urlAlias);

  const {
    data: timeSlots,
    isLoading: slotsLoading,
    error: slotsError,
  } = useTimeSlot(event?.id);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!event) return <p>No event</p>;

  const weekDayTimeCalendar = timeSlots && (
    <WeekDayTimeCalendar
      event={event}
      timeSlots={loadTimeSlotToCalendar(timeSlots)}
      setTimeSlot={setTimeSlot}
    />
  );

  const editWeekDayTimeCalendar = editUser && (
    <EditRoot event={event} user={editUser} setEditUser={setEditUser} />
  );

  const timeSlotInfo = timeSlot && (
    <TimeSlotInfo timeSlot={timeSlot} event={event} />
  );

  return (
    <div className="flex flex-col h-screen pt-10">
      <p className="text-xl font-bold text-center">{event.name}</p>
      {editUser && editWeekDayTimeCalendar}

      {!editUser && (
        <div className="grid grid-cols-3 gap-4 text-center p-10">
          <div className="col-span-2">{weekDayTimeCalendar}</div>
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
