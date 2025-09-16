import type { TimeSlotEvent } from "@/lib/calendar";
import { type ToolbarProps } from "react-big-calendar";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export const CalendarToolbar = ({
  onNavigate,
}: ToolbarProps<TimeSlotEvent>) => {
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
