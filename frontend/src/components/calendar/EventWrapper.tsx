import type { TimeSlotEvent, TimeSlotEventWrapperProps } from "@/lib/calendar";
import { useRef } from "react";

interface CustomEventWrapperProps {
  wrapperClasses: string;
  setTimeSlot?: (value: React.SetStateAction<TimeSlotEvent | null>) => void;
}

export const EventWrapper = ({
  wrapperClasses,
  setTimeSlot,
}: CustomEventWrapperProps) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  return ({ event, children }: TimeSlotEventWrapperProps) => (
    <div
      className={wrapperClasses}
      onMouseEnter={() => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        setTimeSlot?.(event);

        timerRef.current = setTimeout(() => {
          setTimeSlot?.(null);
          timerRef.current = null;
        }, 200);
      }}
      onMouseLeave={() => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        setTimeSlot?.(null);
      }}
    >
      {children}
    </div>
  );
};
