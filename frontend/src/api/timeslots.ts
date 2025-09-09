import { timeStringToDate } from "@/lib/calendar";
import type { TimeSlot, TimeSlotRaw } from "@/lib/timeslot";

export async function fetchAllEventTimeSlots(
  eventId: string
): Promise<TimeSlot[]> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/timeslots/event/${eventId}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch timeslots");
  }
  const raw_timeslots: TimeSlotRaw[] = await res.json();
  return raw_timeslots.map((raw_timeslot: TimeSlotRaw) => ({
    ...raw_timeslot,
    date: new Date(raw_timeslot.date),
    startTime: timeStringToDate(raw_timeslot.startTime),
    endTime: timeStringToDate(raw_timeslot.endTime),
    updatedAt: new Date(raw_timeslot.updatedAt),
  }));
}
