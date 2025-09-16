import type { BaseTimeSlot } from "@/lib/timeslot";
import type { CalendarType } from "./CalendarType";
import moment from "moment";
import { formatTime } from "@/lib/calendar";

// export class WeekDayTimeCalendar extends CalendarType {
//   type = "weekdayTime";

//   formatTimeSlot = (start: Date, end: Date) => {
//     return `${moment(start).format("dddd")} ${formatTime(start)} - ${formatTime(
//       end
//     )}`;
//   };
// }
