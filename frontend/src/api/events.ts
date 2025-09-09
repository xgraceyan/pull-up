import { timeStringToDate } from "@/lib/calendar";
import type { Event, EventRaw } from "@/lib/event";

export async function fetchEventFromUrl(urlAlias: string): Promise<Event> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/events/${urlAlias}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch event");
  }
  const raw_event: EventRaw = await res.json();
  return {
    ...raw_event,
    startTime: timeStringToDate(raw_event.startTime),
    endTime: timeStringToDate(raw_event.endTime),
    startDate: new Date(raw_event.startDate),
    endDate: new Date(raw_event.endDate),
    createdAt: new Date(raw_event.createdAt),
  };
}
