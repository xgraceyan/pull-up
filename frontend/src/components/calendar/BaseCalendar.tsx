import { localizer, type TimeSlotEvent } from "@/lib/calendar";
import type { Event } from "@/lib/event";
import { useMemo, type ComponentType } from "react";
import {
  Calendar,
  type CalendarProps,
  type DateLocalizer,
  type EventWrapperProps,
} from "react-big-calendar";
import { EventWrapper } from "./EventWrapper";
import "./calendar.css";

export interface BaseCalendarProps {
  event: Event;
  timeSlots: TimeSlotEvent[];
  setTimeSlot?: (value: React.SetStateAction<TimeSlotEvent | null>) => void;
  calendarProps?: Partial<CalendarProps<TimeSlotEvent>>;
  disabledDates: Date[];
  setDisabledDates: (value: React.SetStateAction<Date[]>) => void;
  format?: string;
  wrapperClasses?: string;
}

export const BaseCalendar = ({
  event,
  timeSlots,
  setTimeSlot,
  calendarProps,
  format = "EEE MMM dd",
  wrapperClasses,
}: BaseCalendarProps) => {
  const formats = useMemo(
    () => ({
      dayFormat: (date: Date, culture?: string, localizer?: DateLocalizer) =>
        localizer?.format(date, format, culture) ?? "",
    }),
    []
  );

  const eventWrapper = EventWrapper({
    wrapperClasses: wrapperClasses || "",
    setTimeSlot,
  });

  return (
    <div className={`h-[600px] ${event.type}-calendar`}>
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        events={timeSlots}
        defaultDate={event.startDate}
        min={event.startTime}
        max={event.endTime}
        step={30}
        timeslots={2}
        allDayAccessor={undefined}
        style={{
          height: "100%",
        }}
        formats={formats}
        {...calendarProps}
        components={{
          eventWrapper: eventWrapper as unknown as ComponentType<
            EventWrapperProps<TimeSlotEvent> // eventWrapper type fix
          >,
          ...calendarProps?.components,
        }}
        eventPropGetter={(timeSlotEvent: TimeSlotEvent) => {
          return {
            className: "timeslot-event !bg-primary h-full",
            style: {
              opacity:
                0.9 * (timeSlotEvent.userIds.length / event.userIds.length),
            },
          };
        }}
        slotPropGetter={() => {
          return { className: "text-gray-500" };
        }}
      />
    </div>
  );
};
