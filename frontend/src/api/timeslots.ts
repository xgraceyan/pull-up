import {
  convertRawTimeslots,
  type BaseTimeSlot,
  type TimeSlot,
  type TimeSlotPayload,
  type TimeSlotRaw,
} from "@/lib/timeslot";
import { apiFetch } from "./apiUtils";
import { type Event, type EventType } from "@/lib/event";

export async function fetchAllEventTimeSlots<T extends EventType>(
  event: Event & { type: T }
): Promise<TimeSlot<T>[]> {
  const rawTimeSlots: TimeSlotRaw[] = await apiFetch(
    `/timeslots/event/${event.id}`,
    { method: "GET" },
    "Failed to fetch timeslots"
  );
  return convertRawTimeslots<T>(rawTimeSlots);
}

export async function fetchAllFromUser<T extends EventType>(
  event: Event & { type: T },
  userId: string
): Promise<TimeSlot<T>[]> {
  const rawTimeSlots: TimeSlotRaw[] = await apiFetch(
    `/timeslots/event/${event.id}/user/${userId}`,
    { method: "GET" },
    "Failed to fetch time slots for user"
  );
  return convertRawTimeslots<T>(rawTimeSlots);
}

export async function setTimeSlots(
  eventId: string,
  userId: string,
  timeSlots: TimeSlotPayload[]
): Promise<void> {
  await apiFetch(
    `/timeslots/event/${eventId}/user/${userId}/set`,
    {
      method: "PUT",
      body: JSON.stringify(timeSlots),
    },
    "Failed to set timeslots"
  );
}
