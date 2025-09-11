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

  //   const {
  //     data: users,
  //     isLoading: usersLoading,
  //     error: usersError,
  //   } = useUsersByWeekDayTime(
  //     event?.id || "",
  //     timeSlot?.start ? dateToWeekDay(timeSlot.start) : DAYS_OF_WEEK[0],
  //     timeSlot?.start ? dateToTimeString(timeSlot.start) : "00:00",
  //     timeSlot?.end ? dateToTimeString(timeSlot.end) : "00:00"
  //   );

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

  const userInfo = (
    <>
      <h1 className="font-bold">Users</h1>
      {event.userIds.map((user) => (
        <p key={user.id}>
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              setEditUser(user);
            }}
          >
            {user.name}
          </a>
        </p>
      ))}
    </>
  );

  console.log(timeSlots);

  return (
    <div className="flex flex-col h-screen pt-10">
      <p className="text-lg font-medium text-center">{event.name}</p>
      {editUser && editWeekDayTimeCalendar}

      {!editUser && (
        <div className="grid grid-cols-3 gap-4 text-center p-10">
          <div className="col-span-2">{weekDayTimeCalendar}</div>
          <div className="col-span-1">{timeSlot ? timeSlotInfo : userInfo}</div>
        </div>
      )}
    </div>
  );
}
