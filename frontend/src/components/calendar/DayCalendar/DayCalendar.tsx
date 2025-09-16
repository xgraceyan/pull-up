import {
  Calendar,
  DateLocalizer,
  type CalendarProps,
  type DateCellWrapperProps,
  type DateHeaderProps,
  type EventWrapperProps,
  type NavigateAction,
  type SlotInfo,
  type View,
} from "react-big-calendar";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import "../calendar.css";
import {
  disableRemainingDays,
  handleNavigateFactory,
  localizer,
  type TimeSlotEvent,
  type TimeSlotEventWrapperProps,
} from "@/lib/calendar";
import type { Event } from "@/lib/event";
import moment from "moment";
import { CalendarToolbar } from "../CalendarToolbar";
import { CustomDateHeader } from "./CustomDateHeader";

interface DayCalendarProps {
  event: Event;
  timeSlots: TimeSlotEvent[];
  setTimeSlot?: (value: React.SetStateAction<TimeSlotEvent | null>) => void;
  calendarProps?: Partial<CalendarProps<TimeSlotEvent>>;
}

export const DayCalendar = ({
  event,
  timeSlots,
  setTimeSlot,
  calendarProps,
}: DayCalendarProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(event.startDate);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);

  const formats = useMemo(
    () => ({
      dayFormat: (date: Date, culture?: string, localizer?: DateLocalizer) =>
        localizer?.format(date, "ddd, MMM D", culture) ?? "",
    }),
    []
  );

  const eventWrapper = ({ event, children }: TimeSlotEventWrapperProps) => (
    <div
      className="h-full min-h-[100px]"
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

  useEffect(() => {
    disableRemainingDays(event.type, event.endDate, "NEXT", setDisabledDates);
    disableRemainingDays(event.type, event.startDate, "PREV", setDisabledDates);
  }, [event.startDate, event.endDate]);

  return (
    <div className="h-[600px] day-calendar">
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        events={timeSlots}
        defaultView={"month"}
        views={{
          month: true,
        }}
        defaultDate={event.startDate}
        date={currentDate}
        onNavigate={handleNavigateFactory(
          event,
          currentDate,
          setCurrentDate,
          setDisabledDates
        )}
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
            EventWrapperProps<TimeSlotEvent>
          >,

          toolbar: (props) => {
            return <CalendarToolbar {...props} eventType={event.type} />;
          },
          month: {
            dateHeader: (props) => (
              <CustomDateHeader {...props} timeSlots={timeSlots} />
            ),
          },
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
        dayPropGetter={(date: Date) => {
          const isDisabled = disabledDates.some((d) =>
            moment(date).isSame(d, "day")
          );
          if (isDisabled) {
            return {
              className: "text-gray-300 rbc-off-range-bg z-1",
              style: {
                cursor: "not-allowed",
                pointerEvents: "none",
                userSelect: "none",
              },
            };
          }
          return { className: "text-gray-500" };
        }}
      />
    </div>
  );
};
