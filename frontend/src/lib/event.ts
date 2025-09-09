import type { ObjectId } from "mongodb";
import type { DayOfWeek } from "./calendar";
import type { User } from "./user";

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
  userIds: User[];
};

export type EventRaw = {
  id: string;
  publicId: string;
  urlAlias: string;
  name: string;
  type: EventType;
  timezone: string;
  excludeDaysOfWeek: DayOfWeek[];
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  userIds: User[];
};
