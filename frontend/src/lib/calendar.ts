import moment from "moment";
import {
  momentLocalizer,
  type NavigateAction,
  type Event as RBCEvent,
  type SlotInfo,
  type View,
} from "react-big-calendar";
import type { TimeSlotStatus } from "./timeslot";
import type { Event, EventType } from "./event";
import type { BaseCalendarProps } from "@/components/calendar/BaseCalendar";

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

export type CalendarComponent = React.ComponentType<BaseCalendarProps>;

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

export function combineDayAndTime(day: Date, time: Date) {
  const base = new Date(day);
  base.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return base;
}

export function dateToWeekDay(date: Date): DayOfWeek {
  return DAYS_OF_WEEK[date.getDay()];
}

export function normalizeDateToDayOnly(date: Date): number {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
}

export function formatTime(time: Date) {
  return moment(time).format("h:mm A");
}

export function formatDate(date: Date) {
  return moment(date).format("YYYY-MM-DD");
}

export function formatSlotInfoTime<T extends EventType>(
  start: Date,
  end: Date,
  eventType: T
) {
  switch (eventType) {
    case "weekdayTime":
      return `${moment(start).format("dddd")}\n${formatTime(
        start
      )} - ${formatTime(end)}`;
    case "dayTime":
      return `${moment(start).format("dddd, MMM D")}\n${formatTime(
        start
      )} - ${formatTime(end)}`;
    case "day":
      return moment(start).format("dddd, MMM D");
  }
}

export function findTimeSlotInSelection(
  start: Date,
  timeSlots: TimeSlotEvent[]
) {
  const timeSlot = timeSlots.find(
    (slot) => start.getTime() === slot.start.getTime()
  );
  return timeSlot;
}

export function isDateDisabled(date: Date, disabledDates: Date[]) {
  return disabledDates.some(
    (d) =>
      d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate()
  );
}

// Adds new timeslots to existing and returns their combined slots
export function addSlots(
  userId: string,
  slotInfo: SlotInfo,
  timeSlots: TimeSlotEvent[],
  eventType?: EventType,
  disabledDates?: Date[]
) {
  const newTimeSlots: TimeSlotEvent[] = [];

  for (const slot of slotInfo.slots) {
    if (slot.getTime() != slotInfo.end.getTime()) {
      if (
        !findTimeSlotInSelection(slot, timeSlots) &&
        (!disabledDates || !isDateDisabled(slot, disabledDates))
      ) {
        let endTime = new Date(slot);
        endTime.setMinutes(slot.getMinutes() + 30);
        const newEvent: TimeSlotEvent = {
          id: slot.getTime().toString(),
          title: "1 available",
          start: slot,
          end: endTime,
          userIds: [userId],
          status: "available",
          allDay: eventType === "day",
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

export function disableRemainingDays(
  eventType: EventType,
  date: Date,
  action: NavigateAction,
  setDisabledDates: (value: React.SetStateAction<Date[]>) => void,
  newDate?: Date
) {
  if (eventType === "weekdayTime") return;

  const days: Date[] = [];
  const mode = eventType === "dayTime" ? "week" : "month";

  // Disable "trailing" calendar dates from last/next month
  if (mode === "month") {
    const d = newDate?.getMonth() === date.getMonth() ? newDate : date;
    const startOfMonth = moment(d).startOf("month");
    const endOfMonth = moment(d).endOf("month");
    const startCalendar = startOfMonth.clone().startOf("week");
    const endCalendar = endOfMonth.clone().endOf("week");

    let curr = startCalendar;
    while (curr.isBefore(startOfMonth, "day")) {
      days.push(curr.toDate());
      curr.add(1, "day");
    }
    curr = endCalendar;
    while (curr.isAfter(endOfMonth, "day")) {
      days.push(curr.toDate());
      curr.subtract(1, "day");
    }
  }

  if (action === "NEXT") {
    const endOfMode = moment(date).endOf(mode);
    let currDate = moment(date).clone();
    while (currDate.isBefore(endOfMode, "day")) {
      currDate = currDate.add(1, "day").clone();
      days.push(currDate.toDate());
    }
  } else {
    const startOfMode = moment(date).startOf(mode);
    let currDate = moment(date).clone();
    while (currDate.isAfter(startOfMode, "day")) {
      currDate = currDate.subtract(1, "day").clone();
      days.push(currDate.toDate());
    }
  }

  setDisabledDates(days);
}

export function handleNavigateFactory(
  event: Event,
  setCurrentDate: (value: React.SetStateAction<Date>) => void,
  setDisabledDates: (value: React.SetStateAction<Date[]>) => void
) {
  if (event.type === "weekdayTime") return;

  return (newDate: Date, _view: View, action: NavigateAction) => {
    const mode = event.type === "dayTime" ? "week" : "month";

    if (action === "NEXT") {
      const next = moment(newDate).add(1, mode);
      const nextEnd = next.endOf(mode);

      if (nextEnd.isSameOrBefore(event.endDate, "day")) {
        setCurrentDate(next.toDate());
      } else {
        setCurrentDate(event.endDate);
        disableRemainingDays(
          event.type,
          event.endDate,
          action,
          setDisabledDates,
          newDate
        );
      }
    } else if (action === "PREV") {
      const prev = moment(newDate).subtract(1, mode);
      if (prev.isSameOrAfter(event.startDate, "day")) {
        setCurrentDate(prev.toDate());
      } else {
        setCurrentDate(event.startDate);
        disableRemainingDays(
          event.type,
          event.startDate,
          action,
          setDisabledDates,
          newDate
        );
      }
    }
  };
}

export function customDayPropGetter(
  disabledDates: Date[],
  disabledClassName: string
) {
  return (date: Date) => {
    const isDisabled = disabledDates.some((d) =>
      moment(date).startOf("day").isSame(d, "day")
    );
    if (isDisabled) {
      return {
        className: disabledClassName,
        style: {
          cursor: "not-allowed",
          pointerEvents: "none",
          userSelect: "none",
        } as React.CSSProperties,
      };
    }
    return { className: "text-gray-600" };
  };
}
