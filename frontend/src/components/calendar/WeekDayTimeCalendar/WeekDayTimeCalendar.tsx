import "../calendar.css";
import { BaseCalendar, type BaseCalendarProps } from "../BaseCalendar";

export const WeekDayTimeCalendar = ({
  format = "ddd",
  ...rest
}: BaseCalendarProps) => {
  return (
    <>
      <BaseCalendar
        {...rest}
        format={format}
        calendarProps={{
          defaultView: "week",
          defaultDate: undefined,
          views: {
            week: true,
            work_week: true,
          },
          dayPropGetter: () => {
            return { className: "text-gray-600" };
          },
          toolbar: false,
          ...rest.calendarProps,
        }}
      />
    </>
  );
};
