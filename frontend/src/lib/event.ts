import type { DayOfWeek } from "./calendar";

export type EventType = "day" | "daytime" | "weekdaytime";

export type Event = {
  id: string;
  publicId: string;
  urlAlias: string;
  name: string;
  type: EventType;
  timezone: string;
  excludeDaysOfWeek: DayOfWeek[];
  startTime: Date;
  endTime: Date;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
};
