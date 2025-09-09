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
  type TimeSlotEvent,
} from "@/lib/calendar";
export function Event() {
  const [timeSlot, setTimeSlot] = useState<TimeSlotEvent | null>(null); // Time slot hovered
  const { urlAlias } = useParams();
  const { data: event, isLoading, error } = useEvent(urlAlias);

  const {
    data: timeSlots,
    isLoading: slotsLoading,
    error: slotsError,
  } = useTimeSlot(event?.id);

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useUsersByWeekDayTime(
    event?.id || "",
    timeSlot?.start ? dateToWeekDay(timeSlot.start) : DAYS_OF_WEEK[0],
    timeSlot?.start ? dateToTimeString(timeSlot.start) : "00:00",
    timeSlot?.end ? dateToTimeString(timeSlot.end) : "00:00"
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!event) return <p>No event</p>;

  console.log(timeSlots);

  return (
    <div className="flex flex-col h-screen pt-10">
      <p className="text-lg font-medium text-center">{event.name}</p>
      <div className="grid grid-cols-3 gap-4 text-center p-10">
        <div className="col-span-2">
          {timeSlots && (
            <WeekDayTimeCalendar
              event={event}
              timeSlots={loadTimeSlotToCalendar(timeSlots)}
              setTimeSlot={setTimeSlot}
            />
          )}
        </div>
        <div className="col-span-1">
          <h1 className="font-bold">Current Timeslot</h1>
          {timeSlot && users && (
            <>
              <p>{timeSlot.start.toTimeString()}</p>
              {users.map((user) => (
                <p>{user.name}</p>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
