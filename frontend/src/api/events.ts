import { timeStringToDate } from "@/lib/calendar";
import type { Event, EventPayload, EventRaw, EventType } from "@/lib/event";
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
    startDate: moment(raw_event.startDate).local().startOf("day").toDate(),
    endDate: moment(raw_event.endDate).local().startOf("day").toDate(),
    createdAt: moment(raw_event.createdAt).toDate(),
  };
}

export async function checkEventUrlExists(urlAlias: string): Promise<boolean> {
  const res: boolean = await apiFetch(`/events/${urlAlias}/exists`, {
    method: "GET",
  });
  return res;
}

export async function createEvent(eventPayload: EventPayload): Promise<Event> {
  const res: Event = await apiFetch(
    `/events/create`,
    {
      method: "POST",
      body: JSON.stringify(eventPayload),
    },
    "Failed to create event"
  );
  return res;
}
