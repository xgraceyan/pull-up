import { timeStringToDate } from "@/lib/calendar";
import type { Event, EventRaw } from "@/lib/event";
import { apiFetch } from "./apiUtils";

export async function fetchEventFromUrl(urlAlias: string): Promise<Event> {
  const raw_event: EventRaw = await apiFetch(
    `/events/${urlAlias}`,
    { method: "GET" },
    "Failed to fetch event"
  );
  return {
    ...raw_event,
    startTime: timeStringToDate(raw_event.startTime),
    endTime: timeStringToDate(raw_event.endTime),
    startDate: new Date(raw_event.startDate),
    endDate: new Date(raw_event.endDate),
    createdAt: new Date(raw_event.createdAt),
  };
}
