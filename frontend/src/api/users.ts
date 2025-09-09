import { dateToTimeString, type DayOfWeek } from "@/lib/calendar";
import type { User, UserRaw } from "@/lib/user";

export async function fetchUsersByWeekDayTime(
  eventId: string,
  weekDay: DayOfWeek,
  startTime: string,
  endTime: string
): Promise<User[]> {
  const params = new URLSearchParams({
    weekDay,
    startTime,
    endTime,
  });
  const res = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/api/timeslots/event/${eventId}/weekdaytime/users?${params.toString()}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch time slot users");
  }

  const raw_users: UserRaw[] = await res.json();

  console.log("Fetching", weekDay, startTime, endTime, raw_users);

  return raw_users.map((raw_user: UserRaw) => ({
    ...raw_user,
    createdAt: new Date(raw_user.createdAt),
  }));
}
