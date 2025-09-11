import type { Event, EventType } from "@/lib/event";
import { useEffect, useRef, useState } from "react";
import type { Calendar, SlotInfo } from "react-big-calendar";
import { WeekDayTimeCalendar } from "../WeekDayTimeCalendar/WeekDayTimeCalendar";
import type { User } from "@/lib/user";
import { useTimeSlotByUser } from "@/hooks/useTimeSlot";
import { loadTimeSlotToCalendar } from "@/lib/timeslot";
import {
  addSlots,
  findTimeSlotInSelection,
  removeSlots,
  type TimeSlotEvent,
} from "@/lib/calendar";

interface EditCalendarProps {
  event: Event;
  user: User;
  currTimeSlots: TimeSlotEvent[];
  setCurrTimeSlots: (
    value: React.SetStateAction<TimeSlotEvent[] | null>
  ) => void;
}

export const EditCalendar = ({
  event,
  user,
  currTimeSlots,
  setCurrTimeSlots,
}: EditCalendarProps) => {
  const dragOriginRef = useRef<Date | null>(null);

  const handleSelect = (slotInfo: SlotInfo) => {
    const mouseDownSlot = dragOriginRef.current ?? slotInfo.start;
    dragOriginRef.current = null; // reset for next drag

    let selectResult = currTimeSlots;

    if (findTimeSlotInSelection(mouseDownSlot, currTimeSlots)) {
      selectResult = removeSlots(slotInfo, currTimeSlots);
    } else {
      selectResult = addSlots(user.id, slotInfo, currTimeSlots);
    }

    setCurrTimeSlots(selectResult);
  };

  const handleSelectEvent = (event: TimeSlotEvent) => {
    // remove the clicked event
    console.log("Selected", event);

    setCurrTimeSlots(currTimeSlots.filter((ev) => ev.id !== event.id));
  };

  return (
    <WeekDayTimeCalendar
      // key={currTimeSlots.length}
      event={event}
      timeSlots={currTimeSlots}
      calendarProps={{
        selectable: true,
        onSelectSlot: handleSelect,
        onSelectEvent: handleSelectEvent,
        onSelecting: (range) => {
          if (!dragOriginRef.current) dragOriginRef.current = range.start;
          return true;
        },
        components: {
          eventWrapper: undefined,
        },
      }}
    />
  );
};
