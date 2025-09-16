import { useEffect, useState } from "react";
import "../calendar.css";
import {
  customDayPropGetter,
  disableRemainingDays,
  handleNavigateFactory,
} from "@/lib/calendar";
import { CalendarToolbar } from "../CalendarToolbar";
import { CustomDateHeader } from "./CustomDateHeader";
import { BaseCalendar, type BaseCalendarProps } from "../BaseCalendar";

export const DayCalendar = ({
  format = "ddd, MMM D",
  wrapperClasses = "h-full min-h-[100px]",
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
        wrapperClasses={wrapperClasses}
        calendarProps={{
          defaultView: "month",
          views: { month: true },
          date: currentDate,
          onNavigate: handleNavigateFactory(
            event,
            currentDate,
            setCurrentDate,
            setDisabledDates
          ),
          dayPropGetter: customDayPropGetter(
            disabledDates,
            "text-gray-300 rbc-off-range-bg z-1"
          ),
          ...rest.calendarProps,
          components: {
            ...rest.calendarProps?.components,
            toolbar: (props) => {
              return <CalendarToolbar {...props} eventType={event.type} />;
            },
            month: {
              dateHeader: (props) => (
                <CustomDateHeader {...props} timeSlots={rest.timeSlots} />
              ),
            },
          },
        }}
      />
    </>
  );
};
