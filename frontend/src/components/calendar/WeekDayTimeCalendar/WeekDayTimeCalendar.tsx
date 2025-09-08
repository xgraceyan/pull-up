import { Calendar, DateLocalizer, type SlotInfo } from "react-big-calendar";
import { useMemo, useRef, useState } from "react";
import "./week-day-time-calendar.css";
import {
  addSlots,
  findTimeSlotInSelection,
  localizer,
  removeSlots,
  type TimeSlotEvent,
} from "@/lib/calendar";
import type { Event } from "@/lib/event";

interface WeekDayTimeCalendarProps {
  event: Event;
}

export const WeekDayTimeCalendar = ({ event }: WeekDayTimeCalendarProps) => {
  const [currTimeSlots, setCurrTimeSlots] = useState<TimeSlotEvent[]>([]);
  const dragOriginRef = useRef<Date | null>(null);

  const formats = useMemo(
    () => ({
      dayFormat: (date: Date, culture?: string, localizer?: DateLocalizer) =>
        localizer?.format(date, "ddd", culture) ?? "",
    }),
    []
  );

  const handleSelect = (slotInfo: SlotInfo) => {
    const mouseDownSlot = dragOriginRef.current ?? slotInfo.start;
    dragOriginRef.current = null; // reset for next drag

    let selectResult = currTimeSlots;

    if (findTimeSlotInSelection(mouseDownSlot, currTimeSlots)) {
      selectResult = removeSlots(slotInfo, currTimeSlots);
    } else {
      selectResult = addSlots(slotInfo, currTimeSlots);
    }

    setCurrTimeSlots(selectResult);
  };

  return (
    <div className="h-[600px]">
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        events={currTimeSlots}
        defaultView={"week"}
        views={{
          week: true,
          work_week: true,
        }}
        min={event.startTime}
        max={event.endTime}
        step={30}
        timeslots={2}
        toolbar={false}
        allDayAccessor={undefined}
        style={{
          height: "100%",
        }}
        formats={formats}
        selectable
        onSelectSlot={handleSelect}
        onSelecting={(range) => {
          if (!dragOriginRef.current) dragOriginRef.current = range.start;
          return true;
        }}
        eventPropGetter={(event: TimeSlotEvent) => {
          // "event" is a timeslot
          if (event.isSelection) {
            return {
              style: {
                backgroundColor: "rgba(59, 131, 246, 0.4)",
                borderRadius: 0,
                border: "0px",
                color: "transparent",
              },
            };
          }
          return {};
        }}
      />
    </div>
  );
};
