import {
  formatSlotInfoTime,
  formatTime,
  type TimeSlotEvent,
} from "@/lib/calendar";
import type { Event } from "@/lib/event";
import { getAllUsersFromId, type User } from "@/lib/user";
import moment from "moment";
import { Separator } from "../ui/separator";

interface TimeSlotInfoProps {
  timeSlot: TimeSlotEvent;
  event: Event;
}

export const TimeSlotInfo = ({ timeSlot, event }: TimeSlotInfoProps) => {
  const users = getAllUsersFromId(timeSlot?.userIds, event.userIds);
  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-semibold text-md whitespace-pre">
        {formatSlotInfoTime(timeSlot.start, timeSlot.end, event.type)}
      </h1>

      <div className="w-1/2 mx-auto">
        <Separator />
      </div>

      <div className="flex flex-col gap-2">
        {users.map((user) => (
          <p className="text-primary font-medium text-md" key={user.id}>
            {user.name}
          </p>
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-2">
        {event.userIds
          .filter((user) => !users.some((u) => u.id === user.id))
          .map((user) => (
            <p key={user.id} className="text-gray-400">
              {user.name}
            </p>
          ))}
      </div>
    </div>
  );
};
