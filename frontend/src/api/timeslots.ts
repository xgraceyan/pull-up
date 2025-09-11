import { timeStringToDate, type DayOfWeek } from "@/lib/calendar";
import {
  convertRawTimeslots,
  type TimeSlot,
  type TimeSlotPayload,
  type TimeSlotRaw,
} from "@/lib/timeslot";
import type { User, UserRaw } from "@/lib/user";

export async function fetchAllEventTimeSlots(
  eventId: string
): Promise<TimeSlot[]> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/timeslots/event/${eventId}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch timeslots");
  }
  const rawTimeSlots: TimeSlotRaw[] = await res.json();
  return convertRawTimeslots(rawTimeSlots);
}

export async function fetchAllFromUser(
  eventId: string,
  userId: string
): Promise<TimeSlot[]> {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/api/timeslots/event/${eventId}/user/${userId}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch time slots for user");
  }

  const rawTimeSlots: TimeSlotRaw[] = await res.json();
  return convertRawTimeslots(rawTimeSlots);
}

export async function setTimeSlots(
  eventId: string,
  userId: string,
  timeSlots: TimeSlotPayload[]
): Promise<void> {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/api/timeslots/event/${eventId}/user/${userId}/set`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(timeSlots),
    }
  );

  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(`Failed to set timeslots: ${errorMessage}`);
  }
}
