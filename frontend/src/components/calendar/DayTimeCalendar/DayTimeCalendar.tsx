import { useEffect, useState } from "react";
import "../calendar.css";
import {
  customDayPropGetter,
  disableRemainingDays,
  handleNavigateFactory,
} from "@/lib/calendar";
import { CalendarToolbar } from "../CalendarToolbar";
import { BaseCalendar, type BaseCalendarProps } from "../BaseCalendar";

export const DayTimeCalendar = ({
  format = "ddd, MMM D",
  ...rest
}: BaseCalendarProps) => {
  const { event } = rest;
  const [currentDate, setCurrentDate] = useState<Date>(event.startDate);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);

  useEffect(() => {
    disableRemainingDays(event.type, event.endDate, "NEXT", setDisabledDates);
    disableRemainingDays(event.type, event.startDate, "PREV", setDisabledDates);
  }, [event.startDate, event.endDate]);

  return (
    <>
      <BaseCalendar
        {...rest}
        format={format}
        calendarProps={{
          defaultView: "week",
          views: { week: true },
          date: currentDate,
          onNavigate: handleNavigateFactory(
            event,
            currentDate,
            setCurrentDate,
            setDisabledDates
          ),
          dayPropGetter: customDayPropGetter(
            disabledDates,
            "bg-gray-200 text-gray-400 pointer-events-none opacity-60"
          ),
          ...rest.calendarProps,
          components: {
            toolbar: CalendarToolbar,
            ...rest.calendarProps?.components,
          },
        }}
      />
    </>
  );
};
