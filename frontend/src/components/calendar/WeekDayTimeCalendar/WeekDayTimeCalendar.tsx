import {
  Calendar,
  DateLocalizer,
  type CalendarProps,
  type EventWrapperProps,
} from "react-big-calendar";
import { useMemo, type ComponentType } from "react";
import "../calendar.css";
import {
  localizer,
  type TimeSlotEvent,
  type TimeSlotEventWrapperProps,
} from "@/lib/calendar";
import type { Event } from "@/lib/event";

interface WeekDayTimeCalendarProps {
  event: Event;
  timeSlots: TimeSlotEvent[];
  setTimeSlot?: (value: React.SetStateAction<TimeSlotEvent | null>) => void;
  calendarProps?: Partial<CalendarProps<TimeSlotEvent>>;
}

export const WeekDayTimeCalendar = ({
  event,
  timeSlots,
  setTimeSlot,
  calendarProps,
}: WeekDayTimeCalendarProps) => {
  const formats = useMemo(
    () => ({
      dayFormat: (date: Date, culture?: string, localizer?: DateLocalizer) =>
        localizer?.format(date, "ddd", culture) ?? "",
    }),
    []
  );

  const eventWrapper = ({ event, children }: TimeSlotEventWrapperProps) => (
    <div
      onMouseEnter={() => {
        setTimeSlot?.(event);
      }}
      onMouseLeave={() => {
        setTimeSlot?.(null);
      }}
    >
      {children}
    </div>
  );

  return (
    <div className="h-[600px]">
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        events={timeSlots}
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
        components={{
          eventWrapper: eventWrapper as unknown as ComponentType<
            EventWrapperProps<TimeSlotEvent>
          >,
        }}
        eventPropGetter={(timeSlotEvent: TimeSlotEvent) => {
          return {
            className: "timeslot-event !bg-primary",
            style: {
              opacity:
                0.9 * (timeSlotEvent.userIds.length / event.userIds.length),
            },
          };
        }}
        dayPropGetter={() => {
          return { className: "text-gray-600" };
        }}
        slotPropGetter={() => {
          return { className: "text-gray-500" };
        }}
        {...calendarProps}
      />
    </div>
  );
};
