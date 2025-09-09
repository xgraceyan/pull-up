import {
  combineWeekDayAndTime,
  findTimeSlotInSelection,
  type DayOfWeek,
  type TimeSlotEvent,
} from "./calendar";

// TODO: add "not preferred" status
export type TimeSlotStatus = "available" | "unavailable";

export type TimeSlot = {
  id: string;
  userId: string;
  eventId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  weekDay: DayOfWeek;
  status: TimeSlotStatus;
  updatedAt: Date;
};

export type TimeSlotRaw = {
  id: string;
  userId: string;
  eventId: string;
  date: string;
  startTime: string;
  endTime: string;
  weekDay: DayOfWeek;
  status: TimeSlotStatus;
  updatedAt: string;
};

export function loadTimeSlotToCalendar(timeSlots: TimeSlot[]) {
  const newTimeSlots: TimeSlotEvent[] = [];

  for (const slot of timeSlots) {
    const start = combineWeekDayAndTime(slot.weekDay, slot.startTime);
    const end = combineWeekDayAndTime(slot.weekDay, slot.endTime);
    const existing = findTimeSlotInSelection(start, newTimeSlots);
    if (!existing) {
      const newEvent: TimeSlotEvent = {
        id: slot.id,
        title: "Selected",
        start,
        end,
        user_count: 1,
      };
      newTimeSlots.push(newEvent);
    } else {
      existing.user_count += 1;
    }
  }
  return newTimeSlots;
}
