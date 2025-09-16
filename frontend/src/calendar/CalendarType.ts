import type { EventType } from "@/lib/event";

export interface CalendarType {
  type: EventType;

  formatTimeSlot: (start: Date, end: Date) => string;
}
