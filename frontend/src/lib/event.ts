import { dateToTimeString, formatDate, type DayOfWeek } from "./calendar";
import type { User } from "./user";

export type EventType = "day" | "dayTime" | "weekdayTime";

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

export type EventPayload = {
  urlAlias?: string;
  name: string;
  type: EventType;
  timezone: string;
  excludeDaysOfWeek: DayOfWeek[] | null;
  startTime: string | null;
  endTime: string | null;
  startDate: string | null;
  endDate: string | null;
};

export type EventFormData = {
  name: string;
  urlAlias?: string;
  startDate?: Date;
  endDate?: Date;
  startTime?: Date;
  endTime?: Date;
};

export function convertToEventPayload(
  eventType: EventType,
  formData: EventFormData
) {
  return {
    ...formData,
    startDate: formData.startDate ? formatDate(formData.startDate) : null,
    endDate: formData.endDate ? formatDate(formData.endDate) : null,
    startTime: formData.startTime ? dateToTimeString(formData.startTime) : null,
    endTime: formData.endTime ? dateToTimeString(formData.endTime) : null,
    type: eventType,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    excludeDaysOfWeek: [], // TODO
  };
}
