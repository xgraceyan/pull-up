import { formatTime, type TimeSlotEvent } from "@/lib/calendar";
import type { Event } from "@/lib/event";
import { getAllUsersFromId, type User } from "@/lib/user";
import moment from "moment";

interface TimeSlotInfoProps {
  timeSlot: TimeSlotEvent;
  event: Event;
}

export const TimeSlotInfo = ({ timeSlot, event }: TimeSlotInfoProps) => {
  const users = getAllUsersFromId(timeSlot?.userIds, event.userIds);
  return (
    <>
      <h1 className="font-bold">Current Timeslot</h1>
      <p>
        {moment(timeSlot.start).format("dddd")} {formatTime(timeSlot.start)} -{" "}
        {formatTime(timeSlot.end)}
      </p>

      {users.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}

      {event.userIds
        .filter((user) => !users.some((u) => u.id === user.id))
        .map((user) => (
          <p key={user.id} className="text-gray-400">
            {user.name}
          </p>
        ))}
    </>
  );
};
