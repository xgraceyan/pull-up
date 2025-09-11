import {
  convertRawTimeslots,
  type TimeSlot,
  type TimeSlotPayload,
  type TimeSlotRaw,
} from "@/lib/timeslot";
import { apiFetch } from "./apiUtils";

export async function fetchAllEventTimeSlots(
  eventId: string
): Promise<TimeSlot[]> {
  const rawTimeSlots: TimeSlotRaw[] = await apiFetch(
    `/timeslots/event/${eventId}`,
    { method: "GET" },
    "Failed to fetch timeslots"
  );
  return convertRawTimeslots(rawTimeSlots);
}

export async function fetchAllFromUser(
  eventId: string,
  userId: string
): Promise<TimeSlot[]> {
  const rawTimeSlots: TimeSlotRaw[] = await apiFetch(
    `/timeslots/event/${eventId}/user/${userId}`,
    { method: "GET" },
    "Failed to fetch time slots for user"
  );
  return convertRawTimeslots(rawTimeSlots);
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
