import type { Event } from "@/lib/event";
import { useRef } from "react";
import type { SlotInfo } from "react-big-calendar";
import type { User } from "@/lib/user";
import {
  addSlots,
  findTimeSlotInSelection,
  normalizeDateToDayOnly,
  removeSlots,
  type CalendarComponent,
  type TimeSlotEvent,
} from "@/lib/calendar";

interface EditCalendarProps {
  Calendar: CalendarComponent;
  event: Event;
  user: User;
  currTimeSlots: TimeSlotEvent[];
  setCurrTimeSlots: (
    value: React.SetStateAction<TimeSlotEvent[] | null>
  ) => void;
  disabledDates: Date[];
  setDisabledDates: (value: React.SetStateAction<Date[]>) => void;
}

export const EditCalendar = ({
  Calendar,
  event,
  user,
  currTimeSlots,
  setCurrTimeSlots,
  disabledDates,
  setDisabledDates,
}: EditCalendarProps) => {
  const dragOriginRef = useRef<Date | null>(null);

  const handleSelect = (slotInfo: SlotInfo) => {
    const mouseDownSlot = dragOriginRef.current ?? slotInfo.start;
    dragOriginRef.current = null; // reset for next drag

    let selectResult = currTimeSlots;

    if (findTimeSlotInSelection(mouseDownSlot, currTimeSlots)) {
      selectResult = removeSlots(slotInfo, currTimeSlots);
    } else {
      selectResult = addSlots(
        user.id,
        slotInfo,
        currTimeSlots,
        event.type,
        disabledDates
      );
    }

    setCurrTimeSlots(selectResult);
  };

  const handleSelectEvent = (event: TimeSlotEvent) => {
    setCurrTimeSlots(currTimeSlots.filter((ev) => ev.id !== event.id));
  };

  return (
    <div className="edit-calendar">
      <Calendar
        event={event}
        timeSlots={currTimeSlots}
        disabledDates={disabledDates}
        setDisabledDates={setDisabledDates}
        calendarProps={{
          selectable: true,
          onSelectSlot: handleSelect,
          onSelectEvent: handleSelectEvent,
          onSelecting: (range) => {
            if (!dragOriginRef.current) dragOriginRef.current = range.start;

            const start = normalizeDateToDayOnly(range.start);
            const end = normalizeDateToDayOnly(range.end);

            const isDisabled = disabledDates.some((d) => {
              const day = normalizeDateToDayOnly(d);
              return day >= start && day <= end;
            });

            return !isDisabled;
          },
          components: {
            eventWrapper: undefined,
          },
        }}
      />
    </div>
  );
};
