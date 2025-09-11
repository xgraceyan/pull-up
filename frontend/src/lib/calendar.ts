import moment from "moment";
import {
  momentLocalizer,
  type Event as RBCEvent,
  type SlotInfo,
} from "react-big-calendar";
import type { TimeSlotStatus } from "./timeslot";

export const localizer = momentLocalizer(moment);

export const DAYS_OF_WEEK = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const DayOfWeekMap: Record<DayOfWeek, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

export function dayToNum(day: DayOfWeek): number {
  return DayOfWeekMap[day];
}

export function timeStringToDate(time: string): Date {
  const [hr, min] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hr, min, 0, 0);
  return date;
}

export function dateToTimeString(date: Date): string {
  const hr = date.getHours().toString().padStart(2, "0");
  const min = date.getMinutes().toString().padStart(2, "0");
  return `${hr}:${min}`;
}

export function combineWeekDayAndTime(weekDay: DayOfWeek, time: Date) {
  const base = new Date();
  const diff = dayToNum(weekDay) - base.getDay();
  base.setDate(base.getDate() + diff);
  base.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return base;
}

export function dateToWeekDay(date: Date): DayOfWeek {
  return DAYS_OF_WEEK[date.getDay()];
}

export function formatTime(time: Date) {
  return moment(time).format("h:mm A");
}

export function formatDate(date: Date) {
  return moment(date).format("YYYY-MM-DD");
}

export const events = [
  {
    id: 0,
    title: "Team Meeting",
    start: new Date(2025, 8, 1, 9, 0, 0), // Monday
    end: new Date(2025, 8, 1, 10, 0, 0),
  },
  {
    id: 1,
    title: "Lunch with Sarah",
    start: new Date(2025, 8, 3, 12, 0, 0), // Wednesday
    end: new Date(2025, 8, 3, 13, 0, 0),
  },
  {
    id: 2,
    title: "Code Review",
    start: new Date(2025, 8, 5, 15, 0, 0), // Friday
    end: new Date(2025, 8, 5, 16, 0, 0),
  },
];

export type TimeSlotEvent = RBCEvent & {
  id: string;
  start: Date;
  end: Date;
  userIds: string[];
  status: TimeSlotStatus;
};

export type TimeSlotEventWrapperProps = {
  event: TimeSlotEvent;
  children: React.ReactNode;
};

export function findTimeSlotInSelection(
  start: Date,
  timeSlots: TimeSlotEvent[]
) {
  const timeSlot = timeSlots.find(
    (slot) => start.getTime() === slot.start.getTime()
  );
  return timeSlot;
}

// Adds new timeslots to existing and returns their combined slots
export function addSlots(
  userId: string,
  slotInfo: SlotInfo,
  timeSlots: TimeSlotEvent[]
) {
  const newTimeSlots: TimeSlotEvent[] = [];

  for (const slot of slotInfo.slots) {
    if (slot.getTime() != slotInfo.end.getTime()) {
      if (!findTimeSlotInSelection(slot, timeSlots)) {
        let endTime = new Date(slot);
        endTime.setMinutes(slot.getMinutes() + 30);
        const newEvent: TimeSlotEvent = {
          id: slot.getTime().toString(),
          title: "Selected",
          start: slot,
          end: endTime,
          userIds: [userId],
          status: "available",
        };
        newTimeSlots.push(newEvent);
      }
    }
  }

  return [...timeSlots, ...newTimeSlots];
}

export function removeSlots(slotInfo: SlotInfo, timeSlots: TimeSlotEvent[]) {
  const startSet = new Set(slotInfo.slots.map((slot) => slot.getTime()));
  startSet.delete(slotInfo.end.getTime()); // Delete last since slots are start -> start+30
  return timeSlots.filter((event) => !startSet.has(event.start.getTime()));
}
