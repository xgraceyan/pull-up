import type { TimeSlotEvent, TimeSlotEventWrapperProps } from "@/lib/calendar";

interface CustomEventWrapperProps {
  wrapperClasses: string;
  setTimeSlot?: (value: React.SetStateAction<TimeSlotEvent | null>) => void;
}

export const EventWrapper = ({
  wrapperClasses,
  setTimeSlot,
}: CustomEventWrapperProps) => {
  return ({ event, children }: TimeSlotEventWrapperProps) => (
    <div
      className={wrapperClasses}
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
};
