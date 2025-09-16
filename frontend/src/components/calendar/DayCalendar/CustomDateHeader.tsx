import type { TimeSlotEvent } from "@/lib/calendar";
import type { DateHeaderProps } from "react-big-calendar";
import moment from "moment";

interface CustomDateHeaderProps {
  timeSlots: TimeSlotEvent[];
}

export const CustomDateHeader = ({
  date,
  label,
  timeSlots,
}: DateHeaderProps & CustomDateHeaderProps) => {
  const isFilled = timeSlots.some(
    (slot) =>
      slot.allDay &&
      date >= moment(slot.start).startOf("day").toDate() &&
      date < moment(slot.end).startOf("day").toDate()
  );
  return (
    <div className={isFilled ? "custom-date-header text-white" : ""}>
      {label}
    </div>
  );
};
