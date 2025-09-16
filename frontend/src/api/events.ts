import { timeStringToDate } from "@/lib/calendar";
import type { Event, EventRaw } from "@/lib/event";
import { apiFetch } from "./apiUtils";
import moment from "moment";

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
    startDate: moment(raw_event.startDate).toDate(),
    endDate: moment(raw_event.endDate).toDate(),
    createdAt: moment(raw_event.createdAt).toDate(),
  };
}
