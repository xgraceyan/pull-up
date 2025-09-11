import {
  combineWeekDayAndTime,
  dateToTimeString,
  dateToWeekDay,
  findTimeSlotInSelection,
  formatDate,
  timeStringToDate,
  type DayOfWeek,
  type TimeSlotEvent,
} from "./calendar";
import type { Event } from "./event";
import type { User } from "./user";

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

// Timeslots sent back from API
export type TimeSlotRaw = {
  id: string;
  userId: string;
  eventId: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  weekDay: DayOfWeek | null;
  status: TimeSlotStatus;
  updatedAt?: string;
};

// Timeslots to send to API
export type TimeSlotPayload = {
  userId: string;
  eventId: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  weekDay: DayOfWeek | null;
  status: TimeSlotStatus;
};

export function convertRawTimeslots(rawTimeSlots: TimeSlotRaw[]): TimeSlot[] {
  return rawTimeSlots.map((rawTimeSlot: TimeSlotRaw) => ({
    ...rawTimeSlot,
    date: rawTimeSlot.date ? new Date(rawTimeSlot.date) : new Date(),
    startTime: rawTimeSlot.startTime
      ? timeStringToDate(rawTimeSlot.startTime)
      : new Date(),
    endTime: rawTimeSlot.endTime
      ? timeStringToDate(rawTimeSlot.endTime)
      : new Date(),
    weekDay: rawTimeSlot.weekDay ?? "SUNDAY",
    updatedAt: rawTimeSlot.updatedAt
      ? new Date(rawTimeSlot.updatedAt)
      : new Date(),
  }));
}

export function convertToPayloadTimeslots(
  event: Event,
  user: User,
  timeSlotEvents: TimeSlotEvent[]
): TimeSlotPayload[] {
  return timeSlotEvents.map((timeSlot) => ({
    userId: user.id,
    eventId: event.id,
    date: event.type == "weekdayTime" ? null : formatDate(timeSlot.start),
    startTime: event.type == "day" ? null : dateToTimeString(timeSlot.start),
    endTime: event.type == "day" ? null : dateToTimeString(timeSlot.end),
    weekDay: event.type == "weekdayTime" ? dateToWeekDay(timeSlot.start) : null,
    status: timeSlot.status,
  }));
}

export function loadTimeSlotToCalendar(timeSlots: TimeSlot[]): TimeSlotEvent[] {
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
        userIds: [slot.userId],
        status: slot.status,
      };
      newTimeSlots.push(newEvent);
    } else {
      existing.userIds.push(slot.userId);
    }
  }
  return newTimeSlots;
}
