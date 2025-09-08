import moment from "moment";
import {
  momentLocalizer,
  type Event as RBCEvent,
  type SlotInfo,
} from "react-big-calendar";

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

export function timeStringToDate(time: string): Date {
  const [hr, min] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hr, min, 0, 0);
  return date;
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
  id: number;
  isSelection?: boolean;
  start: Date;
  end: Date;
};

export function findTimeSlotInSelection(
  start: Date,
  timeSlots: TimeSlotEvent[]
) {
  return timeSlots.some((slot) => start.getTime() === slot.start.getTime());
}

// Adds new timeslots to existing and returns their combined slots
export function addSlots(slotInfo: SlotInfo, timeSlots: TimeSlotEvent[]) {
  const newTimeSlots: TimeSlotEvent[] = [];

  for (const slot of slotInfo.slots) {
    if (slot.getTime() != slotInfo.end.getTime()) {
      if (!findTimeSlotInSelection(slot, timeSlots)) {
        let endTime = new Date(slot);
        endTime.setMinutes(slot.getMinutes() + 30);
        const newEvent: TimeSlotEvent = {
          id: slot.getTime(),
          title: "Selected",
          start: slot,
          end: endTime,
          isSelection: true,
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
