import type { TimeSlotEvent } from "@/lib/calendar";
import { type ToolbarProps } from "react-big-calendar";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { EventType } from "@/lib/event";

interface ExtraCalendarToolbarProps {
  eventType?: EventType;
}

type CalendarToolbarProps = ExtraCalendarToolbarProps &
  ToolbarProps<TimeSlotEvent>;

export const CalendarToolbar = ({
  onNavigate,
  label,
  eventType,
}: CalendarToolbarProps) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <Button
        variant="outline"
        size="icon"
        className="size-9"
        aria-label="Previous"
        onClick={() => onNavigate("PREV")}
      >
        <ChevronLeftIcon />
      </Button>

      {eventType === "day" && (
        <p className="font-semibold text-gray-850">{label}</p>
      )}

      <Button
        variant="outline"
        size="icon"
        className="size-9"
        aria-label="Next"
        onClick={() => onNavigate("NEXT")}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
};
