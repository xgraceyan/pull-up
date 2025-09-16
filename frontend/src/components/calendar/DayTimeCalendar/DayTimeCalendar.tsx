import {
  Calendar,
  DateLocalizer,
  type CalendarProps,
  type EventWrapperProps,
  type NavigateAction,
  type SlotInfo,
  type View,
} from "react-big-calendar";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import "../calendar.css";
import "./day-time-calendar.css";
import {
  localizer,
  type TimeSlotEvent,
  type TimeSlotEventWrapperProps,
} from "@/lib/calendar";
import type { Event } from "@/lib/event";
import moment from "moment";
import { CalendarToolbar } from "../CalendarToolbar";

interface DayTimeCalendarProps {
  event: Event;
  timeSlots: TimeSlotEvent[];
  setTimeSlot?: (value: React.SetStateAction<TimeSlotEvent | null>) => void;
  calendarProps?: Partial<CalendarProps<TimeSlotEvent>>;
}

export const DayTimeCalendar = ({
  event,
  timeSlots,
  setTimeSlot,
  calendarProps,
}: DayTimeCalendarProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(event.startDate);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);

  const formats = useMemo(
    () => ({
      dayFormat: (date: Date, culture?: string, localizer?: DateLocalizer) =>
        localizer?.format(date, "ddd, \n MMM D", culture) ?? "",
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

  useEffect(() => {
    disableRemainingDays(event.endDate, "NEXT");
    disableRemainingDays(event.startDate, "PREV");
  }, [event.startDate, event.endDate]);

  const disableRemainingDays = (date: Date, action: NavigateAction) => {
    const days: Date[] = [];
    if (action === "NEXT") {
      const endOfWeek = moment(date).endOf("week");
      let currDate = moment(date).clone();
      while (currDate.isBefore(endOfWeek, "day")) {
        currDate = currDate.add(1, "day").clone();
        days.push(currDate.toDate());
      }
    } else {
      const startOfWeek = moment(date).startOf("week");
      let currDate = moment(date).clone();
      while (currDate.isAfter(startOfWeek, "day")) {
        currDate = currDate.subtract(1, "day").clone();
        days.push(currDate.toDate());
      }
    }
    setDisabledDates((prev) => [...prev, ...days]);
  };

  const handleNavigate = (
    newDate: Date,
    view: View,
    action: NavigateAction
  ) => {
    if (action === "NEXT") {
      const nextWeek = moment(currentDate).add(1, "week");
      const nextWeekEnd = nextWeek.endOf("week");

      if (nextWeekEnd.isSameOrBefore(event.endDate, "day")) {
        setCurrentDate(nextWeek.toDate());
      } else {
        setCurrentDate(event.endDate);
        disableRemainingDays(event.endDate, action);
      }
    } else if (action === "PREV") {
      const prevWeek = moment(currentDate).subtract(1, "week");
      if (prevWeek.isSameOrAfter(event.startDate, "day")) {
        setCurrentDate(prevWeek.toDate());
      } else {
        console.log("No", event.startDate);

        setCurrentDate(event.startDate);
        disableRemainingDays(event.startDate, action);
      }
    } else if (action === "TODAY") {
      // Do nothing idk
    }
  };

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
        }}
        defaultDate={event.startDate}
        date={currentDate}
        onNavigate={handleNavigate}
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
          toolbar: CalendarToolbar,
          ...calendarProps?.components,
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
        dayPropGetter={(date: Date) => {
          const isDisabled = disabledDates.some((d) =>
            moment(date).isSame(d, "day")
          );
          if (isDisabled) {
            return {
              className: "bg-gray-200 text-gray-400 pointer-events-none",
              style: { cursor: "not-allowed", opacity: 0.6 },
            };
          }
          return { className: "text-gray-600" };
        }}
        slotPropGetter={() => {
          return { className: "text-gray-500" };
        }}
      />
    </div>
  );
};
