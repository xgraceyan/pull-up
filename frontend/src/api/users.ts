import type { DayOfWeek } from "@/lib/calendar";
import type { User, UserPayload, UserRaw } from "@/lib/user";
import { apiFetch } from "./apiUtils";

export async function createUser(
  eventId: string,
  user: UserPayload
): Promise<User> {
  return await apiFetch(
    `/events/${eventId}/users/create`,
    {
      method: "POST",
      body: JSON.stringify(user),
    },
    "Failed to create user"
  );
}

export async function loginUser(
  eventId: string,
  user: UserPayload
): Promise<User> {
  return await apiFetch(`/events/${eventId}/users/login`, {
    method: "POST",
    body: JSON.stringify(user),
  });
}

export async function deleteUser(
  eventId: string,
  userId: string
): Promise<void> {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/api/events/${eventId}/users/${userId}/delete`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }
}

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
  const raw_users: UserRaw[] = await apiFetch(
    `/timeslots/event/${eventId}/weekdaytime/users?${params.toString()}`,
    { method: "GET" },
    "Failed to fetch time slot users"
  );

  return raw_users.map((raw_user: UserRaw) => ({
    ...raw_user,
    createdAt: new Date(raw_user.createdAt),
  }));
}
