import type { CalendarType } from "@/calendar/CalendarType";
import {
  combineDayAndTime,
  combineWeekDayAndTime,
  dateToTimeString,
  dateToWeekDay,
  findTimeSlotInSelection,
  formatDate,
  timeStringToDate,
  type DayOfWeek,
  type TimeSlotEvent,
} from "./calendar";
import type { Event, EventType } from "./event";
import type { User } from "./user";
import moment from "moment";

// TODO: add "not preferred" status
export type TimeSlotStatus = "available" | "unavailable";

export type BaseTimeSlot = {
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

export type TimeSlot<T extends EventType> = BaseTimeSlot & {
  date: T extends "weekdayTime" ? null : Date;
  startTime: T extends "day" ? null : Date;
  endTime: T extends "day" ? null : Date;
  weekDay: T extends "weekdayTime" ? DayOfWeek : null;
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

export function convertRawTimeslots<T extends EventType>(
  rawTimeSlots: TimeSlotRaw[]
): TimeSlot<T>[] {
  console.log("Raw", rawTimeSlots);

  return rawTimeSlots.map((rawTimeSlot: TimeSlotRaw) => ({
    ...rawTimeSlot,
    date: (rawTimeSlot.date
      ? moment(rawTimeSlot.date).toDate() // parse date
      : null) as TimeSlot<T>["date"],
    startTime: (rawTimeSlot.startTime
      ? timeStringToDate(rawTimeSlot.startTime)
      : null) as TimeSlot<T>["startTime"],
    endTime: (rawTimeSlot.endTime
      ? timeStringToDate(rawTimeSlot.endTime)
      : null) as TimeSlot<T>["endTime"],
    weekDay: (rawTimeSlot.weekDay ?? null) as TimeSlot<T>["weekDay"],
    updatedAt: rawTimeSlot.updatedAt
      ? moment(rawTimeSlot.updatedAt).toDate()
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
    date: event.type === "weekdayTime" ? null : formatDate(timeSlot.start),
    startTime: event.type === "day" ? null : dateToTimeString(timeSlot.start),
    endTime: event.type === "day" ? null : dateToTimeString(timeSlot.end),
    weekDay:
      event.type === "weekdayTime" ? dateToWeekDay(timeSlot.start) : null,
    status: timeSlot.status,
  }));
}

export function loadTimeSlotToCalendar<T extends EventType>(
  timeSlots: TimeSlot<T>[]
): TimeSlotEvent[] {
  const newTimeSlots: TimeSlotEvent[] = [];

  const getStart = (slot: TimeSlot<T>) => {
    if (slot.weekDay) {
      return combineWeekDayAndTime(slot.weekDay, slot.startTime);
    } else if (slot.startTime) {
      return combineDayAndTime(slot.date, slot.startTime);
    } else {
      return slot.date;
    }
  };

  const getEnd = (slot: TimeSlot<T>) => {
    if (slot.weekDay) {
      return combineWeekDayAndTime(slot.weekDay, slot.endTime);
    } else if (slot.endTime) {
      return combineDayAndTime(slot.date, slot.endTime);
    } else {
      return moment(slot.date).add(1, "day").toDate();
    }
  };

  for (const slot of timeSlots) {
    const start = getStart(slot);
    const end = getEnd(slot);
    const existing = findTimeSlotInSelection(start, newTimeSlots);
    if (!existing) {
      const newEvent: TimeSlotEvent = {
        id: slot.id,
        title: "1 available",
        start,
        end,
        userIds: [slot.userId],
        status: slot.status,
        allDay: !slot.weekDay && !slot.startTime && !slot.endTime,
      };
      newTimeSlots.push(newEvent);
    } else {
      existing.userIds.push(slot.userId);
      existing.title = `${existing.userIds.length} available`;
    }
  }

  return newTimeSlots;
}
